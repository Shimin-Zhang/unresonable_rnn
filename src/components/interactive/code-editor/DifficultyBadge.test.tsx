import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DifficultyBadge } from './DifficultyBadge'

describe('DifficultyBadge', () => {
  it('renders 5 stars total', () => {
    const { container } = render(<DifficultyBadge level={3} />)
    const stars = container.querySelectorAll('span[class*="text-"]')
    expect(stars).toHaveLength(5)
  })

  it('renders correct number of filled stars for level 1', () => {
    render(<DifficultyBadge level={1} />)
    expect(screen.getByLabelText('Difficulty: Beginner')).toBeInTheDocument()
  })

  it('renders correct number of filled stars for level 5', () => {
    render(<DifficultyBadge level={5} />)
    expect(screen.getByLabelText('Difficulty: Expert')).toBeInTheDocument()
  })

  it('shows label when showLabel is true', () => {
    render(<DifficultyBadge level={3} showLabel />)
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('hides label when showLabel is false', () => {
    render(<DifficultyBadge level={3} showLabel={false} />)
    expect(screen.queryByText('Medium')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <DifficultyBadge level={2} className="custom-class" />
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('renders different colors for different levels', () => {
    const { container: c1 } = render(<DifficultyBadge level={1} showLabel />)
    const { container: c2 } = render(<DifficultyBadge level={5} showLabel />)

    expect(c1.querySelector('.text-green-500')).toBeInTheDocument()
    expect(c2.querySelector('.text-red-500')).toBeInTheDocument()
  })
})
