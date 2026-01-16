import type { DifficultyLevel } from './types'

export const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  { label: string; color: string; stars: number }
> = {
  1: { label: 'Beginner', color: 'text-green-500', stars: 1 },
  2: { label: 'Easy', color: 'text-lime-500', stars: 2 },
  3: { label: 'Medium', color: 'text-yellow-500', stars: 3 },
  4: { label: 'Hard', color: 'text-orange-500', stars: 4 },
  5: { label: 'Expert', color: 'text-red-500', stars: 5 },
}

export const MAX_STARS = 5

export const EXECUTION_TIMEOUT_MS = 30000

export const PYODIDE_CDN_URL =
  'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'

export const DEFAULT_PYTHON_CODE = `# Write your Python code here
def solution():
    pass

# Test your solution
result = solution()
print(result)
`

export const EDITOR_CONFIG = {
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 4,
  indentUnit: 4,
}

export const OUTPUT_TAB_IDS = {
  OUTPUT: 'output',
  TESTS: 'tests',
} as const
