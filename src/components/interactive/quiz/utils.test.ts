import { describe, it, expect } from 'vitest'
import {
  checkAnswer,
  checkMultipleChoice,
  checkMatching,
  checkFillBlank,
  checkShortAnswer,
  calculatePartialScore,
  shuffleArray,
  formatTimeSpent,
  isAnswerComplete,
  getEmptyAnswer,
} from './utils'
import type {
  MultipleChoiceQuestion,
  MatchingQuestion,
  FillBlankQuestion,
  ShortAnswerQuestion,
} from './types'

describe('checkMultipleChoice', () => {
  const question: MultipleChoiceQuestion = {
    id: 'q1',
    type: 'multiple_choice',
    question: 'Test?',
    options: ['A', 'B', 'C'],
    correctAnswer: 1,
    explanation: '',
  }

  it('returns true for correct answer', () => {
    const answer = { type: 'multiple_choice' as const, selectedOption: 1 }
    expect(checkMultipleChoice(question, answer)).toBe(true)
  })

  it('returns false for incorrect answer', () => {
    const answer = { type: 'multiple_choice' as const, selectedOption: 0 }
    expect(checkMultipleChoice(question, answer)).toBe(false)
  })

  it('handles multi-select questions', () => {
    const multiQuestion: MultipleChoiceQuestion = {
      ...question,
      allowMultiple: true,
      correctAnswers: [0, 2],
    }
    const correctAnswer = {
      type: 'multiple_choice' as const,
      selectedOption: null,
      selectedOptions: [0, 2],
    }
    const incorrectAnswer = {
      type: 'multiple_choice' as const,
      selectedOption: null,
      selectedOptions: [0, 1],
    }

    expect(checkMultipleChoice(multiQuestion, correctAnswer)).toBe(true)
    expect(checkMultipleChoice(multiQuestion, incorrectAnswer)).toBe(false)
  })
})

describe('checkMatching', () => {
  const question: MatchingQuestion = {
    id: 'q1',
    type: 'matching',
    question: 'Match the pairs',
    pairs: [
      { id: 'p1', left: 'A', right: '1' },
      { id: 'p2', left: 'B', right: '2' },
    ],
    explanation: '',
  }

  it('returns true when all matches are correct', () => {
    const answer = {
      type: 'matching' as const,
      matches: { p1: '1', p2: '2' },
    }
    expect(checkMatching(question, answer)).toBe(true)
  })

  it('returns false when some matches are wrong', () => {
    const answer = {
      type: 'matching' as const,
      matches: { p1: '2', p2: '1' },
    }
    expect(checkMatching(question, answer)).toBe(false)
  })

  it('returns false when matches are incomplete', () => {
    const answer = {
      type: 'matching' as const,
      matches: { p1: '1' },
    }
    expect(checkMatching(question, answer)).toBe(false)
  })
})

describe('checkFillBlank', () => {
  const question: FillBlankQuestion = {
    id: 'q1',
    type: 'fill_blank',
    question: 'Fill in the blanks',
    textWithBlanks: 'The ___ is blue',
    blanks: [
      { id: 'b1', answer: 'sky', acceptableAnswers: ['SKY'] },
    ],
    explanation: '',
  }

  it('returns true for correct answer', () => {
    const answer = {
      type: 'fill_blank' as const,
      answers: { b1: 'sky' },
    }
    expect(checkFillBlank(question, answer)).toBe(true)
  })

  it('accepts alternative answers', () => {
    const answer = {
      type: 'fill_blank' as const,
      answers: { b1: 'SKY' },
    }
    expect(checkFillBlank(question, answer)).toBe(true)
  })

  it('is case insensitive by default', () => {
    const answer = {
      type: 'fill_blank' as const,
      answers: { b1: 'SKY' },
    }
    expect(checkFillBlank(question, answer)).toBe(true)
  })

  it('respects caseSensitive flag', () => {
    const caseSensitiveQuestion: FillBlankQuestion = {
      ...question,
      blanks: [{ id: 'b1', answer: 'sky', caseSensitive: true }],
    }
    const answer = {
      type: 'fill_blank' as const,
      answers: { b1: 'SKY' },
    }
    expect(checkFillBlank(caseSensitiveQuestion, answer)).toBe(false)
  })
})

describe('checkShortAnswer', () => {
  const question: ShortAnswerQuestion = {
    id: 'q1',
    type: 'short_answer',
    question: 'What color is the sky?',
    acceptableAnswers: ['blue', 'light blue'],
    explanation: '',
  }

  it('returns true for correct answer', () => {
    const answer = { type: 'short_answer' as const, text: 'blue' }
    expect(checkShortAnswer(question, answer)).toBe(true)
  })

  it('accepts any of the acceptable answers', () => {
    const answer = { type: 'short_answer' as const, text: 'light blue' }
    expect(checkShortAnswer(question, answer)).toBe(true)
  })

  it('is case insensitive by default', () => {
    const answer = { type: 'short_answer' as const, text: 'BLUE' }
    expect(checkShortAnswer(question, answer)).toBe(true)
  })

  it('trims whitespace', () => {
    const answer = { type: 'short_answer' as const, text: '  blue  ' }
    expect(checkShortAnswer(question, answer)).toBe(true)
  })
})

