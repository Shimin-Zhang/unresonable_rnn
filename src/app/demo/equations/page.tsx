'use client'

import { Equation, InlineEquation, SymbolTable } from '@/components/equations'
import type { SymbolDefinition } from '@/components/equations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const rnnHiddenStateSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{blue}{h_t}',
    color: 'blue',
    meaning: 'Hidden state at time t',
    details: 'The "memory" of the network',
  },
  {
    symbol: '\\color{blue}{h_{t-1}}',
    color: 'blue',
    meaning: 'Previous hidden state',
  },
  { symbol: '\\color{red}{x_t}', color: 'red', meaning: 'Input at time t' },
  {
    symbol: '\\color{green}{W_{hh}}',
    color: 'green',
    meaning: 'Hidden-to-hidden weight matrix',
  },
  {
    symbol: '\\color{orange}{W_{xh}}',
    color: 'orange',
    meaning: 'Input-to-hidden weight matrix',
  },
  { symbol: '\\color{purple}{b_h}', color: 'purple', meaning: 'Bias term' },
]

const outputSymbols: SymbolDefinition[] = [
  { symbol: '\\color{magenta}{y_t}', color: 'magenta', meaning: 'Output at time t' },
  { symbol: '\\color{cyan}{W_{hy}}', color: 'cyan', meaning: 'Hidden-to-output weight matrix' },
  { symbol: '\\color{blue}{h_t}', color: 'blue', meaning: 'Current hidden state' },
  { symbol: '\\color{purple}{b_y}', color: 'purple', meaning: 'Output bias' },
]

export default function EquationsDemoPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">
        Equation Rendering Demo
      </h1>

      <div className="space-y-8">
        {/* Block Equation with Symbol Table Below */}
        <Card>
          <CardHeader>
            <CardTitle>RNN Hidden State Update (Table Below)</CardTitle>
          </CardHeader>
          <CardContent>
            <Equation
              latex="\\color{blue}{h_t} = \\tanh(\\color{green}{W_{hh}} \\cdot \\color{blue}{h_{t-1}} + \\color{orange}{W_{xh}} \\cdot \\color{red}{x_t} + \\color{purple}{b_h})"
              symbols={rnnHiddenStateSymbols}
              symbolTablePosition="below"
              label="Step 1: The Hidden State Update"
              size="lg"
            />
          </CardContent>
        </Card>

        {/* Block Equation with Symbol Table Right */}
        <Card>
          <CardHeader>
            <CardTitle>Output Computation (Table Right)</CardTitle>
          </CardHeader>
          <CardContent>
            <Equation
              latex="\\color{magenta}{y_t} = \\color{cyan}{W_{hy}} \\cdot \\color{blue}{h_t} + \\color{purple}{b_y}"
              symbols={outputSymbols}
              symbolTablePosition="right"
              label="Step 2: The Output Computation"
            />
          </CardContent>
        </Card>

        {/* Size Variations */}
        <Card>
          <CardHeader>
            <CardTitle>Size Variations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-slate-600">Small:</p>
              <Equation latex="E = mc^2" size="sm" />
            </div>
            <div>
              <p className="mb-2 text-sm text-slate-600">Medium (default):</p>
              <Equation latex="E = mc^2" size="md" />
            </div>
            <div>
              <p className="mb-2 text-sm text-slate-600">Large:</p>
              <Equation latex="E = mc^2" size="lg" />
            </div>
          </CardContent>
        </Card>

        {/* Inline Equations */}
        <Card>
          <CardHeader>
            <CardTitle>Inline Equations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700">
              The hidden state <InlineEquation latex="h_t" /> is computed at
              each time step using the previous state{' '}
              <InlineEquation latex="h_{t-1}" /> and the current input{' '}
              <InlineEquation latex="x_t" />. The activation function{' '}
              <InlineEquation latex="\tanh" /> squashes values to the range{' '}
              <InlineEquation latex="[-1, 1]" />.
            </p>
          </CardContent>
        </Card>

        {/* Complex Equations */}
        <Card>
          <CardHeader>
            <CardTitle>LSTM Gate Equations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Equation
              latex="f_t = \sigma(W_f \cdot [h_{t-1}, x_t] + b_f)"
              label="Forget Gate"
              symbols={[
                { symbol: 'f_t', color: 'blue', meaning: 'Forget gate output' },
                { symbol: '\\sigma', color: 'gray', meaning: 'Sigmoid activation' },
              ]}
            />
            <Equation
              latex="i_t = \sigma(W_i \cdot [h_{t-1}, x_t] + b_i)"
              label="Input Gate"
              symbols={[
                { symbol: 'i_t', color: 'green', meaning: 'Input gate output' },
              ]}
            />
            <Equation
              latex="o_t = \sigma(W_o \cdot [h_{t-1}, x_t] + b_o)"
              label="Output Gate"
              symbols={[
                { symbol: 'o_t', color: 'orange', meaning: 'Output gate output' },
              ]}
            />
          </CardContent>
        </Card>

        {/* Standalone Symbol Table */}
        <Card>
          <CardHeader>
            <CardTitle>Standalone Symbol Table (Compact Mode)</CardTitle>
          </CardHeader>
          <CardContent>
            <SymbolTable symbols={rnnHiddenStateSymbols} compact />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
