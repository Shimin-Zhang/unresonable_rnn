'use client'

import { useState } from 'react'
import { BadgeCard } from './BadgeCard'
import { cn } from '@/lib/utils'
import type { Badge, UnlockedBadge } from '@/lib/types'
import { BADGES, RARITY_COLORS } from '@/lib/gamification'

interface BadgeGridProps {
  badges: Record<string, UnlockedBadge>
  showLocked?: boolean
  category?: Badge['category'] | 'all'
  className?: string
}

const categories = [
  { id: 'all', label: 'All Badges' },
  { id: 'completion', label: 'Completion' },
  { id: 'mastery', label: 'Mastery' },
  { id: 'streak', label: 'Streaks' },
  { id: 'speed', label: 'Speed' },
  { id: 'special', label: 'Special' },
] as const

export function BadgeGrid({
  badges,
  showLocked = true,
  category: initialCategory = 'all',
  className,
}: BadgeGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [selectedBadge, setSelectedBadge] = useState<Badge | UnlockedBadge | null>(null)

  const allBadges = Object.values(BADGES)
  const filteredBadges =
    selectedCategory === 'all'
      ? allBadges
      : allBadges.filter((b) => b.category === selectedCategory)

  const unlockedCount = filteredBadges.filter((b) => badges[b.id]).length
  const totalCount = filteredBadges.length

  return (
    <div className={cn('space-y-4', className)}>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const catBadges =
            cat.id === 'all'
              ? allBadges
              : allBadges.filter((b) => b.category === cat.id)
          const catUnlocked = catBadges.filter((b) => badges[b.id]).length

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {cat.label}
              <span className="ml-1.5 text-xs opacity-75">
                {catUnlocked}/{catBadges.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Progress</span>
          <span>
            {unlockedCount} / {totalCount} badges
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {filteredBadges
          .filter((badge) => showLocked || badges[badge.id])
          .sort((a, b) => {
            // Sort by unlocked status first, then by rarity
            const aUnlocked = !!badges[a.id]
            const bUnlocked = !!badges[b.id]
            if (aUnlocked !== bUnlocked) return bUnlocked ? 1 : -1

            const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common']
            return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
          })
          .map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badges[badge.id] || badge}
              unlocked={!!badges[badge.id]}
              size="md"
              onClick={() => setSelectedBadge(badges[badge.id] || badge)}
            />
          ))}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <BadgeDetailModal
          badge={selectedBadge}
          unlocked={'unlockedAt' in selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  )
}

function BadgeDetailModal({
  badge,
  unlocked,
  onClose,
}: {
  badge: Badge | UnlockedBadge
  unlocked: boolean
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-sm w-full p-6 text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            'w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center',
            unlocked
              ? cn(
                  'bg-white',
                  badge.rarity === 'common' && 'border-slate-300',
                  badge.rarity === 'uncommon' && 'border-green-400',
                  badge.rarity === 'rare' && 'border-blue-400',
                  badge.rarity === 'epic' && 'border-purple-400',
                  badge.rarity === 'legendary' && 'border-amber-400 shadow-lg shadow-amber-200'
                )
              : 'bg-slate-100 border-slate-200 grayscale'
          )}
        >
          <span className={cn('text-5xl', !unlocked && 'grayscale')}>
            {badge.icon}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900">{badge.name}</h3>
          <span
            className={cn(
              'inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium',
              RARITY_COLORS[badge.rarity]
            )}
          >
            {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
          </span>
        </div>

        <p className="text-slate-600">{badge.description}</p>

        {unlocked && 'unlockedAt' in badge ? (
          <p className="text-sm text-green-600 font-medium">
            Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
          </p>
        ) : (
          <p className="text-sm text-slate-400">
            <span className="text-slate-500 font-medium">Requirement:</span>{' '}
            {badge.requirement}
          </p>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
