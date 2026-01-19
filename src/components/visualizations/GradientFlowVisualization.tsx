'use client'

import { useState, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { SliderControl } from './SliderControl'

interface GradientFlowVisualizationProps {
  className?: string
  maxTimeSteps?: number
}

interface GradientScenario {
  id: string
  name: string
  gradient: number
  description: string
  color: string
  outcome: 'vanishing' | 'stable' | 'exploding'
}

const SCENARIOS: GradientScenario[] = [
  {
    id: 'vanishing',
    name: 'Vanishing (0.5)',
    gradient: 0.5,
    description: 'Each step multiplies by 0.5, causing exponential decay',
    color: 'text-blue-600',
    outcome: 'vanishing',
  },
  {
    id: 'stable',
    name: 'Stable (1.0)',
    gradient: 1.0,
    description: 'Gradient stays constant - the ideal case',
    color: 'text-green-600',
    outcome: 'stable',
  },
  {
    id: 'exploding',
    name: 'Exploding (2.0)',
    gradient: 2.0,
    description: 'Each step multiplies by 2, causing exponential growth',
    color: 'text-red-600',
    outcome: 'exploding',
  },
]

/**
 * Interactive visualization showing how gradients multiply through time steps,
 * demonstrating the vanishing and exploding gradient problems.
 */
export function GradientFlowVisualization({
  className,
  maxTimeSteps = 20,
}: GradientFlowVisualizationProps) {
  const [timeSteps, setTimeSteps] = useState(10)
  const [selectedScenario, setSelectedScenario] = useState<string>('vanishing')

  const activeScenario = useMemo(
    () => SCENARIOS.find((s) => s.id === selectedScenario) || SCENARIOS[0],
    [selectedScenario]
  )

  // Calculate gradient values for each time step
  const gradientValues = useMemo(() => {
    return Array.from({ length: timeSteps + 1 }, (_, i) =>
      Math.pow(activeScenario.gradient, i)
    )
  }, [timeSteps, activeScenario.gradient])

  // Calculate display values (clamped for visualization)
  const displayValues = useMemo(() => {
    return gradientValues.map((v) => {
      if (v < 1e-10) return { value: v, display: '≈0', clamped: true }
      if (v > 1e10) return { value: v, display: '∞', clamped: true }
      if (v < 0.001) return { value: v, display: v.toExponential(1), clamped: false }
      if (v > 1000) return { value: v, display: v.toExponential(1), clamped: false }
      return { value: v, display: v.toFixed(v < 10 ? 4 : 0), clamped: false }
    })
  }, [gradientValues])

  // Final gradient value
  const finalValue = gradientValues[gradientValues.length - 1]
  const finalDisplay = displayValues[displayValues.length - 1]

  // Bar height calculation (logarithmic scale for visualization)
  const getBarHeight = useCallback((value: number) => {
    if (value === 0) return 0
    const logValue = Math.log10(Math.max(value, 1e-10))
    // Map from [-10, 10] to [0, 100]
    const normalized = (logValue + 10) / 20
    return Math.max(0, Math.min(100, normalized * 100))
  }, [])

  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-6', className)}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Gradient Flow Through Time
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Watch how gradients multiply as they flow backward through time steps.
          This is why vanilla RNNs struggle with long-range dependencies.
        </p>
      </div>

      {/* Scenario Selection */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Gradient Multiplier per Step
        </label>
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                selectedScenario === scenario.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              {scenario.name}
            </button>
          ))}
        </div>
        <p className={cn('mt-2 text-sm', activeScenario.color)}>
          {activeScenario.description}
        </p>
      </div>

      {/* Time Steps Slider */}
      <div className="mb-6">
        <SliderControl
          label="Number of Time Steps"
          value={timeSteps}
          config={{ min: 1, max: maxTimeSteps, step: 1 }}
          onChange={setTimeSteps}
          formatValue={(v) => `${v} steps`}
        />
      </div>

      {/* Visualization */}
      <div className="mb-6 rounded-lg bg-slate-50 p-4">
        {/* Gradient bars */}
        <div className="mb-4 flex items-end justify-center gap-1" style={{ height: '150px' }}>
          {displayValues.map((item, i) => {
            const height = getBarHeight(item.value)
            const isFirst = i === 0
            const isLast = i === displayValues.length - 1

            return (
              <div
                key={i}
                className="flex flex-col items-center"
                style={{ width: `${Math.min(30, 600 / displayValues.length)}px` }}
              >
                <div
                  className={cn(
                    'w-full rounded-t transition-all duration-300',
                    activeScenario.outcome === 'vanishing' && 'bg-blue-500',
                    activeScenario.outcome === 'stable' && 'bg-green-500',
                    activeScenario.outcome === 'exploding' && 'bg-red-500',
                    (isFirst || isLast) && 'ring-2 ring-slate-900'
                  )}
                  style={{ height: `${height}%`, minHeight: '4px' }}
                />
                <span className="mt-1 text-xs text-slate-500">t={i}</span>
              </div>
            )
          })}
        </div>

        {/* Formula display */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Gradient at t=0 → t={timeSteps}:{' '}
            <span className="font-mono font-semibold">
              1.0 × {activeScenario.gradient}
              <sup>{timeSteps}</sup> ={' '}
              <span className={activeScenario.color}>{finalDisplay.display}</span>
            </span>
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div
        className={cn(
          'rounded-lg p-4',
          activeScenario.outcome === 'vanishing' && 'bg-blue-50 border border-blue-200',
          activeScenario.outcome === 'stable' && 'bg-green-50 border border-green-200',
          activeScenario.outcome === 'exploding' && 'bg-red-50 border border-red-200'
        )}
      >
        {activeScenario.outcome === 'vanishing' && (
          <div>
            <h4 className="font-semibold text-blue-900">The Vanishing Gradient Problem</h4>
            <p className="mt-1 text-sm text-blue-800">
              When the gradient multiplier is less than 1, gradients shrink exponentially.
              After {timeSteps} steps, the gradient is only{' '}
              <span className="font-mono font-semibold">{finalDisplay.display}</span> of its
              original value. This means early layers receive almost no learning signal,
              making it impossible to learn long-range dependencies.
            </p>
          </div>
        )}
        {activeScenario.outcome === 'stable' && (
          <div>
            <h4 className="font-semibold text-green-900">The Ideal Case</h4>
            <p className="mt-1 text-sm text-green-800">
              When the gradient multiplier is exactly 1, gradients flow unchanged through
              time. This is what we want! However, achieving this in practice is difficult
              with vanilla RNNs. LSTMs solve this by using additive cell state updates.
            </p>
          </div>
        )}
        {activeScenario.outcome === 'exploding' && (
          <div>
            <h4 className="font-semibold text-red-900">The Exploding Gradient Problem</h4>
            <p className="mt-1 text-sm text-red-800">
              When the gradient multiplier is greater than 1, gradients grow exponentially.
              After {timeSteps} steps, the gradient is{' '}
              <span className="font-mono font-semibold">{finalDisplay.display}</span>× larger!
              This causes unstable training with NaN values. Gradient clipping is commonly
              used to mitigate this.
            </p>
          </div>
        )}
      </div>

      {/* Mathematical Insight */}
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h4 className="font-semibold text-slate-900">Mathematical Insight</h4>
        <p className="mt-1 text-sm text-slate-700">
          During backpropagation through time (BPTT), the gradient at step t=0 involves
          multiplying many Jacobian matrices:{' '}
          <span className="font-mono">∂h_T/∂h_0 = ∏(∂h_&#123;t+1&#125;/∂h_t)</span>.
          If the eigenvalues of these Jacobians are consistently &lt;1 or &gt;1,
          the gradient vanishes or explodes exponentially.
        </p>
      </div>
    </div>
  )
}

export default GradientFlowVisualization
