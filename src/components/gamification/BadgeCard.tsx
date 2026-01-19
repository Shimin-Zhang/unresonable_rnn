'use client'

import { cn } from '@/lib/utils'
import type { Badge, BadgeRarity, UnlockedBadge } from '@/lib/types'
import { RARITY_COLORS } from '@/lib/gamification'

interface BadgeCardProps {
  badge: Badge | UnlockedBadge
  unlocked?: boolean
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  onClick?: () => void
  className?: string
}

const sizeClasses = {
  sm: {
    container: 'w-16 h-16',
    icon: 'text-2xl',
    padding: 'p-2',
  },
  md: {
    container: 'w-24 h-24',
    icon: 'text-4xl',
    padding: 'p-3',
  },
  lg: {
    container: 'w-32 h-32',
    icon: 'text-5xl',
    padding: 'p-4',
  },
}

const rarityBorderColors: Record<BadgeRarity, string> = {
  common: 'border-slate-300',
  uncommon: 'border-green-400',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-amber-400 shadow-amber-200',
}

const rarityGlowColors: Record<BadgeRarity, string> = {
  common: '',
  uncommon: 'shadow-green-200',
  rare: 'shadow-blue-200',
  epic: 'shadow-purple-200',
  legendary: 'shadow-amber-300 shadow-lg',
}

export function BadgeCard({
  badge,
  unlocked = false,
  size = 'md',
  showDetails = true,
  onClick,
  className,
}: BadgeCardProps) {
  const isUnlocked = unlocked || 'unlockedAt' in badge
  const classes = sizeClasses[size]

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Badge Icon Container */}
      <div
        className={cn(
          classes.container,
          classes.padding,
          'relative rounded-full border-2 flex items-center justify-center transition-all duration-200',
          isUnlocked
            ? cn(
                'bg-white',
                rarityBorderColors[badge.rarity],
                rarityGlowColors[badge.rarity],
                'hover:scale-105'
              )
            : 'bg-slate-100 border-slate-200 grayscale opacity-50'
        )}
      >
        <span
          className={cn(
            classes.icon,
            !isUnlocked && 'grayscale'
          )}
          role="img"
          aria-label={badge.name}
        >
          {badge.icon}
        </span>

        {/* Rarity indicator for unlocked badges */}
        {isUnlocked && badge.rarity !== 'common' && (
          <div
            className={cn(
              'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-white',
              badge.rarity === 'uncommon' && 'bg-green-400',
              badge.rarity === 'rare' && 'bg-blue-400',
              badge.rarity === 'epic' && 'bg-purple-400',
              badge.rarity === 'legendary' && 'bg-amber-400'
            )}
          />
        )}

        {/* Locked indicator */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-slate-400 text-lg">🔒</span>
          </div>
        )}
      </div>

      {/* Badge Details */}
      {showDetails && (
        <div className="text-center max-w-[120px]">
          <p
            className={cn(
              'font-medium text-sm truncate',
              isUnlocked ? 'text-slate-900' : 'text-slate-400'
            )}
          >
            {badge.name}
          </p>
          {size !== 'sm' && (
            <p
              className={cn(
                'text-xs mt-0.5 line-clamp-2',
                isUnlocked ? 'text-slate-500' : 'text-slate-400'
              )}
            >
              {isUnlocked ? badge.description : badge.requirement}
            </p>
          )}
          {isUnlocked && 'unlockedAt' in badge && size === 'lg' && (
            <p className="text-xs text-slate-400 mt-1">
              {new Date(badge.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Compact badge display for lists
export function BadgeCompact({
  badge,
  unlocked = false,
  className,
}: {
  badge: Badge | UnlockedBadge
  unlocked?: boolean
  className?: string
}) {
  const isUnlocked = unlocked || 'unlockedAt' in badge

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border',
        isUnlocked
          ? cn('bg-white', rarityBorderColors[badge.rarity])
          : 'bg-slate-50 border-slate-200 opacity-60',
        className
      )}
    >
      <span className={cn('text-base', !isUnlocked && 'grayscale')}>
        {badge.icon}
      </span>
      <span
        className={cn(
          'text-sm font-medium',
          isUnlocked ? 'text-slate-700' : 'text-slate-400'
        )}
      >
        {badge.name}
      </span>
      <span
        className={cn(
          'text-xs px-1.5 py-0.5 rounded',
          RARITY_COLORS[badge.rarity]
        )}
      >
        {badge.rarity}
      </span>
    </div>
  )
}
