'use client'

import { CodeEditor } from '@/components/interactive/code-editor'
import type { TestCase, Hint, ExerciseResult } from '@/components/interactive/code-editor'

const DEMO_EXERCISE = {
  exerciseId: 'demo-sum-function',
  title: 'Sum Function',
  description:
    'Write a function called `sum_numbers` that takes a list of numbers and returns their sum.',
  initialCode: `def sum_numbers(numbers):
    # Your code here
    pass

# Test your function
result = sum_numbers([1, 2, 3, 4, 5])
print(result)
`,
  solution: `def sum_numbers(numbers):
    total = 0
    for num in numbers:
        total += num
    return total

# Test your function
result = sum_numbers([1, 2, 3, 4, 5])
print(result)
`,
  difficulty: 2 as const,
  testCases: [
    {
      id: 'test-1',
      name: 'Basic sum',
      input: 'print(sum_numbers([1, 2, 3, 4, 5]))',
      expectedOutput: '15',
    },
    {
      id: 'test-2',
      name: 'Empty list',
      input: 'print(sum_numbers([]))',
      expectedOutput: '0',
    },
    {
      id: 'test-3',
      name: 'Single element',
      input: 'print(sum_numbers([42]))',
      expectedOutput: '42',
    },
    {
      id: 'test-4',
      name: 'Negative numbers',
      input: 'print(sum_numbers([-1, -2, 3]))',
      expectedOutput: '0',
      hidden: true,
    },
  ] satisfies TestCase[],
  hints: [
    {
      id: 'hint-1',
      order: 1,
      content: 'Start by initializing a variable to store the running total.',
    },
    {
      id: 'hint-2',
      order: 2,
      content: 'Use a for loop to iterate through each number in the list.',
    },
    {
      id: 'hint-3',
      order: 3,
      content:
        'Add each number to your running total inside the loop, then return the total.',
    },
  ] satisfies Hint[],
}

export default function CodeEditorDemoPage() {
  const handleComplete = (result: ExerciseResult) => {
    console.log('Exercise completed!', result)
    alert(
      `Congratulations! You completed the exercise in ${result.attempts} attempt(s) using ${result.hintsUsed} hint(s).`
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            Interactive Code Editor Demo
          </h1>
          <p className="text-gray-400">
            This is a demo of the interactive code editor component with Python
            execution via Pyodide.
          </p>
        </div>

        <CodeEditor {...DEMO_EXERCISE} onComplete={handleComplete} />

        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <h2 className="mb-2 text-lg font-semibold text-white">Features</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-300">
            <li>Python syntax highlighting with CodeMirror 6</li>
            <li>Browser-based Python execution via Pyodide (no server needed)</li>
            <li>Automated test case grading</li>
            <li>Progressive hint system</li>
            <li>Solution reveal after multiple attempts</li>
            <li>Difficulty rating display</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
