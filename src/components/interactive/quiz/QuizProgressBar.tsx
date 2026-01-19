'use client'

import { cn } from '@/lib/utils'
import type { QuizProgressBarProps } from './types'

export function QuizProgressBar({
  current,
  total,
  answered,
  className = '',
}: QuizProgressBarProps) {
  const progressPercentage = ((current + 1) / total) * 100
  const answeredPercentage = (answered / total) * 100

  return (
    <div className={cn('space-y-2', className)} data-testid="quiz-progress-bar">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">
          Question {current + 1} of {total}
        </span>
        <span className="text-slate-500">
          {answered} answered
        </span>
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="absolute inset-y-0 left-0 bg-slate-300 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 left-0 bg-primary-500 transition-all duration-300"
          style={{ width: `${answeredPercentage}%` }}
          role="progressbar"
          aria-valuenow={answered}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${answered} of ${total} questions answered`}
        />
      </div>

      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              index < answered
                ? 'bg-primary-500'
                : index === current
                  ? 'bg-primary-300'
                  : 'bg-slate-200'
            )}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}
