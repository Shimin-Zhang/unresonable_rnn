'use client'

import { forwardRef, useCallback, useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { cn } from '@/lib/utils'
import type { SliderConfig, SliderMark, VisualizationBaseProps } from './types'

export interface SliderControlProps extends Omit<VisualizationBaseProps, 'colorScheme'> {
  config: SliderConfig
  value?: number
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
  label?: string
  showValue?: boolean
  formatValue?: (value: number) => string
  disabled?: boolean
  color?: string
  trackHeight?: number
  thumbSize?: number
}

const SliderControl = forwardRef<HTMLDivElement, SliderControlProps>(
  (
    {
      config,
      value: controlledValue,
      onChange,
      onChangeEnd,
      label,
      showValue = true,
      formatValue = (v) => v.toFixed(2),
      disabled = false,
      className,
      width,
      height,
      color = '#3b82f6',
      trackHeight = 8,
      thumbSize = 20,
      animated = true,
      onReady,
    },
    ref
  ) => {
    const { min, max, step = 1, marks, defaultValue = min } = config
    const [internalValue, setInternalValue] = useState(defaultValue)
    const [isDragging, setIsDragging] = useState(false)
    const trackRef = useRef<HTMLDivElement>(null)

    const value = controlledValue !== undefined ? controlledValue : internalValue

    const getPercentage = useCallback(
      (val: number) => ((val - min) / (max - min)) * 100,
      [min, max]
    )

    const getValueFromPosition = useCallback(
      (clientX: number) => {
        if (!trackRef.current) return value

        const rect = trackRef.current.getBoundingClientRect()
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        let newValue = min + percentage * (max - min)

        // Snap to step
        if (step) {
          newValue = Math.round(newValue / step) * step
        }

        // Snap to marks if close
        if (marks) {
          const snapThreshold = (max - min) * 0.02
          for (const mark of marks) {
            if (Math.abs(newValue - mark.value) < snapThreshold) {
              newValue = mark.value
              break
            }
          }
        }

        return Math.max(min, Math.min(max, newValue))
      },
      [min, max, step, marks, value]
    )

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return
        e.preventDefault()
        setIsDragging(true)

        const newValue = getValueFromPosition(e.clientX)
        setInternalValue(newValue)
        onChange?.(newValue)
      },
      [disabled, getValueFromPosition, onChange]
    )

    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (disabled) return
        setIsDragging(true)

        const touch = e.touches[0]
        const newValue = getValueFromPosition(touch.clientX)
        setInternalValue(newValue)
        onChange?.(newValue)
      },
      [disabled, getValueFromPosition, onChange]
    )

    useEffect(() => {
      if (!isDragging) return

      const handleMouseMove = (e: MouseEvent) => {
        const newValue = getValueFromPosition(e.clientX)
        setInternalValue(newValue)
        onChange?.(newValue)
      }

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0]
        const newValue = getValueFromPosition(touch.clientX)
        setInternalValue(newValue)
        onChange?.(newValue)
      }

      const handleEnd = () => {
        setIsDragging(false)
        onChangeEnd?.(value)
      }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleEnd)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleEnd)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleEnd)
      }
    }, [isDragging, getValueFromPosition, onChange, onChangeEnd, value])

    useEffect(() => {
      onReady?.()
    }, [onReady])

    const percentage = getPercentage(value)

    return (
      <div
        ref={ref}
        className={cn('w-full select-none', disabled && 'opacity-50 cursor-not-allowed', className)}
        style={{ width: width || '100%', height: height || 'auto' }}
      >
        {/* Label and value */}
        {(label || showValue) && (
          <div className="flex justify-between items-center mb-2">
            {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
            {showValue && (
              <span
                className={cn(
                  'text-sm font-mono text-slate-600',
                  animated && 'transition-all duration-100'
                )}
              >
                {formatValue(value)}
              </span>
            )}
          </div>
        )}

        {/* Track container */}
        <div className="relative py-2">
          {/* Track background */}
          <div
            ref={trackRef}
            className={cn('relative w-full rounded-full bg-slate-200', !disabled && 'cursor-pointer')}
            style={{ height: trackHeight }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Filled track */}
            <div
              className={cn('absolute h-full rounded-full', animated && 'transition-all duration-100')}
              style={{
                width: `${percentage}%`,
                backgroundColor: color,
              }}
            />

            {/* Marks */}
            {marks && marks.length > 0 && (
              <div className="absolute w-full h-full">
                {marks.map((mark) => {
                  const markPercentage = getPercentage(mark.value)
                  return (
                    <div
                      key={mark.value}
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{ left: `${markPercentage}%` }}
                    >
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full -ml-1',
                          mark.value <= value ? 'bg-white' : 'bg-slate-400'
                        )}
                      />
                    </div>
                  )
                })}
              </div>
            )}

            {/* Thumb */}
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 rounded-full shadow-md border-2 border-white',
                animated && 'transition-all duration-100',
                isDragging && 'scale-110',
                !disabled && 'cursor-grab active:cursor-grabbing'
              )}
              style={{
                left: `${percentage}%`,
                width: thumbSize,
                height: thumbSize,
                marginLeft: -thumbSize / 2,
                backgroundColor: color,
              }}
            />
          </div>

          {/* Mark labels */}
          {marks && marks.length > 0 && (
            <div className="relative mt-2">
              {marks.map((mark) => {
                if (!mark.label) return null
                const markPercentage = getPercentage(mark.value)
                return (
                  <span
                    key={mark.value}
                    className="absolute text-xs text-slate-500 -translate-x-1/2"
                    style={{ left: `${markPercentage}%` }}
                  >
                    {mark.label}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Min/Max labels */}
        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    )
  }
)

SliderControl.displayName = 'SliderControl'

export { SliderControl }
