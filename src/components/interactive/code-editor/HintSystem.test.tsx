import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HintSystem } from './HintSystem'
import type { Hint } from './types'

describe('HintSystem', () => {
  const sampleHints: Hint[] = [
    { id: 'hint-1', order: 1, content: 'First hint content' },
    { id: 'hint-2', order: 2, content: 'Second hint content' },
    { id: 'hint-3', order: 3, content: 'Third hint content' },
  ]

  it('returns null when hints array is empty', () => {
    const { container } = render(
      <HintSystem hints={[]} revealedCount={0} onRevealHint={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('shows hint count', () => {
    render(
      <HintSystem hints={sampleHints} revealedCount={1} onRevealHint={vi.fn()} />
    )
    expect(screen.getByText('Hints (1/3)')).toBeInTheDocument()
  })

  it('shows placeholder when no hints revealed', () => {
    render(
      <HintSystem hints={sampleHints} revealedCount={0} onRevealHint={vi.fn()} />
    )
    expect(
      screen.getByText('No hints revealed yet. Click the Hint button to get help.')
    ).toBeInTheDocument()
  })

  it('renders revealed hints', () => {
    render(
      <HintSystem hints={sampleHints} revealedCount={2} onRevealHint={vi.fn()} />
    )
    expect(screen.getByText('Hint 1')).toBeInTheDocument()
    expect(screen.getByText('Hint 2')).toBeInTheDocument()
  })

  it('expands hint content when clicked', () => {
    render(
      <HintSystem hints={sampleHints} revealedCount={1} onRevealHint={vi.fn()} />
    )

    expect(screen.queryByText('First hint content')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Hint 1'))

    expect(screen.getByText('First hint content')).toBeInTheDocument()
  })

  it('collapses expanded hint when clicked again', () => {
    render(
      <HintSystem hints={sampleHints} revealedCount={1} onRevealHint={vi.fn()} />
    )

    fireEvent.click(screen.getByText('Hint 1'))
    expect(screen.getByText('First hint content')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Hint 1'))
    expect(screen.queryByText('First hint content')).not.toBeInTheDocument()
  })

  it('shows reveal next hint button when hints remain', () => {
    render(
      <HintSystem hints={sampleHints} revealedCount={1} onRevealHint={vi.fn()} />
    )
    expect(screen.getByText('Reveal Next Hint')).toBeInTheDocument()
  })

  it('hides reveal button when all hints revealed', () => {
    render(
      <HintSystem hints={sampleHints} revealedCount={3} onRevealHint={vi.fn()} />
    )
    expect(screen.queryByText('Reveal Next Hint')).not.toBeInTheDocument()
  })

  it('calls onRevealHint when reveal button clicked', () => {
    const onRevealHint = vi.fn()
    render(
      <HintSystem hints={sampleHints} revealedCount={1} onRevealHint={onRevealHint} />
    )

    fireEvent.click(screen.getByText('Reveal Next Hint'))
    expect(onRevealHint).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <HintSystem
        hints={sampleHints}
        revealedCount={0}
        onRevealHint={vi.fn()}
        className="custom-class"
      />
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
