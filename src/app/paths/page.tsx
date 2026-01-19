'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui'
import { Header, Footer } from '@/components/layout'
import { MODULES, LEARNING_PATHS, type LearningPathId } from '@/lib/constants'
import { useProgressStore } from '@/stores/progressStore'
import { BadgeNotificationContainer } from '@/components/gamification'

// =============================================================================
// DATA: Path Details
// =============================================================================

const pathDetails: Record<
  LearningPathId,
  {
    icon: string
    audience: string[]
    goals: string[]
    highlights: string[]
    notFor: string[]
    color: string
  }
> = {
  conceptual: {
    icon: '🎯',
    audience: ['Managers', 'Product Managers', 'Executives', 'Technical Writers'],
    goals: [
      'Understand what RNNs are and why they matter',
      'Communicate effectively with ML teams',
      'Make informed decisions about AI investments',
    ],
    highlights: [
      'Skip the math-heavy implementation details',
      'Focus on business applications and trade-offs',
      'Learn the vocabulary to discuss AI confidently',
    ],
    notFor: ['Those who want to implement RNNs', 'Deep technical understanding'],
    color: 'purple',
  },
  practitioner: {
    icon: '🛠️',
    audience: ['ML Engineers', 'Data Scientists', 'Researchers', 'Students'],
    goals: [
      'Master RNN architecture from theory to code',
      'Implement and train models from scratch',
      'Build portfolio-worthy projects',
    ],
    highlights: [
      'Complete coverage of all 11 modules',
      'Hands-on coding exercises in every module',
      'Capstone project with real datasets',
    ],
    notFor: ['Time-constrained learners', 'Non-technical roles'],
    color: 'blue',
  },
  quickWins: {
    icon: '⚡',
    audience: ['Busy Professionals', 'Career Changers', 'Curious Developers'],
    goals: [
      'Get a solid foundation quickly',
      'Understand the key concepts',
      'Know when to use RNNs vs alternatives',
    ],
    highlights: [
      'Optimized for minimal time investment',
      'Core concepts without exhaustive detail',
      'Practical decision-making focus',
    ],
    notFor: ['Those seeking deep expertise', 'Interview preparation'],
    color: 'green',
  },
  interviewPrep: {
    icon: '💼',
    audience: ['Job Seekers', 'Career Changers', 'Students preparing for interviews'],
    goals: [
      'Ace technical interviews on RNNs',
      'Explain concepts clearly under pressure',
      'Demonstrate practical understanding',
    ],
    highlights: [
      'Focus on commonly asked questions',
      'Practice explaining complex concepts',
      'Key topics that interviewers love',
    ],
    notFor: ['Those not job searching', 'Complete beginners'],
    color: 'amber',
  },
}

// =============================================================================
// DATA: Time Recommendations
// =============================================================================

interface TimeOption {
  id: string
  label: string
  hours: string
  description: string
  recommendedPath: LearningPathId
}

const timeOptions: TimeOption[] = [
  {
    id: 'minimal',
    label: 'Just a taste',
    hours: '1-2 hours',
    description: "I want to understand what RNNs are without going deep",
    recommendedPath: 'quickWins',
  },
  {
    id: 'moderate',
    label: 'Solid understanding',
    hours: '2-4 hours',
    description: 'I want practical knowledge for my work',
    recommendedPath: 'conceptual',
  },
  {
    id: 'interview',
    label: 'Interview ready',
    hours: '3-4 hours',
    description: "I'm preparing for technical interviews",
    recommendedPath: 'interviewPrep',
  },
  {
    id: 'comprehensive',
    label: 'Full mastery',
    hours: '6-8+ hours',
    description: 'I want to implement RNNs and build projects',
    recommendedPath: 'practitioner',
  },
]

// =============================================================================
// COMPONENTS
// =============================================================================

