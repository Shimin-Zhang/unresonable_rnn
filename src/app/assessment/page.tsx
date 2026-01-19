'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@/components/ui'
import { Header, Footer } from '@/components/layout'
import { useProgressStore } from '@/stores/progressStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import {
  REFLECTION_PROMPTS,
  FINAL_CHALLENGE,
  MODULE_QUIZ_SUMMARIES,
  type ReflectionPrompt,
} from '@/content/assessment/reflections'

// Local storage key for reflections
const REFLECTIONS_STORAGE_KEY = 'rnn-reflections'

interface ReflectionResponse {
  promptId: string
  response: string
  savedAt: string
}

// Quiz Summary Section
function QuizSummarySection() {
  const { completedModules } = useProgressStore()
  const completedCount = MODULE_QUIZ_SUMMARIES.filter((q) =>
    completedModules.includes(q.moduleId)
  ).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle as="h2">Module Quizzes</CardTitle>
            <CardDescription>
              Formative assessments to check your understanding
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {completedCount}/{MODULE_QUIZ_SUMMARIES.length}
            </div>
            <div className="text-sm text-slate-500">Completed</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MODULE_QUIZ_SUMMARIES.map((quiz) => {
            const isCompleted = completedModules.includes(quiz.moduleId)
            return (
              <div
                key={quiz.quizId}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isCompleted
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {quiz.moduleId}
                    </span>
                    <h4 className="font-medium text-slate-900">{quiz.moduleTitle}</h4>
                    {isCompleted && (
                      <span className="text-emerald-600 text-sm">✓</span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {quiz.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <span className="text-sm text-slate-500">
                    {quiz.questionCount} questions
                  </span>
                  <Link href={`/modules/${quiz.moduleId}`}>
                    <Button variant={isCompleted ? 'outline' : 'primary'} className="text-sm">
                      {isCompleted ? 'Review' : 'Start'}
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Individual Reflection Card
function ReflectionCard({
  prompt,
  response,
  onSave,
}: {
  prompt: ReflectionPrompt
  response: string
  onSave: (promptId: string, text: string) => void
}) {
  const [text, setText] = useState(response)
  const [isSaved, setIsSaved] = useState(true)
  const [showRubric, setShowRubric] = useState(false)

  useEffect(() => {
    setText(response)
  }, [response])

  const handleChange = (value: string) => {
    setText(value)
    setIsSaved(false)
  }

  const handleSave = () => {
    onSave(prompt.id, text)
    setIsSaved(true)
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle as="h3" className="text-lg">{prompt.title}</CardTitle>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <span>{prompt.targetAudience}</span>
              <span>•</span>
              <span>{prompt.estimatedTime}</span>
            </div>
          </div>
          {text.length > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
              In Progress
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-slate-700">{prompt.prompt}</p>

        {/* Hints */}
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
          <h5 className="text-sm font-medium text-amber-900 mb-2">Hints</h5>
          <ul className="text-sm text-amber-800 space-y-1">
            {prompt.hints.map((hint, i) => (
              <li key={i}>• {hint}</li>
            ))}
          </ul>
        </div>

        {/* Text area */}
        <div>
          <textarea
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Write your reflection here..."
            className="w-full h-40 p-3 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-y text-slate-700"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-slate-500">{wordCount} words</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRubric(!showRubric)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {showRubric ? 'Hide' : 'Show'} rubric
              </button>
              <Button
                onClick={handleSave}
                disabled={isSaved}
                variant={isSaved ? 'outline' : 'primary'}
                className="text-sm"
              >
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        {/* Rubric */}
        {showRubric && (
          <div className="rounded-lg border border-slate-200 p-4 space-y-3">
            <h5 className="font-medium text-slate-900">Evaluation Rubric</h5>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                <div className="text-xs font-medium text-emerald-700 mb-1">Excellent</div>
                <p className="text-xs text-emerald-800">{prompt.rubric.excellent}</p>
              </div>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                <div className="text-xs font-medium text-blue-700 mb-1">Good</div>
                <p className="text-xs text-blue-800">{prompt.rubric.good}</p>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                <div className="text-xs font-medium text-amber-700 mb-1">Developing</div>
                <p className="text-xs text-amber-800">{prompt.rubric.developing}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Reflection Journal Section
function ReflectionJournalSection() {
  const [responses, setResponses] = useState<Record<string, ReflectionResponse>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(REFLECTIONS_STORAGE_KEY)
    if (stored) {
      try {
        setResponses(JSON.parse(stored))
      } catch {
        // Invalid JSON, ignore
      }
    }
    setIsLoaded(true)
  }, [])

  const handleSave = (promptId: string, text: string) => {
    const newResponses = {
      ...responses,
      [promptId]: {
        promptId,
        response: text,
        savedAt: new Date().toISOString(),
      },
    }
    setResponses(newResponses)
    localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(newResponses))
  }

  const completedCount = Object.values(responses).filter(
    (r) => r.response.trim().length > 50
  ).length

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-pulse">Loading reflections...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reflection Journal</h2>
          <p className="text-slate-600">
            Summative assessment through guided reflection
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">
            {completedCount}/{REFLECTION_PROMPTS.length}
          </div>
          <div className="text-sm text-slate-500">Reflections</div>
        </div>
      </div>

      {REFLECTION_PROMPTS.map((prompt) => (
        <ReflectionCard
          key={prompt.id}
          prompt={prompt}
          response={responses[prompt.id]?.response || ''}
          onSave={handleSave}
        />
      ))}
    </div>
  )
}

// Final Challenge Section
function FinalChallengeSection() {
  const { badges } = useGamificationStore()
  const hasParticipated = badges[FINAL_CHALLENGE.badges.participation]

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏆</span>
          <span className="text-sm font-medium text-purple-700">Community Challenge</span>
        </div>
        <CardTitle className="text-purple-900">{FINAL_CHALLENGE.title}</CardTitle>
        <CardDescription className="text-purple-700">
          {FINAL_CHALLENGE.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Task */}
        <div className="bg-white/60 rounded-lg p-4">
          <h4 className="font-semibold text-slate-900 mb-2">The Task</h4>
          <p className="text-slate-700 whitespace-pre-line">{FINAL_CHALLENGE.task}</p>
        </div>

        {/* Submission Format */}
        <div className="bg-white/60 rounded-lg p-4">
          <h4 className="font-semibold text-slate-900 mb-2">Submission Format</h4>
          <p className="text-slate-700">{FINAL_CHALLENGE.submissionFormat}</p>
        </div>

        {/* Voting Criteria */}
        <div className="bg-white/60 rounded-lg p-4">
          <h4 className="font-semibold text-slate-900 mb-2">Voting Criteria</h4>
          <ul className="text-slate-700 space-y-1">
            {FINAL_CHALLENGE.votingCriteria.map((criterion, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-purple-600">★</span>
                {criterion}
              </li>
            ))}
          </ul>
        </div>

        {/* Badges */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-purple-200 bg-white/50 p-3 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-sm font-medium text-purple-900">Participation Badge</div>
            <div className="text-xs text-purple-700">Submit any entry</div>
          </div>
          <div className="rounded-lg border border-purple-200 bg-white/50 p-3 text-center">
            <div className="text-2xl mb-1">👑</div>
            <div className="text-sm font-medium text-purple-900">Champion Badge</div>
            <div className="text-xs text-purple-700">Win community vote</div>
          </div>
          <div className="rounded-lg border border-purple-200 bg-white/50 p-3 text-center">
            <div className="text-2xl mb-1">🎨</div>
            <div className="text-sm font-medium text-purple-900">Creativity Badge</div>
            <div className="text-xs text-purple-700">Most creative corpus</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          {hasParticipated ? (
            <div className="text-emerald-600 font-medium">
              ✓ You&apos;ve participated in the challenge!
            </div>
          ) : (
            <Button variant="primary" className="bg-purple-600 hover:bg-purple-700">
              Submit Your Entry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Progress Overview
function ProgressOverview() {
  const { completedModules } = useProgressStore()
  const { stats, badges } = useGamificationStore()

  const quizProgress = MODULE_QUIZ_SUMMARIES.filter((q) =>
    completedModules.includes(q.moduleId)
  ).length / MODULE_QUIZ_SUMMARIES.length * 100

  return (
    <Card className="mb-8">
      <CardContent className="py-6">
        <div className="grid gap-6 md:grid-cols-4 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600">
              {completedModules.length}
            </div>
            <div className="text-sm text-slate-500">Modules Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600">
              {Math.round(quizProgress)}%
            </div>
            <div className="text-sm text-slate-500">Quiz Progress</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600">
              {stats.totalPoints.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500">Total Points</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">
              {Object.keys(badges).length}
            </div>
            <div className="text-sm text-slate-500">Badges Earned</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Assessment Page
export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Assessment Hub
          </h1>
          <p className="text-lg text-slate-600">
            Track your progress, complete reflections, and take on the final challenge
          </p>
        </div>

        {/* Progress Overview */}
        <ProgressOverview />

        {/* Main Content */}
        <div className="space-y-12">
          {/* Quiz Summary */}
          <section>
            <QuizSummarySection />
          </section>

          {/* Reflection Journal */}
          <section>
            <ReflectionJournalSection />
          </section>

          {/* Final Challenge */}
          <section>
            <FinalChallengeSection />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
