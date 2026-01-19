'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { QUIZ_COLORS } from './constants'
import { shuffleArray } from './utils'
import type { MatchingProps, MatchingAnswer } from './types'

export function Matching({
  question,
  answer,
  showFeedback,
  onAnswer,
  disabled = false,
  className = '',
}: MatchingProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [shuffledRightItems, setShuffledRightItems] = useState<string[]>([])
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current) {
      const rightItems = question.pairs.map((p) => p.right)
      setShuffledRightItems(shuffleArray(rightItems))
      initializedRef.current = true
    }
  }, [question.pairs])

  const matches = useMemo(() => answer?.matches ?? {}, [answer?.matches])

  const handleDragStart = useCallback(
    (e: React.DragEvent, item: string) => {
      if (disabled) return
      setDraggedItem(item)
      e.dataTransfer.setData('text/plain', item)
      e.dataTransfer.effectAllowed = 'move'
    },
    [disabled]
  )

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
    setDropTargetId(null)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent, pairId: string) => {
      if (disabled) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setDropTargetId(pairId)
    },
    [disabled]
  )

  const handleDragLeave = useCallback(() => {
    setDropTargetId(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, pairId: string) => {
      if (disabled) return
      e.preventDefault()
      const item = e.dataTransfer.getData('text/plain')

      const newMatches: Record<string, string> = {}
      for (const [key, value] of Object.entries(matches)) {
        if (value !== item) {
          newMatches[key] = value
        }
      }
      newMatches[pairId] = item

      onAnswer({
        type: 'matching',
        matches: newMatches,
      })

      setDraggedItem(null)
      setDropTargetId(null)
    },
    [matches, onAnswer, disabled]
  )

  const handleRemoveMatch = useCallback(
    (pairId: string) => {
      if (disabled) return
      const newMatches = { ...matches }
      delete newMatches[pairId]
      onAnswer({
        type: 'matching',
        matches: newMatches,
      })
    },
    [matches, onAnswer, disabled]
  )

  const handleClickSelect = useCallback(
    (item: string) => {
      if (disabled) return
      setDraggedItem((prev) => (prev === item ? null : item))
    },
    [disabled]
  )

  const handleClickDrop = useCallback(
    (pairId: string) => {
      if (disabled || !draggedItem) return

      const newMatches: Record<string, string> = {}
      for (const [key, value] of Object.entries(matches)) {
        if (value !== draggedItem) {
          newMatches[key] = value
        }
      }
      newMatches[pairId] = draggedItem

      onAnswer({
        type: 'matching',
        matches: newMatches,
      })

      setDraggedItem(null)
    },
    [draggedItem, matches, onAnswer, disabled]
  )

  const usedItems = new Set(Object.values(matches))

  const isCorrectMatch = (pairId: string): boolean => {
    const pair = question.pairs.find((p) => p.id === pairId)
    return pair ? matches[pairId] === pair.right : false
  }

  const getDropZoneStyles = (pairId: string): string => {
    const hasMatch = !!matches[pairId]
    const isDropTarget = dropTargetId === pairId

    if (showFeedback && hasMatch) {
      if (isCorrectMatch(pairId)) {
        return cn(QUIZ_COLORS.correct.bg, QUIZ_COLORS.correct.border)
      }
      return cn(QUIZ_COLORS.incorrect.bg, QUIZ_COLORS.incorrect.border)
    }

    if (isDropTarget) {
      return cn(QUIZ_COLORS.selected.bg, 'border-primary-500 border-dashed')
    }

    if (hasMatch) {
      return cn(QUIZ_COLORS.selected.bg, QUIZ_COLORS.selected.border)
    }

    return 'bg-slate-50 border-slate-300 border-dashed'
  }

  return (
    <div className={cn('space-y-4', className)} data-testid="matching">
      <p className="text-lg font-medium text-slate-900">{question.question}</p>
      <p className="text-sm text-slate-500">
        Drag items from the right to match with items on the left, or click to select and
        place.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-600">Match these:</h4>
          {question.pairs.map((pair) => {
            const hasMatch = !!matches[pair.id]
            const correct = showFeedback && hasMatch && isCorrectMatch(pair.id)
            const incorrect = showFeedback && hasMatch && !isCorrectMatch(pair.id)

            return (
              <div key={pair.id} className="flex items-center gap-3">
                <div className="flex-1 rounded-lg border border-slate-200 bg-white p-3 text-slate-700">
                  {pair.left}
                </div>
                <ArrowRightIcon className="h-5 w-5 shrink-0 text-slate-400" />
                <button
                  type="button"
                  onClick={() => (hasMatch ? handleRemoveMatch(pair.id) : handleClickDrop(pair.id))}
                  onDragOver={(e) => handleDragOver(e, pair.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, pair.id)}
                  disabled={disabled}
                  className={cn(
                    'flex min-h-[48px] flex-1 items-center justify-center rounded-lg border-2 p-3 transition-all',
                    getDropZoneStyles(pair.id),
                    disabled && 'cursor-not-allowed opacity-60',
                    !disabled && !hasMatch && draggedItem && 'cursor-pointer'
                  )}
                  data-testid={`drop-zone-${pair.id}`}
                >
                  {hasMatch ? (
                    <div className="flex items-center gap-2">
                      <span>{matches[pair.id]}</span>
                      {showFeedback &&
                        (correct ? (
                          <CheckCircleIcon
                            className={cn('h-5 w-5', QUIZ_COLORS.correct.icon)}
                          />
                        ) : incorrect ? (
                          <XCircleIcon
                            className={cn('h-5 w-5', QUIZ_COLORS.incorrect.icon)}
                          />
                        ) : null)}
                      {!disabled && !showFeedback && (
                        <XIcon className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400">Drop here</span>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-600">Available answers:</h4>
          <div className="flex flex-wrap gap-2">
            {shuffledRightItems.map((item, index) => {
              const isUsed = usedItems.has(item)
              const isDragging = draggedItem === item
              const isClickSelected = draggedItem === item && !isUsed

              return (
                <button
                  key={index}
                  type="button"
                  draggable={!disabled && !isUsed}
                  onClick={() => !isUsed && handleClickSelect(item)}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  disabled={disabled || isUsed}
                  className={cn(
                    'rounded-lg border-2 px-4 py-2 font-medium transition-all',
                    isUsed
                      ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-50'
                      : isClickSelected
                        ? cn(QUIZ_COLORS.selected.bg, QUIZ_COLORS.selected.border, QUIZ_COLORS.selected.text)
                        : 'cursor-grab border-slate-300 bg-white text-slate-700 hover:border-primary-400 hover:bg-primary-50',
                    isDragging && 'opacity-50',
                    disabled && 'cursor-not-allowed'
                  )}
                  data-testid={`draggable-${index}`}
                >
                  {item}
                </button>
              )
            })}
          </div>
          {draggedItem && !usedItems.has(draggedItem) && (
            <p className="text-sm text-primary-600">
              Click on a drop zone to place &quot;{draggedItem}&quot;
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}
