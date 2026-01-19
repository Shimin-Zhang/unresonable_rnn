'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { SpacedRepetitionPromptProps } from './types'

export function SpacedRepetitionPrompt({
  questionsToReview,
  onStartReview,
  onSkip,
  className = '',
}: SpacedRepetitionPromptProps) {
  return (
    <div
      className={cn(
        'rounded-lg border-2 border-primary-200 bg-primary-50 p-6',
        className
      )}
      data-testid="spaced-repetition-prompt"
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary-100 p-2">
          <BrainIcon className="h-6 w-6 text-primary-600" />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-slate-900">
              Time for a quick review!
            </h3>
            <p className="text-sm text-slate-600">
              Strengthen your memory by reviewing{' '}
              <span className="font-medium text-primary-600">
                {questionsToReview} question{questionsToReview !== 1 ? 's' : ''}
              </span>{' '}
              from your previous quiz.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ClockIcon className="h-4 w-4" />
            <span>Based on spaced repetition for optimal retention</span>
          </div>

          <div className="flex gap-3">
            <Button onClick={onStartReview} variant="primary" size="sm">
              <PlayIcon className="mr-2 h-4 w-4" />
              Start Review
            </Button>
            <Button onClick={onSkip} variant="ghost" size="sm">
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}
