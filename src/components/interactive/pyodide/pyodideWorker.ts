/// <reference lib="webworker" />

import type {
  PyodideWorkerMessage,
  PyodideExecuteResponse,
  PyodideLoadingMessage,
  PyodideReadyMessage,
  PyodideErrorMessage,
} from './types'

declare const self: DedicatedWorkerGlobalScope

interface PyodideInterface {
  runPython: (code: string) => unknown
  loadPackagesFromImports: (code: string) => Promise<void>
}

declare function loadPyodide(): Promise<PyodideInterface>

const PYODIDE_CDN_URL = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'

let pyodide: PyodideInterface | null = null

async function initPyodide(): Promise<void> {
  if (pyodide) return

  const loadingMsg: PyodideLoadingMessage = { type: 'loading', stage: 'init' }
  self.postMessage(loadingMsg)

  importScripts(`${PYODIDE_CDN_URL}pyodide.js`)

  pyodide = await loadPyodide()

  const packagesMsg: PyodideLoadingMessage = {
    type: 'loading',
    stage: 'packages',
  }
  self.postMessage(packagesMsg)

  const readyLoadingMsg: PyodideLoadingMessage = {
    type: 'loading',
    stage: 'ready',
  }
  self.postMessage(readyLoadingMsg)

  const readyMsg: PyodideReadyMessage = { type: 'ready' }
  self.postMessage(readyMsg)
}

async function executeCode(
  id: string,
  code: string
): Promise<PyodideExecuteResponse> {
  if (!pyodide) {
    throw new Error('Pyodide not initialized')
  }

  const startTime = performance.now()
  let stdout = ''
  let stderr = ''
  let error: string | undefined

  const captureOutput = `
import sys
from io import StringIO

_stdout_capture = StringIO()
_stderr_capture = StringIO()
_original_stdout = sys.stdout
_original_stderr = sys.stderr
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture

try:
${code.split('\n').map((line) => '    ' + line).join('\n')}
except Exception as e:
    print(str(e), file=sys.stderr)
finally:
    sys.stdout = _original_stdout
    sys.stderr = _original_stderr

(_stdout_capture.getvalue(), _stderr_capture.getvalue())
`

  try {
    await pyodide.loadPackagesFromImports(code)
    const result = pyodide.runPython(captureOutput) as [string, string]
    stdout = result[0]
    stderr = result[1]
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  const executionTime = performance.now() - startTime

  return {
    type: 'result',
    id,
    stdout,
    stderr,
    error,
    executionTime,
  }
}

self.onmessage = async (event: MessageEvent<PyodideWorkerMessage>) => {
  const message = event.data

  try {
    if (message.type === 'execute') {
      await initPyodide()
      const result = await executeCode(message.id, message.code)
      self.postMessage(result)
    }
  } catch (e) {
    const errorMsg: PyodideErrorMessage = {
      type: 'error',
      error: e instanceof Error ? e.message : String(e),
    }
    self.postMessage(errorMsg)
  }
}

export {}
