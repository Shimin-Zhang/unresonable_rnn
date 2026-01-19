import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  GamificationState,
  UserStats,
  ModuleStats,
  UnlockedBadge,
  BadgeNotification,
  Certificate,
  ExerciseResult,
} from '@/lib/types'
import {
  BADGES,
  MODULE_BADGES,
  PATH_BADGES,
  STREAK_THRESHOLDS,
  COMPLETION_THRESHOLDS,
  EXERCISE_THRESHOLDS,
  PERFECT_EXERCISE_THRESHOLDS,
  FIRST_TRY_THRESHOLDS,
  POINTS_THRESHOLDS,
  calculateModulePoints,
  calculateExercisePoints,
  isWithinTimeRange,
  POINTS,
} from '@/lib/gamification'
import { LEARNING_PATHS } from '@/lib/constants'

interface GamificationActions {
  // User actions
  setUsername: (username: string) => void

  // Progress tracking
  startModule: (moduleId: number) => void
  completeModule: (moduleId: number) => void
  recordExerciseResult: (
    moduleId: number,
    exerciseId: string,
    attempts: number,
    hintsUsed: number,
    timeToComplete: number
  ) => void

  // Path completion
  checkPathCompletion: (completedModules: number[]) => void

  // Streak management
  updateStreak: () => void

  // Badge management
  unlockBadge: (badgeId: string) => void
  markNotificationSeen: (notificationId: string) => void
  clearNotifications: () => void

  // Certificate generation
  generateCertificate: (pathId: string, pathName: string) => Certificate

  // Reset
  resetGamification: () => void

  // Getters
  getBadge: (badgeId: string) => UnlockedBadge | null
  getUnseenNotifications: () => BadgeNotification[]
  getTotalBadgeCount: () => number
  getModuleStats: (moduleId: number) => ModuleStats | null
}

const initialStats: UserStats = {
  totalPoints: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  totalTimeSpent: 0,
  modulesCompletedCount: 0,
  exercisesCompletedCount: 0,
  perfectExercises: 0,
  averageAttemptsPerExercise: 0,
}

const initialState: GamificationState = {
  username: null,
  badges: {},
  stats: initialStats,
  moduleStats: {},
  certificates: [],
  notifications: [],
}

// Helper to generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper to get today's date string
function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

// Helper to check if two dates are consecutive
function areConsecutiveDays(date1: string, date2: string): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

// Helper to check if date is today
function isToday(dateStr: string): boolean {
  return dateStr === getTodayString()
}

