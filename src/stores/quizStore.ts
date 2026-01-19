import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  Answer,
  QuizAttempt,
  QuizProgress,
  QuestionResult,
  SpacedRepetitionPrompt,
} from '@/components/interactive/quiz/types'

interface QuizState {
  quizzes: Record<string, QuizProgress>

  // Quiz lifecycle
  startQuiz: (quizId: string) => string
  submitAnswer: (
    quizId: string,
    questionId: string,
    answer: Answer,
    isCorrect: boolean,
    timeSpent: number,
    partialScore?: number
  ) => void
  completeQuiz: (quizId: string, score: number, maxScore: number) => QuizAttempt | null
  resetQuiz: (quizId: string) => void

  // Navigation
  setCurrentQuestion: (quizId: string, index: number) => void
  startQuestionTimer: (quizId: string) => void

  // Getters
  getQuizProgress: (quizId: string) => QuizProgress | null
  getCurrentAttempt: (quizId: string) => QuizAttempt | null
  getAnswer: (quizId: string, questionId: string) => Answer | null
  getBestScore: (quizId: string) => number

  // Spaced repetition
  scheduleReview: (quizId: string, questionIds: string[], interval: number) => void
  getDueReviews: () => Array<{ quizId: string; prompt: SpacedRepetitionPrompt }>
  completeReview: (quizId: string, performance: 'easy' | 'medium' | 'hard') => void
}

const generateAttemptId = () => Math.random().toString(36).substring(2, 11)

const SM2_INITIAL_INTERVAL = 1
const SM2_INITIAL_EASE = 2.5
const SM2_MIN_EASE = 1.3

