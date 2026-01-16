'use client'

import { useEffect, useRef, type FC } from 'react'
import katex from 'katex'
import { cn } from '@/lib/utils'
import type { InlineEquationProps } from './types'

/**
 * InlineEquation component for rendering LaTeX inline with text.
 * This is a lightweight component for simple inline math expressions.
 *
 * @example
 * ```tsx
 * <p>
 *   The hidden state <InlineEquation latex="h_t" /> is computed at each step.
 * </p>
 * ```
 */
export const InlineEquation: FC<InlineEquationProps> = ({
  latex,
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    try {
      katex.render(latex, ref.current, {
        displayMode: false,
        throwOnError: false,
        trust: true,
        strict: false,
        output: 'html',
      })
    } catch (error) {
      console.error('KaTeX rendering error:', error)
      if (ref.current) {
        ref.current.textContent = latex
      }
    }
  }, [latex])

  return (
    <span
      ref={ref}
      className={cn('inline-math', className)}
      aria-label={`Mathematical expression: ${latex}`}
    />
  )
}
