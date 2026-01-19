/**
 * Shared types for visualization components
 */

// Network diagram types
export interface NetworkNode {
  id: string
  label?: string
  type: 'input' | 'hidden' | 'output' | 'lstm' | 'gate'
  layer: number
  position?: { x: number; y: number }
  activation?: number // 0-1 for coloring
}

export interface NetworkConnection {
  source: string
  target: string
  weight?: number
  animated?: boolean
}

export interface NetworkData {
  nodes: NetworkNode[]
  connections: NetworkConnection[]
}

// Heatmap types
export interface HeatmapCell {
  row: number
  col: number
  value: number
  label?: string
}

export interface HeatmapData {
  cells: HeatmapCell[]
  rowLabels?: string[]
  colLabels?: string[]
  minValue?: number
  maxValue?: number
}

// Data flow animation types
export interface DataFlowStep {
  id: string
  data: number[]
  label?: string
  highlight?: number[] // indices to highlight
}

export interface DataFlowSequence {
  steps: DataFlowStep[]
  loopDuration?: number // ms per step
}

// Timeline chart types
export interface TimelinePoint {
  time: number
  value: number
  label?: string
}

export interface TimelineSeries {
  id: string
  name: string
  color?: string
  data: TimelinePoint[]
}

export interface TimelineData {
  series: TimelineSeries[]
  xLabel?: string
  yLabel?: string
}

// Slider control types
export interface SliderMark {
  value: number
  label?: string
}

export interface SliderConfig {
  min: number
  max: number
  step?: number
  marks?: SliderMark[]
  defaultValue?: number
}

// Color scale types
export type ColorScheme =
  | 'viridis'
  | 'plasma'
  | 'inferno'
  | 'magma'
  | 'warm'
  | 'cool'
  | 'blues'
  | 'greens'
  | 'reds'
  | 'purples'
  | 'oranges'
  | 'diverging'

// Common component props
export interface VisualizationBaseProps {
  width?: number
  height?: number
  className?: string
  colorScheme?: ColorScheme
  animated?: boolean
  onReady?: () => void
}

// Interaction callbacks
export interface InteractionCallbacks<T = unknown> {
  onHover?: (item: T | null) => void
  onClick?: (item: T) => void
  onSelect?: (items: T[]) => void
}
