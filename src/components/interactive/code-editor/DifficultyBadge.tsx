'use client'

import { DIFFICULTY_CONFIG, MAX_STARS } from './constants'
import type { DifficultyBadgeProps } from './types'

export function DifficultyBadge({
  level,
  showLabel = false,
  className = '',
}: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[level]

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-label={`Difficulty: ${config.label}`}
    >
      <div className="flex gap-0.5" role="img" aria-hidden="true">
        {Array.from({ length: MAX_STARS }, (_, i) => (
          <span
            key={i}
            className={`text-sm ${i < config.stars ? config.color : 'text-gray-300 dark:text-gray-600'}`}
          >
            ★
          </span>
        ))}
      </div>
      {showLabel && (
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      )}
    </div>
  )
}
