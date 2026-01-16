'use client'

import { useState } from 'react'
import type { HintSystemProps } from './types'

export function HintSystem({
  hints,
  revealedCount,
  onRevealHint,
  className = '',
}: HintSystemProps) {
  const [expandedHints, setExpandedHints] = useState<Set<string>>(new Set())
  const sortedHints = [...hints].sort((a, b) => a.order - b.order)
  const revealedHints = sortedHints.slice(0, revealedCount)

  const toggleHint = (hintId: string) => {
    setExpandedHints((prev) => {
      const next = new Set(prev)
      if (next.has(hintId)) {
        next.delete(hintId)
      } else {
        next.add(hintId)
      }
      return next
    })
  }

  if (hints.length === 0) {
    return null
  }

  return (
    <div
      className={`rounded-md border border-gray-700 bg-gray-800 ${className}`}
      data-testid="hint-system"
    >
      <div className="border-b border-gray-700 px-3 py-2">
        <h3 className="text-sm font-medium text-gray-300">
          Hints ({revealedCount}/{hints.length})
        </h3>
      </div>

      <div className="p-2">
        {revealedHints.length === 0 ? (
          <p className="px-2 py-1 text-sm italic text-gray-500">
            No hints revealed yet. Click the Hint button to get help.
          </p>
        ) : (
          <div className="space-y-1">
            {revealedHints.map((hint, index) => (
              <div
                key={hint.id}
                className="rounded-md border border-gray-600 bg-gray-700/50"
              >
                <button
                  onClick={() => toggleHint(hint.id)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-200 hover:bg-gray-700"
                  aria-expanded={expandedHints.has(hint.id)}
                >
                  <span>Hint {index + 1}</span>
                  <ChevronIcon expanded={expandedHints.has(hint.id)} />
                </button>
                {expandedHints.has(hint.id) && (
                  <div className="border-t border-gray-600 px-3 py-2 text-sm text-gray-300">
                    {hint.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {revealedCount < hints.length && (
          <button
            onClick={onRevealHint}
            className="mt-2 w-full rounded-md border border-yellow-600/50 bg-yellow-600/10 px-3 py-1.5 text-sm text-yellow-500 transition-colors hover:bg-yellow-600/20"
          >
            Reveal Next Hint
          </button>
        )}
      </div>
    </div>
  )
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  )
}
