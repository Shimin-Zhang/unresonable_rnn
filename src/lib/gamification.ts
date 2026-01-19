import type { Badge, BadgeRarity } from './types'

// Point values for different actions
export const POINTS = {
  MODULE_COMPLETE: 100,
  MODULE_COMPLETE_BONUS_PER_DIFFICULTY: 20, // Multiply by module complexity
  EXERCISE_COMPLETE: 25,
  EXERCISE_PERFECT: 50, // No hints used
  EXERCISE_FIRST_TRY: 30, // Completed on first attempt
  STREAK_DAILY: 10, // Per day of streak
  STREAK_WEEKLY_BONUS: 50, // Bonus for 7-day streak
  PATH_COMPLETE: 500,
  CAPSTONE_COMPLETE: 1000,
} as const

// Module difficulty ratings (used for point multipliers)
export const MODULE_DIFFICULTY: Record<number, number> = {
  0: 1, // Executive Context - easy
  1: 1, // Why Sequences Matter - easy
  2: 2, // RNN Architecture - medium
  3: 3, // Vanishing Gradients & LSTMs - hard
  4: 2, // Character-Level Modeling - medium
  5: 1, // Experiments - easy
  6: 2, // Beyond Text - medium
  7: 3, // Attention Mechanisms - hard
  8: 1, // Limitations & Path Forward - easy
  9: 3, // Implementation Deep Dive - hard
  10: 5, // Capstone Project - very hard
}

// Rarity colors for UI
export const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: 'text-slate-400 bg-slate-100',
  uncommon: 'text-green-500 bg-green-100',
  rare: 'text-blue-500 bg-blue-100',
  epic: 'text-purple-500 bg-purple-100',
  legendary: 'text-amber-500 bg-amber-100',
}

