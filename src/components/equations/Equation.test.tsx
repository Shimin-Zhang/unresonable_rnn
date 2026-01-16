import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Equation } from './Equation'
import { InlineEquation } from './InlineEquation'
import { SymbolTable } from './SymbolTable'
import type { SymbolDefinition } from './types'

// Mock KaTeX to avoid rendering issues in tests
vi.mock('katex', () => ({
  default: {
    render: vi.fn((latex: string, element: HTMLElement) => {
      element.innerHTML = `<span class="katex">${latex}</span>`
    }),
  },
}))

describe('Equation', () => {
  const sampleSymbols: SymbolDefinition[] = [
    { symbol: 'h_t', color: 'blue', meaning: 'Hidden state at time t' },
    { symbol: 'x_t', color: 'red', meaning: 'Input at time t' },
  ]

  it('renders the equation container', () => {
    render(<Equation latex="h_t = \tanh(W x_t)" />)
    expect(screen.getByLabelText(/Mathematical equation/)).toBeInTheDocument()
  })

  it('renders with a label', () => {
    render(<Equation latex="y = mx + b" label="Linear equation" />)
    expect(screen.getByText('Linear equation')).toBeInTheDocument()
  })

  it('renders symbol table when symbols provided', () => {
    render(<Equation latex="h_t = f(x_t)" symbols={sampleSymbols} />)
    expect(screen.getByText('Hidden state at time t')).toBeInTheDocument()
    expect(screen.getByText('Input at time t')).toBeInTheDocument()
  })

  it('hides symbol table when symbolTablePosition is hidden', () => {
    render(
      <Equation
        latex="h_t = f(x_t)"
        symbols={sampleSymbols}
        symbolTablePosition="hidden"
      />
    )
    expect(
      screen.queryByText('Hidden state at time t')
    ).not.toBeInTheDocument()
  })

  it('applies size classes correctly', () => {
    const { container, rerender } = render(
      <Equation latex="x" size="sm" />
    )
    expect(container.querySelector('.text-base')).toBeInTheDocument()

    rerender(<Equation latex="x" size="lg" />)
    expect(container.querySelector('.text-xl')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Equation latex="x" className="custom-class" />
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})

describe('InlineEquation', () => {
  it('renders inline equation', () => {
    render(<InlineEquation latex="x^2" />)
    expect(
      screen.getByLabelText(/Mathematical expression/)
    ).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <InlineEquation latex="x" className="my-inline" />
    )
    expect(container.querySelector('.my-inline')).toBeInTheDocument()
  })
})

describe('SymbolTable', () => {
  const symbols: SymbolDefinition[] = [
    { symbol: 'h_t', color: 'blue', meaning: 'Hidden state' },
    {
      symbol: 'W_{xh}',
      color: 'orange',
      meaning: 'Weight matrix',
      details: 'Input to hidden',
    },
  ]

  it('renders all symbols', () => {
    render(<SymbolTable symbols={symbols} />)
    expect(screen.getByText('Hidden state')).toBeInTheDocument()
    expect(screen.getByText('Weight matrix')).toBeInTheDocument()
  })

  it('renders symbol details when provided', () => {
    render(<SymbolTable symbols={symbols} />)
    expect(screen.getByText('Input to hidden')).toBeInTheDocument()
  })

  it('renders in compact mode', () => {
    render(<SymbolTable symbols={symbols} compact />)
    expect(screen.getByText('Symbol Legend')).toBeInTheDocument()
  })

  it('returns null for empty symbols array', () => {
    const { container } = render(<SymbolTable symbols={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('displays color indicators', () => {
    render(<SymbolTable symbols={symbols} />)
    expect(screen.getByText('blue')).toBeInTheDocument()
    expect(screen.getByText('orange')).toBeInTheDocument()
  })
})
