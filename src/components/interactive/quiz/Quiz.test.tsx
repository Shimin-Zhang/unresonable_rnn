import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Quiz } from './Quiz'
import type { QuizConfig } from './types'

vi.mock('@/stores/quizStore', () => ({
  useQuizStore: () => ({
    startQuiz: vi.fn(() => 'attempt-1'),
    submitAnswer: vi.fn(),
    completeQuiz: vi.fn(() => ({
      attemptId: 'attempt-1',
      quizId: 'test-quiz',
      startedAt: '2024-01-01T00:00:00Z',
      completedAt: '2024-01-01T00:01:00Z',
      results: [],
      score: 2,
      maxScore: 2,
      percentage: 100,
    })),
    getQuizProgress: vi.fn(() => null),
    scheduleReview: vi.fn(),
    getDueReviews: vi.fn(() => []),
  }),
}))

const mockConfig: QuizConfig = {
  id: 'test-quiz',
  title: 'Test Quiz',
  description: 'A test quiz description',
  questions: [
    {
      id: 'q1',
      type: 'multiple_choice',
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      explanation: 'Basic math',
    },
    {
      id: 'q2',
      type: 'multiple_choice',
      question: 'What is 3 + 3?',
      options: ['5', '6', '7', '8'],
      correctAnswer: 1,
      explanation: 'More basic math',
    },
  ],
  showFeedback: 'immediate',
}

describe('Quiz', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders quiz title and description in intro phase', () => {
    render(<Quiz config={mockConfig} />)

    expect(screen.getByText('Test Quiz')).toBeInTheDocument()
    expect(screen.getByText('A test quiz description')).toBeInTheDocument()
  })

  it('shows question count in intro phase', () => {
    render(<Quiz config={mockConfig} />)

    expect(screen.getByText('2 questions')).toBeInTheDocument()
  })

  it('has a start button', () => {
    render(<Quiz config={mockConfig} />)

    expect(screen.getByRole('button', { name: /start quiz/i })).toBeInTheDocument()
  })

  it('shows first question after starting', () => {
    render(<Quiz config={mockConfig} />)

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  })

  it('shows progress bar after starting', () => {
    render(<Quiz config={mockConfig} />)

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
  })

  it('shows check answer button', () => {
    render(<Quiz config={mockConfig} />)

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    expect(screen.getByRole('button', { name: /check answer/i })).toBeInTheDocument()
  })

  it('disables check answer button when no answer selected', () => {
    render(<Quiz config={mockConfig} />)

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    expect(screen.getByRole('button', { name: /check answer/i })).toBeDisabled()
  })

  it('enables check answer button after selecting an option', () => {
    render(<Quiz config={mockConfig} />)

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    fireEvent.click(screen.getByTestId('option-1'))

    expect(screen.getByRole('button', { name: /check answer/i })).not.toBeDisabled()
  })

  it('shows feedback panel after checking answer', () => {
    render(<Quiz config={mockConfig} />)

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    fireEvent.click(screen.getByTestId('option-1'))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(screen.getByTestId('feedback-panel')).toBeInTheDocument()
  })

  it('shows correct feedback for correct answer', () => {
    render(<Quiz config={mockConfig} />)

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    fireEvent.click(screen.getByTestId('option-1'))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(screen.getByText('Correct!')).toBeInTheDocument()
  })

  it('shows incorrect feedback for wrong answer', () => {
    render(<Quiz config={mockConfig} />)

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    fireEvent.click(screen.getByTestId('option-0'))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(screen.getByText('Not quite right')).toBeInTheDocument()
  })

  it('allows navigating to next question', () => {
    render(<Quiz config={mockConfig} />)

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    fireEvent.click(screen.getByTestId('option-1'))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))
    // Click the Continue button in the feedback panel
    const continueButtons = screen.getAllByRole('button', { name: /continue/i })
    fireEvent.click(continueButtons[0])

    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
  })

  it('shows finish quiz button on last question', () => {
    render(<Quiz config={mockConfig} />)

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))
    fireEvent.click(screen.getByTestId('option-1'))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))
    // Click the Continue button in the feedback panel
    const continueButtons = screen.getAllByRole('button', { name: /continue/i })
    fireEvent.click(continueButtons[0])

    expect(screen.getByRole('button', { name: /finish quiz/i })).toBeInTheDocument()
  })

  it('calls onComplete callback when quiz is finished', () => {
    const onComplete = vi.fn()
    render(<Quiz config={mockConfig} onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    fireEvent.click(screen.getByTestId('option-1'))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))
    // Click the Continue button in the feedback panel
    let continueButtons = screen.getAllByRole('button', { name: /continue/i })
    fireEvent.click(continueButtons[0])

    fireEvent.click(screen.getByTestId('option-1'))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))
    fireEvent.click(screen.getByRole('button', { name: /finish quiz/i }))

    expect(onComplete).toHaveBeenCalled()
  })

  it('shows results after finishing quiz', () => {
    render(<Quiz config={mockConfig} />)

    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }))

    fireEvent.click(screen.getByTestId('option-1'))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))
    // Click the Continue button in the feedback panel
    let continueButtons = screen.getAllByRole('button', { name: /continue/i })
    fireEvent.click(continueButtons[0])

    fireEvent.click(screen.getByTestId('option-1'))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))
    fireEvent.click(screen.getByRole('button', { name: /finish quiz/i }))

    expect(screen.getByText('Quiz Complete!')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Quiz config={mockConfig} className="custom-class" />
    )

    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
