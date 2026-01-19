'use client'

import { InlineEquation } from '@/components/equations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, ExplanationCards } from '@/components/ui'
import type { ExplanationItem } from '@/components/ui'

// Stakeholder explanations for capstone project
const capstoneExplanations: ExplanationItem[] = [
  {
    audience: 'business',
    label: 'From Theory to Practice',
    content: 'The capstone project transforms conceptual understanding into hands-on experience. By training your own model, you will gain intuition for hyperparameter tuning, data quality, and the practical challenges that arise in real AI projects.',
  },
  {
    audience: 'technical',
    label: 'End-to-End ML Pipeline',
    content: 'You will implement the complete ML pipeline: data collection and preprocessing, model architecture selection, training loop with gradient clipping and learning rate scheduling, evaluation metrics (perplexity, sample quality), and model deployment.',
  },
  {
    audience: 'casual',
    label: 'Build Your Own AI Writer',
    content: 'Remember those Shakespeare samples from earlier? Now you will create your own! Pick a text you love - song lyrics, recipes, poetry - and train an RNN to write more of it.',
  },
]

export function Module10Content() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Module 10: Capstone Project - Train Your Own Model</CardTitle>
          <CardDescription>
            Apply everything you have learned by building a complete character-level language model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            Congratulations on reaching the capstone! This module brings together everything from
            the course: RNN architecture, training dynamics, loss functions, sampling strategies,
            and evaluation metrics. You will build a complete, working language model from scratch.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Choose your difficulty level based on your experience and time commitment. Each level
            offers a unique challenge while reinforcing the core concepts.
          </p>
        </CardContent>
      </Card>

      {/* Stakeholder Context */}
      <ExplanationCards items={capstoneExplanations} title="Why Build Your Own Model?" />

      {/* Difficulty Levels */}
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-medium text-slate-700">Choose Your Challenge</span>
          </div>
          <CardTitle>Project Difficulty Levels</CardTitle>
          <CardDescription>
            Select based on your experience and available time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Beginner */}
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌱</span>
                <h4 className="font-semibold text-green-900">Beginner</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Dataset:</span> Song Lyrics (~500KB)</p>
                <p><span className="font-medium">Goal:</span> Generate coherent lyrics with rhyme patterns</p>
                <p className="font-medium">Success Metrics:</p>
                <ul className="list-disc list-inside text-green-700">
                  <li>Loss &lt; 1.5</li>
                  <li>Recognizable words</li>
                  <li>Basic structure</li>
                </ul>
              </div>
            </div>

            {/* Intermediate */}
            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌿</span>
                <h4 className="font-semibold text-blue-900">Intermediate</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Dataset:</span> Code Generator (~5MB)</p>
                <p><span className="font-medium">Goal:</span> 80%+ syntactically parseable code</p>
                <p className="font-medium">Success Metrics:</p>
                <ul className="list-disc list-inside text-blue-700">
                  <li>Loss &lt; 1.2</li>
                  <li>80% parseable</li>
                  <li>Correct indentation</li>
                </ul>
              </div>
            </div>

            {/* Advanced */}
            <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌳</span>
                <h4 className="font-semibold text-purple-900">Advanced</h4>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Dataset:</span> Multi-Author Style (~10MB)</p>
                <p><span className="font-medium">Goal:</span> Human evaluators identify correct author 70%+</p>
                <p className="font-medium">Success Metrics:</p>
                <ul className="list-disc list-inside text-purple-700">
                  <li>Style transfer accuracy</li>
                  <li>Human evaluation</li>
                  <li>Perplexity &lt; 50</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mt-4">
            <h5 className="font-medium text-amber-900 mb-2">Recommendation</h5>
            <p className="text-amber-800 text-sm">
              Start with <strong>Beginner</strong> even if you have experience. The song lyrics
              project trains quickly and provides immediate feedback.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Project Milestones */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🗺️</span>
            <span className="text-sm font-medium text-slate-600">Your Journey</span>
          </div>
          <CardTitle>5 Project Milestones</CardTitle>
          <CardDescription>
            Complete each milestone to earn badges and build your model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Milestone 1 */}
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">1</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-slate-900">Data Preparation</h4>
                  <span className="text-sm bg-slate-100 px-2 py-0.5 rounded">📊 Data Wrangler</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">Collect, clean, and preprocess your training corpus</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>☐ Choose and download your dataset</li>
                  <li>☐ Clean text (remove special characters)</li>
                  <li>☐ Create character/token vocabulary</li>
                  <li>☐ Split into train/validation/test (80/10/10)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">2</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-slate-900">Model Architecture</h4>
                  <span className="text-sm bg-slate-100 px-2 py-0.5 rounded">🏗️ Architect</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">Design and implement your RNN architecture</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>☐ Choose RNN variant (vanilla, LSTM, GRU)</li>
                  <li>☐ Define embedding layer dimensions</li>
                  <li>☐ Set hidden state size (128-512 typical)</li>
                  <li>☐ Implement forward pass</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">3</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-slate-900">Training Loop</h4>
                  <span className="text-sm bg-slate-100 px-2 py-0.5 rounded">🏋️ Trainer</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">Implement robust training with proper optimization</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>☐ Implement cross-entropy loss</li>
                  <li>☐ Set up optimizer (Adam, lr=0.001)</li>
                  <li>☐ Add gradient clipping (max_norm=5)</li>
                  <li>☐ Implement learning rate scheduling</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Milestone 4 */}
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">4</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-slate-900">Evaluation</h4>
                  <span className="text-sm bg-slate-100 px-2 py-0.5 rounded">📈 Evaluator</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">Measure model quality with multiple metrics</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>☐ Calculate validation perplexity</li>
                  <li>☐ Generate samples at different temperatures</li>
                  <li>☐ Compare against baseline (random, n-gram)</li>
                  <li>☐ Analyze failure cases</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Milestone 5 */}
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">5</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-slate-900">Presentation</h4>
                  <span className="text-sm bg-slate-100 px-2 py-0.5 rounded">🎤 Presenter</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">Document and share your results</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>☐ Write project summary</li>
                  <li>☐ Create visualizations (loss curves, samples)</li>
                  <li>☐ Document hyperparameter choices</li>
                  <li>☐ Reflect on what worked and what did not</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏆</span>
            <span className="text-sm font-medium text-amber-700">Gamification</span>
          </div>
          <CardTitle className="text-amber-900">Achievement Badges</CardTitle>
          <CardDescription className="text-amber-700">
            Earn badges as you progress through your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white/50 border border-amber-200 p-4 flex items-start gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <h5 className="font-semibold text-amber-900">First Loss</h5>
                <p className="text-sm text-amber-800">Complete your first training epoch</p>
              </div>
            </div>
            <div className="rounded-lg bg-white/50 border border-amber-200 p-4 flex items-start gap-3">
              <span className="text-3xl">📉</span>
              <div>
                <h5 className="font-semibold text-amber-900">Loss Crusher</h5>
                <p className="text-sm text-amber-800">Achieve loss below 1.5</p>
              </div>
            </div>
            <div className="rounded-lg bg-white/50 border border-amber-200 p-4 flex items-start gap-3">
              <span className="text-3xl">🧠</span>
              <div>
                <h5 className="font-semibold text-amber-900">Perplexity Pro</h5>
                <p className="text-sm text-amber-800">Achieve perplexity below 50</p>
              </div>
            </div>
            <div className="rounded-lg bg-white/50 border border-amber-200 p-4 flex items-start gap-3">
              <span className="text-3xl">✍️</span>
              <div>
                <h5 className="font-semibold text-amber-900">Sample Master</h5>
                <p className="text-sm text-amber-800">Generate 100 coherent samples</p>
              </div>
            </div>
            <div className="rounded-lg bg-white/50 border border-amber-200 p-4 flex items-start gap-3">
              <span className="text-3xl">🌡️</span>
              <div>
                <h5 className="font-semibold text-amber-900">Temperature Explorer</h5>
                <p className="text-sm text-amber-800">Experiment with 5 different temperatures</p>
              </div>
            </div>
            <div className="rounded-lg bg-white/50 border border-amber-200 p-4 flex items-start gap-3">
              <span className="text-3xl">🎓</span>
              <div>
                <h5 className="font-semibold text-amber-900">Course Graduate</h5>
                <p className="text-sm text-amber-800">Complete the entire capstone project</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📊</span>
            <span className="text-sm font-medium text-slate-600">Success Criteria</span>
          </div>
          <CardTitle>Evaluation Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <h5 className="font-semibold text-slate-900 mb-2">Perplexity</h5>
              <div className="mb-3">
                <InlineEquation latex="PPL = e^{L}" />
              </div>
              <p className="text-sm text-slate-600">
                Lower is better. Represents how many characters the model is confused between.
                A good character-level model achieves PPL of 1.5-3.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <h5 className="font-semibold text-slate-900 mb-2">Sample Quality</h5>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• <strong>Coherence:</strong> Do samples make sense?</li>
                <li>• <strong>Style:</strong> Does it match the training data?</li>
                <li>• <strong>Diversity:</strong> Are samples varied?</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <h5 className="font-medium text-slate-900 mb-3">Benchmark Targets by Level</h5>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 font-medium">Level</th>
                    <th className="text-left py-2 pr-4 font-medium">Perplexity</th>
                    <th className="text-left py-2 pr-4 font-medium">Loss</th>
                    <th className="text-left py-2 font-medium">Custom Metric</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4 text-green-700">Beginner</td>
                    <td className="py-2 pr-4">&lt; 5.0</td>
                    <td className="py-2 pr-4">&lt; 1.5</td>
                    <td className="py-2">Recognizable words</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4 text-blue-700">Intermediate</td>
                    <td className="py-2 pr-4">&lt; 3.0</td>
                    <td className="py-2 pr-4">&lt; 1.2</td>
                    <td className="py-2">80% parseable code</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-purple-700">Advanced</td>
                    <td className="py-2 pr-4">&lt; 2.0</td>
                    <td className="py-2 pr-4">&lt; 0.8</td>
                    <td className="py-2">70% style accuracy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips for Success */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💡</span>
            <span className="text-sm font-medium text-green-700">Pro Tips</span>
          </div>
          <CardTitle className="text-green-900">Tips for Success</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h5 className="font-semibold text-slate-900">Training</h5>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Start with a small model and scale up
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Use gradient clipping (max_norm=5)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Monitor validation loss for overfitting
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Save checkpoints every 10 epochs
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-semibold text-slate-900">Debugging</h5>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Overfit on a tiny dataset first
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Check that loss decreases initially
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Generate samples every epoch to track progress
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  If loss explodes, reduce learning rate
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ready to Begin!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            You now have everything you need to build your own character-level language model.
            Remember: the goal is not perfection, but understanding.
          </p>
          <div className="rounded-lg bg-primary-50 border border-primary-200 p-4">
            <h5 className="font-semibold text-primary-900 mb-2">Your Next Steps</h5>
            <ol className="space-y-2 text-sm text-primary-800 list-decimal list-inside">
              <li>Choose your difficulty level</li>
              <li>Collect your dataset</li>
              <li>Work through the 5 milestones</li>
              <li>Earn your badges</li>
              <li>Share your results!</li>
            </ol>
          </div>
          <p className="text-slate-600 text-sm mt-4">
            Congratulations on completing the RNN course! Whether you build a lyrics generator,
            code writer, or style mimic, you are now part of the lineage of researchers who
            discovered the unreasonable effectiveness of recurrent neural networks.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Module10Content