export const useGamificationStore = create<GamificationState & GamificationActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUsername: (username: string) => {
        set({ username })
      },

      startModule: (moduleId: number) => {
        const { moduleStats } = get()
        if (!moduleStats[moduleId]) {
          set({
            moduleStats: {
              ...moduleStats,
              [moduleId]: {
                moduleId,
                startedAt: new Date().toISOString(),
                completedAt: null,
                timeSpent: 0,
                pointsEarned: 0,
                exerciseResults: {},
              },
            },
          })
        }
        // Update streak when user starts learning
        get().updateStreak()
      },

      completeModule: (moduleId: number) => {
        const { moduleStats, stats, badges } = get()
        const now = new Date()
        const currentModuleStats = moduleStats[moduleId] || {
          moduleId,
          startedAt: now.toISOString(),
          completedAt: null,
          timeSpent: 0,
          pointsEarned: 0,
          exerciseResults: {},
        }

        // Calculate points for this module
        const modulePoints = calculateModulePoints(moduleId)

        // Calculate time spent (if we have a start time)
        let timeSpent = currentModuleStats.timeSpent
        if (currentModuleStats.startedAt && !currentModuleStats.completedAt) {
          const startTime = new Date(currentModuleStats.startedAt)
          timeSpent = Math.floor((now.getTime() - startTime.getTime()) / 1000)
        }

        // Update module stats
        const updatedModuleStats = {
          ...moduleStats,
          [moduleId]: {
            ...currentModuleStats,
            completedAt: now.toISOString(),
            timeSpent,
            pointsEarned: modulePoints,
          },
        }

        // Update user stats
        const newModulesCount = stats.modulesCompletedCount + 1
        const newTotalPoints = stats.totalPoints + modulePoints
        const newTotalTime = stats.totalTimeSpent + timeSpent

        set({
          moduleStats: updatedModuleStats,
          stats: {
            ...stats,
            totalPoints: newTotalPoints,
            totalTimeSpent: newTotalTime,
            modulesCompletedCount: newModulesCount,
          },
        })

        // Check for module-specific badges
        if (MODULE_BADGES[moduleId] && !badges[MODULE_BADGES[moduleId]]) {
          get().unlockBadge(MODULE_BADGES[moduleId])
        }

        // Check for completion threshold badges
        for (const threshold of COMPLETION_THRESHOLDS) {
          if (newModulesCount >= threshold.count && !badges[threshold.badge]) {
            get().unlockBadge(threshold.badge)
          }
        }

        // Check for points threshold badges
        for (const threshold of POINTS_THRESHOLDS) {
          if (newTotalPoints >= threshold.points && !badges[threshold.badge]) {
            get().unlockBadge(threshold.badge)
          }
        }

        // Check for speed badge (under 10 minutes)
        if (timeSpent < 600 && !badges['speed_demon']) {
          get().unlockBadge('speed_demon')
        }

        // Check for marathon badge (over 2 hours in session)
        if (timeSpent > 7200 && !badges['marathon_runner']) {
          get().unlockBadge('marathon_runner')
        }

        // Check for time-of-day badges
        const hour = now.getHours()
        if (isWithinTimeRange(hour, 0, 5) && !badges['night_owl']) {
          get().unlockBadge('night_owl')
        }
        if (isWithinTimeRange(hour, 5, 7) && !badges['early_bird']) {
          get().unlockBadge('early_bird')
        }

        // Update streak
        get().updateStreak()
      },

      recordExerciseResult: (
        moduleId: number,
        exerciseId: string,
        attempts: number,
        hintsUsed: number,
        timeToComplete: number
      ) => {
        const { moduleStats, stats, badges } = get()
        const currentModuleStats = moduleStats[moduleId] || {
          moduleId,
          startedAt: new Date().toISOString(),
          completedAt: null,
          timeSpent: 0,
          pointsEarned: 0,
          exerciseResults: {},
        }

        // Calculate points for this exercise
        const exercisePoints = calculateExercisePoints(hintsUsed, attempts)

        // Create exercise result
        const exerciseResult: ExerciseResult = {
          exerciseId,
          attempts,
          hintsUsed,
          completed: true,
          completedAt: new Date().toISOString(),
          timeToComplete,
          pointsEarned: exercisePoints,
        }

        // Update module stats
        const updatedModuleStats = {
          ...moduleStats,
          [moduleId]: {
            ...currentModuleStats,
            pointsEarned: currentModuleStats.pointsEarned + exercisePoints,
            exerciseResults: {
              ...currentModuleStats.exerciseResults,
              [exerciseId]: exerciseResult,
            },
          },
        }

        // Update user stats
        const newExerciseCount = stats.exercisesCompletedCount + 1
        const newPerfectCount = hintsUsed === 0 ? stats.perfectExercises + 1 : stats.perfectExercises
        const newTotalPoints = stats.totalPoints + exercisePoints

        // Calculate new average attempts
        const totalAttempts =
          stats.averageAttemptsPerExercise * stats.exercisesCompletedCount + attempts
        const newAverageAttempts = totalAttempts / newExerciseCount

        set({
          moduleStats: updatedModuleStats,
          stats: {
            ...stats,
            totalPoints: newTotalPoints,
            exercisesCompletedCount: newExerciseCount,
            perfectExercises: newPerfectCount,
            averageAttemptsPerExercise: newAverageAttempts,
          },
        })

        // Check for exercise threshold badges
        for (const threshold of EXERCISE_THRESHOLDS) {
          if (newExerciseCount >= threshold.count && !badges[threshold.badge]) {
            get().unlockBadge(threshold.badge)
          }
        }

        // Check for perfect exercise badges
        for (const threshold of PERFECT_EXERCISE_THRESHOLDS) {
          if (newPerfectCount >= threshold.count && !badges[threshold.badge]) {
            get().unlockBadge(threshold.badge)
          }
        }

        // Check for first try badges (count exercises with 1 attempt)
        if (attempts === 1) {
          // Count total first-try completions
          let firstTryCount = 0
          for (const modStats of Object.values(updatedModuleStats)) {
            for (const result of Object.values(modStats.exerciseResults)) {
              if (result.attempts === 1) {
                firstTryCount++
              }
            }
          }
          for (const threshold of FIRST_TRY_THRESHOLDS) {
            if (firstTryCount >= threshold.count && !badges[threshold.badge]) {
              get().unlockBadge(threshold.badge)
            }
          }
        }

        // Check for points threshold badges
        for (const threshold of POINTS_THRESHOLDS) {
          if (newTotalPoints >= threshold.points && !badges[threshold.badge]) {
            get().unlockBadge(threshold.badge)
          }
        }
      },

      checkPathCompletion: (completedModules: number[]) => {
        const { badges } = get()

        // Check each learning path
        for (const [pathId, path] of Object.entries(LEARNING_PATHS)) {
          const pathModules = path.modules as readonly number[]
          const isPathComplete = pathModules.every((moduleId) =>
            completedModules.includes(moduleId)
          )

          if (isPathComplete) {
            const badgeId = PATH_BADGES[pathId]
            if (badgeId && !badges[badgeId]) {
              get().unlockBadge(badgeId)
            }
          }
        }
      },

      updateStreak: () => {
        const { stats, badges } = get()
        const today = getTodayString()
        const lastActive = stats.lastActiveDate

        let newStreak = stats.currentStreak
        let newLongest = stats.longestStreak

        if (!lastActive) {
          // First activity
          newStreak = 1
        } else if (isToday(lastActive)) {
          // Already active today, no change
          return
        } else if (areConsecutiveDays(lastActive, today)) {
          // Consecutive day
          newStreak = stats.currentStreak + 1
        } else {
          // Streak broken
          newStreak = 1
        }

        if (newStreak > newLongest) {
          newLongest = newStreak
        }

        // Add streak bonus points
        let bonusPoints = POINTS.STREAK_DAILY
        if (newStreak % 7 === 0) {
          bonusPoints += POINTS.STREAK_WEEKLY_BONUS
        }

        set({
          stats: {
            ...stats,
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastActiveDate: today,
            totalPoints: stats.totalPoints + bonusPoints,
          },
        })

        // Check for streak badges
        for (const threshold of STREAK_THRESHOLDS) {
          if (newStreak >= threshold.days && !badges[threshold.badge]) {
            get().unlockBadge(threshold.badge)
          }
        }
      },

      unlockBadge: (badgeId: string) => {
        const badge = BADGES[badgeId]
        if (!badge) return

        const { badges, notifications } = get()
        if (badges[badgeId]) return // Already unlocked

        const now = new Date().toISOString()
        const unlockedBadge: UnlockedBadge = {
          ...badge,
          unlockedAt: now,
        }

        const notification: BadgeNotification = {
          id: generateId(),
          badgeId,
          timestamp: now,
          seen: false,
        }

        set({
          badges: {
            ...badges,
            [badgeId]: unlockedBadge,
          },
          notifications: [notification, ...notifications],
        })
      },

      markNotificationSeen: (notificationId: string) => {
        const { notifications } = get()
        set({
          notifications: notifications.map((n) =>
            n.id === notificationId ? { ...n, seen: true } : n
          ),
        })
      },

      clearNotifications: () => {
        const { notifications } = get()
        set({
          notifications: notifications.map((n) => ({ ...n, seen: true })),
        })
      },

      generateCertificate: (pathId: string, pathName: string) => {
        const { username, stats, badges, certificates } = get()
        const certificate: Certificate = {
          id: generateId(),
          pathId,
          pathName,
          username: username || 'Anonymous Learner',
          completedAt: new Date().toISOString(),
          totalTimeSpent: stats.totalTimeSpent,
          totalPoints: stats.totalPoints,
          badgesEarned: Object.keys(badges),
        }

        set({
          certificates: [...certificates, certificate],
        })

        return certificate
      },

      resetGamification: () => {
        set(initialState)
      },

      // Getters
      getBadge: (badgeId: string) => {
        const { badges } = get()
        return badges[badgeId] || null
      },

      getUnseenNotifications: () => {
        const { notifications } = get()
        return notifications.filter((n) => !n.seen)
      },

      getTotalBadgeCount: () => {
        const { badges } = get()
        return Object.keys(badges).length
      },

      getModuleStats: (moduleId: number) => {
        const { moduleStats } = get()
        return moduleStats[moduleId] || null
      },
    }),
    {
      name: 'rnn-gamification',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
