'use client'

import { forwardRef, useImperativeHandle, useRef, useCallback, useState, useEffect } from 'react'
import * as d3 from 'd3'
import { cn } from '@/lib/utils'
import { useResponsiveD3, getColorScale } from './hooks/useD3'
import type { DataFlowSequence, DataFlowStep, VisualizationBaseProps, InteractionCallbacks } from './types'

export interface AnimatedDataFlowProps
  extends VisualizationBaseProps,
    InteractionCallbacks<DataFlowStep> {
  sequence: DataFlowSequence
  autoPlay?: boolean
  loopDuration?: number
  showStepLabels?: boolean
  direction?: 'horizontal' | 'vertical'
  particleCount?: number
}

export interface AnimatedDataFlowRef {
  play: () => void
  pause: () => void
  stop: () => void
  setStep: (stepIndex: number) => void
  getCurrentStep: () => number
}

const AnimatedDataFlow = forwardRef<AnimatedDataFlowRef, AnimatedDataFlowProps>(
  (
    {
      sequence,
      width,
      height,
      className,
      colorScheme = 'viridis',
      animated = true,
      autoPlay = false,
      loopDuration = 1000,
      showStepLabels = true,
      direction = 'horizontal',
      particleCount = 5,
      onHover,
      onClick,
      onReady,
    },
    ref
  ) => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(autoPlay)

    const render = useCallback(
      (
        container: d3.Selection<HTMLDivElement, unknown, null, undefined>,
        dimensions: { width: number; height: number }
      ) => {
        const { width: w, height: h } = dimensions
        const margin = { top: 40, right: 40, bottom: 40, left: 40 }
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

        const steps = sequence.steps
        const numSteps = steps.length

        // Calculate step positions
        const isHorizontal = direction === 'horizontal'
        const stepWidth = isHorizontal ? innerWidth / numSteps : innerWidth
        const stepHeight = isHorizontal ? innerHeight : innerHeight / numSteps

        // Color scale for data values
        const allValues = steps.flatMap((s) => s.data)
        const minVal = Math.min(...allValues)
        const maxVal = Math.max(...allValues)
        const colorScale = getColorScale(colorScheme, [minVal, maxVal])

        // Arrow gradient
        const defs = svg.append('defs')
        const gradient = defs
          .append('linearGradient')
          .attr('id', 'flow-gradient')
          .attr('x1', '0%')
          .attr('y1', '0%')
          .attr('x2', '100%')
          .attr('y2', '0%')

        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.2)
        gradient.append('stop').attr('offset', '50%').attr('stop-color', '#3b82f6').attr('stop-opacity', 1)
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.2)

        // Draw step containers
        const stepGroups = g
          .selectAll('.step-group')
          .data(steps)
          .join('g')
          .attr('class', 'step-group')
          .attr('transform', (_, i) =>
            isHorizontal ? `translate(${i * stepWidth}, 0)` : `translate(0, ${i * stepHeight})`
          )
          .style('cursor', 'pointer')
          .on('mouseenter', function (event, step) {
            d3.select(this).select('.step-bg').attr('fill', '#f1f5f9')
            onHover?.(step)
          })
          .on('mouseleave', function () {
            d3.select(this).select('.step-bg').attr('fill', '#f8fafc')
            onHover?.(null)
          })
          .on('click', (event, step) => {
            const index = steps.indexOf(step)
            setCurrentStep(index)
            onClick?.(step)
          })

        // Step backgrounds
        stepGroups
          .append('rect')
          .attr('class', 'step-bg')
          .attr('width', stepWidth - 10)
          .attr('height', stepHeight - 10)
          .attr('x', 5)
          .attr('y', 5)
          .attr('rx', 8)
          .attr('fill', '#f8fafc')
          .attr('stroke', '#e2e8f0')
          .attr('stroke-width', 1)

        // Step labels
        if (showStepLabels) {
          stepGroups
            .append('text')
            .attr('x', stepWidth / 2)
            .attr('y', 25)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', '500')
            .attr('fill', '#64748b')
            .text((step) => step.label || `Step ${steps.indexOf(step) + 1}`)
        }

        // Data visualization within each step
        stepGroups.each(function (step, stepIndex) {
          const stepG = d3.select(this)
          const dataLength = step.data.length
          const cellSize = Math.min(
            (stepWidth - 30) / dataLength,
            (stepHeight - 60) / 1,
            30
          )

          const dataG = stepG
            .append('g')
            .attr('class', 'data-group')
            .attr(
              'transform',
              `translate(${(stepWidth - dataLength * cellSize) / 2}, ${stepHeight / 2 - cellSize / 2})`
            )

          // Data cells
          dataG
            .selectAll('.data-cell')
            .data(step.data)
            .join('rect')
            .attr('class', 'data-cell')
            .attr('x', (_, i) => i * cellSize)
            .attr('y', 0)
            .attr('width', cellSize - 2)
            .attr('height', cellSize - 2)
            .attr('rx', 4)
            .attr('fill', (d) => colorScale(d) as string)
            .attr('stroke', (_, i) =>
              step.highlight?.includes(i) ? '#fbbf24' : 'none'
            )
            .attr('stroke-width', 2)

          // Data values
          dataG
            .selectAll('.data-value')
            .data(step.data)
            .join('text')
            .attr('class', 'data-value')
            .attr('x', (_, i) => i * cellSize + cellSize / 2 - 1)
            .attr('y', cellSize / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('font-size', Math.max(cellSize * 0.35, 8))
            .attr('fill', (d) => {
              const color = d3.color(colorScale(d) as string)
              if (!color) return '#000'
              const rgb = color.rgb()
              const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
              return luminance > 0.5 ? '#000' : '#fff'
            })
            .text((d) => d.toFixed(1))
        })

        // Draw flow arrows between steps
        if (animated && numSteps > 1) {
          for (let i = 0; i < numSteps - 1; i++) {
            const arrowG = g.append('g').attr('class', `arrow-${i}`)

            if (isHorizontal) {
              const startX = (i + 1) * stepWidth - 5
              const endX = (i + 1) * stepWidth + 5
              const y = stepHeight / 2

              // Arrow path
              arrowG
                .append('path')
                .attr('d', `M ${startX} ${y} L ${endX} ${y}`)
                .attr('stroke', '#94a3b8')
                .attr('stroke-width', 2)
                .attr('marker-end', 'url(#flow-arrow)')

              // Animated particles
              for (let p = 0; p < particleCount; p++) {
                arrowG
                  .append('circle')
                  .attr('class', `particle-${i}-${p}`)
                  .attr('r', 3)
                  .attr('fill', '#3b82f6')
                  .attr('cx', startX)
                  .attr('cy', y)
                  .attr('opacity', 0)
              }
            }
          }

          // Arrow marker
          defs
            .append('marker')
            .attr('id', 'flow-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 5)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#94a3b8')
        }

        // Highlight current step
        g.selectAll('.step-bg')
          .filter((_, i) => i === currentStep)
          .attr('stroke', '#3b82f6')
          .attr('stroke-width', 2)

        onReady?.()
      },
      [
        sequence,
        colorScheme,
        animated,
        showStepLabels,
        direction,
        particleCount,
        currentStep,
        onHover,
        onClick,
        onReady,
      ]
    )

    const divRef = useResponsiveD3<HTMLDivElement>(render, [
      sequence,
      colorScheme,
      animated,
      showStepLabels,
      direction,
      currentStep,
    ])

    // Animation loop
    useEffect(() => {
      if (isPlaying && sequence.steps.length > 1) {
        timerRef.current = setInterval(() => {
          setCurrentStep((prev) => (prev + 1) % sequence.steps.length)
        }, sequence.loopDuration || loopDuration)

        return () => {
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
        }
      }
    }, [isPlaying, sequence.steps.length, sequence.loopDuration, loopDuration])

    // Animate particles when playing
    useEffect(() => {
      if (!svgRef.current || !isPlaying) return

      const svg = d3.select(svgRef.current)

      sequence.steps.forEach((_, i) => {
        if (i >= sequence.steps.length - 1) return

        for (let p = 0; p < particleCount; p++) {
          const particle = svg.select(`.particle-${i}-${p}`)
          if (particle.empty()) return

          const startX = parseFloat(particle.attr('cx'))
          const delay = (p / particleCount) * (loopDuration / 2)

          function animateParticle() {
            particle
              .attr('cx', startX)
              .attr('opacity', 0)
              .transition()
              .delay(delay)
              .duration(0)
              .attr('opacity', 1)
              .transition()
              .duration(loopDuration / 2)
              .ease(d3.easeLinear)
              .attr('cx', startX + 10)
              .attr('opacity', 0)
              .on('end', () => {
                if (isPlaying) animateParticle()
              })
          }

          animateParticle()
        }
      })
    }, [isPlaying, sequence.steps, particleCount, loopDuration])

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      stop: () => {
        setIsPlaying(false)
        setCurrentStep(0)
      },
      setStep: (stepIndex: number) => {
        setCurrentStep(Math.max(0, Math.min(stepIndex, sequence.steps.length - 1)))
      },
      getCurrentStep: () => currentStep,
    }))

    return (
      <div
        ref={divRef}
        className={cn('w-full h-full min-h-[200px]', className)}
        style={{ width: width || '100%', height: height || '100%' }}
      />
    )
  }
)

AnimatedDataFlow.displayName = 'AnimatedDataFlow'

export { AnimatedDataFlow }
