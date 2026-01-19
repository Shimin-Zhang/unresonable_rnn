'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Quiz } from '@/components/interactive/quiz'
import { MODULE_1_QUIZ } from '@/content/module-1/quiz'
import { KEY_TAKEAWAYS } from '@/content/module-1/content'

export function Section5_KeyTakeaways() {
  return (
    <section className="mb-8">
      {/* Turing Completeness */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle as="h2">1.5 The Power of Recurrence: Turing Completeness</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p>
              Here&apos;s a remarkable fact: RNNs are <strong>Turing-complete</strong>. This means
              they can theoretically simulate any computation that a Turing machine can perform.
            </p>
          </div>

          {/* Quote from Karpathy */}
          <blockquote className="border-l-4 border-primary-500 bg-primary-50 p-4 italic text-slate-700">
            &ldquo;If training vanilla neural nets is optimization over functions, training
            recurrent nets is optimization over programs.&rdquo;
            <footer className="mt-2 text-sm font-medium text-slate-600">
              &mdash; Andrej Karpathy, <cite>The Unreasonable Effectiveness of RNNs</cite>
            </footer>
          </blockquote>

          <div className="prose prose-slate max-w-none">
            <p>
              But there&apos;s an important caveat. As Karpathy notes:
            </p>
          </div>

          <blockquote className="border-l-4 border-amber-400 bg-amber-50 p-4 italic text-slate-700">
            &ldquo;Unlike a random piece of code you find on Github, RNNs have the nice property
            of being differentiable and hence end-to-end trainable with gradient descent.
            However, it&apos;s one thing to say that RNNs can theoretically simulate arbitrary
            programs, but it&apos;s quite another to actually get them to find the right
            program with gradient descent.&rdquo;
          </blockquote>

          {/* Practical implications */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h4 className="font-semibold text-emerald-900 mb-2">Theoretical Power</h4>
              <ul className="text-sm text-emerald-800 space-y-1">
                <li>• Can simulate any computation</li>
                <li>• Hidden state provides working memory</li>
                <li>• Recurrence enables arbitrary loops</li>
                <li>• Parameters are learned, not programmed</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h4 className="font-semibold text-amber-900 mb-2">Practical Limitations</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Finite precision arithmetic</li>
                <li>• Gradient descent may not find the right program</li>
                <li>• Training can be unstable</li>
                <li>• Long-range dependencies are hard</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-slate-100 border border-slate-300 p-4">
            <p className="text-slate-700 italic">
              <span className="font-semibold">Key insight:</span> RNNs are fundamentally
              different from feedforward networks. They&apos;re not just processing data—they&apos;re
              learning programs. This is why they can produce such surprising emergent behaviors,
              from generating Shakespeare to writing C code.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle as="h2">Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {KEY_TAKEAWAYS.map((takeaway, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                  {index + 1}
                </span>
                <p className="text-slate-700">{takeaway}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Check Quiz */}
      <Card>
        <CardHeader>
          <CardTitle as="h2">Knowledge Check</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-slate-600">
            Test your understanding of sequence architectures and why they matter.
            You need 70% to pass.
          </p>
          <Quiz config={MODULE_1_QUIZ} />
        </CardContent>
      </Card>
    </section>
  )
}
