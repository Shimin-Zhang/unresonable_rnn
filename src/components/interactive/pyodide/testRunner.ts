import type { TestCase, TestResult } from '../code-editor/types'

export function createTestCode(userCode: string, testCase: TestCase): string {
  return `
${userCode}

# Run test
${testCase.input}
`
}

export function evaluateTestResult(
  testCase: TestCase,
  stdout: string,
  error?: string,
  executionTime: number = 0
): TestResult {
  const actualOutput = stdout.trim()
  const expectedOutput = testCase.expectedOutput.trim()
  const passed = actualOutput === expectedOutput && !error

  return {
    testCase,
    passed,
    actualOutput,
    error,
    executionTime,
  }
}

export function summarizeResults(results: TestResult[]): {
  passed: number
  failed: number
  total: number
  allPassed: boolean
} {
  const passed = results.filter((r) => r.passed).length
  const failed = results.length - passed

  return {
    passed,
    failed,
    total: results.length,
    allPassed: passed === results.length,
  }
}
