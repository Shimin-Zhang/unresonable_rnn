'use client'

import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import { cn } from '@/lib/utils'
import { useResponsiveD3, getColorScale } from './hooks/useD3'
import type { HeatmapData, HeatmapCell, VisualizationBaseProps, InteractionCallbacks } from './types'

export interface HeatmapDisplayProps
  extends VisualizationBaseProps,
    InteractionCallbacks<HeatmapCell> {
  data: HeatmapData
  showValues?: boolean
  cellPadding?: number
  formatValue?: (value: number) => string
  tooltipContent?: (cell: HeatmapCell, rowLabel?: string, colLabel?: string) => string
}

export interface HeatmapDisplayRef {
  highlightCell: (row: number, col: number) => void
  highlightRow: (row: number) => void
  highlightCol: (col: number) => void
  clearHighlights: () => void
  updateCell: (row: number, col: number, value: number) => void
}

const HeatmapDisplay = forwardRef<HeatmapDisplayRef, HeatmapDisplayProps>(
  (
    {
      data,
      width,
      height,
      className,
      colorScheme = 'viridis',
      animated = true,
      showValues = false,
      cellPadding = 2,
      formatValue = (v) => v.toFixed(2),
      tooltipContent,
      onHover,
      onClick,
      onReady,
    },
    ref
  ) => {
    const svgRef = useRef<SVGSVGElement | null>(null)

    const render = useCallback(
      (
        container: d3.Selection<HTMLDivElement, unknown, null, undefined>,
        dimensions: { width: number; height: number }
      ) => {
        const { width: w, height: h } = dimensions
        const margin = { top: 50, right: 30, bottom: 50, left: 80 }
        const innerWidth = w - margin.left - margin.right
        const innerHeight = h - margin.top - margin.bottom

        // Clear previous content
        container.selectAll('*').remove()

        // Create SVG
        const svg = container
          .append('svg')
          .attr('width', w)
          .attr('height', h)
          .attr('viewBox', `0 0 ${w} ${h}`)

        svgRef.current = svg.node()

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

        // Determine grid dimensions
        const numRows = Math.max(...data.cells.map((c) => c.row)) + 1
        const numCols = Math.max(...data.cells.map((c) => c.col)) + 1

        // Calculate cell sizes
        const cellWidth = (innerWidth - cellPadding * (numCols - 1)) / numCols
        const cellHeight = (innerHeight - cellPadding * (numRows - 1)) / numRows

        // Color scale
        const minVal = data.minValue ?? Math.min(...data.cells.map((c) => c.value))
        const maxVal = data.maxValue ?? Math.max(...data.cells.map((c) => c.value))
        const colorScale = getColorScale(colorScheme, [minVal, maxVal])

        // Create tooltip
        const tooltip = container
          .append('div')
          .attr('class', 'absolute hidden bg-slate-800 text-white px-2 py-1 rounded text-sm pointer-events-none z-10')
          .style('position', 'absolute')

        // Draw cells
        const cells = g
          .append('g')
          .attr('class', 'cells')
          .selectAll('rect')
          .data(data.cells)
          .join('rect')
          .attr('class', 'cell')
          .attr('x', (d) => d.col * (cellWidth + cellPadding))
          .attr('y', (d) => d.row * (cellHeight + cellPadding))
          .attr('width', cellWidth)
          .attr('height', cellHeight)
          .attr('fill', (d) => colorScale(d.value) as string)
          .attr('rx', 2)
          .style('cursor', 'pointer')
          .on('mouseenter', function (event, cell) {
            d3.select(this).attr('stroke', '#fff').attr('stroke-width', 2)

            const content =
              tooltipContent?.(
                cell,
                data.rowLabels?.[cell.row],
                data.colLabels?.[cell.col]
              ) ||
              `Row: ${data.rowLabels?.[cell.row] || cell.row}\nCol: ${data.colLabels?.[cell.col] || cell.col}\nValue: ${formatValue(cell.value)}`

            tooltip
              .html(content.replace(/\n/g, '<br>'))
              .style('display', 'block')
              .style('left', `${event.offsetX + 10}px`)
              .style('top', `${event.offsetY + 10}px`)

            onHover?.(cell)
          })
          .on('mousemove', function (event) {
            tooltip.style('left', `${event.offsetX + 10}px`).style('top', `${event.offsetY + 10}px`)
          })
          .on('mouseleave', function () {
            d3.select(this).attr('stroke', 'none')
            tooltip.style('display', 'none')
            onHover?.(null)
          })
          .on('click', (event, cell) => {
            onClick?.(cell)
          })

        // Entrance animation
        if (animated) {
          cells
            .attr('opacity', 0)
            .transition()
            .duration(500)
            .delay((_, i) => i * 10)
            .attr('opacity', 1)
        }

        // Show values in cells
        if (showValues) {
          g.append('g')
            .attr('class', 'values')
            .selectAll('text')
            .data(data.cells)
            .join('text')
            .attr('x', (d) => d.col * (cellWidth + cellPadding) + cellWidth / 2)
            .attr('y', (d) => d.row * (cellHeight + cellPadding) + cellHeight / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('font-size', Math.min(cellWidth, cellHeight) * 0.3)
            .attr('fill', (d) => {
              // Use contrasting text color
              const color = d3.color(colorScale(d.value) as string)
              if (!color) return '#000'
              const rgb = color.rgb()
              const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
              return luminance > 0.5 ? '#000' : '#fff'
            })
            .text((d) => formatValue(d.value))
        }

        // Row labels
        if (data.rowLabels) {
          g.append('g')
            .attr('class', 'row-labels')
            .selectAll('text')
            .data(data.rowLabels)
            .join('text')
            .attr('x', -10)
            .attr('y', (_, i) => i * (cellHeight + cellPadding) + cellHeight / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .attr('font-size', '12px')
            .attr('fill', '#64748b')
            .text((d) => d)
        }

        // Column labels
        if (data.colLabels) {
          g.append('g')
            .attr('class', 'col-labels')
            .selectAll('text')
            .data(data.colLabels)
            .join('text')
            .attr('x', (_, i) => i * (cellWidth + cellPadding) + cellWidth / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#64748b')
            .text((d) => d)
        }

        // Color legend
        const legendWidth = 20
        const legendHeight = innerHeight
        const legendX = innerWidth + 20

        const legendScale = d3.scaleLinear().domain([minVal, maxVal]).range([legendHeight, 0])

        const legendAxis = d3.axisRight(legendScale).ticks(5).tickFormat(d3.format('.2f'))

        const legendGradient = svg
          .append('defs')
          .append('linearGradient')
          .attr('id', 'heatmap-gradient')
          .attr('x1', '0%')
          .attr('y1', '100%')
          .attr('x2', '0%')
          .attr('y2', '0%')

        const gradientStops = 10
        for (let i = 0; i <= gradientStops; i++) {
          const t = i / gradientStops
          const value = minVal + t * (maxVal - minVal)
          legendGradient
            .append('stop')
            .attr('offset', `${t * 100}%`)
            .attr('stop-color', colorScale(value) as string)
        }

        g.append('rect')
          .attr('x', legendX)
          .attr('y', 0)
          .attr('width', legendWidth)
          .attr('height', legendHeight)
          .style('fill', 'url(#heatmap-gradient)')

        g.append('g')
          .attr('class', 'legend-axis')
          .attr('transform', `translate(${legendX + legendWidth}, 0)`)
          .call(legendAxis)
          .selectAll('text')
          .attr('font-size', '10px')

        onReady?.()
      },
      [
        data,
        colorScheme,
        animated,
        showValues,
        cellPadding,
        formatValue,
        tooltipContent,
        onHover,
        onClick,
        onReady,
      ]
    )

    const divRef = useResponsiveD3<HTMLDivElement>(render, [
      data,
      colorScheme,
      animated,
      showValues,
      cellPadding,
    ])

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
      highlightCell: (row: number, col: number) => {
        if (!svgRef.current) return
        const svg = d3.select(svgRef.current)

        svg.selectAll('.cell').attr('opacity', 0.3)
        svg
          .selectAll('.cell')
          .filter((d) => (d as HeatmapCell).row === row && (d as HeatmapCell).col === col)
          .attr('opacity', 1)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
      },

      highlightRow: (row: number) => {
        if (!svgRef.current) return
        const svg = d3.select(svgRef.current)

        svg.selectAll('.cell').attr('opacity', 0.3)
        svg
          .selectAll('.cell')
          .filter((d) => (d as HeatmapCell).row === row)
          .attr('opacity', 1)
      },

      highlightCol: (col: number) => {
        if (!svgRef.current) return
        const svg = d3.select(svgRef.current)

        svg.selectAll('.cell').attr('opacity', 0.3)
        svg
          .selectAll('.cell')
          .filter((d) => (d as HeatmapCell).col === col)
          .attr('opacity', 1)
      },

      clearHighlights: () => {
        if (!svgRef.current) return
        const svg = d3.select(svgRef.current)

        svg.selectAll('.cell').attr('opacity', 1).attr('stroke', 'none')
      },

      updateCell: (row: number, col: number, value: number) => {
        if (!svgRef.current) return
        const svg = d3.select(svgRef.current)
        const minVal = data.minValue ?? Math.min(...data.cells.map((c) => c.value))
        const maxVal = data.maxValue ?? Math.max(...data.cells.map((c) => c.value))
        const colorScale = getColorScale(colorScheme, [minVal, maxVal])

        svg
          .selectAll('.cell')
          .filter((d) => (d as HeatmapCell).row === row && (d as HeatmapCell).col === col)
          .transition()
          .duration(300)
          .attr('fill', colorScale(value) as string)
      },
    }))

    return (
      <div
        ref={divRef}
        className={cn('w-full h-full min-h-[300px] relative', className)}
        style={{ width: width || '100%', height: height || '100%' }}
      />
    )
  }
)

HeatmapDisplay.displayName = 'HeatmapDisplay'

export { HeatmapDisplay }
