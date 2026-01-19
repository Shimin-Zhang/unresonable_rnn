export const QUIZ_COLORS = {
  correct: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-700',
    icon: 'text-green-500',
  },
  incorrect: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-700',
    icon: 'text-red-500',
  },
  selected: {
    bg: 'bg-primary-50',
    border: 'border-primary-500',
    text: 'text-primary-700',
  },
  default: {
    bg: 'bg-white',
    border: 'border-slate-200',
    text: 'text-slate-700',
  },
} as const

export const PASSING_SCORE_DEFAULT = 70

export const CONFETTI_DURATION = 3000

export const SPACED_REPETITION_INTERVALS = {
  initial: 1,
  easy: 4,
  medium: 2,
  hard: 1,
} as const

export const BLANK_PLACEHOLDER = '___'

export const MATCHING_DROP_ZONE_ID_PREFIX = 'drop-zone-'

export const ANIMATION_DURATIONS = {
  feedback: 300,
  transition: 200,
  confetti: 3000,
} as const
