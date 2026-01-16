import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserProgress, LearningPath } from '@/lib/types'

interface ProgressState extends UserProgress {
  // Actions
  setCurrentPath: (pathId: string) => void
  setCurrentModule: (moduleId: number) => void
  completeModule: (moduleId: number) => void
  resetProgress: () => void
}

const initialState: UserProgress = {
  completedModules: [],
  currentModule: null,
  currentPath: null,
  startedAt: null,
  lastAccessedAt: null,
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
    }),
    {
      name: 'rnn-learning-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
