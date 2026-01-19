// Question Types
export type QuestionType = 'multiple_choice' | 'matching' | 'fill_blank' | 'short_answer'

export interface BaseQuestion {
  id: string
  type: QuestionType
  question: string
  explanation: string
  points?: number
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice'
  options: string[]
  correctAnswer: number
  allowMultiple?: boolean
  correctAnswers?: number[]
}

export interface MatchingPair {
  id: string
  left: string
  right: string
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching'
  pairs: MatchingPair[]
}

export interface BlankSlot {
  id: string
  answer: string
  acceptableAnswers?: string[]
  caseSensitive?: boolean
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill_blank'
  textWithBlanks: string
  blanks: BlankSlot[]
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short_answer'
  acceptableAnswers: string[]
  caseSensitive?: boolean
  maxLength?: number
}

export type Question =
  | MultipleChoiceQuestion
  | MatchingQuestion
  | FillBlankQuestion
  | ShortAnswerQuestion

// Answer Types
export interface MultipleChoiceAnswer {
  type: 'multiple_choice'
  selectedOption: number | null
  selectedOptions?: number[]
}

export interface MatchingAnswer {
  type: 'matching'
  matches: Record<string, string>
}

export interface FillBlankAnswer {
  type: 'fill_blank'
  answers: Record<string, string>
}

export interface ShortAnswerAnswer {
  type: 'short_answer'
  text: string
}

export type Answer =
  | MultipleChoiceAnswer
  | MatchingAnswer
  | FillBlankAnswer
  | ShortAnswerAnswer

// Result Types
export interface QuestionResult {
  questionId: string
  isCorrect: boolean
  partialScore?: number
  answer: Answer
  timestamp: string
  timeSpent: number
}

export interface QuizAttempt {
  attemptId: string
  quizId: string
  startedAt: string
  completedAt: string | null
  results: QuestionResult[]
  score: number
  maxScore: number
  percentage: number
}

// Quiz Configuration
export interface QuizConfig {
  id: string
  title: string
  description?: string
  questions: Question[]
  shuffleQuestions?: boolean
  shuffleOptions?: boolean
  showFeedback: 'immediate' | 'after_submit' | 'after_quiz'
  allowRetry?: boolean
  maxAttempts?: number
  passingScore?: number
  timeLimit?: number
}

// Spaced Repetition
export interface SpacedRepetitionPrompt {
  questionIds: string[]
  dueAt: string
  interval: number
  easeFactor: number
}

export interface QuizProgress {
  quizId: string
  attempts: QuizAttempt[]
  currentAttemptId: string | null
  currentQuestionIndex: number
  answers: Record<string, Answer>
  questionStartTime: string | null
  bestScore: number
  lastAttemptAt: string | null
  spacedRepetition?: SpacedRepetitionPrompt
}

// Component Props
export interface QuizProps {
  config: QuizConfig
  onComplete?: (attempt: QuizAttempt) => void
  onQuestionAnswer?: (questionId: string, result: QuestionResult) => void
  showSpacedRepetitionPrompt?: boolean
  className?: string
}

export interface QuestionCardProps {
  question: Question
  answer: Answer | null
  showFeedback: boolean
  isCorrect?: boolean
  onAnswer: (answer: Answer) => void
  disabled?: boolean
  className?: string
}

export interface MultipleChoiceProps {
  question: MultipleChoiceQuestion
  answer: MultipleChoiceAnswer | null
  showFeedback: boolean
  onAnswer: (answer: MultipleChoiceAnswer) => void
  disabled?: boolean
  className?: string
}

export interface MatchingProps {
  question: MatchingQuestion
  answer: MatchingAnswer | null
  showFeedback: boolean
  onAnswer: (answer: MatchingAnswer) => void
  disabled?: boolean
  className?: string
}

export interface FillBlankProps {
  question: FillBlankQuestion
  answer: FillBlankAnswer | null
  showFeedback: boolean
  onAnswer: (answer: FillBlankAnswer) => void
  disabled?: boolean
  className?: string
}

export interface ShortAnswerProps {
  question: ShortAnswerQuestion
  answer: ShortAnswerAnswer | null
  showFeedback: boolean
  onAnswer: (answer: ShortAnswerAnswer) => void
  disabled?: boolean
  className?: string
}

export interface QuizProgressBarProps {
  current: number
  total: number
  answered: number
  className?: string
}

export interface QuizResultsProps {
  attempt: QuizAttempt
  questions: Question[]
  onRetry?: () => void
  onContinue?: () => void
  className?: string
}

export interface FeedbackPanelProps {
  isCorrect: boolean
  explanation: string
  onNext?: () => void
  className?: string
}

export interface ScoreSummaryProps {
  score: number
  maxScore: number
  percentage: number
  isPassing: boolean
  className?: string
}

export interface ConfettiProps {
  active: boolean
  duration?: number
}

export interface SpacedRepetitionPromptProps {
  questionsToReview: number
  onStartReview: () => void
  onSkip: () => void
  className?: string
}
