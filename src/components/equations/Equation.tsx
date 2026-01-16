'use client'

import { useEffect, useRef, type FC } from 'react'
import katex from 'katex'
import { cn } from '@/lib/utils'
import { SymbolTable } from './SymbolTable'
import type { EquationProps } from './types'

/** Size configurations for responsive equation display */
const SIZE_CLASSES = {
  sm: 'text-base md:text-lg',
  md: 'text-lg md:text-xl',
  lg: 'text-xl md:text-2xl',
}

/**
 * Equation component for rendering LaTeX equations with KaTeX.
 * Supports color-coded elements and accompanying symbol tables.
 *
 * @example
 * ```tsx
 * <Equation
 *   latex="h_t = \tanh(W_{hh} \cdot h_{t-1} + W_{xh} \cdot x_t)"
 *   symbols={[
 *     { symbol: 'h_t', color: 'blue', meaning: 'Hidden state at time t' },
 *     { symbol: 'x_t', color: 'red', meaning: 'Input at time t' },
 *   ]}
 * />
 * ```
 */
export const Equation: FC<EquationProps> = ({
  latex,
  inline = false,
  symbols = [],
  symbolTablePosition = 'below',
  className,
  label,
  size = 'md',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      katex.render(latex, containerRef.current, {
        displayMode: !inline,
        throwOnError: false,
        trust: true, // Allow \color and other trusted commands
        strict: false,
        output: 'html',
      })
    } catch (error) {
      console.error('KaTeX rendering error:', error)
      if (containerRef.current) {
        containerRef.current.textContent = `Error rendering: ${latex}`
      }
    }
  }, [latex, inline])

  const showSymbolTable =
    symbols.length > 0 && symbolTablePosition !== 'hidden'
  const isRightLayout = symbolTablePosition === 'right'

  return (
    <div
      className={cn(
        'equation-container',
        isRightLayout ? 'flex flex-col gap-4 lg:flex-row lg:items-start' : '',
        className
      )}
    >
      <div
        className={cn(
          'equation-display',
          isRightLayout ? 'lg:flex-1' : '',
          !inline && 'my-4'
        )}
      >
        {label && (
          <div className="mb-2 text-sm font-medium text-slate-600">{label}</div>
        )}
        <div
          ref={containerRef}
          className={cn(
            'katex-container',
            SIZE_CLASSES[size],
            !inline && 'overflow-x-auto py-4 text-center',
            inline && 'inline'
          )}
          aria-label={`Mathematical equation: ${latex}`}
        />
      </div>

      {showSymbolTable && (
        <div
          className={cn(
            'symbol-table-container',
            isRightLayout ? 'lg:w-80 lg:flex-shrink-0' : 'mt-4'
          )}
        >
          <SymbolTable symbols={symbols} compact={isRightLayout} />
        </div>
      )}
    </div>
  )
}
