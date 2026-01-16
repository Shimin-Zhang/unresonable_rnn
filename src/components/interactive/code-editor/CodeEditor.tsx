'use client'

import { useState, useCallback } from 'react'
import { EditorPane } from './EditorPane'
import { OutputPanel } from './OutputPanel'
import { ControlBar } from './ControlBar'
import { HintSystem } from './HintSystem'
import { TestResults } from './TestResults'
import { DifficultyBadge } from './DifficultyBadge'
import { usePyodide } from '../pyodide'
import type {
  CodeEditorProps,
  ExecutionResult,
  TestResult,
  ExerciseResult,
} from './types'

export function CodeEditor({
  exerciseId,
  title,
  description,
  initialCode,
  solution,
  difficulty,
  testCases,
  hints = [],
  onComplete,
  className = '',
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<ExecutionResult | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const { execute, runTests, isLoading: pyodideLoading } = usePyodide()

  const handleRun = useCallback(async () => {
    setIsRunning(true)
    setTestResults([])
    try {
      const result = await execute(code)
      setOutput(result)
    } finally {
      setIsRunning(false)
    }
  }, [code, execute])

  const handleCheckAnswer = useCallback(async () => {
    setIsRunning(true)
    setAttempts((prev) => prev + 1)
    try {
      const results = await runTests(code, testCases)
      setTestResults(results)

      const allPassed = results.every((r) => r.passed)
      if (allPassed && onComplete) {
        const exerciseResult: ExerciseResult = {
          exerciseId,
          passed: true,
          testResults: results,
          attempts: attempts + 1,
          hintsUsed: hintsRevealed,
          completedAt: new Date().toISOString(),
          code,
        }
        onComplete(exerciseResult)
      }
    } finally {
      setIsRunning(false)
    }
  }, [code, testCases, runTests, onComplete, exerciseId, attempts, hintsRevealed])

  const handleShowHint = useCallback(() => {
    if (hintsRevealed < hints.length) {
      setHintsRevealed((prev) => prev + 1)
    }
  }, [hintsRevealed, hints.length])

  const handleShowSolution = useCallback(() => {
    setShowSolution(true)
    setCode(solution)
  }, [solution])

  const isProcessing = isRunning || pyodideLoading

  return (
    <div
      className={`rounded-lg border border-gray-700 bg-gray-900 ${className}`}
      data-testid="code-editor"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-700 p-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <DifficultyBadge level={difficulty} showLabel />
      </div>

      {/* Main content */}
      <div className="grid gap-4 p-4 lg:grid-cols-2">
        {/* Editor column */}
        <div className="space-y-4">
          <div className="h-[300px]">
            <EditorPane
              code={code}
              onChange={setCode}
              readOnly={isProcessing}
            />
          </div>

          <ControlBar
            onRun={handleRun}
            onCheckAnswer={handleCheckAnswer}
            onShowHint={handleShowHint}
            onShowSolution={handleShowSolution}
            isRunning={isProcessing}
            hasHints={hints.length > 0}
            hintsRemaining={hints.length - hintsRevealed}
            canShowSolution={!showSolution && attempts >= 2}
          />
        </div>

        {/* Output column */}
        <div className="space-y-4">
          <div className="h-[200px]">
            <OutputPanel result={output} isLoading={isProcessing} />
          </div>

          {testResults.length > 0 && <TestResults results={testResults} />}

          {hints.length > 0 && (
            <HintSystem
              hints={hints}
              revealedCount={hintsRevealed}
              onRevealHint={handleShowHint}
            />
          )}
        </div>
      </div>

      {/* Status bar */}
      {pyodideLoading && (
        <div className="border-t border-gray-700 px-4 py-2 text-xs text-gray-500">
          Loading Python runtime...
        </div>
      )}

      {showSolution && (
        <div className="border-t border-gray-700 bg-purple-900/20 px-4 py-2 text-xs text-purple-400">
          Solution revealed. Try to understand the code before moving on.
        </div>
      )}
    </div>
  )
}
