'use client'

import type { TestResultsProps } from './types'

export function TestResults({ results, className = '' }: TestResultsProps) {
  const passedCount = results.filter((r) => r.passed).length
  const totalCount = results.length
  const allPassed = passedCount === totalCount

  if (results.length === 0) {
    return null
  }

  return (
    <div
      className={`rounded-md border border-gray-700 bg-gray-800 ${className}`}
      data-testid="test-results"
    >
      <div className="flex items-center justify-between border-b border-gray-700 px-3 py-2">
        <h3 className="text-sm font-medium text-gray-300">Test Results</h3>
        <span
          className={`text-sm font-medium ${allPassed ? 'text-green-400' : 'text-red-400'}`}
        >
          {passedCount}/{totalCount} passed
        </span>
      </div>

      <div className="divide-y divide-gray-700">
        {results.map((result) => (
          <div
            key={result.testCase.id}
            className="px-3 py-2"
            data-testid={`test-result-${result.testCase.id}`}
          >
            <div className="flex items-center gap-2">
              {result.passed ? (
                <span className="text-green-400" aria-label="Passed">
                  ✓
                </span>
              ) : (
                <span className="text-red-400" aria-label="Failed">
                  ✗
                </span>
              )}
              <span
                className={`text-sm font-medium ${result.passed ? 'text-green-400' : 'text-red-400'}`}
              >
                {result.testCase.name}
              </span>
              <span className="text-xs text-gray-500">
                ({result.executionTime.toFixed(0)}ms)
              </span>
            </div>

            {!result.passed && !result.testCase.hidden && (
              <div className="ml-5 mt-1 space-y-1 text-xs">
                <div className="text-gray-400">
                  <span className="font-medium">Expected:</span>{' '}
                  <code className="rounded bg-gray-700 px-1 py-0.5">
                    {result.testCase.expectedOutput}
                  </code>
                </div>
                <div className="text-gray-400">
                  <span className="font-medium">Got:</span>{' '}
                  <code className="rounded bg-gray-700 px-1 py-0.5">
                    {result.actualOutput || '(no output)'}
                  </code>
                </div>
                {result.error && (
                  <div className="text-red-400">
                    <span className="font-medium">Error:</span> {result.error}
                  </div>
                )}
              </div>
            )}

            {!result.passed && result.testCase.hidden && (
              <div className="ml-5 mt-1 text-xs text-gray-500 italic">
                Hidden test case - details not shown
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
