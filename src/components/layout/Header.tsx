'use client'

import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'
import { useGamification } from '@/hooks/useGamification'
import { APP_NAME } from '@/lib/constants'

export function Header() {
  const { progress, currentPath } = useProgress()
  const gamification = useGamification()
  const { stats } = gamification

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <svg
            className="h-8 w-8 text-primary-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="font-semibold text-slate-900">RNN Learning</span>
        </Link>

        <nav className="flex items-center space-x-4 sm:space-x-6">
          {currentPath && (
            <div className="hidden sm:flex items-center space-x-3">
              <span className="text-sm text-slate-600">{currentPath.name}</span>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700">{progress}%</span>
            </div>
          )}

          {/* Gamification Quick Stats */}
          <div className="flex items-center gap-3">
            {stats.currentStreak > 0 && (
              <span className="hidden sm:flex items-center gap-1 text-sm text-orange-500 font-medium">
                <span>🔥</span>
                <span>{stats.currentStreak}</span>
              </span>
            )}
            <Link
              href="/progress"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 text-sm font-medium transition-colors"
            >
              <span>{stats.totalPoints.toLocaleString()}</span>
              <span className="text-blue-500">pts</span>
            </Link>
          </div>

          <Link
            href="/modules"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Modules
          </Link>
        </nav>
      </div>
    </header>
  )
}
