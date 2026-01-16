'use client'

import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'
import { MODULES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { getStatus, pathModules, currentPath } = useProgress()

  const displayModules = currentPath ? pathModules : MODULES

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {currentPath ? currentPath.name : 'All Modules'}
        </h2>
        <nav className="space-y-1">
          {displayModules.map((module) => {
            const status = getStatus(module.id)
            return (
              <Link
                key={module.id}
                href={`/modules/${module.id}`}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm transition-colors',
                  {
                    'bg-primary-50 text-primary-700': status === 'in_progress',
                    'text-slate-600 hover:bg-slate-100':
                      status === 'available' || status === 'completed',
                    'cursor-not-allowed text-slate-400': status === 'locked',
                  }
                )}
                onClick={(e) => status === 'locked' && e.preventDefault()}
              >
                <span
                  className={cn('mr-3 flex h-6 w-6 items-center justify-center rounded-full text-xs', {
                    'bg-primary-100 text-primary-700': status === 'in_progress',
                    'bg-green-100 text-green-700': status === 'completed',
                    'bg-slate-100 text-slate-500':
                      status === 'available' || status === 'locked',
                  })}
                >
                  {status === 'completed' ? (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : status === 'locked' ? (
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    module.id
                  )}
                </span>
                <span className="flex-1 truncate">{module.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
