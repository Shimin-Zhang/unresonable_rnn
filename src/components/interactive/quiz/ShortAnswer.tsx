'use client'

import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { QUIZ_COLORS } from './constants'
import { checkShortAnswer } from './utils'
import type { ShortAnswerProps, ShortAnswerAnswer } from './types'

export function ShortAnswer({
  question,
  answer,
  showFeedback,
  onAnswer,
  disabled = false,
  className = '',
}: ShortAnswerProps) {
  const text = answer?.text ?? ''

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (disabled) return
      const value = e.target.value
      if (question.maxLength && value.length > question.maxLength) return

      onAnswer({
        type: 'short_answer',
        text: value,
      })
    },
    [onAnswer, disabled, question.maxLength]
  )

  const isCorrect = showFeedback && text.trim().length > 0
    ? checkShortAnswer(question, { type: 'short_answer', text })
    : null

  return (
    <div className={cn('space-y-4', className)} data-testid="short-answer">
      <p className="text-lg font-medium text-slate-900">{question.question}</p>

      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={text}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Type your answer here..."
            rows={4}
            className={cn(
              'w-full rounded-lg border-2 p-4 text-slate-700 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
              showFeedback && text.trim().length > 0
                ? isCorrect
                  ? cn(
                      QUIZ_COLORS.correct.bg,
                      QUIZ_COLORS.correct.border,
                      QUIZ_COLORS.correct.text
                    )
                  : cn(
                      QUIZ_COLORS.incorrect.bg,
                      QUIZ_COLORS.incorrect.border,
                      QUIZ_COLORS.incorrect.text
                    )
                : 'border-slate-300 bg-white focus:border-primary-500',
              disabled && 'cursor-not-allowed opacity-60'
            )}
            data-testid="short-answer-input"
          />

          {showFeedback && text.trim().length > 0 && (
            <div className="absolute right-3 top-3">
              {isCorrect ? (
                <CheckCircleIcon
                  className={cn('h-6 w-6', QUIZ_COLORS.correct.icon)}
                />
              ) : (
                <XCircleIcon
                  className={cn('h-6 w-6', QUIZ_COLORS.incorrect.icon)}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          {question.maxLength ? (
            <span>
              {text.length} / {question.maxLength} characters
            </span>
          ) : (
            <span />
          )}
          {!question.caseSensitive && (
            <span className="text-slate-400">Not case sensitive</span>
          )}
        </div>
      </div>

      {showFeedback && text.trim().length > 0 && !isCorrect && (
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-600 mb-2">Acceptable answers:</p>
          <ul className="space-y-1">
            {question.acceptableAnswers.map((acceptableAnswer, index) => (
              <li
                key={index}
                className={cn(
                  'text-sm font-medium',
                  QUIZ_COLORS.correct.text
                )}
              >
                {acceptableAnswer}
              </li>
            ))}
          </ul>
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
