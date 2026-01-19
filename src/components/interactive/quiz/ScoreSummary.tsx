'use client'

import { cn } from '@/lib/utils'
import { QUIZ_COLORS } from './constants'
import type { ScoreSummaryProps } from './types'

export function ScoreSummary({
  score,
  maxScore,
  percentage,
  isPassing,
  className = '',
}: ScoreSummaryProps) {
  const getScoreColor = () => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 70) return 'text-primary-600'
    if (percentage >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = () => {
    if (percentage === 100) return 'Perfect score!'
    if (percentage >= 90) return 'Excellent work!'
    if (percentage >= 70) return 'Good job!'
    if (percentage >= 50) return 'Keep practicing!'
    return 'Review the material and try again'
  }

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div
      className={cn('flex flex-col items-center space-y-4', className)}
      data-testid="score-summary"
    >
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={cn(getScoreColor(), 'transition-all duration-1000')}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-3xl font-bold', getScoreColor())}>
            {percentage}%
          </span>
          <span className="text-xs text-slate-500">
            {score}/{maxScore}
          </span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className={cn('text-lg font-semibold', getScoreColor())}>
          {getScoreMessage()}
        </p>
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
            isPassing
              ? cn(QUIZ_COLORS.correct.bg, QUIZ_COLORS.correct.text)
              : cn(QUIZ_COLORS.incorrect.bg, QUIZ_COLORS.incorrect.text)
          )}
        >
          {isPassing ? (
            <>
              <CheckIcon className="h-4 w-4" />
              Passed
            </>
          ) : (
            <>
              <XIcon className="h-4 w-4" />
              Not passed
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}
