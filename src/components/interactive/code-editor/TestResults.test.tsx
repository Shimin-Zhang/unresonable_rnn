import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestResults } from './TestResults'
import type { TestResult, TestCase } from './types'

describe('TestResults', () => {
  const createTestCase = (id: string, name: string, hidden = false): TestCase => ({
    id,
    name,
    input: `test input ${id}`,
    expectedOutput: `expected ${id}`,
    hidden,
  })

  const createTestResult = (
    testCase: TestCase,
    passed: boolean,
    actualOutput = 'actual output',
    error?: string
  ): TestResult => ({
    testCase,
    passed,
    actualOutput,
    error,
    executionTime: 100,
  })

  it('returns null when results array is empty', () => {
    const { container } = render(<TestResults results={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('displays pass/fail count', () => {
    const results: TestResult[] = [
      createTestResult(createTestCase('1', 'Test 1'), true),
      createTestResult(createTestCase('2', 'Test 2'), false),
      createTestResult(createTestCase('3', 'Test 3'), true),
    ]

    render(<TestResults results={results} />)
    expect(screen.getByText('2/3 passed')).toBeInTheDocument()
  })

  it('shows all passed indicator when all tests pass', () => {
    const results: TestResult[] = [
      createTestResult(createTestCase('1', 'Test 1'), true),
      createTestResult(createTestCase('2', 'Test 2'), true),
    ]

    render(<TestResults results={results} />)
    expect(screen.getByText('2/2 passed')).toBeInTheDocument()
  })

  it('renders test case names', () => {
    const results: TestResult[] = [
      createTestResult(createTestCase('1', 'Basic Sum'), true),
      createTestResult(createTestCase('2', 'Edge Case'), false),
    ]

    render(<TestResults results={results} />)
    expect(screen.getByText('Basic Sum')).toBeInTheDocument()
    expect(screen.getByText('Edge Case')).toBeInTheDocument()
  })

  it('shows execution time for each test', () => {
    const results: TestResult[] = [
      createTestResult(createTestCase('1', 'Test'), true),
    ]

    render(<TestResults results={results} />)
    expect(screen.getByText('(100ms)')).toBeInTheDocument()
  })

  it('shows expected and actual output for failed tests', () => {
    const testCase = createTestCase('1', 'Failed Test')
    const result = createTestResult(testCase, false, 'wrong output')

    render(<TestResults results={[result]} />)
    expect(screen.getByText('Expected:')).toBeInTheDocument()
    expect(screen.getByText('Got:')).toBeInTheDocument()
    expect(screen.getByText('expected 1')).toBeInTheDocument()
    expect(screen.getByText('wrong output')).toBeInTheDocument()
  })

  it('shows error message for failed tests with errors', () => {
    const testCase = createTestCase('1', 'Error Test')
    const result = createTestResult(testCase, false, '', 'SyntaxError')

    render(<TestResults results={[result]} />)
    expect(screen.getByText('Error:')).toBeInTheDocument()
    expect(screen.getByText('SyntaxError')).toBeInTheDocument()
  })

  it('hides details for hidden test cases', () => {
    const testCase = createTestCase('1', 'Hidden Test', true)
    const result = createTestResult(testCase, false)

    render(<TestResults results={[result]} />)
    expect(
      screen.getByText('Hidden test case - details not shown')
    ).toBeInTheDocument()
    expect(screen.queryByText('Expected:')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const results: TestResult[] = [
      createTestResult(createTestCase('1', 'Test'), true),
    ]

    const { container } = render(
      <TestResults results={results} className="custom-class" />
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
