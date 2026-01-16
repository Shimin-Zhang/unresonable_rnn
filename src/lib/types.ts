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
