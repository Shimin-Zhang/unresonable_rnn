'use client'

import { use, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button, Card, CardContent } from '@/components/ui'
import { Header, Footer } from '@/components/layout'
import { MODULES } from '@/lib/constants'
import { useProgressStore } from '@/stores/progressStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import { BadgeNotificationContainer } from '@/components/gamification'

interface ModulePageProps {
  params: Promise<{ moduleId: string }>
}

export default function ModulePage({ params }: ModulePageProps) {
  const resolvedParams = use(params)
  const moduleId = parseInt(resolvedParams.moduleId, 10)
  const moduleData = MODULES.find((m) => m.id === moduleId)
  const { completeModule, completedModules, setCurrentModule } = useProgressStore()
  const gamification = useGamificationStore()

  if (!moduleData) {
    notFound()
  }

  const isCompleted = completedModules.includes(moduleId)
  const prevModule = moduleId > 0 ? MODULES[moduleId - 1] : null
  const nextModule = moduleId < MODULES.length - 1 ? MODULES[moduleId + 1] : null

  // Start module tracking when page loads
  useEffect(() => {
    if (!isCompleted) {
      gamification.startModule(moduleId)
    }
  }, [moduleId, isCompleted, gamification])

  const handleComplete = () => {
    completeModule(moduleId)
    // Trigger gamification tracking
    gamification.completeModule(moduleId)
    // Check for path completion badges
    gamification.checkPathCompletion([...completedModules, moduleId])
  }

  const handleStart = () => {
    setCurrentModule(moduleId)
    gamification.startModule(moduleId)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Module Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-lg font-medium text-primary-700">
              {moduleData.id}
            </span>
            <span className="text-sm text-slate-500">{moduleData.duration}</span>
            {isCompleted && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Completed
              </span>
            )}
          </div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900">{moduleData.title}</h1>
          <p className="text-lg text-slate-600">{moduleData.subtitle}</p>
        </div>

        {/* Module Content Placeholder */}
        <Card className="mb-8">
          <CardContent className="py-12 text-center">
            <div className="mb-4 text-6xl">🚧</div>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              Module Content Coming Soon
            </h2>
            <p className="mx-auto max-w-md text-slate-600">
              {moduleData.description}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              This module will include interactive exercises, quizzes, and visualizations.
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {prevModule && (
              <Link href={`/modules/${prevModule.id}`}>
                <Button variant="outline">
                  ← {prevModule.title}
                </Button>
              </Link>
            )}
          </div>
          <div className="flex gap-2">
            {!isCompleted && (
              <Button onClick={handleComplete} variant="primary">
                Mark as Complete
              </Button>
            )}
            {nextModule && (
              <Link href={`/modules/${nextModule.id}`}>
                <Button variant={isCompleted ? 'primary' : 'secondary'}>
                  {nextModule.title} →
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <BadgeNotificationContainer />
    </div>
  )
}
