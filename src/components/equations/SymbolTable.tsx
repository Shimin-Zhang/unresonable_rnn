'use client'

import { useEffect, useRef, type FC } from 'react'
import katex from 'katex'
import { cn } from '@/lib/utils'
import { COLOR_MAP, type SymbolTableProps, type SymbolDefinition } from './types'

/**
 * Renders a single symbol with its LaTeX representation
 */
const SymbolCell: FC<{ symbol: string; className?: string }> = ({
  symbol,
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    try {
      katex.render(symbol, ref.current, {
        displayMode: false,
        throwOnError: false,
        trust: true,
        strict: false,
      })
    } catch {
      if (ref.current) {
        ref.current.textContent = symbol
      }
    }
  }, [symbol])

  return <span ref={ref} className={className} />
}

/**
 * Color indicator dot for the symbol table
 */
const ColorDot: FC<{ color: SymbolDefinition['color'] }> = ({ color }) => {
  const colorClasses = COLOR_MAP[color]
  return (
    <span
      className={cn(
        'inline-block h-3 w-3 rounded-full',
        colorClasses.bg,
        'border-2',
        colorClasses.text.replace('text-', 'border-')
      )}
      aria-hidden="true"
    />
  )
}

/**
 * SymbolTable component displays a legend of symbols used in an equation.
 * Each symbol is shown with its color, LaTeX representation, and meaning.
 *
 * @example
 * ```tsx
 * <SymbolTable
 *   symbols={[
 *     { symbol: 'h_t', color: 'blue', meaning: 'Hidden state at time t' },
 *     { symbol: 'W_{xh}', color: 'orange', meaning: 'Input-to-hidden weights' },
 *   ]}
 * />
 * ```
 */
export const SymbolTable: FC<SymbolTableProps> = ({
  symbols,
  compact = false,
  className,
}) => {
  if (symbols.length === 0) return null

  if (compact) {
    return (
      <div
        className={cn(
          'rounded-lg border border-slate-200 bg-slate-50 p-3',
          className
        )}
      >
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Symbol Legend
        </div>
        <div className="space-y-2">
          {symbols.map((sym, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <ColorDot color={sym.color} />
              <SymbolCell
                symbol={sym.symbol}
                className={cn('font-medium', COLOR_MAP[sym.color].text)}
              />
              <span className="text-slate-600">{sym.meaning}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-3 py-2 text-left font-semibold text-slate-700">
              Symbol
            </th>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">
              Color
            </th>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">
              Meaning
            </th>
          </tr>
        </thead>
        <tbody>
          {symbols.map((sym, idx) => (
            <tr
              key={idx}
              className={cn(
                'border-b border-slate-100',
                idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
              )}
            >
              <td className="px-3 py-2">
                <SymbolCell
                  symbol={sym.symbol}
                  className={cn('text-base', COLOR_MAP[sym.color].text)}
                />
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <ColorDot color={sym.color} />
                  <span className="capitalize text-slate-600">{sym.color}</span>
                </div>
              </td>
              <td className="px-3 py-2 text-slate-700">
                {sym.meaning}
                {sym.details && (
                  <span className="block text-xs text-slate-500">
                    {sym.details}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
