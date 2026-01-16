import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  }
  return `${hours}h ${remainingMinutes}m`
}

export function getModuleStatus(
  moduleId: number,
  completedModules: number[],
  currentModule: number | null
): 'locked' | 'available' | 'in_progress' | 'completed' {
  if (completedModules.includes(moduleId)) {
    return 'completed'
  }
  if (currentModule === moduleId) {
    return 'in_progress'
  }
  // Module 0 is always available
  if (moduleId === 0) {
    return 'available'
  }
  // Other modules require previous module to be completed
  if (completedModules.includes(moduleId - 1)) {
    return 'available'
  }
  return 'locked'
}

export function calculateProgress(completedModules: number[], totalModules: number): number {
  return Math.round((completedModules.length / totalModules) * 100)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}
