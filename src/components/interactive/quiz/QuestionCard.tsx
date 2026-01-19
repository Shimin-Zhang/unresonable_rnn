'use client'

import { cn } from '@/lib/utils'
import { MultipleChoice } from './MultipleChoice'
import { Matching } from './Matching'
import { FillBlank } from './FillBlank'
import { ShortAnswer } from './ShortAnswer'
import type {
  QuestionCardProps,
  MultipleChoiceAnswer,
  MatchingAnswer,
  FillBlankAnswer,
  ShortAnswerAnswer,
} from './types'

export function QuestionCard({
  question,
  answer,
  showFeedback,
  isCorrect,
  onAnswer,
  disabled = false,
  className = '',
}: QuestionCardProps) {
  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <MultipleChoice
            question={question}
            answer={answer as MultipleChoiceAnswer | null}
            showFeedback={showFeedback}
            onAnswer={(a) => onAnswer(a)}
            disabled={disabled}
          />
        )
      case 'matching':
        return (
          <Matching
            question={question}
            answer={answer as MatchingAnswer | null}
            showFeedback={showFeedback}
            onAnswer={(a) => onAnswer(a)}
            disabled={disabled}
          />
        )
      case 'fill_blank':
        return (
          <FillBlank
            question={question}
            answer={answer as FillBlankAnswer | null}
            showFeedback={showFeedback}
            onAnswer={(a) => onAnswer(a)}
            disabled={disabled}
          />
        )
      case 'short_answer':
        return (
          <ShortAnswer
            question={question}
            answer={answer as ShortAnswerAnswer | null}
            showFeedback={showFeedback}
            onAnswer={(a) => onAnswer(a)}
            disabled={disabled}
          />
        )
      default:
        return <p className="text-red-500">Unknown question type</p>
    }
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 bg-white p-6',
        className
      )}
      data-testid="question-card"
    >
      {renderQuestion()}
    </div>
  )
}
