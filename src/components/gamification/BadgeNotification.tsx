'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useGamification } from '@/hooks/useGamification'
import { BADGES, RARITY_COLORS } from '@/lib/gamification'

export function BadgeNotificationContainer() {
  const { getUnseenNotifications, markNotificationSeen } = useGamification()
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([])

  const unseenNotifications = getUnseenNotifications()

  useEffect(() => {
    // Show new notifications one at a time
    for (const notification of unseenNotifications) {
      if (!visibleNotifications.includes(notification.id)) {
        setVisibleNotifications((prev) => [...prev, notification.id])

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setVisibleNotifications((prev) =>
            prev.filter((id) => id !== notification.id)
          )
          markNotificationSeen(notification.id)
        }, 5000)
      }
    }
  }, [unseenNotifications, visibleNotifications, markNotificationSeen])

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {unseenNotifications
        .filter((n) => visibleNotifications.includes(n.id))
        .map((notification) => {
          const badge = BADGES[notification.badgeId]
          if (!badge) return null

          return (
            <BadgeUnlockNotification
              key={notification.id}
              badge={badge}
              onDismiss={() => {
                setVisibleNotifications((prev) =>
                  prev.filter((id) => id !== notification.id)
                )
                markNotificationSeen(notification.id)
              }}
            />
          )
        })}
    </div>
  )
}

interface BadgeUnlockNotificationProps {
  badge: (typeof BADGES)[string]
  onDismiss: () => void
}

function BadgeUnlockNotification({
  badge,
  onDismiss,
}: BadgeUnlockNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 50)
  }, [])

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-xl border overflow-hidden transition-all duration-300 max-w-sm',
        badge.rarity === 'common' && 'border-slate-300',
        badge.rarity === 'uncommon' && 'border-green-400',
        badge.rarity === 'rare' && 'border-blue-400',
        badge.rarity === 'epic' && 'border-purple-400',
        badge.rarity === 'legendary' && 'border-amber-400',
        isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-full'
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'px-4 py-2 flex items-center justify-between',
          badge.rarity === 'common' && 'bg-slate-50',
          badge.rarity === 'uncommon' && 'bg-green-50',
          badge.rarity === 'rare' && 'bg-blue-50',
          badge.rarity === 'epic' && 'bg-purple-50',
          badge.rarity === 'legendary' && 'bg-amber-50'
        )}
      >
        <span className="text-sm font-medium text-slate-700">
          Badge Unlocked!
        </span>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex items-center gap-4">
        {/* Badge Icon */}
        <div
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-2',
            badge.rarity === 'common' && 'bg-slate-50 border-slate-300',
            badge.rarity === 'uncommon' && 'bg-green-50 border-green-400',
            badge.rarity === 'rare' && 'bg-blue-50 border-blue-400',
            badge.rarity === 'epic' && 'bg-purple-50 border-purple-400',
            badge.rarity === 'legendary' && 'bg-amber-50 border-amber-400'
          )}
        >
          <span className="text-3xl animate-bounce">{badge.icon}</span>
        </div>

        {/* Badge Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 truncate">{badge.name}</h4>
          <p className="text-sm text-slate-600 line-clamp-2">
            {badge.description}
          </p>
          <span
            className={cn(
              'inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium',
              RARITY_COLORS[badge.rarity]
            )}
          >
            {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
          </span>
        </div>
      </div>
    </div>
  )
}

// Full-screen celebration modal for major achievements
export function BadgeUnlockCelebration({
  badge,
  onClose,
}: {
  badge: (typeof BADGES)[string]
  onClose: () => void
}) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    // Animate in stages
    const timers = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), 300),
      setTimeout(() => setStage(3), 600),
    ]

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300',
        stage >= 1 ? 'bg-black/60' : 'bg-black/0'
      )}
      onClick={onClose}
    >
      {/* Confetti effect placeholder */}
      {stage >= 3 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#fbbf24', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          'bg-white rounded-2xl max-w-md w-full p-8 text-center space-y-6 transition-all duration-500',
          stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Badge Icon */}
        <div
          className={cn(
            'w-32 h-32 mx-auto rounded-full flex items-center justify-center border-4 transition-all duration-500',
            badge.rarity === 'legendary' && 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-200',
            badge.rarity === 'epic' && 'border-purple-400 bg-purple-50',
            badge.rarity === 'rare' && 'border-blue-400 bg-blue-50',
            badge.rarity === 'uncommon' && 'border-green-400 bg-green-50',
            badge.rarity === 'common' && 'border-slate-300 bg-slate-50',
            stage >= 3 ? 'scale-100' : 'scale-0'
          )}
        >
          <span className="text-7xl">{badge.icon}</span>
        </div>

        {/* Achievement text */}
        <div>
          <p className="text-slate-500 uppercase tracking-wide text-sm font-medium">
            Achievement Unlocked
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {badge.name}
          </h2>
          <span
            className={cn(
              'inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium',
              RARITY_COLORS[badge.rarity]
            )}
          >
            {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
          </span>
        </div>

        <p className="text-slate-600">{badge.description}</p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  )
}
