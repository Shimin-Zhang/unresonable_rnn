'use client'

import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import { cn } from '@/lib/utils'
import { useResponsiveD3 } from './hooks/useD3'
import type { TimelineData, TimelineSeries, TimelinePoint, VisualizationBaseProps, InteractionCallbacks } from './types'

export interface TimelineChartProps
  extends VisualizationBaseProps,
    InteractionCallbacks<TimelinePoint & { seriesId: string }> {
  data: TimelineData
  showGrid?: boolean
  showDots?: boolean
  showArea?: boolean
  lineWidth?: number
  curveType?: 'linear' | 'monotone' | 'step' | 'natural'
  enableBrush?: boolean
  enableZoom?: boolean
  onBrushChange?: (range: [number, number] | null) => void
}

export interface TimelineChartRef {
  highlightSeries: (seriesId: string | null) => void
  highlightPoint: (seriesId: string, time: number) => void
  setTimeRange: (range: [number, number]) => void
  resetView: () => void
  addDataPoint: (seriesId: string, point: TimelinePoint) => void
}

const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const TimelineChart = forwardRef<TimelineChartRef, TimelineChartProps>(
  (
    {
      data,
      width,
      height,
      className,
      animated = true,
      showGrid = true,
      showDots = true,
      showArea = false,
      lineWidth = 2,
      curveType = 'monotone',
      enableBrush = false,
      enableZoom = true,
      onBrushChange,
      onHover,
      onClick,
      onReady,
    },
    ref
  ) => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
    const xScaleRef = useRef<d3.ScaleLinear<number, number> | null>(null)
    const yScaleRef = useRef<d3.ScaleLinear<number, number> | null>(null)

    const getCurve = useCallback(() => {
      switch (curveType) {
        case 'linear':
          return d3.curveLinear
        case 'monotone':
          return d3.curveMonotoneX
        case 'step':
          return d3.curveStep
        case 'natural':
          return d3.curveNatural
        default:
          return d3.curveMonotoneX
      }
    }, [curveType])

    const render = useCallback(
      (
        container: d3.Selection<HTMLDivElement, unknown, null, undefined>,
        dimensions: { width: number; height: number }
      ) => {
        const { width: w, height: h } = dimensions
        const margin = { top: 30, right: 30, bottom: enableBrush ? 80 : 50, left: 60 }
        const innerWidth = w - margin.left - margin.right
        const innerHeight = h - margin.top - margin.bottom
        const brushHeight = 30

        // Clear previous content
        container.selectAll('*').remove()

        // Create SVG
        const svg = container
          .append('svg')
          .attr('width', w)
          .attr('height', h)
          .attr('viewBox', `0 0 ${w} ${h}`)

        svgRef.current = svg.node()

        // Calculate domains
        const allPoints = data.series.flatMap((s) => s.data)
        const xExtent = d3.extent(allPoints, (d) => d.time) as [number, number]
        const yExtent = d3.extent(allPoints, (d) => d.value) as [number, number]

        // Add padding to y domain
        const yPadding = (yExtent[1] - yExtent[0]) * 0.1
        const yDomain: [number, number] = [yExtent[0] - yPadding, yExtent[1] + yPadding]

        // Scales
        const xScale = d3.scaleLinear().domain(xExtent).range([0, innerWidth])
        const yScale = d3.scaleLinear().domain(yDomain).range([innerHeight, 0])

        xScaleRef.current = xScale
        yScaleRef.current = yScale

        // Clip path
        svg
          .append('defs')
          .append('clipPath')
          .attr('id', 'chart-clip')
          .append('rect')
          .attr('width', innerWidth)
          .attr('height', innerHeight)

        // Main chart group
        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

        // Chart area with clipping
        const chartArea = g.append('g').attr('clip-path', 'url(#chart-clip)')

        // Grid
        if (showGrid) {
          const gridG = chartArea.append('g').attr('class', 'grid')

          // Horizontal grid lines
          gridG
            .selectAll('.h-line')
            .data(yScale.ticks(5))
            .join('line')
            .attr('class', 'h-line')
            .attr('x1', 0)
            .attr('x2', innerWidth)
            .attr('y1', (d) => yScale(d))
            .attr('y2', (d) => yScale(d))
            .attr('stroke', '#e2e8f0')
            .attr('stroke-dasharray', '3,3')

          // Vertical grid lines
          gridG
            .selectAll('.v-line')
            .data(xScale.ticks(5))
            .join('line')
            .attr('class', 'v-line')
            .attr('x1', (d) => xScale(d))
            .attr('x2', (d) => xScale(d))
            .attr('y1', 0)
            .attr('y2', innerHeight)
            .attr('stroke', '#e2e8f0')
            .attr('stroke-dasharray', '3,3')
        }

        // Line generator
        const line = d3
          .line<TimelinePoint>()
          .x((d) => xScale(d.time))
          .y((d) => yScale(d.value))
          .curve(getCurve())

        // Area generator
        const area = d3
          .area<TimelinePoint>()
          .x((d) => xScale(d.time))
          .y0(innerHeight)
          .y1((d) => yScale(d.value))
          .curve(getCurve())

        // Draw series
        data.series.forEach((series, seriesIndex) => {
          const color = series.color || defaultColors[seriesIndex % defaultColors.length]

          // Area (if enabled)
          if (showArea) {
            chartArea
              .append('path')
              .datum(series.data)
              .attr('class', `area-${series.id}`)
              .attr('fill', color)
              .attr('fill-opacity', 0.1)
              .attr('d', area)
          }

          // Line
          const path = chartArea
            .append('path')
            .datum(series.data)
            .attr('class', `line-${series.id}`)
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', lineWidth)
            .attr('d', line)

          // Animate line drawing
          if (animated) {
            const totalLength = (path.node() as SVGPathElement).getTotalLength()
            path
              .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
              .attr('stroke-dashoffset', totalLength)
              .transition()
              .duration(1000)
              .ease(d3.easeLinear)
              .attr('stroke-dashoffset', 0)
          }

          // Dots
          if (showDots) {
            chartArea
              .selectAll(`.dot-${series.id}`)
              .data(series.data)
              .join('circle')
              .attr('class', `dot-${series.id} dot`)
              .attr('cx', (d) => xScale(d.time))
              .attr('cy', (d) => yScale(d.value))
              .attr('r', animated ? 0 : 4)
              .attr('fill', color)
              .attr('stroke', '#fff')
              .attr('stroke-width', 2)
              .style('cursor', 'pointer')
              .on('mouseenter', function (event, point) {
                d3.select(this).attr('r', 6)
                onHover?.({ ...point, seriesId: series.id })

                // Show tooltip
                const tooltip = container.select('.tooltip')
                tooltip
                  .style('display', 'block')
                  .style('left', `${event.offsetX + 10}px`)
                  .style('top', `${event.offsetY + 10}px`)
                  .html(
                    `<strong>${series.name}</strong><br/>Time: ${point.time.toFixed(2)}<br/>Value: ${point.value.toFixed(2)}${point.label ? `<br/>${point.label}` : ''}`
                  )
              })
              .on('mousemove', function (event) {
                container
                  .select('.tooltip')
                  .style('left', `${event.offsetX + 10}px`)
                  .style('top', `${event.offsetY + 10}px`)
              })
              .on('mouseleave', function () {
                d3.select(this).attr('r', 4)
                onHover?.(null)
                container.select('.tooltip').style('display', 'none')
              })
              .on('click', (event, point) => {
                onClick?.({ ...point, seriesId: series.id })
              })

            // Animate dots appearing
            if (animated) {
              chartArea
                .selectAll(`.dot-${series.id}`)
                .transition()
                .delay(1000)
                .duration(300)
                .attr('r', 4)
            }
          }
        })

        // X Axis
        const xAxis = g
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${innerHeight})`)
          .call(d3.axisBottom(xScale).ticks(5))

        xAxis.selectAll('text').attr('font-size', '12px').attr('fill', '#64748b')
        xAxis.selectAll('line').attr('stroke', '#94a3b8')
        xAxis.select('.domain').attr('stroke', '#94a3b8')

        // X axis label
        if (data.xLabel) {
          g.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 40)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#64748b')
            .text(data.xLabel)
        }

        // Y Axis
        const yAxis = g.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale).ticks(5))

        yAxis.selectAll('text').attr('font-size', '12px').attr('fill', '#64748b')
        yAxis.selectAll('line').attr('stroke', '#94a3b8')
        yAxis.select('.domain').attr('stroke', '#94a3b8')

        // Y axis label
        if (data.yLabel) {
          g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -innerHeight / 2)
            .attr('y', -45)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#64748b')
            .text(data.yLabel)
        }

        // Legend
        const legend = g
          .append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(${innerWidth - 100}, 0)`)

        data.series.forEach((series, i) => {
          const color = series.color || defaultColors[i % defaultColors.length]

          const legendItem = legend.append('g').attr('transform', `translate(0, ${i * 20})`)

          legendItem.append('line').attr('x1', 0).attr('x2', 20).attr('y1', 0).attr('y2', 0).attr('stroke', color).attr('stroke-width', 2)

          legendItem
            .append('text')
            .attr('x', 25)
            .attr('y', 4)
            .attr('font-size', '12px')
            .attr('fill', '#64748b')
            .text(series.name)
        })

        // Zoom behavior
        if (enableZoom) {
          const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 10])
            .translateExtent([
              [0, 0],
              [w, h],
            ])
            .extent([
              [0, 0],
              [innerWidth, innerHeight],
            ])
            .on('zoom', (event) => {
              const newXScale = event.transform.rescaleX(xScale)
              xScaleRef.current = newXScale

              // Update lines
              data.series.forEach((series) => {
                const newLine = d3
                  .line<TimelinePoint>()
                  .x((d) => newXScale(d.time))
                  .y((d) => yScale(d.value))
                  .curve(getCurve())

                chartArea.select(`.line-${series.id}`).attr('d', newLine(series.data))

                if (showArea) {
                  const newArea = d3
                    .area<TimelinePoint>()
                    .x((d) => newXScale(d.time))
                    .y0(innerHeight)
                    .y1((d) => yScale(d.value))
                    .curve(getCurve())

                  chartArea.select(`.area-${series.id}`).attr('d', newArea(series.data))
                }

                if (showDots) {
                  chartArea.selectAll(`.dot-${series.id}`).attr('cx', (d) => newXScale((d as TimelinePoint).time))
                }
              })

              xAxis.call(d3.axisBottom(newXScale).ticks(5))
            })

          svg.call(zoom)
          zoomRef.current = zoom
        }

        // Brush (for time range selection)
        if (enableBrush) {
          const brushG = svg
            .append('g')
            .attr('class', 'brush')
            .attr('transform', `translate(${margin.left},${h - margin.bottom + 20})`)

          const brushXScale = d3.scaleLinear().domain(xExtent).range([0, innerWidth])

          const brush = d3
            .brushX()
            .extent([
              [0, 0],
              [innerWidth, brushHeight],
            ])
            .on('brush end', (event) => {
              if (!event.selection) {
                onBrushChange?.(null)
                return
              }
              const [x0, x1] = event.selection as [number, number]
              const range: [number, number] = [brushXScale.invert(x0), brushXScale.invert(x1)]
              onBrushChange?.(range)
            })

          // Mini chart in brush area
          const miniLine = d3
            .line<TimelinePoint>()
            .x((d) => brushXScale(d.time))
            .y(
              (d) =>
                d3
                  .scaleLinear()
                  .domain(yDomain)
                  .range([brushHeight, 0])(d.value)
            )
            .curve(getCurve())

          data.series.forEach((series, i) => {
            const color = series.color || defaultColors[i % defaultColors.length]
            brushG
              .append('path')
              .datum(series.data)
              .attr('fill', 'none')
              .attr('stroke', color)
              .attr('stroke-width', 1)
              .attr('opacity', 0.5)
              .attr('d', miniLine)
          })

          brushG.call(brush)
        }

        // Tooltip container
        container
          .append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('display', 'none')
          .style('background', '#1e293b')
          .style('color', '#fff')
          .style('padding', '8px 12px')
          .style('border-radius', '6px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '10')

        onReady?.()
      },
      [
        data,
        animated,
        showGrid,
        showDots,
        showArea,
        lineWidth,
        getCurve,
        enableBrush,
        enableZoom,
        onBrushChange,
        onHover,
        onClick,
        onReady,
      ]
    )

    const divRef = useResponsiveD3<HTMLDivElement>(render, [
      data,
      animated,
      showGrid,
      showDots,
      showArea,
      lineWidth,
      curveType,
      enableBrush,
      enableZoom,
    ])

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
      highlightSeries: (seriesId: string | null) => {
        if (!svgRef.current) return
        const svg = d3.select(svgRef.current)

        if (seriesId === null) {
          data.series.forEach((s) => {
            svg.select(`.line-${s.id}`).attr('opacity', 1).attr('stroke-width', lineWidth)
            svg.selectAll(`.dot-${s.id}`).attr('opacity', 1)
            svg.select(`.area-${s.id}`).attr('fill-opacity', 0.1)
          })
        } else {
          data.series.forEach((s) => {
            const isHighlighted = s.id === seriesId
            svg
              .select(`.line-${s.id}`)
              .attr('opacity', isHighlighted ? 1 : 0.2)
              .attr('stroke-width', isHighlighted ? lineWidth * 1.5 : lineWidth)
            svg.selectAll(`.dot-${s.id}`).attr('opacity', isHighlighted ? 1 : 0.2)
            svg.select(`.area-${s.id}`).attr('fill-opacity', isHighlighted ? 0.2 : 0.05)
          })
        }
      },

      highlightPoint: (seriesId: string, time: number) => {
        if (!svgRef.current) return
        const svg = d3.select(svgRef.current)

        svg.selectAll('.dot').attr('r', 4)
        svg
          .selectAll(`.dot-${seriesId}`)
          .filter((d) => (d as TimelinePoint).time === time)
          .attr('r', 8)
      },

      setTimeRange: (range: [number, number]) => {
        if (!svgRef.current || !zoomRef.current || !xScaleRef.current) return
        const svg = d3.select(svgRef.current)
        const rect = svgRef.current.getBoundingClientRect()
        const innerWidth = rect.width - 90 // margin.left + margin.right

        const [t0, t1] = range
        const x0 = xScaleRef.current(t0)
        const x1 = xScaleRef.current(t1)
        const scale = innerWidth / (x1 - x0)
        const translateX = -x0 * scale

        svg.transition().duration(750).call(zoomRef.current.transform, d3.zoomIdentity.translate(translateX, 0).scale(scale))
      },

      resetView: () => {
        if (!svgRef.current || !zoomRef.current) return
        d3.select(svgRef.current).transition().duration(750).call(zoomRef.current.transform, d3.zoomIdentity)
      },

      addDataPoint: (seriesId: string, point: TimelinePoint) => {
        const series = data.series.find((s) => s.id === seriesId)
        if (series) {
          series.data.push(point)
          // Re-render will be triggered by data change
        }
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

TimelineChart.displayName = 'TimelineChart'

export { TimelineChart }
