'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { Header, Footer } from '@/components/layout'
import { MODULES, LEARNING_PATHS, type LearningPathId } from '@/lib/constants'
import { useProgressStore } from '@/stores/progressStore'
import { BadgeNotificationContainer } from '@/components/gamification'

export default function ModulesIndexPage() {
  const { currentPath, completedModules } = useProgressStore()

  // Get modules for current path, or all modules if no path selected
  const displayModules = useMemo(() => {
    if (currentPath && LEARNING_PATHS[currentPath as LearningPathId]) {
      const pathModules = LEARNING_PATHS[currentPath as LearningPathId].modules as readonly number[]
      return MODULES.filter((m) => pathModules.includes(m.id))
    }
    return MODULES
  }, [currentPath])

  const pathInfo = currentPath ? LEARNING_PATHS[currentPath as LearningPathId] : null

  // Calculate progress
  const progress = useMemo(() => {
    const completed = displayModules.filter((m) => completedModules.includes(m.id)).length
    const total = displayModules.length
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }, [displayModules, completedModules])

  // Find next incomplete module
  const nextModule = useMemo(() => {
    return displayModules.find((m) => !completedModules.includes(m.id))
  }, [displayModules, completedModules])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {pathInfo ? `${pathInfo.name} Path` : 'All Modules'}
              </h1>
              <p className="text-lg text-slate-600">
                {pathInfo
                  ? pathInfo.description
                  : 'Complete course curriculum - 11 modules covering RNNs from fundamentals to implementation'}
              </p>
            </div>
            {!currentPath && (
              <Link href="/paths">
                <Button variant="outline">Choose a Learning Path</Button>
              </Link>
            )}
          </div>

          {/* Progress bar */}
          {currentPath && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">Your progress</span>
                <span className="font-medium text-slate-900">
                  {progress.completed} of {progress.total} modules ({progress.percentage}%)
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    progress.percentage === 100 ? 'bg-green-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        {nextModule && (
          <Card className="mb-8 border-2 border-primary-200 bg-primary-50">
            <CardContent className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
              <div>
                <div className="text-sm text-primary-600">Continue where you left off</div>
                <div className="font-semibold text-primary-900">
                  Module {nextModule.id}: {nextModule.title}
                </div>
              </div>
              <Link href={`/modules/${nextModule.id}`}>
                <Button variant="primary">Continue Learning</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Path filter info */}
        {currentPath && (
          <div className="mb-6 flex items-center justify-between rounded-lg bg-slate-100 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Showing modules for:</span>
              <span className="font-semibold text-slate-900">{pathInfo?.name}</span>
              <span className="text-slate-400">({displayModules.length} modules)</span>
            </div>
            <Link href="/paths" className="text-sm text-primary-600 hover:text-primary-800">
              Change path
            </Link>
          </div>
        )}

        {/* Module cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayModules.map((module, index) => {
            const isCompleted = completedModules.includes(module.id)
            const isNext = nextModule?.id === module.id
            const moduleNumber = currentPath ? index + 1 : module.id

            return (
              <Link key={module.id} href={`/modules/${module.id}`}>
                <Card
                  className={`h-full transition-all hover:shadow-md ${
                    isNext
                      ? 'ring-2 ring-primary-500'
                      : isCompleted
                        ? 'bg-green-50 hover:bg-green-100'
                        : 'hover:border-primary-300'
                  }`}
                >
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isNext
                              ? 'bg-primary-500 text-white'
                              : 'bg-primary-100 text-primary-700'
                        }`}
                      >
                        {isCompleted ? '✓' : module.id}
                      </span>
                      <span className="text-xs text-slate-500">{module.duration}</span>
                      {isNext && (
                        <span className="ml-auto rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                          Up Next
                        </span>
                      )}
                      {isCompleted && (
                        <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Completed
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-base">{module.title}</CardTitle>
                    <CardDescription className="text-xs">{module.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{module.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {module.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Show other modules if on a path */}
        {currentPath && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-slate-700">Other Modules (Not in your path)</h2>
            <p className="mb-6 text-sm text-slate-500">
              These modules are part of the full course but not included in your selected path.
              You can still explore them if you&apos;re curious.
            </p>
            <div className="grid gap-4 opacity-60 md:grid-cols-2 lg:grid-cols-3">
              {MODULES.filter(
                (m) => !(LEARNING_PATHS[currentPath as LearningPathId].modules as readonly number[]).includes(m.id)
              ).map((module) => {
                const isCompleted = completedModules.includes(module.id)

                return (
                  <Link key={module.id} href={`/modules/${module.id}`}>
                    <Card className="h-full transition-all hover:opacity-100 hover:shadow-md">
                      <CardHeader>
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                              isCompleted
                                ? 'bg-green-500 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isCompleted ? '✓' : module.id}
                          </span>
                          <span className="text-xs text-slate-500">{module.duration}</span>
                        </div>
                        <CardTitle className="text-base text-slate-700">{module.title}</CardTitle>
                        <CardDescription className="text-xs">{module.subtitle}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Back to home */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>
      </main>
      <Footer />
      <BadgeNotificationContainer />
    </div>
  )
}
