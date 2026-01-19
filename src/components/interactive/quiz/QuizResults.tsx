'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ScoreSummary } from './ScoreSummary'
import { QUIZ_COLORS, PASSING_SCORE_DEFAULT } from './constants'
import { formatTimeSpent } from './utils'
import type { QuizResultsProps } from './types'

export function QuizResults({
  attempt,
  questions,
  onRetry,
  onContinue,
  className = '',
}: QuizResultsProps) {
  const isPassing = attempt.percentage >= PASSING_SCORE_DEFAULT

  const correctCount = attempt.results.filter((r) => r.isCorrect).length
  const totalTimeSpent = attempt.results.reduce((sum, r) => sum + r.timeSpent, 0)

  return (
    <div
      className={cn('space-y-6 rounded-lg border border-slate-200 bg-white p-6', className)}
      data-testid="quiz-results"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Quiz Complete!</h2>
        <p className="text-slate-500">Here&apos;s how you did</p>
      </div>

      <ScoreSummary
        score={attempt.score}
        maxScore={attempt.maxScore}
        percentage={attempt.percentage}
        isPassing={isPassing}
      />

      <div className="grid grid-cols-3 gap-4 rounded-lg bg-slate-50 p-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-600">{correctCount}</p>
          <p className="text-xs text-slate-500">Correct</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-600">
            {questions.length - correctCount}
          </p>
          <p className="text-xs text-slate-500">Incorrect</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-600">
            {formatTimeSpent(totalTimeSpent)}
          </p>
          <p className="text-xs text-slate-500">Time spent</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900">Question Review</h3>
        <div className="space-y-2">
          {questions.map((question, index) => {
            const result = attempt.results.find((r) => r.questionId === question.id)
            const isCorrect = result?.isCorrect ?? false

            return (
              <div
                key={question.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg border-2 p-3',
                  isCorrect
                    ? cn(QUIZ_COLORS.correct.bg, QUIZ_COLORS.correct.border)
                    : cn(QUIZ_COLORS.incorrect.bg, QUIZ_COLORS.incorrect.border)
                )}
              >
                <div
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  )}
                >
                  {isCorrect ? (
                    <CheckIcon className="h-4 w-4 text-white" />
                  ) : (
                    <XIcon className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    Question {index + 1}
                  </p>
                  <p className="text-sm text-slate-600 truncate">{question.question}</p>
                  {!isCorrect && question.explanation && (
                    <p className="mt-1 text-xs text-slate-500">
                      <span className="font-medium">Tip:</span> {question.explanation}
                    </p>
                  )}
                </div>
                {result && (
                  <span className="shrink-0 text-xs text-slate-400">
                    {formatTimeSpent(result.timeSpent)}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="flex-1">
            <RefreshIcon className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
        {onContinue && (
          <Button onClick={onContinue} variant="primary" className="flex-1">
            Continue
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
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

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
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
