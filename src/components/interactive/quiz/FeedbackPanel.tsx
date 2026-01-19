'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { QUIZ_COLORS } from './constants'
import type { FeedbackPanelProps } from './types'

export function FeedbackPanel({
  isCorrect,
  explanation,
  onNext,
  className = '',
}: FeedbackPanelProps) {
  const colors = isCorrect ? QUIZ_COLORS.correct : QUIZ_COLORS.incorrect

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-4 transition-all',
        colors.bg,
        colors.border,
        className
      )}
      data-testid="feedback-panel"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          {isCorrect ? (
            <CheckCircleIcon className={cn('h-6 w-6', colors.icon)} />
          ) : (
            <XCircleIcon className={cn('h-6 w-6', colors.icon)} />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <p className={cn('font-semibold', colors.text)}>
            {isCorrect ? 'Correct!' : 'Not quite right'}
          </p>

          {explanation && (
            <p className="text-sm text-slate-600">{explanation}</p>
          )}
        </div>
      </div>

      {onNext && (
        <div className="mt-4 flex justify-end">
          <Button onClick={onNext} variant="primary" size="sm">
            Continue
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  )
}