// Badge definitions
export const BADGES: Record<string, Badge> = {
  // Completion badges
  first_blood: {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Complete your first module',
    icon: '🩸',
    rarity: 'common',
    category: 'completion',
    requirement: 'Complete 1 module',
  },
  getting_started: {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Complete 3 modules',
    icon: '🚀',
    rarity: 'common',
    category: 'completion',
    requirement: 'Complete 3 modules',
  },
  halfway_hero: {
    id: 'halfway_hero',
    name: 'Halfway Hero',
    description: 'Complete 5 modules',
    icon: '⭐',
    rarity: 'uncommon',
    category: 'completion',
    requirement: 'Complete 5 modules',
  },
  deep_learner: {
    id: 'deep_learner',
    name: 'Deep Learner',
    description: 'Complete 8 modules',
    icon: '🧠',
    rarity: 'rare',
    category: 'completion',
    requirement: 'Complete 8 modules',
  },
  completionist: {
    id: 'completionist',
    name: 'Completionist',
    description: 'Complete all 11 modules',
    icon: '🏆',
    rarity: 'epic',
    category: 'completion',
    requirement: 'Complete all modules',
  },

  // Mastery badges
  linguist: {
    id: 'linguist',
    name: 'Linguist',
    description: 'Complete the Character-Level Modeling module',
    icon: '📚',
    rarity: 'uncommon',
    category: 'mastery',
    requirement: 'Complete Module 4',
  },
  interpreter: {
    id: 'interpreter',
    name: 'Interpreter',
    description: 'Complete the RNN Architecture module',
    icon: '🔄',
    rarity: 'uncommon',
    category: 'mastery',
    requirement: 'Complete Module 2',
  },
  memory_master: {
    id: 'memory_master',
    name: 'Memory Master',
    description: 'Complete the Vanishing Gradients & LSTMs module',
    icon: '🧬',
    rarity: 'rare',
    category: 'mastery',
    requirement: 'Complete Module 3',
  },
  attention_seeker: {
    id: 'attention_seeker',
    name: 'Attention Seeker',
    description: 'Complete the Attention Mechanisms module',
    icon: '👁️',
    rarity: 'rare',
    category: 'mastery',
    requirement: 'Complete Module 7',
  },
  creative_writer: {
    id: 'creative_writer',
    name: 'Creative Writer',
    description: 'Complete the Experiments module exploring text generation',
    icon: '✍️',
    rarity: 'uncommon',
    category: 'mastery',
    requirement: 'Complete Module 5',
  },
  optimization_guru: {
    id: 'optimization_guru',
    name: 'Optimization Guru',
    description: 'Complete the Implementation Deep Dive module',
    icon: '⚡',
    rarity: 'epic',
    category: 'mastery',
    requirement: 'Complete Module 9',
  },
  capstone_champion: {
    id: 'capstone_champion',
    name: 'Capstone Champion',
    description: 'Complete the Capstone Project',
    icon: '👑',
    rarity: 'legendary',
    category: 'mastery',
    requirement: 'Complete Module 10',
  },

  // Exercise mastery badges
  perfect_ten: {
    id: 'perfect_ten',
    name: 'Perfect Ten',
    description: 'Complete 10 exercises without using any hints',
    icon: '💯',
    rarity: 'rare',
    category: 'mastery',
    requirement: 'Complete 10 exercises with 0 hints',
  },
  first_try_master: {
    id: 'first_try_master',
    name: 'First Try Master',
    description: 'Complete 5 exercises on the first attempt',
    icon: '🎯',
    rarity: 'uncommon',
    category: 'mastery',
    requirement: 'Complete 5 exercises on first attempt',
  },
  exercise_enthusiast: {
    id: 'exercise_enthusiast',
    name: 'Exercise Enthusiast',
    description: 'Complete 25 exercises',
    icon: '💪',
    rarity: 'uncommon',
    category: 'mastery',
    requirement: 'Complete 25 exercises',
  },
  exercise_champion: {
    id: 'exercise_champion',
    name: 'Exercise Champion',
    description: 'Complete 50 exercises',
    icon: '🥇',
    rarity: 'rare',
    category: 'mastery',
    requirement: 'Complete 50 exercises',
  },

  // Streak badges
  three_day_streak: {
    id: 'three_day_streak',
    name: 'Three Day Streak',
    description: 'Learn for 3 consecutive days',
    icon: '🔥',
    rarity: 'common',
    category: 'streak',
    requirement: '3-day learning streak',
  },
  week_warrior: {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Learn for 7 consecutive days',
    icon: '📅',
    rarity: 'uncommon',
    category: 'streak',
    requirement: '7-day learning streak',
  },
  two_week_titan: {
    id: 'two_week_titan',
    name: 'Two Week Titan',
    description: 'Learn for 14 consecutive days',
    icon: '🗓️',
    rarity: 'rare',
    category: 'streak',
    requirement: '14-day learning streak',
  },
  monthly_master: {
    id: 'monthly_master',
    name: 'Monthly Master',
    description: 'Learn for 30 consecutive days',
    icon: '🌟',
    rarity: 'epic',
    category: 'streak',
    requirement: '30-day learning streak',
  },

  // Speed badges
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a module in under 10 minutes',
    icon: '⚡',
    rarity: 'uncommon',
    category: 'speed',
    requirement: 'Complete module in < 10 min',
  },
  marathon_runner: {
    id: 'marathon_runner',
    name: 'Marathon Runner',
    description: 'Study for more than 2 hours in a single session',
    icon: '🏃',
    rarity: 'uncommon',
    category: 'speed',
    requirement: '2+ hour session',
  },

  // Path completion badges
  conceptual_thinker: {
    id: 'conceptual_thinker',
    name: 'Conceptual Thinker',
    description: 'Complete the Conceptual learning path',
    icon: '💭',
    rarity: 'rare',
    category: 'completion',
    requirement: 'Complete Conceptual path',
  },
  full_practitioner: {
    id: 'full_practitioner',
    name: 'Full Practitioner',
    description: 'Complete the Full Practitioner learning path',
    icon: '🎓',
    rarity: 'legendary',
    category: 'completion',
    requirement: 'Complete Practitioner path',
  },
  quick_learner: {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Complete the Quick Wins learning path',
    icon: '⚡',
    rarity: 'rare',
    category: 'completion',
    requirement: 'Complete Quick Wins path',
  },
  interview_ready: {
    id: 'interview_ready',
    name: 'Interview Ready',
    description: 'Complete the Interview Prep learning path',
    icon: '💼',
    rarity: 'rare',
    category: 'completion',
    requirement: 'Complete Interview Prep path',
  },

  // Special badges
  early_adopter: {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'One of the first users of the platform',
    icon: '🌱',
    rarity: 'uncommon',
    category: 'special',
    requirement: 'Be an early user',
  },
  night_owl: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a module between midnight and 5am',
    icon: '🦉',
    rarity: 'uncommon',
    category: 'special',
    requirement: 'Learn late at night',
  },
  early_bird: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a module between 5am and 7am',
    icon: '🐦',
    rarity: 'uncommon',
    category: 'special',
    requirement: 'Learn early morning',
  },
  point_collector: {
    id: 'point_collector',
    name: 'Point Collector',
    description: 'Earn 1000 total points',
    icon: '💰',
    rarity: 'uncommon',
    category: 'special',
    requirement: 'Earn 1000 points',
  },
  point_hoarder: {
    id: 'point_hoarder',
    name: 'Point Hoarder',
    description: 'Earn 5000 total points',
    icon: '💎',
    rarity: 'epic',
    category: 'special',
    requirement: 'Earn 5000 points',
  },
}

