'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { useGamification } from '@/hooks/useGamification'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { LeaderboardEntry } from '@/lib/types'

// Mock leaderboard data for demonstration
// In production, this would come from a backend API
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    username: 'RNNMaster',
    totalPoints: 8750,
    badgeCount: 28,
    completedModules: 11,
    streak: 45,
  },
  {
    rank: 2,
    username: 'DeepLearner42',
    totalPoints: 7200,
    badgeCount: 24,
    completedModules: 10,
    streak: 30,
  },
  {
    rank: 3,
    username: 'NeuralNinja',
    totalPoints: 6500,
    badgeCount: 22,
    completedModules: 9,
    streak: 21,
  },
  {
    rank: 4,
    username: 'AttentionSeeker',
    totalPoints: 5800,
    badgeCount: 19,
    completedModules: 8,
    streak: 14,
  },
  {
    rank: 5,
    username: 'GradientMaster',
    totalPoints: 5200,
    badgeCount: 17,
    completedModules: 8,
    streak: 10,
  },
  {
    rank: 6,
    username: 'SequencePro',
    totalPoints: 4600,
    badgeCount: 15,
    completedModules: 7,
    streak: 7,
  },
  {
    rank: 7,
    username: 'MLEnthusiast',
    totalPoints: 4100,
    badgeCount: 13,
    completedModules: 6,
    streak: 5,
  },
  {
    rank: 8,
    username: 'CodeLearner',
    totalPoints: 3500,
    badgeCount: 11,
    completedModules: 5,
    streak: 3,
  },
  {
    rank: 9,
    username: 'AIStudent',
    totalPoints: 2900,
    badgeCount: 9,
    completedModules: 4,
    streak: 2,
  },
  {
    rank: 10,
    username: 'NewbieCoder',
    totalPoints: 2300,
    badgeCount: 7,
    completedModules: 3,
    streak: 1,
  },
]

type SortKey = 'rank' | 'points' | 'badges' | 'modules' | 'streak'

interface LeaderboardProps {
  className?: string
}

