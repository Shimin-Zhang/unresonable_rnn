import type {
  Question,
  Answer,
  MultipleChoiceQuestion,
  MultipleChoiceAnswer,
  MatchingQuestion,
  MatchingAnswer,
  FillBlankQuestion,
  FillBlankAnswer,
  ShortAnswerQuestion,
  ShortAnswerAnswer,
} from './types'

export function checkAnswer(question: Question, answer: Answer): boolean {
  switch (question.type) {
    case 'multiple_choice':
      return checkMultipleChoice(question, answer as MultipleChoiceAnswer)
    case 'matching':
      return checkMatching(question, answer as MatchingAnswer)
    case 'fill_blank':
      return checkFillBlank(question, answer as FillBlankAnswer)
    case 'short_answer':
      return checkShortAnswer(question, answer as ShortAnswerAnswer)
    default:
      return false
  }
}

export function checkMultipleChoice(
  question: MultipleChoiceQuestion,
  answer: MultipleChoiceAnswer
): boolean {
  if (question.allowMultiple && question.correctAnswers) {
    const selected = new Set(answer.selectedOptions ?? [])
    const correct = new Set(question.correctAnswers)
    if (selected.size !== correct.size) return false
    for (const s of selected) {
      if (!correct.has(s)) return false
    }
    return true
  }
  return answer.selectedOption === question.correctAnswer
}

export function checkMatching(question: MatchingQuestion, answer: MatchingAnswer): boolean {
  for (const pair of question.pairs) {
    if (answer.matches[pair.id] !== pair.right) {
      return false
    }
  }
  return true
}

export function checkFillBlank(question: FillBlankQuestion, answer: FillBlankAnswer): boolean {
  for (const blank of question.blanks) {
    const userAnswer = answer.answers[blank.id] ?? ''
    const normalizedUserAnswer = blank.caseSensitive
      ? userAnswer.trim()
      : userAnswer.trim().toLowerCase()

    const acceptableAnswers = [blank.answer, ...(blank.acceptableAnswers ?? [])]
    const isCorrect = acceptableAnswers.some((acceptable) => {
      const normalizedAcceptable = blank.caseSensitive
        ? acceptable.trim()
        : acceptable.trim().toLowerCase()
      return normalizedUserAnswer === normalizedAcceptable
    })

    if (!isCorrect) return false
  }
  return true
}

export function checkShortAnswer(
  question: ShortAnswerQuestion,
  answer: ShortAnswerAnswer
): boolean {
  const userAnswer = question.caseSensitive
    ? answer.text.trim()
    : answer.text.trim().toLowerCase()

  return question.acceptableAnswers.some((acceptable) => {
    const normalizedAcceptable = question.caseSensitive
      ? acceptable.trim()
      : acceptable.trim().toLowerCase()
    return userAnswer === normalizedAcceptable
  })
}

export function calculatePartialScore(question: Question, answer: Answer): number {
  switch (question.type) {
    case 'multiple_choice':
      return checkMultipleChoice(question, answer as MultipleChoiceAnswer) ? 1 : 0
    case 'matching': {
      const matchAnswer = answer as MatchingAnswer
      let correct = 0
      for (const pair of question.pairs) {
        if (matchAnswer.matches[pair.id] === pair.right) {
          correct++
        }
      }
      return correct / question.pairs.length
    }
    case 'fill_blank': {
      const fillAnswer = answer as FillBlankAnswer
      let correct = 0
      for (const blank of question.blanks) {
        const userAnswer = blank.caseSensitive
          ? (fillAnswer.answers[blank.id] ?? '').trim()
          : (fillAnswer.answers[blank.id] ?? '').trim().toLowerCase()
        const acceptableAnswers = [blank.answer, ...(blank.acceptableAnswers ?? [])]
        const isCorrect = acceptableAnswers.some((acceptable) => {
          const normalizedAcceptable = blank.caseSensitive
            ? acceptable.trim()
            : acceptable.trim().toLowerCase()
          return userAnswer === normalizedAcceptable
        })
        if (isCorrect) correct++
      }
      return correct / question.blanks.length
    }
    case 'short_answer':
      return checkShortAnswer(question, answer as ShortAnswerAnswer) ? 1 : 0
    default:
      return 0
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function formatTimeSpent(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export function getEmptyAnswer(question: Question): Answer {
  switch (question.type) {
    case 'multiple_choice':
      return {
        type: 'multiple_choice',
        selectedOption: null,
        selectedOptions: question.allowMultiple ? [] : undefined,
      }
    case 'matching':
      return { type: 'matching', matches: {} }
    case 'fill_blank':
      return { type: 'fill_blank', answers: {} }
    case 'short_answer':
      return { type: 'short_answer', text: '' }
  }
}

export function isAnswerComplete(question: Question, answer: Answer | null): boolean {
  if (!answer) return false

  switch (question.type) {
    case 'multiple_choice': {
      const mcAnswer = answer as MultipleChoiceAnswer
      if (question.allowMultiple) {
        return (mcAnswer.selectedOptions?.length ?? 0) > 0
      }
      return mcAnswer.selectedOption !== null
    }
    case 'matching': {
      const matchAnswer = answer as MatchingAnswer
      return Object.keys(matchAnswer.matches).length === question.pairs.length
    }
    case 'fill_blank': {
      const fillAnswer = answer as FillBlankAnswer
      return question.blanks.every(
        (blank) => fillAnswer.answers[blank.id]?.trim().length > 0
      )
    }
    case 'short_answer': {
      const shortAnswer = answer as ShortAnswerAnswer
      return shortAnswer.text.trim().length > 0
    }
    default:
      return false
  }
}
