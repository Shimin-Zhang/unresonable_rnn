import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MultipleChoice } from './MultipleChoice'
import type { MultipleChoiceQuestion, MultipleChoiceAnswer } from './types'

const mockQuestion: MultipleChoiceQuestion = {
  id: 'q1',
  type: 'multiple_choice',
  question: 'What is 2 + 2?',
  options: ['3', '4', '5', '6'],
  correctAnswer: 1,
  explanation: 'Basic arithmetic',
}

const mockMultiSelectQuestion: MultipleChoiceQuestion = {
  id: 'q2',
  type: 'multiple_choice',
  question: 'Select all prime numbers:',
  options: ['2', '4', '5', '6'],
  correctAnswer: 0,
  allowMultiple: true,
  correctAnswers: [0, 2],
  explanation: 'Prime numbers are divisible only by 1 and themselves',
}

describe('MultipleChoice', () => {
  it('renders the question text', () => {
    render(
      <MultipleChoice
        question={mockQuestion}
        answer={null}
        showFeedback={false}
        onAnswer={() => {}}
      />
    )
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  })

  it('renders all options', () => {
    render(
      <MultipleChoice
        question={mockQuestion}
        answer={null}
        showFeedback={false}
        onAnswer={() => {}}
      />
    )
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('calls onAnswer when an option is clicked', () => {
    const onAnswer = vi.fn()
    render(
      <MultipleChoice
        question={mockQuestion}
        answer={null}
        showFeedback={false}
        onAnswer={onAnswer}
      />
    )

    fireEvent.click(screen.getByTestId('option-1'))

    expect(onAnswer).toHaveBeenCalledWith({
      type: 'multiple_choice',
      selectedOption: 1,
    })
  })

  it('shows selected state for the answered option', () => {
    const answer: MultipleChoiceAnswer = {
      type: 'multiple_choice',
      selectedOption: 1,
    }
    render(
      <MultipleChoice
        question={mockQuestion}
        answer={answer}
        showFeedback={false}
        onAnswer={() => {}}
      />
    )

    const selectedButton = screen.getByTestId('option-1')
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows correct feedback for correct answer', () => {
    const answer: MultipleChoiceAnswer = {
      type: 'multiple_choice',
      selectedOption: 1,
    }
    render(
      <MultipleChoice
        question={mockQuestion}
        answer={answer}
        showFeedback={true}
        onAnswer={() => {}}
      />
    )

    const correctOption = screen.getByTestId('option-1')
    expect(correctOption.className).toContain('bg-green')
  })

  it('shows incorrect feedback for wrong answer', () => {
    const answer: MultipleChoiceAnswer = {
      type: 'multiple_choice',
      selectedOption: 0,
    }
    render(
      <MultipleChoice
        question={mockQuestion}
        answer={answer}
        showFeedback={true}
        onAnswer={() => {}}
      />
    )

    const selectedOption = screen.getByTestId('option-0')
    expect(selectedOption.className).toContain('bg-red')
  })

  it('disables interaction when disabled prop is true', () => {
    const onAnswer = vi.fn()
    render(
      <MultipleChoice
        question={mockQuestion}
        answer={null}
        showFeedback={false}
        onAnswer={onAnswer}
        disabled={true}
      />
    )

    fireEvent.click(screen.getByTestId('option-1'))
    expect(onAnswer).not.toHaveBeenCalled()
  })

  it('shows multi-select hint for allowMultiple questions', () => {
    render(
      <MultipleChoice
        question={mockMultiSelectQuestion}
        answer={null}
        showFeedback={false}
        onAnswer={() => {}}
      />
    )

    expect(screen.getByText('Select all that apply')).toBeInTheDocument()
  })

  it('allows selecting multiple options for multi-select questions', () => {
    const onAnswer = vi.fn()
    const initialAnswer: MultipleChoiceAnswer = {
      type: 'multiple_choice',
      selectedOption: null,
      selectedOptions: [0],
    }

    render(
      <MultipleChoice
        question={mockMultiSelectQuestion}
        answer={initialAnswer}
        showFeedback={false}
        onAnswer={onAnswer}
      />
    )

    fireEvent.click(screen.getByTestId('option-2'))

    expect(onAnswer).toHaveBeenCalledWith({
      type: 'multiple_choice',
      selectedOption: null,
      selectedOptions: [0, 2],
    })
  })

  it('applies custom className', () => {
    const { container } = render(
      <MultipleChoice
        question={mockQuestion}
        answer={null}
        showFeedback={false}
        onAnswer={() => {}}
        className="custom-class"
      />
    )

    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
