/**
 * Types for the LaTeX equation rendering system
 */

/** Standard colors used for equation elements */
export type EquationColor =
  | 'blue'
  | 'green'
  | 'orange'
  | 'red'
  | 'purple'
  | 'cyan'
  | 'magenta'
  | 'gray'

/** Mapping of color names to CSS/Tailwind classes */
export const COLOR_MAP: Record<EquationColor, { text: string; bg: string }> = {
  blue: { text: 'text-blue-600', bg: 'bg-blue-100' },
  green: { text: 'text-green-600', bg: 'bg-green-100' },
  orange: { text: 'text-orange-600', bg: 'bg-orange-100' },
  red: { text: 'text-red-600', bg: 'bg-red-100' },
  purple: { text: 'text-purple-600', bg: 'bg-purple-100' },
  cyan: { text: 'text-cyan-600', bg: 'bg-cyan-100' },
  magenta: { text: 'text-pink-600', bg: 'bg-pink-100' },
  gray: { text: 'text-gray-600', bg: 'bg-gray-100' },
}

/** A single symbol definition for the symbol table */
export interface SymbolDefinition {
  /** The LaTeX representation of the symbol (e.g., "h_t", "W_{xh}") */
  symbol: string
  /** The color used for this symbol in the equation */
  color: EquationColor
  /** Plain English description of what this symbol means */
  meaning: string
  /** Optional additional details or context */
  details?: string
}

/** Props for the Equation component */
export interface EquationProps {
  /** The LaTeX equation string (can include \color{} commands) */
  latex: string
  /** Whether this is an inline equation (default: false for block display) */
  inline?: boolean
  /** Symbol definitions to display in the accompanying table */
  symbols?: SymbolDefinition[]
  /** Layout of the symbol table relative to equation */
  symbolTablePosition?: 'below' | 'right' | 'hidden'
  /** Optional CSS class name */
  className?: string
  /** Optional label/caption for the equation */
  label?: string
  /** Size variant for responsive display */
  size?: 'sm' | 'md' | 'lg'
}

/** Props for standalone SymbolTable component */
export interface SymbolTableProps {
  /** Array of symbol definitions to display */
  symbols: SymbolDefinition[]
  /** Whether to display in compact mode */
  compact?: boolean
  /** Optional CSS class name */
  className?: string
}

/** Props for InlineEquation component */
export interface InlineEquationProps {
  /** The LaTeX equation string */
  latex: string
  /** Optional CSS class name */
  className?: string
}
