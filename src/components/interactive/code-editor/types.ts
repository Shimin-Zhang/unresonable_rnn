export type DifficultyLevel = 1 | 2 | 3 | 4 | 5

export interface TestCase {
  id: string
  name: string
  input: string
  expectedOutput: string
  hidden?: boolean
}

export interface TestResult {
  testCase: TestCase
  passed: boolean
  actualOutput: string
  error?: string
  executionTime: number
}

export interface Hint {
  id: string
  order: number
  content: string
}

export interface ExecutionResult {
  stdout: string
  stderr: string
  error?: string
  executionTime: number
}

export interface ExerciseResult {
  exerciseId: string
  passed: boolean
  testResults: TestResult[]
  attempts: number
  hintsUsed: number
  completedAt: string
  code: string
}

export interface ExerciseProgress {
  exerciseId: string
  currentCode: string
  hintsRevealed: number
  attempts: number
  bestResult: ExerciseResult | null
  lastAttemptAt: string | null
}

export interface CodeEditorProps {
  exerciseId: string
  title: string
  description: string
  initialCode: string
  solution: string
  difficulty: DifficultyLevel
  testCases: TestCase[]
  hints?: Hint[]
  onComplete?: (result: ExerciseResult) => void
  className?: string
}

export interface EditorPaneProps {
  code: string
  onChange: (code: string) => void
  readOnly?: boolean
  className?: string
}

export interface OutputPanelProps {
  result: ExecutionResult | null
  isLoading: boolean
  className?: string
}

export interface ControlBarProps {
  onRun: () => void
  onCheckAnswer: () => void
  onShowHint: () => void
  onShowSolution: () => void
  isRunning: boolean
  hasHints: boolean
  hintsRemaining: number
  canShowSolution: boolean
  className?: string
}

export interface HintSystemProps {
  hints: Hint[]
  revealedCount: number
  onRevealHint: () => void
  className?: string
}

export interface TestResultsProps {
  results: TestResult[]
  className?: string
}

export interface DifficultyBadgeProps {
  level: DifficultyLevel
  showLabel?: boolean
  className?: string
}
