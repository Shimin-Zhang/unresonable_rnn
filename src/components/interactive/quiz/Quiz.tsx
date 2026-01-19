'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useQuizStore } from '@/stores/quizStore'
import { QuestionCard } from './QuestionCard'
import { QuizProgressBar } from './QuizProgressBar'
import { FeedbackPanel } from './FeedbackPanel'
import { QuizResults } from './QuizResults'
import { Confetti } from './Confetti'
import { SpacedRepetitionPrompt } from './SpacedRepetitionPrompt'
import { PASSING_SCORE_DEFAULT, SPACED_REPETITION_INTERVALS } from './constants'
import {
  checkAnswer,
  calculatePartialScore,
  shuffleArray,
  isAnswerComplete,
  getEmptyAnswer,
} from './utils'
import type { QuizProps, Question, Answer, QuizAttempt } from './types'

type QuizPhase = 'intro' | 'questions' | 'results'

export function Quiz({
  config,
  onComplete,
  onQuestionAnswer,
  showSpacedRepetitionPrompt = true,
  className = '',
}: QuizProps) {
  const [phase, setPhase] = useState<QuizPhase>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentIsCorrect, setCurrentIsCorrect] = useState<boolean | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showReviewPrompt, setShowReviewPrompt] = useState(false)

  const {
    startQuiz,
    submitAnswer,
    completeQuiz,
    getQuizProgress,
    scheduleReview,
    getDueReviews,
  } = useQuizStore()

  const questions = useMemo(() => {
    if (config.shuffleQuestions) {
      return shuffleArray(config.questions)
    }
    return config.questions
  }, [config.questions, config.shuffleQuestions])

  const currentQuestion = questions[currentIndex]

  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter((qId) => {
      const question = questions.find((q) => q.id === qId)
      return question && isAnswerComplete(question, answers[qId])
    }).length
  }, [answers, questions])

  const progress = getQuizProgress(config.id)

  useEffect(() => {
    if (showSpacedRepetitionPrompt) {
      const dueReviews = getDueReviews()
      const hasReview = dueReviews.some((r) => r.quizId === config.id)
      if (hasReview && phase === 'intro') {
        setShowReviewPrompt(true)
      }
    }
  }, [config.id, showSpacedRepetitionPrompt, getDueReviews, phase])

  const handleStartQuiz = useCallback(() => {
    startQuiz(config.id)
    setPhase('questions')
    setCurrentIndex(0)
    setAnswers({})
    setShowFeedback(false)
    setCurrentIsCorrect(null)
    setQuestionStartTime(Date.now())
    setShowReviewPrompt(false)
  }, [config.id, startQuiz])

  const handleAnswer = useCallback(
    (answer: Answer) => {
      if (!currentQuestion) return

      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: answer,
      }))
    },
    [currentQuestion]
  )

  const handleSubmitAnswer = useCallback(() => {
    if (!currentQuestion) return

    const answer = answers[currentQuestion.id]
    if (!answer || !isAnswerComplete(currentQuestion, answer)) return

    const isCorrect = checkAnswer(currentQuestion, answer)
    const partialScore = calculatePartialScore(currentQuestion, answer)
    const timeSpent = Date.now() - questionStartTime

    submitAnswer(
      config.id,
      currentQuestion.id,
      answer,
      isCorrect,
      timeSpent,
      partialScore
    )

    setCurrentIsCorrect(isCorrect)

    if (config.showFeedback === 'immediate') {
      setShowFeedback(true)
    }

    if (onQuestionAnswer) {
      onQuestionAnswer(currentQuestion.id, {
        questionId: currentQuestion.id,
        isCorrect,
        partialScore,
        answer,
        timestamp: new Date().toISOString(),
        timeSpent,
      })
    }
  }, [
    currentQuestion,
    answers,
    questionStartTime,
    config.id,
    config.showFeedback,
    submitAnswer,
    onQuestionAnswer,
  ])

  const handleNextQuestion = useCallback(() => {
    setShowFeedback(false)
    setCurrentIsCorrect(null)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setQuestionStartTime(Date.now())
    }
  }, [currentIndex, questions.length])

  const handlePreviousQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setShowFeedback(false)
      setCurrentIsCorrect(null)
      setCurrentIndex((prev) => prev - 1)
      setQuestionStartTime(Date.now())
    }
  }, [currentIndex])

  const handleFinishQuiz = useCallback(() => {
    let score = 0
    const maxScore = questions.length
    const incorrectQuestionIds: string[] = []

    for (const question of questions) {
      const answer = answers[question.id]
      if (answer && checkAnswer(question, answer)) {
        score++
      } else {
        incorrectQuestionIds.push(question.id)
      }
    }

    const attempt = completeQuiz(config.id, score, maxScore)

    if (attempt) {
      setCompletedAttempt(attempt)

      if (attempt.percentage === 100) {
        setShowConfetti(true)
      }

      if (incorrectQuestionIds.length > 0) {
        scheduleReview(
          config.id,
          incorrectQuestionIds,
          SPACED_REPETITION_INTERVALS.initial
        )
      }

      if (onComplete) {
        onComplete(attempt)
      }
    }

    setPhase('results')
  }, [questions, answers, config.id, completeQuiz, scheduleReview, onComplete])

  const handleRetry = useCallback(() => {
    setCompletedAttempt(null)
    setShowConfetti(false)
    handleStartQuiz()
  }, [handleStartQuiz])

  const handleContinue = useCallback(() => {
    setPhase('intro')
    setCompletedAttempt(null)
    setShowConfetti(false)
  }, [])

  const handleSkipReview = useCallback(() => {
    setShowReviewPrompt(false)
  }, [])

  const canSubmitCurrent = currentQuestion
    ? isAnswerComplete(currentQuestion, answers[currentQuestion.id])
    : false

  const allAnswered = answeredCount === questions.length

  const isLastQuestion = currentIndex === questions.length - 1

  if (phase === 'intro') {
    return (
      <div className={cn('space-y-6', className)} data-testid="quiz">
        {showReviewPrompt && (
          <SpacedRepetitionPrompt
            questionsToReview={
              getDueReviews().find((r) => r.quizId === config.id)?.prompt
                .questionIds.length ?? 0
            }
            onStartReview={handleStartQuiz}
            onSkip={handleSkipReview}
          />
        )}

        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">{config.title}</h2>
          {config.description && (
            <p className="text-slate-600">{config.description}</p>
          )}

          <div className="flex justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <QuestionIcon className="h-5 w-5" />
              <span>{questions.length} questions</span>
            </div>
            {config.passingScore && (
              <div className="flex items-center gap-2">
                <TargetIcon className="h-5 w-5" />
                <span>{config.passingScore}% to pass</span>
              </div>
            )}
            {config.timeLimit && (
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <span>{config.timeLimit} minutes</span>
              </div>
            )}
          </div>

          {progress && progress.bestScore > 0 && (
            <p className="text-sm text-slate-500">
              Your best score:{' '}
              <span className="font-semibold text-primary-600">
                {progress.bestScore}%
              </span>
            </p>
          )}

          <Button onClick={handleStartQuiz} variant="primary" size="lg">
            {progress?.attempts.length ? 'Try Again' : 'Start Quiz'}
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'results' && completedAttempt) {
    return (
      <div className={cn('space-y-6', className)} data-testid="quiz">
        <Confetti active={showConfetti} />
        <QuizResults
          attempt={completedAttempt}
          questions={questions}
          onRetry={config.allowRetry !== false ? handleRetry : undefined}
          onContinue={handleContinue}
        />
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)} data-testid="quiz">
      <Confetti active={showConfetti} />

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">{config.title}</h2>
        </div>

        <QuizProgressBar
          current={currentIndex}
          total={questions.length}
          answered={answeredCount}
        />
      </div>

      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          answer={answers[currentQuestion.id] ?? null}
          showFeedback={showFeedback}
          isCorrect={currentIsCorrect ?? undefined}
          onAnswer={handleAnswer}
          disabled={showFeedback}
        />
      )}

      {showFeedback && currentQuestion && currentIsCorrect !== null && (
        <FeedbackPanel
          isCorrect={currentIsCorrect}
          explanation={currentQuestion.explanation}
          onNext={isLastQuestion ? undefined : handleNextQuestion}
        />
      )}

      <div className="flex items-center justify-between">
        <Button
          onClick={handlePreviousQuestion}
          variant="outline"
          disabled={currentIndex === 0}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-3">
          {!showFeedback && (
            <Button
              onClick={handleSubmitAnswer}
              variant="secondary"
              disabled={!canSubmitCurrent}
            >
              Check Answer
            </Button>
          )}

          {isLastQuestion ? (
            <Button
              onClick={handleFinishQuiz}
              variant="primary"
              disabled={!allAnswered}
            >
              Finish Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              variant="primary"
              disabled={showFeedback && config.showFeedback === 'immediate'}
            >
              {showFeedback ? 'Continue' : 'Skip'}
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  )
}
