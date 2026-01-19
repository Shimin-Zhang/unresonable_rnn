'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { cn } from '@/lib/utils'

interface LSTMCellDiagramProps {
  className?: string
  interactive?: boolean
  showDataFlow?: boolean
  highlightGate?: 'forget' | 'input' | 'output' | 'cell' | null
}

interface GateInfo {
  id: string
  name: string
  symbol: string
  color: string
  bgColor: string
  description: string
  equation: string
}

const GATES: GateInfo[] = [
  {
    id: 'forget',
    name: 'Forget Gate',
    symbol: 'f_t',
    color: 'text-red-600',
    bgColor: 'bg-red-100 border-red-300',
    description: 'Decides what information to discard from the cell state',
    equation: 'f_t = σ(W_f · [h_{t-1}, x_t] + b_f)',
  },
  {
    id: 'input',
    name: 'Input Gate',
    symbol: 'i_t',
    color: 'text-green-600',
    bgColor: 'bg-green-100 border-green-300',
    description: 'Decides what new information to store in the cell state',
    equation: 'i_t = σ(W_i · [h_{t-1}, x_t] + b_i)',
  },
  {
    id: 'output',
    name: 'Output Gate',
    symbol: 'o_t',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 border-blue-300',
    description: 'Decides what parts of the cell state to output',
    equation: 'o_t = σ(W_o · [h_{t-1}, x_t] + b_o)',
  },
  {
    id: 'cell',
    name: 'Cell State',
    symbol: 'C_t',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 border-purple-300',
    description: 'The memory that flows through time with minimal transformation',
    equation: 'C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t',
  },
]

/**
 * Interactive LSTM cell diagram showing the gate structure and data flow.
 */