// Path to badge mapping
export const PATH_BADGES: Record<string, string> = {
  conceptual: 'conceptual_thinker',
  practitioner: 'full_practitioner',
  quickWins: 'quick_learner',
  interviewPrep: 'interview_ready',
}

// Module to badge mapping
export const MODULE_BADGES: Record<number, string> = {
  2: 'interpreter',
  3: 'memory_master',
  4: 'linguist',
  5: 'creative_writer',
  7: 'attention_seeker',
  9: 'optimization_guru',
  10: 'capstone_champion',
}

// Streak thresholds
export const STREAK_THRESHOLDS = [
  { days: 3, badge: 'three_day_streak' },
  { days: 7, badge: 'week_warrior' },
  { days: 14, badge: 'two_week_titan' },
  { days: 30, badge: 'monthly_master' },
]

// Module completion thresholds
export const COMPLETION_THRESHOLDS = [
  { count: 1, badge: 'first_blood' },
  { count: 3, badge: 'getting_started' },
  { count: 5, badge: 'halfway_hero' },
  { count: 8, badge: 'deep_learner' },
  { count: 11, badge: 'completionist' },
]

// Exercise completion thresholds
export const EXERCISE_THRESHOLDS = [
  { count: 25, badge: 'exercise_enthusiast' },
  { count: 50, badge: 'exercise_champion' },
]

// Perfect exercise thresholds
export const PERFECT_EXERCISE_THRESHOLDS = [
  { count: 10, badge: 'perfect_ten' },
]

// First try thresholds
export const FIRST_TRY_THRESHOLDS = [
  { count: 5, badge: 'first_try_master' },
]

// Points thresholds
export const POINTS_THRESHOLDS = [
  { points: 1000, badge: 'point_collector' },
  { points: 5000, badge: 'point_hoarder' },
]

// Utility to check if within time range
export function isWithinTimeRange(hour: number, start: number, end: number): boolean {
  if (start < end) {
    return hour >= start && hour < end
  }
  // Handle overnight ranges (e.g., 22-5)
  return hour >= start || hour < end
}

// Calculate points for module completion
export function calculateModulePoints(moduleId: number): number {
  const difficulty = MODULE_DIFFICULTY[moduleId] || 1
  return POINTS.MODULE_COMPLETE + POINTS.MODULE_COMPLETE_BONUS_PER_DIFFICULTY * difficulty
}

// Calculate points for exercise completion
export function calculateExercisePoints(
  hintsUsed: number,
  attempts: number
): number {
  let points = POINTS.EXERCISE_COMPLETE

  if (hintsUsed === 0) {
    points += POINTS.EXERCISE_PERFECT
  }

  if (attempts === 1) {
    points += POINTS.EXERCISE_FIRST_TRY
  }

  return points
}
