'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ProgressDashboard } from '@/components/gamification/ProgressDashboard'
import { Leaderboard } from '@/components/gamification/Leaderboard'
import { CertificateList, CertificateGenerator } from '@/components/gamification/Certificate'
import { BadgeNotificationContainer } from '@/components/gamification/BadgeNotification'
import { useGamification } from '@/hooks/useGamification'
import { useProgress } from '@/hooks/useProgress'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LEARNING_PATHS } from '@/lib/constants'

type View = 'dashboard' | 'leaderboard' | 'certificates'

export default function ProgressPage() {
  const [activeView, setActiveView] = useState<View>('dashboard')
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const gamification = useGamification()
  const progress = useProgress()

  const views = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'certificates', label: 'Certificates', icon: '📜' },
  ] as const

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-600 hover:text-slate-900">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-slate-900">
                Your Progress
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* User Info */}
              <button
                onClick={() => setShowUsernameModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                  {(gamification.username || 'A').charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-700 hidden sm:inline">
                  {gamification.username || 'Set Username'}
                </span>
              </button>

              {/* Points Display */}
              <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                {gamification.stats.totalPoints.toLocaleString()} pts
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as View)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
                  activeView === view.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                )}
              >
                <span>{view.icon}</span>
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && <ProgressDashboard />}

        {activeView === 'leaderboard' && (
          <div className="space-y-6">
            <Leaderboard />
          </div>
        )}

        {activeView === 'certificates' && (
          <div className="space-y-6">
            <CertificateList />

            {/* Certificate Generators for each path */}
            <Card>
              <CardHeader>
                <CardTitle>Earn Certificates</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {Object.entries(LEARNING_PATHS).map(([pathId, path]) => {
                  const pathModules = path.modules as readonly number[]
                  const completed = pathModules.filter((id) =>
                    progress.completedModules.includes(id)
                  ).length
                  const isComplete = completed === pathModules.length

                  return (
                    <div
                      key={pathId}
                      className={cn(
                        'p-4 rounded-lg border',
                        isComplete
                          ? 'bg-green-50 border-green-200'
                          : 'bg-slate-50 border-slate-200'
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-slate-900">
                            {path.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {path.description}
                          </p>
                        </div>
                        {isComplete && (
                          <span className="text-green-600 text-lg">✓</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium">
                            {completed}/{pathModules.length}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full transition-all',
                              isComplete ? 'bg-green-500' : 'bg-blue-500'
                            )}
                            style={{
                              width: `${(completed / pathModules.length) * 100}%`,
                            }}
                          />
                        </div>

                        {isComplete && (
                          <CertificateGenerator
                            pathId={pathId}
                            className="mt-3"
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Badge Notification Container */}
      <BadgeNotificationContainer />

      {/* Username Modal */}
      {showUsernameModal && (
        <UsernameModal
          currentUsername={gamification.username}
          onSave={(username) => {
            gamification.setUsername(username)
            setShowUsernameModal(false)
          }}
          onClose={() => setShowUsernameModal(false)}
        />
      )}
    </div>
  )
}

function UsernameModal({
  currentUsername,
  onSave,
  onClose,
}: {
  currentUsername: string | null
  onSave: (username: string) => void
  onClose: () => void
}) {
  const [username, setUsername] = useState(currentUsername || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onSave(username.trim())
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-900 mb-4">Set Username</h2>
        <p className="text-slate-600 mb-4">
          Your username will be displayed on certificates and the leaderboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={30}
            autoFocus
          />

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!username.trim()}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
