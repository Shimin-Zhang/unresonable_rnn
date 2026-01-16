import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OutputPanel } from './OutputPanel'
import type { ExecutionResult } from './types'

describe('OutputPanel', () => {
  it('shows placeholder text when no result', () => {
    render(<OutputPanel result={null} isLoading={false} />)
    expect(
      screen.getByText('Click "Run" to execute your code')
    ).toBeInTheDocument()
  })

  it('shows loading spinner when isLoading is true', () => {
    render(<OutputPanel result={null} isLoading={true} />)
    expect(screen.getByText('Running...')).toBeInTheDocument()
  })

  it('displays stdout output', () => {
    const result: ExecutionResult = {
      stdout: 'Hello, World!',
      stderr: '',
      executionTime: 100,
    }
    render(<OutputPanel result={result} isLoading={false} />)
    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
  })

  it('displays stderr output', () => {
    const result: ExecutionResult = {
      stdout: '',
      stderr: 'Warning: something happened',
      executionTime: 50,
    }
    render(<OutputPanel result={result} isLoading={false} />)
    expect(screen.getByText('Warning: something happened')).toBeInTheDocument()
  })

  it('displays error output', () => {
    const result: ExecutionResult = {
      stdout: '',
      stderr: '',
      error: 'SyntaxError: invalid syntax',
      executionTime: 10,
    }
    render(<OutputPanel result={result} isLoading={false} />)
    expect(screen.getByText('SyntaxError: invalid syntax')).toBeInTheDocument()
  })

  it('displays execution time', () => {
    const result: ExecutionResult = {
      stdout: 'output',
      stderr: '',
      executionTime: 150,
    }
    render(<OutputPanel result={result} isLoading={false} />)
    expect(screen.getByText('150ms')).toBeInTheDocument()
  })

  it('shows "No output" when result is empty', () => {
    const result: ExecutionResult = {
      stdout: '',
      stderr: '',
      executionTime: 10,
    }
    render(<OutputPanel result={result} isLoading={false} />)
    expect(screen.getByText('No output')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <OutputPanel result={null} isLoading={false} className="custom-class" />
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