describe('checkAnswer', () => {
  it('dispatches to correct checker for multiple choice', () => {
    const question: MultipleChoiceQuestion = {
      id: 'q1',
      type: 'multiple_choice',
      question: 'Test?',
      options: ['A', 'B'],
      correctAnswer: 0,
      explanation: '',
    }
    const answer = { type: 'multiple_choice' as const, selectedOption: 0 }
    expect(checkAnswer(question, answer)).toBe(true)
  })
})

describe('calculatePartialScore', () => {
  it('returns 1 for fully correct multiple choice', () => {
    const question: MultipleChoiceQuestion = {
      id: 'q1',
      type: 'multiple_choice',
      question: 'Test?',
      options: ['A', 'B'],
      correctAnswer: 0,
      explanation: '',
    }
    const answer = { type: 'multiple_choice' as const, selectedOption: 0 }
    expect(calculatePartialScore(question, answer)).toBe(1)
  })

  it('returns partial score for matching questions', () => {
    const question: MatchingQuestion = {
      id: 'q1',
      type: 'matching',
      question: 'Match',
      pairs: [
        { id: 'p1', left: 'A', right: '1' },
        { id: 'p2', left: 'B', right: '2' },
      ],
      explanation: '',
    }
    const answer = {
      type: 'matching' as const,
      matches: { p1: '1', p2: '1' },
    }
    expect(calculatePartialScore(question, answer)).toBe(0.5)
  })
})

describe('shuffleArray', () => {
  it('returns array of same length', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffleArray(arr)
    expect(shuffled).toHaveLength(arr.length)
  })

  it('contains all original elements', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffleArray(arr)
    expect(shuffled.sort()).toEqual(arr.sort())
  })

  it('does not modify original array', () => {
    const arr = [1, 2, 3, 4, 5]
    const original = [...arr]
    shuffleArray(arr)
    expect(arr).toEqual(original)
  })
})

describe('formatTimeSpent', () => {
  it('formats seconds correctly', () => {
    expect(formatTimeSpent(5000)).toBe('5s')
    expect(formatTimeSpent(30000)).toBe('30s')
  })

  it('formats minutes and seconds correctly', () => {
    expect(formatTimeSpent(65000)).toBe('1m 5s')
    expect(formatTimeSpent(125000)).toBe('2m 5s')
  })
})

describe('isAnswerComplete', () => {
  it('returns false for null answer', () => {
    const question: MultipleChoiceQuestion = {
      id: 'q1',
      type: 'multiple_choice',
      question: 'Test?',
      options: ['A', 'B'],
      correctAnswer: 0,
      explanation: '',
    }
    expect(isAnswerComplete(question, null)).toBe(false)
  })

  it('returns true for selected multiple choice', () => {
    const question: MultipleChoiceQuestion = {
      id: 'q1',
      type: 'multiple_choice',
      question: 'Test?',
      options: ['A', 'B'],
      correctAnswer: 0,
      explanation: '',
    }
    const answer = { type: 'multiple_choice' as const, selectedOption: 0 }
    expect(isAnswerComplete(question, answer)).toBe(true)
  })

  it('returns false for empty short answer', () => {
    const question: ShortAnswerQuestion = {
      id: 'q1',
      type: 'short_answer',
      question: 'Test?',
      acceptableAnswers: ['answer'],
      explanation: '',
    }
    const answer = { type: 'short_answer' as const, text: '' }
    expect(isAnswerComplete(question, answer)).toBe(false)
  })
})

describe('getEmptyAnswer', () => {
  it('returns correct empty answer for multiple choice', () => {
    const question: MultipleChoiceQuestion = {
      id: 'q1',
      type: 'multiple_choice',
      question: 'Test?',
      options: ['A', 'B'],
      correctAnswer: 0,
      explanation: '',
    }
    const empty = getEmptyAnswer(question)
    expect(empty).toEqual({
      type: 'multiple_choice',
      selectedOption: null,
      selectedOptions: undefined,
    })
  })

  it('returns correct empty answer for matching', () => {
    const question: MatchingQuestion = {
      id: 'q1',
      type: 'matching',
      question: 'Match',
      pairs: [],
      explanation: '',
    }
    const empty = getEmptyAnswer(question)
    expect(empty).toEqual({ type: 'matching', matches: {} })
  })
})
