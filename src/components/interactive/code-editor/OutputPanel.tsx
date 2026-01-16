'use client'

import type { OutputPanelProps } from './types'

export function OutputPanel({
  result,
  isLoading,
  className = '',
}: OutputPanelProps) {
  const hasError = result?.error || result?.stderr

  return (
    <div
      className={`flex h-full flex-col rounded-md border border-gray-700 bg-gray-900 ${className}`}
      data-testid="output-panel"
    >
      <div className="flex items-center justify-between border-b border-gray-700 px-3 py-2">
        <span className="text-sm font-medium text-gray-300">Output</span>
        {result && (
          <span className="text-xs text-gray-500">
            {result.executionTime.toFixed(0)}ms
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto p-3">
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <LoadingSpinner />
            <span>Running...</span>
          </div>
        ) : result ? (
          <div className="space-y-2">
            {result.stdout && (
              <pre className="whitespace-pre-wrap font-mono text-sm text-green-400">
                {result.stdout}
              </pre>
            )}
            {result.stderr && (
              <pre className="whitespace-pre-wrap font-mono text-sm text-yellow-400">
                {result.stderr}
              </pre>
            )}
            {result.error && (
              <pre className="whitespace-pre-wrap font-mono text-sm text-red-400">
                {result.error}
              </pre>
            )}
            {!result.stdout && !result.stderr && !result.error && (
              <span className="text-sm italic text-gray-500">
                No output
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm italic text-gray-500">
            Click &quot;Run&quot; to execute your code
          </span>
        )}
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
