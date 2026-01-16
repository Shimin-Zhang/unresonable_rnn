import { describe, it, expect } from 'vitest'
import {
  formatDuration,
  getModuleStatus,
  calculateProgress,
  generateId,
} from './utils'

describe('formatDuration', () => {
  it('formats minutes under 60', () => {
    expect(formatDuration(30)).toBe('30 min')
    expect(formatDuration(45)).toBe('45 min')
  })

  it('formats exactly one hour', () => {
    expect(formatDuration(60)).toBe('1 hour')
  })

  it('formats multiple hours', () => {
    expect(formatDuration(120)).toBe('2 hours')
  })

  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m')
    expect(formatDuration(150)).toBe('2h 30m')
  })
})

describe('getModuleStatus', () => {
  it('returns completed for completed modules', () => {
    expect(getModuleStatus(1, [1, 2, 3], null)).toBe('completed')
  })

  it('returns in_progress for current module', () => {
    expect(getModuleStatus(2, [1], 2)).toBe('in_progress')
  })

  it('returns available for module 0', () => {
    expect(getModuleStatus(0, [], null)).toBe('available')
  })

  it('returns available when previous module is completed', () => {
    expect(getModuleStatus(2, [1], null)).toBe('available')
  })

  it('returns locked when previous module is not completed', () => {
    expect(getModuleStatus(3, [1], null)).toBe('locked')
  })
})

describe('calculateProgress', () => {
  it('calculates 0% for no completed modules', () => {
    expect(calculateProgress([], 10)).toBe(0)
  })

  it('calculates 100% when all modules completed', () => {
    expect(calculateProgress([1, 2, 3], 3)).toBe(100)
  })

  it('calculates percentage correctly', () => {
    expect(calculateProgress([1, 2], 4)).toBe(50)
    expect(calculateProgress([1, 2, 3], 10)).toBe(30)
  })
})

describe('generateId', () => {
  it('generates a string', () => {
    expect(typeof generateId()).toBe('string')
  })

  it('generates unique ids', () => {
    const ids = new Set([generateId(), generateId(), generateId()])
    expect(ids.size).toBe(3)
  })

  it('generates ids of expected length', () => {
    const id = generateId()
    expect(id.length).toBe(7)
  })
})
