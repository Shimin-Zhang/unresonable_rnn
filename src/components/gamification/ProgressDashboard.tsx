'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useGamification } from '@/hooks/useGamification'
import { useProgress } from '@/hooks/useProgress'
import { BadgeCard } from './BadgeCard'
import { BadgeGrid } from './BadgeGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MODULES, LEARNING_PATHS } from '@/lib/constants'

type TabId = 'overview' | 'badges' | 'modules' | 'stats'

export function ProgressDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex gap-4">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'badges', label: 'Badges' },
            { id: 'modules', label: 'Modules' },
            { id: 'stats', label: 'Statistics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={cn(
                'px-4 py-3 font-medium text-sm border-b-2 transition-colors -mb-px',
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'badges' && <BadgesTab />}
      {activeTab === 'modules' && <ModulesTab />}
      {activeTab === 'stats' && <StatsTab />}
    </div>
  )
}

function OverviewTab() {
  const gamification = useGamification()
  const progress = useProgress()
  const { getLevel, getLevelProgress, getStatsSummary, getRecentBadges, badges } =
    gamification

  const level = getLevel()
  const levelProgress = getLevelProgress()
  const stats = getStatsSummary()
  const recentBadges = getRecentBadges(4)

  return (
    <div className="space-y-6">
      {/* Level & Points Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {level.level}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {gamification.username || 'Anonymous Learner'}
                </h2>
                <p className="text-slate-500">
                  Level {level.level} - {level.title}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                {stats.points.toLocaleString()}
              </p>
              <p className="text-slate-500 text-sm">Total Points</p>
            </div>
          </div>

          {/* Level Progress */}
          {level.nextLevel && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Progress to Level {level.level + 1}</span>
                <span>{levelProgress}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {level.nextLevel - stats.points} points to next level
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon="🔥"
          label="Current Streak"
          value={`${stats.streak} days`}
          subtext={`Best: ${stats.longestStreak} days`}
        />
        <StatCard
          icon="📚"
          label="Modules"
          value={`${stats.modulesCompleted} / ${MODULES.length}`}
          subtext={`${Math.round((stats.modulesCompleted / MODULES.length) * 100)}% complete`}
        />
        <StatCard
          icon="🏆"
          label="Badges"
          value={`${stats.badgesUnlocked} / ${stats.totalBadges}`}
          subtext={`${Math.round((stats.badgesUnlocked / stats.totalBadges) * 100)}% unlocked`}
        />
        <StatCard
          icon="⏱️"
          label="Time Spent"
          value={stats.timeSpent}
          subtext="Total learning time"
        />
      </div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Recent Achievements</span>
              <span className="text-sm font-normal text-slate-500">
                ({stats.badgesUnlocked} total)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              {recentBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} size="md" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Path Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Path Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(LEARNING_PATHS).map(([pathId, path]) => {
            const pathModules = path.modules as readonly number[]
            const completed = pathModules.filter((id) =>
              progress.completedModules.includes(id)
            ).length
            const percentage = Math.round((completed / pathModules.length) * 100)

            return (
              <div key={pathId}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{path.name}</span>
                  <span className="text-slate-500">
                    {completed}/{pathModules.length} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-500',
                      percentage === 100
                        ? 'bg-green-500'
                        : percentage > 50
                          ? 'bg-blue-500'
                          : 'bg-slate-400'
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

function BadgesTab() {
  const { badges } = useGamification()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievement Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <BadgeGrid badges={badges} showLocked />
      </CardContent>
    </Card>
  )
}

function ModulesTab() {
  const progress = useProgress()
  const gamification = useGamification()
  const { moduleStats } = gamification

  return (
    <div className="space-y-4">
      {MODULES.map((module) => {
        const stats = moduleStats[module.id]
        const isCompleted = progress.completedModules.includes(module.id)

        return (
          <Card
            key={module.id}
            className={cn(
              'transition-all',
              isCompleted && 'border-green-200 bg-green-50/30'
            )}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                      isCompleted
                        ? 'bg-green-100 text-green-600'
                        : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {isCompleted ? '✓' : module.id}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {module.title}
                    </h3>
                    <p className="text-sm text-slate-500">{module.subtitle}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {module.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm">
                  {stats ? (
                    <>
                      <p className="font-medium text-blue-600">
                        {stats.pointsEarned} pts
                      </p>
                      {stats.completedAt && (
                        <p className="text-slate-400">
                          {new Date(stats.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-400">{module.duration}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function StatsTab() {
  const gamification = useGamification()
  const progress = useProgress()
  const { stats, moduleStats } = gamification

  // Calculate additional stats
  const totalExercisePoints = Object.values(moduleStats).reduce(
    (sum, mod) =>
      sum +
      Object.values(mod.exerciseResults).reduce(
        (eSum, ex) => eSum + ex.pointsEarned,
        0
      ),
    0
  )

  const avgTimePerModule =
    Object.values(moduleStats).length > 0
      ? Math.round(
          Object.values(moduleStats).reduce((sum, mod) => sum + mod.timeSpent, 0) /
            Object.values(moduleStats).length
        )
      : 0

  return (
    <div className="space-y-6">
      {/* Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-500">Exercises Completed</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.exercisesCompletedCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Perfect Exercises</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.perfectExercises}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg. Attempts</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.averageAttemptsPerExercise.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Exercise Points</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalExercisePoints}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg. Time/Module</p>
              <p className="text-2xl font-bold text-slate-900">
                {gamification.formatTimeSpent(avgTimePerModule)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Time</p>
              <p className="text-2xl font-bold text-slate-900">
                {gamification.formatTimeSpent(stats.totalTimeSpent)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak History */}
      <Card>
        <CardHeader>
          <CardTitle>Streak Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500">
                {stats.currentStreak}
              </p>
              <p className="text-sm text-slate-500 mt-1">Current Streak</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-500">
                {stats.longestStreak}
              </p>
              <p className="text-sm text-slate-500 mt-1">Longest Streak</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-slate-900">
                {stats.lastActiveDate
                  ? new Date(stats.lastActiveDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : '-'}
              </p>
              <p className="text-sm text-slate-500 mt-1">Last Active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Points Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                label: 'Module Completions',
                value:
                  stats.totalPoints -
                  totalExercisePoints -
                  stats.currentStreak * 10,
                color: 'bg-blue-500',
              },
              {
                label: 'Exercise Completions',
                value: totalExercisePoints,
                color: 'bg-green-500',
              },
              {
                label: 'Streak Bonuses',
                value: stats.currentStreak * 10,
                color: 'bg-orange-500',
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">
                    {item.value} pts
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(item.color, 'h-full transition-all')}
                    style={{
                      width: `${Math.min(
                        100,
                        (item.value / stats.totalPoints) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: string
  label: string
  value: string
  subtext: string
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400">{subtext}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
