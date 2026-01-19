import { useGamificationStore } from '@/stores/gamificationStore'
import { BADGES, RARITY_COLORS, MODULE_DIFFICULTY, POINTS } from '@/lib/gamification'
import type { Badge, BadgeRarity, UnlockedBadge } from '@/lib/types'

export function useGamification() {
  const store = useGamificationStore()

  // Get all available badges
  const allBadges = Object.values(BADGES)

  // Get unlocked badges as array
  const unlockedBadges = Object.values(store.badges)

  // Get locked badges
  const lockedBadges = allBadges.filter((badge) => !store.badges[badge.id])

  // Get badge progress percentage
  const badgeProgress = Math.round((unlockedBadges.length / allBadges.length) * 100)

  // Get badges by category
  const getBadgesByCategory = (category: Badge['category']) => {
    return allBadges.filter((badge) => badge.category === category)
  }

  // Get badges by rarity
  const getBadgesByRarity = (rarity: BadgeRarity) => {
    return allBadges.filter((badge) => badge.rarity === rarity)
  }

  // Get unlocked badges by category
  const getUnlockedByCategory = (category: Badge['category']) => {
    return unlockedBadges.filter((badge) => badge.category === category)
  }

  // Get rarity color classes
  const getRarityColor = (rarity: BadgeRarity) => {
    return RARITY_COLORS[rarity]
  }

  // Get level based on total points
  const getLevel = () => {
    const points = store.stats.totalPoints
    if (points >= 10000) return { level: 10, title: 'Grandmaster', nextLevel: null }
    if (points >= 7500) return { level: 9, title: 'Master', nextLevel: 10000 }
    if (points >= 5000) return { level: 8, title: 'Expert', nextLevel: 7500 }
    if (points >= 3500) return { level: 7, title: 'Advanced', nextLevel: 5000 }
    if (points >= 2500) return { level: 6, title: 'Proficient', nextLevel: 3500 }
    if (points >= 1500) return { level: 5, title: 'Intermediate', nextLevel: 2500 }
    if (points >= 1000) return { level: 4, title: 'Developing', nextLevel: 1500 }
    if (points >= 500) return { level: 3, title: 'Apprentice', nextLevel: 1000 }
    if (points >= 200) return { level: 2, title: 'Beginner', nextLevel: 500 }
    return { level: 1, title: 'Novice', nextLevel: 200 }
  }

  // Get level progress percentage
  const getLevelProgress = () => {
    const { level, nextLevel } = getLevel()
    if (!nextLevel) return 100

    const levelThresholds = [0, 200, 500, 1000, 1500, 2500, 3500, 5000, 7500, 10000]
    const currentThreshold = levelThresholds[level - 1]
    const points = store.stats.totalPoints

    return Math.round(((points - currentThreshold) / (nextLevel - currentThreshold)) * 100)
  }

  // Format time spent
  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${mins}m`
  }

  // Get recent badges (last 5 unlocked)
  const getRecentBadges = (count = 5) => {
    return [...unlockedBadges]
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
      .slice(0, count)
  }

  // Check if a badge is unlocked
  const isBadgeUnlocked = (badgeId: string) => {
    return !!store.badges[badgeId]
  }

  // Get badge by ID (returns full badge definition with unlock status)
  const getBadgeById = (badgeId: string): (Badge & { unlocked: boolean; unlockedAt?: string }) | null => {
    const badge = BADGES[badgeId]
    if (!badge) return null

    const unlockedBadge = store.badges[badgeId]
    return {
      ...badge,
      unlocked: !!unlockedBadge,
      unlockedAt: unlockedBadge?.unlockedAt,
    }
  }

  // Get stats summary
  const getStatsSummary = () => {
    const { stats } = store
    return {
      points: stats.totalPoints,
      streak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      modulesCompleted: stats.modulesCompletedCount,
      exercisesCompleted: stats.exercisesCompletedCount,
      perfectExercises: stats.perfectExercises,
      timeSpent: formatTimeSpent(stats.totalTimeSpent),
      badgesUnlocked: unlockedBadges.length,
      totalBadges: allBadges.length,
    }
  }

  return {
    ...store,
    allBadges,
    unlockedBadges,
    lockedBadges,
    badgeProgress,
    getBadgesByCategory,
    getBadgesByRarity,
    getUnlockedByCategory,
    getRarityColor,
    getLevel,
    getLevelProgress,
    formatTimeSpent,
    getRecentBadges,
    isBadgeUnlocked,
    getBadgeById,
    getStatsSummary,
    MODULE_DIFFICULTY,
    POINTS,
  }
}