function TimeBasedRecommendation({
  onSelectPath,
}: {
  onSelectPath: (pathId: LearningPathId) => void
}) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const handleTimeSelect = (option: TimeOption) => {
    setSelectedTime(option.id)
  }

  const selectedOption = timeOptions.find((o) => o.id === selectedTime)

  return (
    <Card className="mb-8 border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">⏰</span>
          How much time do you have?
        </CardTitle>
        <CardDescription>
          We&apos;ll recommend the best path based on your availability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {timeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleTimeSelect(option)}
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                selectedTime === option.id
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                  : 'border-slate-200 hover:border-primary-300'
              }`}
            >
              <div className="mb-1 font-semibold text-slate-900">{option.label}</div>
              <div className="mb-2 text-sm font-medium text-primary-600">{option.hours}</div>
              <div className="text-xs text-slate-500">{option.description}</div>
            </button>
          ))}
        </div>

        {selectedOption && (
          <div className="mt-6 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">{pathDetails[selectedOption.recommendedPath].icon}</span>
              <div>
                <div className="font-semibold text-slate-900">
                  Recommended: {LEARNING_PATHS[selectedOption.recommendedPath].name}
                </div>
                <div className="text-sm text-slate-500">
                  {LEARNING_PATHS[selectedOption.recommendedPath].description}
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => onSelectPath(selectedOption.recommendedPath)}
              className="w-full sm:w-auto"
            >
              Start {LEARNING_PATHS[selectedOption.recommendedPath].name} Path
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PathCard({
  pathId,
  isSelected,
  onSelect,
  progress,
}: {
  pathId: LearningPathId
  isSelected: boolean
  onSelect: () => void
  progress: { completed: number; total: number; percentage: number }
}) {
  const path = LEARNING_PATHS[pathId]
  const details = pathDetails[pathId]

  const colorClasses: Record<string, { bg: string; border: string; text: string; ring: string }> = {
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-300',
      text: 'text-purple-700',
      ring: 'ring-purple-500',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-700',
      ring: 'ring-blue-500',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-700',
      ring: 'ring-green-500',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-700',
      ring: 'ring-amber-500',
    },
  }

  const colors = colorClasses[details.color]

  return (
    <Card
      className={`relative transition-all ${
        isSelected ? `ring-2 ${colors.ring} shadow-lg` : 'hover:shadow-md'
      }`}
    >
      {isSelected && (
        <div
          className={`absolute -top-3 left-4 rounded-full ${colors.bg} px-3 py-1 text-xs font-semibold ${colors.text}`}
        >
          Current Path
        </div>
      )}

      <CardHeader className={isSelected ? colors.bg : ''}>
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-3xl">{details.icon}</span>
              <CardTitle className="text-xl">{path.name}</CardTitle>
            </div>
            <CardDescription className="text-base">{path.description}</CardDescription>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">📚</span>
            <span className="font-medium">{path.modules.length} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">⏱️</span>
            <span className="font-medium">{path.duration}</span>
          </div>
        </div>

        {/* Progress bar */}
        {progress.completed > 0 && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-slate-500">Progress</span>
              <span className="font-medium text-slate-700">
                {progress.completed}/{progress.total} ({progress.percentage}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full transition-all ${
                  progress.percentage === 100 ? 'bg-green-500' : 'bg-primary-500'
                }`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Audience */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-700">Best for:</h4>
          <div className="flex flex-wrap gap-1">
            {details.audience.map((role) => (
              <span
                key={role}
                className={`rounded-full ${colors.bg} px-2 py-1 text-xs ${colors.text}`}
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-700">You will:</h4>
          <ul className="space-y-1 text-sm text-slate-600">
            {details.goals.map((goal, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                {goal}
              </li>
            ))}
          </ul>
        </div>

        {/* Modules preview */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-700">Modules included:</h4>
          <div className="flex flex-wrap gap-1">
            {path.modules.map((moduleId) => {
              const moduleData = MODULES[moduleId]
              return (
                <span
                  key={moduleId}
                  className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600"
                  title={moduleData.title}
                >
                  {moduleId}: {moduleData.title.split(':')[0]}
                </span>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {isSelected ? (
            <Link href={`/modules/${path.modules[0]}`} className="flex-1">
              <Button variant="primary" className="w-full">
                Continue Learning
              </Button>
            </Link>
          ) : (
            <Button variant="outline" onClick={onSelect} className="flex-1">
              Select This Path
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function PathComparison() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Path Comparison</CardTitle>
        <CardDescription>See all paths side by side to make the best choice.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-3 text-left text-sm font-semibold text-slate-900">Feature</th>
              {Object.values(LEARNING_PATHS).map((path) => (
                <th
                  key={path.id}
                  className="pb-3 text-center text-sm font-semibold text-slate-900"
                >
                  {pathDetails[path.id as LearningPathId].icon} {path.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3 text-sm font-medium text-slate-700">Duration</td>
              {Object.values(LEARNING_PATHS).map((path) => (
                <td key={path.id} className="py-3 text-center text-sm text-slate-600">
                  {path.duration}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-slate-700">Modules</td>
              {Object.values(LEARNING_PATHS).map((path) => (
                <td key={path.id} className="py-3 text-center text-sm text-slate-600">
                  {path.modules.length}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-slate-700">Math Depth</td>
              <td className="py-3 text-center text-sm text-slate-600">Light</td>
              <td className="py-3 text-center text-sm text-slate-600">Deep</td>
              <td className="py-3 text-center text-sm text-slate-600">Light</td>
              <td className="py-3 text-center text-sm text-slate-600">Medium</td>
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-slate-700">Coding Required</td>
              <td className="py-3 text-center text-sm text-slate-600">No</td>
              <td className="py-3 text-center text-sm text-slate-600">Yes</td>
              <td className="py-3 text-center text-sm text-slate-600">Minimal</td>
              <td className="py-3 text-center text-sm text-slate-600">Some</td>
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-slate-700">Hands-on Projects</td>
              <td className="py-3 text-center text-sm text-slate-600">-</td>
              <td className="py-3 text-center text-sm text-green-600">✓ Capstone</td>
              <td className="py-3 text-center text-sm text-slate-600">-</td>
              <td className="py-3 text-center text-sm text-slate-600">-</td>
            </tr>
            <tr>
              <td className="py-3 text-sm font-medium text-slate-700">Interview Focus</td>
              <td className="py-3 text-center text-sm text-slate-600">-</td>
              <td className="py-3 text-center text-sm text-slate-600">-</td>
              <td className="py-3 text-center text-sm text-slate-600">-</td>
              <td className="py-3 text-center text-sm text-green-600">✓ Targeted</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

function SwitchPathModal({
  isOpen,
  onClose,
  currentPath,
  newPath,
  onConfirm,
}: {
  isOpen: boolean
  onClose: () => void
  currentPath: LearningPathId | null
  newPath: LearningPathId
  onConfirm: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Switch Learning Path?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            You&apos;re about to switch from{' '}
            <strong>{currentPath ? LEARNING_PATHS[currentPath].name : 'no path'}</strong> to{' '}
            <strong>{LEARNING_PATHS[newPath].name}</strong>.
          </p>
          <p className="text-sm text-slate-500">
            Your module completion progress will be preserved, but your active path will change.
            The new path may include different modules.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={onConfirm} className="flex-1">
              Switch Path
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function LearningPathsPage() {
  const { currentPath, setCurrentPath, completedModules } = useProgressStore()
  const [showModal, setShowModal] = useState(false)
  const [pendingPath, setPendingPath] = useState<LearningPathId | null>(null)

  // Calculate progress for each path
  const pathProgress = useMemo(() => {
    const progress: Record<LearningPathId, { completed: number; total: number; percentage: number }> =
      {} as any

    Object.entries(LEARNING_PATHS).forEach(([id, path]) => {
      const completed = path.modules.filter((m) => completedModules.includes(m)).length
      const total = path.modules.length
      progress[id as LearningPathId] = {
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    })

    return progress
  }, [completedModules])

  const handleSelectPath = (pathId: LearningPathId) => {
    if (currentPath && currentPath !== pathId) {
      setPendingPath(pathId)
      setShowModal(true)
    } else {
      setCurrentPath(pathId)
    }
  }

  const handleConfirmSwitch = () => {
    if (pendingPath) {
      setCurrentPath(pendingPath)
      setPendingPath(null)
    }
    setShowModal(false)
  }

  // Find next module to continue
  const getNextModule = (pathId: LearningPathId) => {
    const path = LEARNING_PATHS[pathId]
    const nextModule = path.modules.find((m) => !completedModules.includes(m))
    return nextModule ?? path.modules[0]
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-slate-900">Choose Your Learning Path</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Everyone learns differently. Select a path tailored to your goals, role, and available
            time. You can switch paths anytime.
          </p>
        </div>

        {/* Time-based recommendation */}
        <TimeBasedRecommendation onSelectPath={handleSelectPath} />

        {/* Path comparison */}
        <PathComparison />

        {/* Path Cards */}
        <h2 className="mb-6 text-2xl font-bold text-slate-900">All Paths</h2>
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {(Object.keys(LEARNING_PATHS) as LearningPathId[]).map((pathId) => (
            <PathCard
              key={pathId}
              pathId={pathId}
              isSelected={currentPath === pathId}
              onSelect={() => handleSelectPath(pathId)}
              progress={pathProgress[pathId]}
            />
          ))}
        </div>

        {/* Current path quick actions */}
        {currentPath && (
          <Card className="mb-8 border-2 border-primary-200 bg-primary-50">
            <CardContent className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
              <div>
                <div className="mb-1 text-sm text-primary-600">Your current path</div>
                <div className="text-xl font-bold text-primary-900">
                  {pathDetails[currentPath as LearningPathId].icon}{' '}
                  {LEARNING_PATHS[currentPath as LearningPathId].name}
                </div>
                <div className="text-sm text-primary-700">
                  {pathProgress[currentPath as LearningPathId].completed} of{' '}
                  {pathProgress[currentPath as LearningPathId].total} modules completed
                </div>
              </div>
              <Link href={`/modules/${getNextModule(currentPath as LearningPathId)}`}>
                <Button variant="primary" size="lg">
                  Continue Learning
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Back to home */}
        <div className="text-center">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>
      </main>
      <Footer />
      <BadgeNotificationContainer />

      {/* Switch path modal */}
      <SwitchPathModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        currentPath={currentPath as LearningPathId | null}
        newPath={pendingPath!}
        onConfirm={handleConfirmSwitch}
      />
    </div>
  )
}