export function LSTMCellDiagram({
  className,
  interactive = true,
  showDataFlow = false,
  highlightGate: externalHighlight = null,
}: LSTMCellDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [highlightGate, setHighlightGate] = useState<string | null>(externalHighlight)
  const [animating, setAnimating] = useState(showDataFlow)

  // Use external highlight if provided
  useEffect(() => {
    if (externalHighlight !== undefined) {
      setHighlightGate(externalHighlight)
    }
  }, [externalHighlight])

  const activeGate = useMemo(
    () => GATES.find((g) => g.id === highlightGate),
    [highlightGate]
  )

  // Draw the LSTM cell diagram
  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 600
    const height = 400
    const margin = { top: 30, right: 30, bottom: 30, left: 30 }

    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const g = svg.append('g')

    // Define arrow marker
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'lstm-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#64748b')

    // Colors
    const colors = {
      forget: '#ef4444',
      input: '#22c55e',
      output: '#3b82f6',
      cell: '#a855f7',
      candidate: '#f59e0b',
      line: '#64748b',
      hidden: '#1e293b',
    }

    // Helper to check if a gate should be highlighted
    const isHighlighted = (gateId: string) => !highlightGate || highlightGate === gateId
    const getOpacity = (gateId: string) => (isHighlighted(gateId) ? 1 : 0.3)

    // Cell state line (top horizontal)
    g.append('line')
      .attr('x1', 50)
      .attr('y1', 80)
      .attr('x2', 550)
      .attr('y2', 80)
      .attr('stroke', colors.cell)
      .attr('stroke-width', 4)
      .attr('opacity', getOpacity('cell'))
      .attr('marker-end', 'url(#lstm-arrow)')

    // Labels for cell state
    g.append('text')
      .attr('x', 30)
      .attr('y', 85)
      .attr('text-anchor', 'end')
      .attr('font-size', '14px')
      .attr('fill', colors.cell)
      .attr('opacity', getOpacity('cell'))
      .text('C_{t-1}')

    g.append('text')
      .attr('x', 560)
      .attr('y', 85)
      .attr('text-anchor', 'start')
      .attr('font-size', '14px')
      .attr('fill', colors.cell)
      .attr('opacity', getOpacity('cell'))
      .text('C_t')

    // Forget gate (×)
    const forgetX = 150
    g.append('circle')
      .attr('cx', forgetX)
      .attr('cy', 80)
      .attr('r', 20)
      .attr('fill', 'white')
      .attr('stroke', colors.forget)
      .attr('stroke-width', 3)
      .attr('opacity', getOpacity('forget'))
      .style('cursor', interactive ? 'pointer' : 'default')
      .on('mouseenter', () => interactive && setHighlightGate('forget'))
      .on('mouseleave', () => interactive && setHighlightGate(null))

    g.append('text')
      .attr('x', forgetX)
      .attr('y', 86)
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .attr('fill', colors.forget)
      .attr('opacity', getOpacity('forget'))
      .text('×')

    // Forget gate input line
    g.append('line')
      .attr('x1', forgetX)
      .attr('y1', 180)
      .attr('x2', forgetX)
      .attr('y2', 100)
      .attr('stroke', colors.forget)
      .attr('stroke-width', 2)
      .attr('opacity', getOpacity('forget'))
      .attr('marker-end', 'url(#lstm-arrow)')

    // Forget gate sigmoid box
    g.append('rect')
      .attr('x', forgetX - 20)
      .attr('y', 180)
      .attr('width', 40)
      .attr('height', 30)
      .attr('rx', 4)
      .attr('fill', colors.forget)
      .attr('opacity', getOpacity('forget'))
      .style('cursor', interactive ? 'pointer' : 'default')
      .on('mouseenter', () => interactive && setHighlightGate('forget'))
      .on('mouseleave', () => interactive && setHighlightGate(null))

    g.append('text')
      .attr('x', forgetX)
      .attr('y', 200)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', 'white')
      .attr('opacity', getOpacity('forget'))
      .text('σ')

    g.append('text')
      .attr('x', forgetX)
      .attr('y', 230)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', colors.forget)
      .attr('opacity', getOpacity('forget'))
      .text('f_t')

    // Input gate + candidate value (+ in the middle)
    const inputX = 280

    // Plus symbol for addition
    g.append('circle')
      .attr('cx', inputX)
      .attr('cy', 80)
      .attr('r', 20)
      .attr('fill', 'white')
      .attr('stroke', colors.input)
      .attr('stroke-width', 3)
      .attr('opacity', getOpacity('input'))
      .style('cursor', interactive ? 'pointer' : 'default')
      .on('mouseenter', () => interactive && setHighlightGate('input'))
      .on('mouseleave', () => interactive && setHighlightGate(null))

    g.append('text')
      .attr('x', inputX)
      .attr('y', 86)
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .attr('fill', colors.input)
      .attr('opacity', getOpacity('input'))
      .text('+')

    // Input gate multiplication (×)
    const inputMulX = inputX
    const inputMulY = 140
    g.append('circle')
      .attr('cx', inputMulX)
      .attr('cy', inputMulY)
      .attr('r', 15)
      .attr('fill', 'white')
      .attr('stroke', colors.input)
      .attr('stroke-width', 2)
      .attr('opacity', getOpacity('input'))

    g.append('text')
      .attr('x', inputMulX)
      .attr('y', inputMulY + 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('fill', colors.input)
      .attr('opacity', getOpacity('input'))
      .text('×')

    // Line from multiplication to plus
    g.append('line')
      .attr('x1', inputMulX)
      .attr('y1', inputMulY - 15)
      .attr('x2', inputMulX)
      .attr('y2', 100)
      .attr('stroke', colors.input)
      .attr('stroke-width', 2)
      .attr('opacity', getOpacity('input'))
      .attr('marker-end', 'url(#lstm-arrow)')

    // Input gate sigmoid
    g.append('rect')
      .attr('x', inputMulX - 50)
      .attr('y', 180)
      .attr('width', 40)
      .attr('height', 30)
      .attr('rx', 4)
      .attr('fill', colors.input)
      .attr('opacity', getOpacity('input'))
      .style('cursor', interactive ? 'pointer' : 'default')
      .on('mouseenter', () => interactive && setHighlightGate('input'))
      .on('mouseleave', () => interactive && setHighlightGate(null))

    g.append('text')
      .attr('x', inputMulX - 30)
      .attr('y', 200)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', 'white')
      .attr('opacity', getOpacity('input'))
      .text('σ')

    g.append('text')
      .attr('x', inputMulX - 30)
      .attr('y', 230)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', colors.input)
      .attr('opacity', getOpacity('input'))
      .text('i_t')

    // Candidate value tanh
    g.append('rect')
      .attr('x', inputMulX + 10)
      .attr('y', 180)
      .attr('width', 40)
      .attr('height', 30)
      .attr('rx', 4)
      .attr('fill', colors.candidate)
      .attr('opacity', getOpacity('input'))

    g.append('text')
      .attr('x', inputMulX + 30)
      .attr('y', 200)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', 'white')
      .attr('opacity', getOpacity('input'))
      .text('tanh')

    g.append('text')
      .attr('x', inputMulX + 30)
      .attr('y', 230)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', colors.candidate)
      .attr('opacity', getOpacity('input'))
      .text('C̃_t')

    // Lines to input multiplication
    g.append('line')
      .attr('x1', inputMulX - 30)
      .attr('y1', 180)
      .attr('x2', inputMulX - 15)
      .attr('y2', inputMulY)
      .attr('stroke', colors.input)
      .attr('stroke-width', 2)
      .attr('opacity', getOpacity('input'))

    g.append('line')
      .attr('x1', inputMulX + 30)
      .attr('y1', 180)
      .attr('x2', inputMulX + 15)
      .attr('y2', inputMulY)
      .attr('stroke', colors.candidate)
      .attr('stroke-width', 2)
      .attr('opacity', getOpacity('input'))

    // Output gate
    const outputX = 420

    // tanh after cell state
    const tanhX = outputX
    const tanhY = 140
    g.append('rect')
      .attr('x', tanhX - 25)
      .attr('y', tanhY - 15)
      .attr('width', 50)
      .attr('height', 30)
      .attr('rx', 4)
      .attr('fill', colors.cell)
      .attr('opacity', getOpacity('output'))

    g.append('text')
      .attr('x', tanhX)
      .attr('y', tanhY + 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', 'white')
      .attr('opacity', getOpacity('output'))
      .text('tanh')

    // Line from cell state to tanh
    g.append('line')
      .attr('x1', tanhX)
      .attr('y1', 80)
      .attr('x2', tanhX)
      .attr('y2', tanhY - 15)
      .attr('stroke', colors.cell)
      .attr('stroke-width', 2)
      .attr('opacity', getOpacity('output'))

    // Output multiplication
    const outputMulX = outputX + 60
    const outputMulY = tanhY
    g.append('circle')
      .attr('cx', outputMulX)
      .attr('cy', outputMulY)
      .attr('r', 15)
      .attr('fill', 'white')
      .attr('stroke', colors.output)
      .attr('stroke-width', 2)
      .attr('opacity', getOpacity('output'))
      .style('cursor', interactive ? 'pointer' : 'default')
      .on('mouseenter', () => interactive && setHighlightGate('output'))
      .on('mouseleave', () => interactive && setHighlightGate(null))

    g.append('text')
      .attr('x', outputMulX)
      .attr('y', outputMulY + 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('fill', colors.output)
      .attr('opacity', getOpacity('output'))
      .text('×')

    // Line from tanh to output mult
    g.append('line')
      .attr('x1', tanhX + 25)
      .attr('y1', tanhY)
      .attr('x2', outputMulX - 15)
      .attr('y2', outputMulY)
      .attr('stroke', colors.cell)
      .attr('stroke-width', 2)
      .attr('opacity', getOpacity('output'))

    // Output gate sigmoid
    g.append('rect')
      .attr('x', outputMulX - 20)
      .attr('y', 180)
      .attr('width', 40)
      .attr('height', 30)
      .attr('rx', 4)
      .attr('fill', colors.output)
      .attr('opacity', getOpacity('output'))
      .style('cursor', interactive ? 'pointer' : 'default')
      .on('mouseenter', () => interactive && setHighlightGate('output'))
      .on('mouseleave', () => interactive && setHighlightGate(null))

    g.append('text')
      .attr('x', outputMulX)
      .attr('y', 200)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', 'white')
      .attr('opacity', getOpacity('output'))
      .text('σ')

    g.append('text')
      .attr('x', outputMulX)
      .attr('y', 230)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', colors.output)
      .attr('opacity', getOpacity('output'))
      .text('o_t')

    // Line from output sigmoid to mult
    g.append('line')
      .attr('x1', outputMulX)
      .attr('y1', 180)
      .attr('x2', outputMulX)
      .attr('y2', outputMulY + 15)
      .attr('stroke', colors.output)
      .attr('stroke-width', 2)
      .attr('opacity', getOpacity('output'))

    // Output h_t
    g.append('line')
      .attr('x1', outputMulX + 15)
      .attr('y1', outputMulY)
      .attr('x2', 560)
      .attr('y2', outputMulY)
      .attr('stroke', colors.hidden)
      .attr('stroke-width', 3)
      .attr('opacity', getOpacity('output'))
      .attr('marker-end', 'url(#lstm-arrow)')

    g.append('text')
      .attr('x', 570)
      .attr('y', outputMulY + 5)
      .attr('text-anchor', 'start')
      .attr('font-size', '14px')
      .attr('fill', colors.hidden)
      .attr('opacity', getOpacity('output'))
      .text('h_t')

    // Input concatenation area
    g.append('rect')
      .attr('x', 100)
      .attr('y', 280)
      .attr('width', 400)
      .attr('height', 60)
      .attr('rx', 8)
      .attr('fill', '#f8fafc')
      .attr('stroke', colors.line)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,5')

    g.append('text')
      .attr('x', 300)
      .attr('y', 305)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', colors.line)
      .text('Concatenated inputs: [h_{t-1}, x_t]')

    // Input lines from concatenation to gates
    const gateXPositions = [forgetX, inputMulX - 30, inputMulX + 30, outputMulX]
    gateXPositions.forEach((x) => {
      g.append('line')
        .attr('x1', x)
        .attr('y1', 280)
        .attr('x2', x)
        .attr('y2', 210)
        .attr('stroke', colors.line)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
    })

    // h_{t-1} and x_t inputs
    g.append('text')
      .attr('x', 30)
      .attr('y', 310)
      .attr('text-anchor', 'end')
      .attr('font-size', '14px')
      .attr('fill', colors.hidden)
      .text('h_{t-1}')

    g.append('line')
      .attr('x1', 40)
      .attr('y1', 305)
      .attr('x2', 100)
      .attr('y2', 305)
      .attr('stroke', colors.hidden)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#lstm-arrow)')

    g.append('text')
      .attr('x', 300)
      .attr('y', 370)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', colors.line)
      .text('x_t')

    g.append('line')
      .attr('x1', 300)
      .attr('y1', 355)
      .attr('x2', 300)
      .attr('y2', 340)
      .attr('stroke', colors.line)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#lstm-arrow)')

  }, [highlightGate, interactive])

  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-6', className)}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">LSTM Cell Architecture</h3>
        <p className="mt-1 text-sm text-slate-600">
          {interactive
            ? 'Hover over gates to learn what each component does.'
            : 'The LSTM cell uses gates to control information flow.'}
        </p>
      </div>

      {/* Gate buttons */}
      {interactive && (
        <div className="mb-4 flex flex-wrap gap-2">
          {GATES.map((gate) => (
            <button
              key={gate.id}
              onClick={() => setHighlightGate(highlightGate === gate.id ? null : gate.id)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                highlightGate === gate.id
                  ? gate.bgColor
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              )}
            >
              <span className={gate.color}>{gate.symbol}</span> {gate.name}
            </button>
          ))}
        </div>
      )}

      {/* SVG Diagram */}
      <div className="mb-4 overflow-x-auto">
        <svg
          ref={svgRef}
          className="mx-auto"
          style={{ minWidth: '500px', maxWidth: '100%' }}
          preserveAspectRatio="xMidYMid meet"
        />
      </div>

      {/* Gate explanation */}
      {activeGate && (
        <div className={cn('rounded-lg border p-4', activeGate.bgColor)}>
          <h4 className={cn('font-semibold', activeGate.color)}>{activeGate.name}</h4>
          <p className="mt-1 text-sm text-slate-700">{activeGate.description}</p>
          <p className="mt-2 font-mono text-sm text-slate-600">{activeGate.equation}</p>
        </div>
      )}

      {/* Default explanation when no gate selected */}
      {!activeGate && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-semibold text-slate-900">The LSTM Solution</h4>
          <p className="mt-1 text-sm text-slate-700">
            Unlike vanilla RNNs where gradients multiply through transformations, the LSTM
            cell state C_t flows through with only element-wise operations (× and +). This
            creates a &quot;gradient highway&quot; where gradients can flow unchanged through many
            time steps, solving the vanishing gradient problem.
          </p>
        </div>
      )}
    </div>
  )
}

export default LSTMCellDiagram
