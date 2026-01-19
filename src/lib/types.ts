export interface Module {
  id: number
  title: string
  subtitle: string
  description: string
  duration: string
  tags: readonly string[]
}

export interface LearningPath {
  id: string
  name: string
  description: string
  modules: readonly number[]
  duration: string
}

export interface UserProgress {
  completedModules: number[]
  currentModule: number | null
  currentPath: string | null
  startedAt: string | null
  lastAccessedAt: string | null
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface QuizResult {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
  timestamp: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string | null
}

export type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed'

// Gamification Types
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: BadgeRarity
  category: 'completion' | 'speed' | 'mastery' | 'streak' | 'special'
  requirement: string
}

export interface UnlockedBadge extends Badge {
  unlockedAt: string
}

export interface UserStats {
  totalPoints: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null
  totalTimeSpent: number // in seconds
  modulesCompletedCount: number
  exercisesCompletedCount: number
  perfectExercises: number // exercises completed with 0 hints
  averageAttemptsPerExercise: number
}

export interface ModuleStats {
  moduleId: number
  startedAt: string | null
  completedAt: string | null
  timeSpent: number // in seconds
  pointsEarned: number
  exerciseResults: Record<string, ExerciseResult>
}

export interface ExerciseResult {
  exerciseId: string
  attempts: number
  hintsUsed: number
  completed: boolean
  completedAt: string | null
  timeToComplete: number | null // in seconds
  pointsEarned: number
}

export interface LeaderboardEntry {
  rank: number
  username: string
  totalPoints: number
  badgeCount: number
  completedModules: number
  streak: number
}

export interface Certificate {
  id: string
  pathId: string
  pathName: string
  username: string
  completedAt: string
  totalTimeSpent: number
  totalPoints: number
  badgesEarned: string[]
}

export interface GamificationState {
  username: string | null
  badges: Record<string, UnlockedBadge>
  stats: UserStats
  moduleStats: Record<number, ModuleStats>
  certificates: Certificate[]
  notifications: BadgeNotification[]
}

export interface BadgeNotification {
  id: string
  badgeId: string
  timestamp: string
  seen: boolean
}
