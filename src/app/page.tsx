'use client'

import Link from 'next/link'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { Footer } from '@/components/layout'
import { MODULES, LEARNING_PATHS } from '@/lib/constants'
import { useProgressStore } from '@/stores/progressStore'

export default function HomePage() {
  const { setCurrentPath, currentPath } = useProgressStore()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-20 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            The Unreasonable Effectiveness of RNNs
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-100 sm:text-xl">
            Master Recurrent Neural Networks through an interactive learning experience
            based on Andrej Karpathy&apos;s influential blog post.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/modules/0">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                Start Learning
              </Button>
            </Link>
            <Link href="#paths">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Choose Your Path
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">11</div>
              <div className="text-sm text-slate-600">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">4</div>
              <div className="text-sm text-slate-600">Learning Paths</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">6-8h</div>
              <div className="text-sm text-slate-600">Full Course</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">2h</div>
              <div className="text-sm text-slate-600">Quick Path</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section id="paths" className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900">
            Choose Your Learning Path
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">
            Select a path tailored to your role and goals. Each path covers the essential
            concepts while respecting your time constraints.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Object.values(LEARNING_PATHS).map((path) => (
              <Card
                key={path.id}
                variant="elevated"
                className={`cursor-pointer transition-all hover:scale-105 ${
                  currentPath === path.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => setCurrentPath(path.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{path.name}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-sm text-slate-500">
                    {path.modules.length} modules &middot; {path.duration}
                  </div>
                  <Link href="/modules/0">
                    <Button size="sm" className="w-full">
                      {currentPath === path.id ? 'Continue' : 'Start Path'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Overview Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900">
            Course Modules
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">
            From fundamentals to advanced implementations, explore the complete journey
            of understanding RNNs.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((module) => (
              <Link key={module.id} href={`/modules/${module.id}`}>
                <Card className="h-full transition-all hover:border-primary-300 hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
                        {module.id}
                      </span>
                      <span className="text-xs text-slate-500">{module.duration}</span>
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
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
