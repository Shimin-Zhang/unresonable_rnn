'use client'

import { useCallback, useMemo, Fragment } from 'react'
import { cn } from '@/lib/utils'
import { QUIZ_COLORS, BLANK_PLACEHOLDER } from './constants'
import type { FillBlankProps, FillBlankAnswer } from './types'

export function FillBlank({
  question,
  answer,
  showFeedback,
  onAnswer,
  disabled = false,
  className = '',
}: FillBlankProps) {
  const answers = useMemo(() => answer?.answers ?? {}, [answer?.answers])

  const handleInputChange = useCallback(
    (blankId: string, value: string) => {
      if (disabled) return
      onAnswer({
        type: 'fill_blank',
        answers: {
          ...answers,
          [blankId]: value,
        },
      })
    },
    [answers, onAnswer, disabled]
  )

  const isBlankCorrect = useCallback(
    (blankId: string): boolean => {
      const blank = question.blanks.find((b) => b.id === blankId)
      if (!blank) return false

      const userAnswer = blank.caseSensitive
        ? (answers[blankId] ?? '').trim()
        : (answers[blankId] ?? '').trim().toLowerCase()

      const acceptableAnswers = [blank.answer, ...(blank.acceptableAnswers ?? [])]
      return acceptableAnswers.some((acceptable) => {
        const normalized = blank.caseSensitive
          ? acceptable.trim()
          : acceptable.trim().toLowerCase()
        return userAnswer === normalized
      })
    },
    [question.blanks, answers]
  )

  const getCorrectAnswer = useCallback(
    (blankId: string): string => {
      const blank = question.blanks.find((b) => b.id === blankId)
      return blank?.answer ?? ''
    },
    [question.blanks]
  )

  const textParts = useMemo(() => {
    const parts: Array<{ type: 'text' | 'blank'; content: string; blankId?: string }> = []
    let text = question.textWithBlanks
    let blankIndex = 0

    while (text.includes(BLANK_PLACEHOLDER)) {
      const placeholderIndex = text.indexOf(BLANK_PLACEHOLDER)

      if (placeholderIndex > 0) {
        parts.push({ type: 'text', content: text.slice(0, placeholderIndex) })
      }

      if (blankIndex < question.blanks.length) {
        parts.push({
          type: 'blank',
          content: '',
          blankId: question.blanks[blankIndex].id,
        })
        blankIndex++
      }

      text = text.slice(placeholderIndex + BLANK_PLACEHOLDER.length)
    }

    if (text.length > 0) {
      parts.push({ type: 'text', content: text })
    }

    return parts
  }, [question.textWithBlanks, question.blanks])

  return (
    <div className={cn('space-y-4', className)} data-testid="fill-blank">
      <p className="text-lg font-medium text-slate-900">{question.question}</p>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-slate-700 leading-relaxed">
          {textParts.map((part, index) => {
            if (part.type === 'text') {
              return <Fragment key={index}>{part.content}</Fragment>
            }

            const blankId = part.blankId!
            const userAnswer = answers[blankId] ?? ''
            const correct = isBlankCorrect(blankId)
            const hasAnswer = userAnswer.trim().length > 0

            return (
              <span key={index} className="inline-flex items-center gap-1 mx-1">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => handleInputChange(blankId, e.target.value)}
                  disabled={disabled}
                  placeholder="..."
                  className={cn(
                    'inline-block min-w-[80px] max-w-[200px] rounded border-2 px-2 py-1 text-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
                    showFeedback && hasAnswer
                      ? correct
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
                      : 'border-slate-300 bg-slate-50 text-slate-700 focus:border-primary-500',
                    disabled && 'cursor-not-allowed opacity-60'
                  )}
                  data-testid={`blank-input-${blankId}`}
                  style={{ width: `${Math.max(80, userAnswer.length * 10 + 20)}px` }}
                />
                {showFeedback && hasAnswer && (
                  <>
                    {correct ? (
                      <CheckCircleIcon
                        className={cn('h-5 w-5 shrink-0', QUIZ_COLORS.correct.icon)}
                      />
                    ) : (
                      <XCircleIcon
                        className={cn('h-5 w-5 shrink-0', QUIZ_COLORS.incorrect.icon)}
                      />
                    )}
                  </>
                )}
              </span>
            )
          })}
        </p>
      </div>

      {showFeedback && (
        <div className="space-y-2">
          {question.blanks.map((blank) => {
            const correct = isBlankCorrect(blank.id)
            const hasAnswer = (answers[blank.id] ?? '').trim().length > 0

            if (!hasAnswer || correct) return null

            return (
              <p key={blank.id} className="text-sm text-slate-600">
                <span className="font-medium">Correct answer:</span>{' '}
                <span className={cn('font-semibold', QUIZ_COLORS.correct.text)}>
                  {getCorrectAnswer(blank.id)}
                </span>
              </p>
            )
          })}
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
