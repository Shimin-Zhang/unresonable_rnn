'use client'

import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { QUIZ_COLORS } from './constants'
import type { MultipleChoiceProps, MultipleChoiceAnswer } from './types'

export function MultipleChoice({
  question,
  answer,
  showFeedback,
  onAnswer,
  disabled = false,
  className = '',
}: MultipleChoiceProps) {
  const handleOptionClick = useCallback(
    (index: number) => {
      if (disabled) return

      if (question.allowMultiple) {
        const currentSelected = answer?.selectedOptions ?? []
        const newSelected = currentSelected.includes(index)
          ? currentSelected.filter((i) => i !== index)
          : [...currentSelected, index]

        onAnswer({
          type: 'multiple_choice',
          selectedOption: null,
          selectedOptions: newSelected,
        })
      } else {
        onAnswer({
          type: 'multiple_choice',
          selectedOption: index,
        })
      }
    },
    [question.allowMultiple, answer, onAnswer, disabled]
  )

  const isSelected = (index: number): boolean => {
    if (!answer) return false
    if (question.allowMultiple) {
      return answer.selectedOptions?.includes(index) ?? false
    }
    return answer.selectedOption === index
  }

  const isCorrectOption = (index: number): boolean => {
    if (question.allowMultiple && question.correctAnswers) {
      return question.correctAnswers.includes(index)
    }
    return index === question.correctAnswer
  }

  const getOptionStyles = (index: number): string => {
    const selected = isSelected(index)
    const correct = isCorrectOption(index)

    if (showFeedback) {
      if (correct) {
        return cn(
          QUIZ_COLORS.correct.bg,
          QUIZ_COLORS.correct.border,
          QUIZ_COLORS.correct.text
        )
      }
      if (selected && !correct) {
        return cn(
          QUIZ_COLORS.incorrect.bg,
          QUIZ_COLORS.incorrect.border,
          QUIZ_COLORS.incorrect.text
        )
      }
    }

    if (selected) {
      return cn(
        QUIZ_COLORS.selected.bg,
        QUIZ_COLORS.selected.border,
        QUIZ_COLORS.selected.text
      )
    }

    return cn(
      QUIZ_COLORS.default.bg,
      QUIZ_COLORS.default.border,
      QUIZ_COLORS.default.text,
      'hover:bg-slate-50'
    )
  }

  return (
    <div className={cn('space-y-3', className)} data-testid="multiple-choice">
      <p className="text-lg font-medium text-slate-900">{question.question}</p>

      {question.allowMultiple && (
        <p className="text-sm text-slate-500">Select all that apply</p>
      )}

      <div className="space-y-2">
        {question.options.map((option, index) => {
          const selected = isSelected(index)
          const correct = isCorrectOption(index)
          const showCorrectIcon = showFeedback && correct
          const showIncorrectIcon = showFeedback && selected && !correct

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleOptionClick(index)}
              disabled={disabled}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-all',
                getOptionStyles(index),
                disabled && 'cursor-not-allowed opacity-60'
              )}
              data-testid={`option-${index}`}
              aria-pressed={selected}
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium',
                  selected
                    ? 'border-current bg-current text-white'
                    : 'border-current bg-transparent'
                )}
              >
                {selected ? (
                  question.allowMultiple ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </span>

              <span className="flex-1">{option}</span>

              {showCorrectIcon && (
                <CheckCircleIcon
                  className={cn('h-5 w-5 shrink-0', QUIZ_COLORS.correct.icon)}
                />
              )}
              {showIncorrectIcon && (
                <XCircleIcon
                  className={cn('h-5 w-5 shrink-0', QUIZ_COLORS.incorrect.icon)}
                />
              )}
            </button>
          )
        })}
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
