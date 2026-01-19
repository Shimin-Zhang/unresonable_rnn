'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface RealTimeDataOptions<T> {
  /** Maximum number of data points to keep */
  maxPoints?: number
  /** Update interval in milliseconds */
  interval?: number
  /** Whether to automatically start */
  autoStart?: boolean
  /** Data generator function */
  generator?: () => T
  /** Transform function for incoming data */
  transform?: (data: T) => T
}

interface RealTimeDataReturn<T> {
  data: T[]
  isRunning: boolean
  start: () => void
  stop: () => void
  reset: () => void
  push: (item: T) => void
  setData: (data: T[]) => void
}

/**
 * Hook for managing real-time streaming data
 * Useful for live updating visualizations
 */
export function useRealTimeData<T>(
  options: RealTimeDataOptions<T> = {}
): RealTimeDataReturn<T> {
  const {
    maxPoints = 100,
    interval = 100,
    autoStart = false,
    generator,
    transform = (d) => d,
  } = options

  const [data, setDataState] = useState<T[]>([])
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const push = useCallback(
    (item: T) => {
      setDataState((prev) => {
        const transformed = transform(item)
        const newData = [...prev, transformed]
        return newData.slice(-maxPoints)
      })
    },
    [maxPoints, transform]
  )

  const setData = useCallback(
    (newData: T[]) => {
      setDataState(newData.slice(-maxPoints))
    },
    [maxPoints]
  )

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setDataState([])
  }, [])

  useEffect(() => {
    if (isRunning && generator) {
      intervalRef.current = setInterval(() => {
        const newItem = generator()
        push(newItem)
      }, interval)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [isRunning, generator, interval, push])

  return {
    data,
    isRunning,
    start,
    stop,
    reset,
    push,
    setData,
  }
}

interface BufferedUpdateOptions<T> {
  /** Buffer size before flushing */
  bufferSize?: number
  /** Maximum time before flushing in ms */
  flushInterval?: number
  /** Callback when buffer flushes */
  onFlush: (items: T[]) => void
}

/**
 * Hook for buffered updates to reduce render frequency
 * Batches multiple updates together for better performance
 */
export function useBufferedUpdate<T>(options: BufferedUpdateOptions<T>) {
  const { bufferSize = 10, flushInterval = 100, onFlush } = options

  const bufferRef = useRef<T[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const flush = useCallback(() => {
    if (bufferRef.current.length > 0) {
      onFlush([...bufferRef.current])
      bufferRef.current = []
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [onFlush])

  const push = useCallback(
    (item: T) => {
      bufferRef.current.push(item)

      if (bufferRef.current.length >= bufferSize) {
        flush()
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(flush, flushInterval)
      }
    },
    [bufferSize, flushInterval, flush]
  )

  const clear = useCallback(() => {
    bufferRef.current = []
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return { push, flush, clear }
}

interface ThrottledCallbackOptions {
  /** Minimum time between calls in ms */
  throttleMs?: number
  /** Whether to call on leading edge */
  leading?: boolean
  /** Whether to call on trailing edge */
  trailing?: boolean
}

/**
 * Hook for throttled callbacks
 * Useful for rate-limiting expensive visualization updates
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  options: ThrottledCallbackOptions = {}
): T {
  const { throttleMs = 16, leading = true, trailing = true } = options

  const lastCallRef = useRef<number>(0)
  const pendingArgsRef = useRef<Parameters<T> | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const throttled = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const elapsed = now - lastCallRef.current

      const execute = () => {
        lastCallRef.current = Date.now()
        callback(...args)
      }

      if (elapsed >= throttleMs) {
        if (leading) {
          execute()
        } else {
          pendingArgsRef.current = args
        }
      } else {
        pendingArgsRef.current = args

        if (trailing && !timerRef.current) {
          timerRef.current = setTimeout(() => {
            timerRef.current = null
            if (pendingArgsRef.current) {
              lastCallRef.current = Date.now()
              callback(...pendingArgsRef.current)
              pendingArgsRef.current = null
            }
          }, throttleMs - elapsed)
        }
      }
    },
    [callback, throttleMs, leading, trailing]
  ) as T

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return throttled
}

/**
 * Hook for RAF-based animation loops
 * Useful for smooth 60fps animations
 */
export function useAnimationFrame(callback: (deltaTime: number) => void, running = true) {
  const frameRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!running) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      return
    }

    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        const deltaTime = time - previousTimeRef.current
        callback(deltaTime)
      }
      previousTimeRef.current = time
      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [callback, running])
}
