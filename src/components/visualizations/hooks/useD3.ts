'use client'

import { useRef, useEffect, useCallback } from 'react'
import * as d3 from 'd3'

/**
 * Hook for managing D3 visualizations with React
 * Handles container selection and cleanup
 */
export function useD3<T extends SVGSVGElement | HTMLDivElement>(
  renderFn: (selection: d3.Selection<T, unknown, null, undefined>) => void,
  deps: React.DependencyList = []
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (ref.current) {
      renderFn(d3.select(ref.current) as d3.Selection<T, unknown, null, undefined>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

/**
 * Hook for responsive D3 visualizations
 * Automatically resizes when container changes
 */
export function useResponsiveD3<T extends SVGSVGElement | HTMLDivElement>(
  renderFn: (
    selection: d3.Selection<T, unknown, null, undefined>,
    dimensions: { width: number; height: number }
  ) => void | (() => void),
  deps: React.DependencyList = []
) {
  const ref = useRef<T>(null)
  const cleanupRef = useRef<(() => void) | void>()

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return

      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) {
        // Cleanup previous render
        if (cleanupRef.current) {
          cleanupRef.current()
        }
        cleanupRef.current = renderFn(
          d3.select(element) as d3.Selection<T, unknown, null, undefined>,
          { width, height }
        )
      }
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

/**
 * Hook for animated D3 visualizations with playback controls
 */
export function useAnimatedD3<T extends SVGSVGElement | HTMLDivElement>(
  renderFn: (selection: d3.Selection<T, unknown, null, undefined>) => void,
  animateFn: (selection: d3.Selection<T, unknown, null, undefined>, progress: number) => void,
  duration: number = 1000,
  deps: React.DependencyList = []
) {
  const ref = useRef<T>(null)
  const timerRef = useRef<d3.Timer | null>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    if (ref.current) {
      renderFn(d3.select(ref.current) as d3.Selection<T, unknown, null, undefined>)
    }

    return () => {
      if (timerRef.current) {
        timerRef.current.stop()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const play = useCallback(() => {
    if (!ref.current) return

    if (timerRef.current) {
      timerRef.current.stop()
    }

    const startProgress = progressRef.current
    const startTime = Date.now()
    const selection = d3.select(ref.current) as d3.Selection<T, unknown, null, undefined>

    timerRef.current = d3.timer(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(startProgress + elapsed / duration, 1)
      progressRef.current = progress

      animateFn(selection, progress)

      if (progress >= 1) {
        timerRef.current?.stop()
        progressRef.current = 0
      }
    })
  }, [animateFn, duration])

  const pause = useCallback(() => {
    if (timerRef.current) {
      timerRef.current.stop()
    }
  }, [])

  const reset = useCallback(() => {
    if (timerRef.current) {
      timerRef.current.stop()
    }
    progressRef.current = 0
    if (ref.current) {
      animateFn(
        d3.select(ref.current) as d3.Selection<T, unknown, null, undefined>,
        0
      )
    }
  }, [animateFn])

  return { ref, play, pause, reset }
}

/**
 * Get a D3 color scale based on scheme name
 * Returns a function that maps a number in [0, 1] domain to a color string
 */
export function getColorScale(
  scheme: string,
  domain: [number, number] = [0, 1]
): (value: number) => string {
  const interpolators: Record<string, (t: number) => string> = {
    viridis: d3.interpolateViridis,
    plasma: d3.interpolatePlasma,
    inferno: d3.interpolateInferno,
    magma: d3.interpolateMagma,
    warm: d3.interpolateWarm,
    cool: d3.interpolateCool,
    blues: d3.interpolateBlues,
    greens: d3.interpolateGreens,
    reds: d3.interpolateReds,
    purples: d3.interpolatePurples,
    oranges: d3.interpolateOranges,
  }

  if (scheme === 'diverging') {
    const midpoint = (domain[0] + domain[1]) / 2
    const scale = d3.scaleDiverging<string>()
      .domain([domain[0], midpoint, domain[1]])
      .interpolator(d3.interpolateRdBu)
    return (value: number) => scale(value)
  }

  const interpolator = interpolators[scheme] || d3.interpolateViridis
  const scale = d3.scaleSequential(interpolator).domain(domain)
  return (value: number) => scale(value)
}
