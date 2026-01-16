'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type {
  PyodideState,
  PyodideWorkerResponse,
  PyodideExecuteRequest,
} from './types'
import type { ExecutionResult, TestCase, TestResult } from '../code-editor/types'

interface UsePyodideReturn extends PyodideState {
  execute: (code: string) => Promise<ExecutionResult>
  runTests: (code: string, testCases: TestCase[]) => Promise<TestResult[]>
}

export function usePyodide(): UsePyodideReturn {
  const [state, setState] = useState<PyodideState>({
    isLoading: false,
    isReady: false,
    loadingStage: null,
    error: null,
  })

  const workerRef = useRef<Worker | null>(null)
  const pendingRequests = useRef<
    Map<string, { resolve: (value: ExecutionResult) => void; reject: (error: Error) => void }>
  >(new Map())
  const requestIdCounter = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const worker = new Worker(
      new URL('./pyodideWorker.ts', import.meta.url),
      { type: 'module' }
    )

    worker.onmessage = (event: MessageEvent<PyodideWorkerResponse>) => {
      const message = event.data

      switch (message.type) {
        case 'loading':
          setState((prev) => ({
            ...prev,
            isLoading: true,
            loadingStage: message.stage,
          }))
          break

        case 'ready':
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isReady: true,
            loadingStage: 'ready',
          }))
          break

        case 'result': {
          const pending = pendingRequests.current.get(message.id)
          if (pending) {
            pending.resolve({
              stdout: message.stdout,
              stderr: message.stderr,
              error: message.error,
              executionTime: message.executionTime,
            })
            pendingRequests.current.delete(message.id)
          }
          break
        }

        case 'error':
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: message.error,
          }))
          pendingRequests.current.forEach((pending) => {
            pending.reject(new Error(message.error))
          })
          pendingRequests.current.clear()
          break
      }
    }

    worker.onerror = (error) => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }))
    }

    workerRef.current = worker

    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  const execute = useCallback(async (code: string): Promise<ExecutionResult> => {
    if (!workerRef.current) {
      return {
        stdout: '',
        stderr: '',
        error: 'Python runtime not available',
        executionTime: 0,
      }
    }

    const id = `req-${++requestIdCounter.current}`

    return new Promise((resolve, reject) => {
      pendingRequests.current.set(id, { resolve, reject })

      const request: PyodideExecuteRequest = {
        type: 'execute',
        id,
        code,
      }

      workerRef.current!.postMessage(request)

      setTimeout(() => {
        const pending = pendingRequests.current.get(id)
        if (pending) {
          pending.reject(new Error('Execution timeout'))
          pendingRequests.current.delete(id)
        }
      }, 30000)
    })
  }, [])

  const runTests = useCallback(
    async (code: string, testCases: TestCase[]): Promise<TestResult[]> => {
      const results: TestResult[] = []

      for (const testCase of testCases) {
        const startTime = performance.now()

        const testCode = `
${code}

# Test input
${testCase.input}
`
        try {
          const result = await execute(testCode)
          const actualOutput = result.stdout.trim()
          const expectedOutput = testCase.expectedOutput.trim()
          const passed = actualOutput === expectedOutput && !result.error

          results.push({
            testCase,
            passed,
            actualOutput,
            error: result.error,
            executionTime: performance.now() - startTime,
          })
        } catch (e) {
          results.push({
            testCase,
            passed: false,
            actualOutput: '',
            error: e instanceof Error ? e.message : String(e),
            executionTime: performance.now() - startTime,
          })
        }
      }

      return results
    },
    [execute]
  )

  return {
    ...state,
    execute,
    runTests,
  }
}
