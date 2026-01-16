import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ControlBar } from './ControlBar'

describe('ControlBar', () => {
  const defaultProps = {
    onRun: vi.fn(),
    onCheckAnswer: vi.fn(),
    onShowHint: vi.fn(),
    onShowSolution: vi.fn(),
    isRunning: false,
    hasHints: true,
    hintsRemaining: 3,
    canShowSolution: false,
  }

  it('renders Run and Check Answer buttons', () => {
    render(<ControlBar {...defaultProps} />)
    expect(screen.getByLabelText('Run code')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Check answer against test cases')
    ).toBeInTheDocument()
  })

  it('calls onRun when Run button is clicked', () => {
    render(<ControlBar {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Run code'))
    expect(defaultProps.onRun).toHaveBeenCalled()
  })

  it('calls onCheckAnswer when Check Answer button is clicked', () => {
    render(<ControlBar {...defaultProps} />)
    fireEvent.click(screen.getByLabelText('Check answer against test cases'))
    expect(defaultProps.onCheckAnswer).toHaveBeenCalled()
  })

  it('shows Hint button when hasHints is true and hintsRemaining > 0', () => {
    render(<ControlBar {...defaultProps} />)
    expect(screen.getByText('Hint (3)')).toBeInTheDocument()
  })

  it('hides Hint button when hintsRemaining is 0', () => {
    render(<ControlBar {...defaultProps} hintsRemaining={0} />)
    expect(screen.queryByText(/Hint/)).not.toBeInTheDocument()
  })

  it('hides Hint button when hasHints is false', () => {
    render(<ControlBar {...defaultProps} hasHints={false} />)
    expect(screen.queryByText(/Hint/)).not.toBeInTheDocument()
  })

  it('shows Solution button when canShowSolution is true', () => {
    render(<ControlBar {...defaultProps} canShowSolution={true} />)
    expect(screen.getByLabelText('Show solution')).toBeInTheDocument()
  })

  it('hides Solution button when canShowSolution is false', () => {
    render(<ControlBar {...defaultProps} canShowSolution={false} />)
    expect(screen.queryByLabelText('Show solution')).not.toBeInTheDocument()
  })

  it('disables buttons when isRunning is true', () => {
    render(<ControlBar {...defaultProps} isRunning={true} />)
    expect(screen.getByLabelText('Run code')).toBeDisabled()
    expect(
      screen.getByLabelText('Check answer against test cases')
    ).toBeDisabled()
  })

  it('calls onShowHint when Hint button is clicked', () => {
    render(<ControlBar {...defaultProps} />)
    fireEvent.click(screen.getByText('Hint (3)'))
    expect(defaultProps.onShowHint).toHaveBeenCalled()
  })

  it('calls onShowSolution when Solution button is clicked', () => {
    render(<ControlBar {...defaultProps} canShowSolution={true} />)
    fireEvent.click(screen.getByLabelText('Show solution'))
    expect(defaultProps.onShowSolution).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ControlBar {...defaultProps} className="custom-class" />
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