const calculateNextInterval = (
  interval: number,
  easeFactor: number,
  performance: 'easy' | 'medium' | 'hard'
): { interval: number; easeFactor: number } => {
  let newEase = easeFactor
  let newInterval = interval

  switch (performance) {
    case 'easy':
      newEase = easeFactor + 0.15
      newInterval = Math.round(interval * newEase)
      break
    case 'medium':
      newInterval = Math.round(interval * newEase)
      break
    case 'hard':
      newEase = Math.max(SM2_MIN_EASE, easeFactor - 0.2)
      newInterval = Math.max(1, Math.round(interval * 0.5))
      break
  }

  return { interval: newInterval, easeFactor: newEase }
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      quizzes: {},

      startQuiz: (quizId: string) => {
        const now = new Date().toISOString()
        const attemptId = generateAttemptId()
        const { quizzes } = get()
        const existing = quizzes[quizId]

        const newAttempt: QuizAttempt = {
          attemptId,
          quizId,
          startedAt: now,
          completedAt: null,
          results: [],
          score: 0,
          maxScore: 0,
          percentage: 0,
        }

        set({
          quizzes: {
            ...quizzes,
            [quizId]: {
              quizId,
              attempts: existing ? [...existing.attempts, newAttempt] : [newAttempt],
              currentAttemptId: attemptId,
              currentQuestionIndex: 0,
              answers: {},
              questionStartTime: now,
              bestScore: existing?.bestScore ?? 0,
              lastAttemptAt: existing?.lastAttemptAt ?? null,
              spacedRepetition: existing?.spacedRepetition,
            },
          },
        })

        return attemptId
      },

      submitAnswer: (
        quizId: string,
        questionId: string,
        answer: Answer,
        isCorrect: boolean,
        timeSpent: number,
        partialScore?: number
      ) => {
        const { quizzes } = get()
        const progress = quizzes[quizId]
        if (!progress || !progress.currentAttemptId) return

        const result: QuestionResult = {
          questionId,
          isCorrect,
          partialScore,
          answer,
          timestamp: new Date().toISOString(),
          timeSpent,
        }

        const attemptIndex = progress.attempts.findIndex(
          (a) => a.attemptId === progress.currentAttemptId
        )
        if (attemptIndex === -1) return

        const updatedAttempts = [...progress.attempts]
        const existingResultIndex = updatedAttempts[attemptIndex].results.findIndex(
          (r) => r.questionId === questionId
        )

        if (existingResultIndex >= 0) {
          updatedAttempts[attemptIndex].results[existingResultIndex] = result
        } else {
          updatedAttempts[attemptIndex].results.push(result)
        }

        set({
          quizzes: {
            ...quizzes,
            [quizId]: {
              ...progress,
              attempts: updatedAttempts,
              answers: {
                ...progress.answers,
                [questionId]: answer,
              },
            },
          },
        })
      },

      completeQuiz: (quizId: string, score: number, maxScore: number) => {
        const { quizzes } = get()
        const progress = quizzes[quizId]
        if (!progress || !progress.currentAttemptId) return null

        const now = new Date().toISOString()
        const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

        const attemptIndex = progress.attempts.findIndex(
          (a) => a.attemptId === progress.currentAttemptId
        )
        if (attemptIndex === -1) return null

        const updatedAttempts = [...progress.attempts]
        updatedAttempts[attemptIndex] = {
          ...updatedAttempts[attemptIndex],
          completedAt: now,
          score,
          maxScore,
          percentage,
        }

        const newBestScore = Math.max(progress.bestScore, percentage)

        set({
          quizzes: {
            ...quizzes,
            [quizId]: {
              ...progress,
              attempts: updatedAttempts,
              currentAttemptId: null,
              bestScore: newBestScore,
              lastAttemptAt: now,
            },
          },
        })

        return updatedAttempts[attemptIndex]
      },

      resetQuiz: (quizId: string) => {
        const { quizzes } = get()
        const { [quizId]: _, ...rest } = quizzes
        set({ quizzes: rest })
      },

      setCurrentQuestion: (quizId: string, index: number) => {
        const { quizzes } = get()
        const progress = quizzes[quizId]
        if (!progress) return

        set({
          quizzes: {
            ...quizzes,
            [quizId]: {
              ...progress,
              currentQuestionIndex: index,
              questionStartTime: new Date().toISOString(),
            },
          },
        })
      },

      startQuestionTimer: (quizId: string) => {
        const { quizzes } = get()
        const progress = quizzes[quizId]
        if (!progress) return

        set({
          quizzes: {
            ...quizzes,
            [quizId]: {
              ...progress,
              questionStartTime: new Date().toISOString(),
            },
          },
        })
      },

      getQuizProgress: (quizId: string) => {
        return get().quizzes[quizId] ?? null
      },

      getCurrentAttempt: (quizId: string) => {
        const progress = get().quizzes[quizId]
        if (!progress || !progress.currentAttemptId) return null
        return (
          progress.attempts.find((a) => a.attemptId === progress.currentAttemptId) ?? null
        )
      },

      getAnswer: (quizId: string, questionId: string) => {
        const progress = get().quizzes[quizId]
        return progress?.answers[questionId] ?? null
      },

      getBestScore: (quizId: string) => {
        return get().quizzes[quizId]?.bestScore ?? 0
      },

      scheduleReview: (quizId: string, questionIds: string[], interval: number) => {
        const { quizzes } = get()
        const progress = quizzes[quizId]
        if (!progress) return

        const dueAt = new Date()
        dueAt.setDate(dueAt.getDate() + interval)

        set({
          quizzes: {
            ...quizzes,
            [quizId]: {
              ...progress,
              spacedRepetition: {
                questionIds,
                dueAt: dueAt.toISOString(),
                interval,
                easeFactor: SM2_INITIAL_EASE,
              },
            },
          },
        })
      },

      getDueReviews: () => {
        const { quizzes } = get()
        const now = new Date()
        const due: Array<{ quizId: string; prompt: SpacedRepetitionPrompt }> = []

        for (const [quizId, progress] of Object.entries(quizzes)) {
          if (progress.spacedRepetition) {
            const dueDate = new Date(progress.spacedRepetition.dueAt)
            if (dueDate <= now) {
              due.push({ quizId, prompt: progress.spacedRepetition })
            }
          }
        }

        return due
      },

      completeReview: (quizId: string, performance: 'easy' | 'medium' | 'hard') => {
        const { quizzes } = get()
        const progress = quizzes[quizId]
        if (!progress?.spacedRepetition) return

        const { interval, easeFactor } = calculateNextInterval(
          progress.spacedRepetition.interval || SM2_INITIAL_INTERVAL,
          progress.spacedRepetition.easeFactor || SM2_INITIAL_EASE,
          performance
        )

        const dueAt = new Date()
        dueAt.setDate(dueAt.getDate() + interval)

        set({
          quizzes: {
            ...quizzes,
            [quizId]: {
              ...progress,
              spacedRepetition: {
                ...progress.spacedRepetition,
                dueAt: dueAt.toISOString(),
                interval,
                easeFactor,
              },
            },
          },
        })
      },
    }),
    {
      name: 'rnn-quiz-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
