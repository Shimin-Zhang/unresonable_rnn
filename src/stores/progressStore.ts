import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserProgress } from '@/lib/types'

interface ExerciseProgress {
  exerciseId: string
  currentCode: string
  hintsRevealed: number
  attempts: number
  completed: boolean
  completedAt: string | null
}

interface ProgressState extends UserProgress {
  // Exercise progress
  exercises: Record<string, ExerciseProgress>

  // Module actions
  setCurrentPath: (pathId: string) => void
  setCurrentModule: (moduleId: number) => void
  completeModule: (moduleId: number) => void
  resetProgress: () => void

  // Exercise actions
  saveExerciseProgress: (
    exerciseId: string,
    code: string,
    hintsRevealed: number,
    attempts: number
  ) => void
  completeExercise: (exerciseId: string, code: string) => void
  getExerciseProgress: (exerciseId: string) => ExerciseProgress | null
  resetExercise: (exerciseId: string) => void
}

const initialState: UserProgress & { exercises: Record<string, ExerciseProgress> } = {
  completedModules: [],
  currentModule: null,
  currentPath: null,
  startedAt: null,
  lastAccessedAt: null,
  exercises: {},
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentPath: (pathId: string) => {
        const now = new Date().toISOString()
        set({
          currentPath: pathId,
          startedAt: get().startedAt || now,
          lastAccessedAt: now,
        })
      },

      setCurrentModule: (moduleId: number) => {
        set({
          currentModule: moduleId,
          lastAccessedAt: new Date().toISOString(),
        })
      },

      completeModule: (moduleId: number) => {
        const { completedModules } = get()
        if (!completedModules.includes(moduleId)) {
          set({
            completedModules: [...completedModules, moduleId],
            currentModule: null,
            lastAccessedAt: new Date().toISOString(),
          })
        }
      },

      resetProgress: () => {
        set(initialState)
      },

      saveExerciseProgress: (
        exerciseId: string,
        code: string,
        hintsRevealed: number,
        attempts: number
      ) => {
        const { exercises } = get()
        const existing = exercises[exerciseId]
        set({
          exercises: {
            ...exercises,
            [exerciseId]: {
              exerciseId,
              currentCode: code,
              hintsRevealed,
              attempts,
              completed: existing?.completed ?? false,
              completedAt: existing?.completedAt ?? null,
            },
          },
          lastAccessedAt: new Date().toISOString(),
        })
      },

      completeExercise: (exerciseId: string, code: string) => {
        const { exercises } = get()
        const existing = exercises[exerciseId]
        set({
          exercises: {
            ...exercises,
            [exerciseId]: {
              exerciseId,
              currentCode: code,
              hintsRevealed: existing?.hintsRevealed ?? 0,
              attempts: existing?.attempts ?? 1,
              completed: true,
              completedAt: new Date().toISOString(),
            },
          },
          lastAccessedAt: new Date().toISOString(),
        })
      },

      getExerciseProgress: (exerciseId: string) => {
        const { exercises } = get()
        return exercises[exerciseId] ?? null
      },

      resetExercise: (exerciseId: string) => {
        const { exercises } = get()
        const { [exerciseId]: _, ...rest } = exercises
        set({ exercises: rest })
      },
    }),
    {
      name: 'rnn-learning-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
