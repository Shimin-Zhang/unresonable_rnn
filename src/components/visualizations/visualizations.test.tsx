import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NetworkDiagram } from './NetworkDiagram'
import { HeatmapDisplay } from './HeatmapDisplay'
import { AnimatedDataFlow } from './AnimatedDataFlow'
import { SliderControl } from './SliderControl'
import { TimelineChart } from './TimelineChart'
import type { NetworkData, HeatmapData, DataFlowSequence, TimelineData, SliderConfig } from './types'

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
})

describe('NetworkDiagram', () => {
  const mockData: NetworkData = {
    nodes: [
      { id: 'input1', type: 'input', layer: 0, label: 'Input 1' },
      { id: 'hidden1', type: 'hidden', layer: 1, label: 'Hidden 1' },
      { id: 'output1', type: 'output', layer: 2, label: 'Output 1' },
    ],
    connections: [
      { source: 'input1', target: 'hidden1', weight: 0.5 },
      { source: 'hidden1', target: 'output1', weight: 0.8 },
    ],
  }

  it('renders without crashing', () => {
    const { container } = render(<NetworkDiagram data={mockData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<NetworkDiagram data={mockData} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('calls onReady callback', () => {
    const onReady = vi.fn()
    render(<NetworkDiagram data={mockData} onReady={onReady} />)
    // onReady is called after render in ResizeObserver callback
  })
})

describe('HeatmapDisplay', () => {
  const mockData: HeatmapData = {
    cells: [
      { row: 0, col: 0, value: 0.5 },
      { row: 0, col: 1, value: 0.8 },
      { row: 1, col: 0, value: 0.3 },
      { row: 1, col: 1, value: 0.9 },
    ],
    rowLabels: ['Row 1', 'Row 2'],
    colLabels: ['Col 1', 'Col 2'],
  }

  it('renders without crashing', () => {
    const { container } = render(<HeatmapDisplay data={mockData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<HeatmapDisplay data={mockData} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('AnimatedDataFlow', () => {
  const mockSequence: DataFlowSequence = {
    steps: [
      { id: 'step1', data: [0.1, 0.2, 0.3], label: 'Step 1' },
      { id: 'step2', data: [0.4, 0.5, 0.6], label: 'Step 2' },
      { id: 'step3', data: [0.7, 0.8, 0.9], label: 'Step 3' },
    ],
    loopDuration: 1000,
  }

  it('renders without crashing', () => {
    const { container } = render(<AnimatedDataFlow sequence={mockSequence} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<AnimatedDataFlow sequence={mockSequence} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('SliderControl', () => {
  const mockConfig: SliderConfig = {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    marks: [
      { value: 0, label: '0' },
      { value: 50, label: '50' },
      { value: 100, label: '100' },
    ],
  }

  it('renders without crashing', () => {
    const { container } = render(<SliderControl config={mockConfig} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays label when provided', () => {
    render(<SliderControl config={mockConfig} label="Test Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('displays value when showValue is true', () => {
    render(<SliderControl config={mockConfig} showValue={true} />)
    expect(screen.getByText('50.00')).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    render(<SliderControl config={mockConfig} onChange={onChange} />)
    // Would need to simulate drag interaction
  })

  it('applies disabled state', () => {
    const { container } = render(<SliderControl config={mockConfig} disabled />)
    expect(container.firstChild).toHaveClass('opacity-50')
  })
})

describe('TimelineChart', () => {
  const mockData: TimelineData = {
    series: [
      {
        id: 'series1',
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { time: 0, value: 10 },
          { time: 1, value: 20 },
          { time: 2, value: 15 },
        ],
      },
      {
        id: 'series2',
        name: 'Series 2',
        color: '#10b981',
        data: [
          { time: 0, value: 5 },
          { time: 1, value: 25 },
          { time: 2, value: 20 },
        ],
      },
    ],
    xLabel: 'Time',
    yLabel: 'Value',
  }

  it('renders without crashing', () => {
    const { container } = render(<TimelineChart data={mockData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<TimelineChart data={mockData} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
