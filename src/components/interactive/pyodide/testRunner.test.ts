import { describe, it, expect } from 'vitest'
import { createTestCode, evaluateTestResult, summarizeResults } from './testRunner'
import type { TestCase, TestResult } from '../code-editor/types'

describe('testRunner', () => {
  describe('createTestCode', () => {
    it('combines user code with test input', () => {
      const userCode = 'def add(a, b):\n    return a + b'
      const testCase: TestCase = {
        id: 'test-1',
        name: 'Test',
        input: 'print(add(1, 2))',
        expectedOutput: '3',
      }

      const result = createTestCode(userCode, testCase)

      expect(result).toContain('def add(a, b):')
      expect(result).toContain('print(add(1, 2))')
    })
  })

  describe('evaluateTestResult', () => {
    const testCase: TestCase = {
      id: 'test-1',
      name: 'Test',
      input: 'print(1)',
      expectedOutput: '1',
    }

    it('returns passed=true when output matches', () => {
      const result = evaluateTestResult(testCase, '1\n', undefined, 100)

      expect(result.passed).toBe(true)
      expect(result.testCase).toBe(testCase)
      expect(result.actualOutput).toBe('1')
      expect(result.executionTime).toBe(100)
    })

    it('returns passed=false when output does not match', () => {
      const result = evaluateTestResult(testCase, '2', undefined, 50)

      expect(result.passed).toBe(false)
      expect(result.actualOutput).toBe('2')
    })

    it('returns passed=false when there is an error', () => {
      const result = evaluateTestResult(testCase, '1', 'SyntaxError', 10)

      expect(result.passed).toBe(false)
      expect(result.error).toBe('SyntaxError')
    })

    it('trims whitespace when comparing', () => {
      const result = evaluateTestResult(testCase, '  1  \n', undefined, 10)

      expect(result.passed).toBe(true)
    })
  })

  describe('summarizeResults', () => {
    const createResult = (passed: boolean): TestResult => ({
      testCase: {
        id: 'test',
        name: 'Test',
        input: '',
        expectedOutput: '',
      },
      passed,
      actualOutput: '',
      executionTime: 0,
    })

    it('returns correct counts', () => {
      const results = [
        createResult(true),
        createResult(true),
        createResult(false),
      ]

      const summary = summarizeResults(results)

      expect(summary.passed).toBe(2)
      expect(summary.failed).toBe(1)
      expect(summary.total).toBe(3)
      expect(summary.allPassed).toBe(false)
    })

    it('returns allPassed=true when all pass', () => {
      const results = [createResult(true), createResult(true)]

      const summary = summarizeResults(results)

      expect(summary.allPassed).toBe(true)
    })

    it('handles empty results', () => {
      const summary = summarizeResults([])

      expect(summary.passed).toBe(0)
      expect(summary.failed).toBe(0)
      expect(summary.total).toBe(0)
      expect(summary.allPassed).toBe(true)
    })
  })
})