export function Leaderboard({ className }: LeaderboardProps) {
  const gamification = useGamification()
  const [sortBy, setSortBy] = useState<SortKey>('points')
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week'>('all')

  // Merge current user into leaderboard
  const leaderboardWithUser = useMemo(() => {
    const currentUser: LeaderboardEntry = {
      rank: 0, // Will be calculated
      username: gamification.username || 'You',
      totalPoints: gamification.stats.totalPoints,
      badgeCount: gamification.getTotalBadgeCount(),
      completedModules: gamification.stats.modulesCompletedCount,
      streak: gamification.stats.currentStreak,
    }

    // Combine and sort
    const combined = [...MOCK_LEADERBOARD, currentUser]

    // Sort by selected key
    const sortKeyMap: Record<SortKey, keyof LeaderboardEntry> = {
      rank: 'totalPoints',
      points: 'totalPoints',
      badges: 'badgeCount',
      modules: 'completedModules',
      streak: 'streak',
    }

    combined.sort(
      (a, b) =>
        (b[sortKeyMap[sortBy]] as number) - (a[sortKeyMap[sortBy]] as number)
    )

    // Assign ranks
    return combined.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      isCurrentUser: entry.username === currentUser.username,
    }))
  }, [gamification, sortBy])

  // Find current user's rank
  const currentUserEntry = leaderboardWithUser.find((e) => e.isCurrentUser)
  const currentUserRank = currentUserEntry?.rank || 0

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            Leaderboard
          </CardTitle>

          <div className="flex gap-2">
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e) =>
                setTimeRange(e.target.value as 'all' | 'month' | 'week')
              }
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="points">Points</option>
              <option value="badges">Badges</option>
              <option value="modules">Modules</option>
              <option value="streak">Streak</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Current User Highlight */}
        {currentUserRank > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {currentUserRank <= 3 ? (
                    <span className="text-lg">
                      {currentUserRank === 1
                        ? '🥇'
                        : currentUserRank === 2
                          ? '🥈'
                          : '🥉'}
                    </span>
                  ) : (
                    currentUserRank
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Your Ranking</p>
                  <p className="text-sm text-slate-500">
                    {currentUserRank === 1
                      ? "You're at the top!"
                      : `${currentUserRank - 1} ${currentUserRank === 2 ? 'person' : 'people'} ahead of you`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">
                  {gamification.stats.totalPoints.toLocaleString()} pts
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-500">
                  Rank
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-500">
                  User
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-slate-500">
                  <button
                    onClick={() => setSortBy('points')}
                    className={cn(
                      'hover:text-blue-600 transition-colors',
                      sortBy === 'points' && 'text-blue-600'
                    )}
                  >
                    Points
                  </button>
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-slate-500 hidden sm:table-cell">
                  <button
                    onClick={() => setSortBy('badges')}
                    className={cn(
                      'hover:text-blue-600 transition-colors',
                      sortBy === 'badges' && 'text-blue-600'
                    )}
                  >
                    Badges
                  </button>
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-slate-500 hidden md:table-cell">
                  <button
                    onClick={() => setSortBy('modules')}
                    className={cn(
                      'hover:text-blue-600 transition-colors',
                      sortBy === 'modules' && 'text-blue-600'
                    )}
                  >
                    Modules
                  </button>
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-slate-500 hidden lg:table-cell">
                  <button
                    onClick={() => setSortBy('streak')}
                    className={cn(
                      'hover:text-blue-600 transition-colors',
                      sortBy === 'streak' && 'text-blue-600'
                    )}
                  >
                    Streak
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardWithUser.slice(0, 10).map((entry) => (
                <tr
                  key={entry.username}
                  className={cn(
                    'border-b border-slate-100 transition-colors',
                    entry.isCurrentUser
                      ? 'bg-blue-50 hover:bg-blue-100'
                      : 'hover:bg-slate-50'
                  )}
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center">
                      {entry.rank <= 3 ? (
                        <span className="text-lg">
                          {entry.rank === 1
                            ? '🥇'
                            : entry.rank === 2
                              ? '🥈'
                              : '🥉'}
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium w-6 text-center">
                          {entry.rank}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                          entry.isCurrentUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        )}
                      >
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <span
                        className={cn(
                          'font-medium',
                          entry.isCurrentUser
                            ? 'text-blue-600'
                            : 'text-slate-900'
                        )}
                      >
                        {entry.isCurrentUser
                          ? `${entry.username} (You)`
                          : entry.username}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right font-medium text-slate-900">
                    {entry.totalPoints.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right text-slate-600 hidden sm:table-cell">
                    {entry.badgeCount}
                  </td>
                  <td className="py-3 px-2 text-right text-slate-600 hidden md:table-cell">
                    {entry.completedModules}
                  </td>
                  <td className="py-3 px-2 text-right hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1 text-orange-500">
                      🔥 {entry.streak}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note about leaderboard */}
        <p className="text-xs text-slate-400 text-center mt-4">
          Leaderboard data is stored locally. Connect an account to sync across
          devices and compete globally.
        </p>
      </CardContent>
    </Card>
  )
}

// Compact leaderboard widget for dashboard
export function LeaderboardWidget({ className }: { className?: string }) {
  const gamification = useGamification()

  // Get top 3 and current user position
  const currentUserPoints = gamification.stats.totalPoints
  let userRank = 1

  for (const entry of MOCK_LEADERBOARD) {
    if (entry.totalPoints > currentUserPoints) {
      userRank++
    }
  }

  const top3 = MOCK_LEADERBOARD.slice(0, 3)

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span>🏆</span> Top Learners
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {top3.map((entry, index) => (
          <div
            key={entry.username}
            className="flex items-center justify-between py-1"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </span>
              <span className="text-sm text-slate-700 truncate max-w-[120px]">
                {entry.username}
              </span>
            </div>
            <span className="text-sm font-medium text-slate-900">
              {entry.totalPoints.toLocaleString()}
            </span>
          </div>
        ))}

        <div className="border-t border-slate-100 pt-2 mt-2">
          <div className="flex items-center justify-between text-blue-600">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">#{userRank}</span>
              <span className="text-sm truncate">You</span>
            </div>
            <span className="text-sm font-medium">
              {currentUserPoints.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
