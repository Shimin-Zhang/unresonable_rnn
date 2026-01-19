'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, ExplanationCards } from '@/components/ui'
import type { ExplanationItem } from '@/components/ui'

// Sample outputs from Karpathy's char-rnn experiments
const EXPERIMENT_SAMPLES = {
  shakespeare: {
    title: 'Shakespeare',
    dataSize: '4.4MB',
    description: 'Complete works of Shakespeare - plays, sonnets, and poems',
    sample: `PANDARUS:
Alas, I think he shall be come approached and the day
When little srain would be attain'd into being never fed,
And who is but a chain and subjects of his death,
I should not sleep.

Second Senator:
They are away this miseries, produced upon my soul,
Breaking and strongly should be buried, when I perish
The earth and thoughts of many states.

DUKE VINCENTIO:
Well, your wit is in the care of side and that.`,
    insight: 'The model learns iambic pentameter rhythm, character names, stage directions, and dramatic dialogue structure.',
  },
  paulGraham: {
    title: 'Paul Graham Essays',
    dataSize: '1MB',
    description: 'Essays on startups, programming, and technology',
    sample: `The surprised in investors weren't going to raise money. I'm not talking about
someone who would become those.

Inexpense, and in the earliest stage, and often, and that's like to be the company.
At some point they were being with the start to go to a most start,
a lot more about it is that means that every founder is something
that I was most, they had to be funding.`,
    insight: 'Captures the essay style, startup vocabulary, and argumentative structure typical of PG essays.',
  },
  wikipedia: {
    title: 'Wikipedia',
    dataSize: '100MB (Hutter Prize)',
    description: 'Wikipedia XML dump - encyclopedic content with markup',
    sample: `Naturalism and decision for the majority of Arab countries' capitalisms and
the Ede in which was also the formation of the material said by the species
of the 1970s, the the Minede of Algeria's French colony. The ethnic first
the [[Algeria]]n period of the [[Pede]] of the [[History of Algeria]]...
<ref name="Pede"/>`,
    insight: 'Learns Wikipedia markup, citation format, cross-references, and encyclopedic writing style.',
  },
  latex: {
    title: 'LaTeX (Algebraic Geometry)',
    dataSize: '16MB',
    description: 'Book on algebraic stacks/geometry with complex mathematical notation',
    sample: `\\begin{proof}
We may assume that $\\mathcal{I}$ is an abelian sheaf on $\\mathcal{C}$.
\\item Given a morphism $\\Delta : \\mathcal{F} \\to \\mathcal{I}$
is an injective and $\\mathcal{I}$ is a quasi-coherent sheaf on $\\mathcal{C}$,
then $\\mathcal{I}$ is an abelian subcategory.
\\end{proof}`,
    insight: 'Produces valid LaTeX syntax, mathematical notation, theorem environments, and proof structures.',
  },
  linuxKernel: {
    title: 'Linux Kernel Source',
    dataSize: '474MB',
    description: 'C code from the Linux kernel codebase',
    sample: `/*
 *  Increment the size file of the new incorrect-Loss Ringer,
 *  expand_argument(in + 1, &(in), &flag_value);
 *  if (strcmp(buf, key) < 0)
 *    return -1;
 *
 *  For the software, all and in-channel this value must be
 *  found to be less than the internal.
 */
static int __init init_module(void)
{
    return driver_register(&example_driver);
}`,
    insight: 'Learns C syntax, kernel coding conventions, comment styles, and function signatures.',
  },
  babyNames: {
    title: 'Baby Names',
    dataSize: '8,000 names',
    description: 'List of common baby names',
    sample: `Rsjsjdsjd
Mavede
Jsjdjejv
Marrida
Chaede
Layede
Trede`,
    insight: 'Early training produces random characters; with more training, generates plausible name-like sequences.',
  },
}

// Training dynamics samples showing progression
const TRAINING_PROGRESSION = [
  {
    iteration: 100,
    description: 'Random babbling',
    sample: `tyntd-Loss Ringer, expand
weprof. In the sontain the a]
of the for is dede a]gent-Loss Ringer`,
    notes: 'Model has learned spaces and basic character frequencies but no coherent structure.',
  },
  {
    iteration: 300,
    description: 'Learning word boundaries',
    sample: `"The the shall to the serval,
And all the stranger, the stranger."

KING RICHARD III:
And if the shall have a stranger,
With the stranger that we have a stranger.`,
    notes: 'Words emerge, basic sentence structure appears, character names start forming.',
  },
  {
    iteration: 500,
    description: 'Basic structure emerges',
    sample: `KING RICHARD III:
I would the state and the ground for the ground
And the state of the world and the ground,
And we have the state and the state.

Second Citizen:
Come, what is the ground for the state?`,
    notes: 'Dialogue structure, character names, and dramatic conventions are recognizable.',
  },
  {
    iteration: 2000,
    description: 'Coherent generation',
    sample: `KING RICHARD III:
So shall the terror of my sojourn stand
Upon the bloody brothers of the field;
Where I will leave you to the heaven's guard,
And live in peace, and think upon the dead.

QUEEN ELIZABETH:
As I intend to prosper and repent,
So thrive I in my dangerous attempt.`,
    notes: 'Near-perfect iambic pentameter, coherent themes, proper dramatic structure.',
  },
]

// Neuron visualization examples
const NEURON_VISUALIZATIONS = [
  {
    id: 'url-detector',
    title: 'URL Detector Neuron',
    description: 'A neuron that activates specifically when inside URLs',
    visualization: `http://www.google.com/search?q=hello
     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     [========= HIGH ACTIVATION =========]

normal text here and more text
     [--- low activation throughout ---]

Visit http://example.com for more
           ^^^^^^^^^^^^^^^^^
           [=== ACTIVATED ===]`,
    insight: 'Without explicit URL training, the network learned a neuron that detects URL context.',
  },
  {
    id: 'quote-tracker',
    title: 'Quote State Neuron',
    description: 'Tracks whether currently inside or outside quotation marks',
    visualization: `He said "hello world" and then left.
         |         |
         ON -----> OFF

"This is a longer quote that spans
[============ ON ===================
multiple words" and ends here.
===============]OFF`,
    insight: 'The neuron maintains state across many characters, remembering if a quote is open.',
  },
  {
    id: 'bracket-counter',
    title: 'Bracket Depth Cell',
    description: 'Tracks nested bracket/parenthesis depth in code',
    visualization: `if (condition && (x > 0)) {
   |             |      | |
   1             2      1 0

function(arg1, (nested, (deep))) {
         |     |        |   | |
         1     2        3   2 1`,
    insight: 'The network learns to count nesting levels, crucial for generating valid code.',
  },
  {
    id: 'position-counter',
    title: 'Line Position Neuron',
    description: 'Encodes position within the current line (for indentation)',
    visualization: `[BOL] def function():
 ^    ^^^^^^^^^^^^^^^^
 0    increasing activation

[BOL]     return value
 ^    ^^^^
 0    high (indented)`,
    insight: 'Helps the model maintain consistent indentation in generated code.',
  },
]

// Stakeholder explanations for experiments
const experimentExplanations: ExplanationItem[] = [
  {
    audience: 'casual',
    label: 'Dinner Party',
    content: "Imagine teaching someone to write by having them read millions of examples. That's what these experiments do - feed an AI different types of text (Shakespeare, computer code, Wikipedia) and see what it learns. The fascinating part? Without being told the rules, it figures out poetry rhythm, code syntax, and encyclopedia formatting all on its own.",
    highlights: ['millions of examples', 'figures out', 'on its own'],
  },
  {
    audience: 'business',
    label: 'For Managers',
    content: "These experiments demonstrate that the same simple architecture can learn vastly different domains - from literary prose to technical code. The business insight: you don't need custom AI for each use case. A well-designed learning system can adapt to your specific domain if given enough representative examples. This is the foundation of modern AI adaptability.",
    highlights: ['same simple architecture', 'different domains', 'adapt to your specific domain'],
  },
  {
    audience: 'technical',
    label: 'Technical',
    content: "The experiments use a 3-layer LSTM with 512 hidden units per layer, trained with SGD and gradient clipping. The remarkable finding is that the same hyperparameters work across vastly different domains. The model learns domain-specific features automatically: LaTeX math environments, C preprocessor directives, iambic pentameter - all emerge from next-character prediction without explicit rules.",
    highlights: ['3-layer LSTM', '512 hidden units', 'next-character prediction'],
  },
  {
    audience: 'interview',
    label: 'Interview',
    content: "Karpathy's char-rnn experiments showed that character-level language models can learn complex, domain-specific patterns purely from data. Key findings: (1) The same architecture generalizes across domains, (2) Models learn hierarchical structure (characters → words → sentences → documents), (3) Individual neurons develop interpretable functions like tracking quotes or counting brackets. This work presaged the scaling insights that led to modern LLMs.",
    highlights: ['character-level', 'hierarchical structure', 'interpretable functions'],
  },
]

function ExperimentCard({
  experiment
}: {
  experiment: typeof EXPERIMENT_SAMPLES[keyof typeof EXPERIMENT_SAMPLES]
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle as="h3" className="text-lg">{experiment.title}</CardTitle>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            {experiment.dataSize}
          </span>
        </div>
        <CardDescription>{experiment.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
            {experiment.sample}
          </pre>
        </div>
        <p className="text-sm text-slate-600 italic">
          {experiment.insight}
        </p>
      </CardContent>
    </Card>
  )
}

function TrainingProgressionSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Training Dynamics: Watching Learning Unfold</CardTitle>
        <CardDescription>
          How generated text evolves from random noise to coherent prose
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-slate-700">
          One of the most fascinating aspects of training char-rnn is watching the model&apos;s output
          evolve over time. Here&apos;s how Shakespeare generation improves from iteration 100 to 2000:
        </p>

        <div className="space-y-6">
          {TRAINING_PROGRESSION.map((stage, index) => (
            <div key={stage.iteration} className="relative">
              {/* Timeline connector */}
              {index < TRAINING_PROGRESSION.length - 1 && (
                <div className="absolute left-6 top-12 h-full w-0.5 bg-gradient-to-b from-primary-300 to-primary-100" />
              )}

              <div className="flex gap-4">
                {/* Iteration badge */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-700">{stage.iteration}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-slate-900">{stage.description}</h4>
                    <span className="text-xs text-slate-500">iter {stage.iteration}</span>
                  </div>

                  <div className="bg-slate-900 rounded-lg p-3 mb-2">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                      {stage.sample}
                    </pre>
                  </div>

                  <p className="text-sm text-slate-600">{stage.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mt-6">
          <h4 className="font-semibold text-amber-900 mb-2">Key Observation</h4>
          <p className="text-sm text-amber-800">
            The model learns structure hierarchically: first character frequencies, then word boundaries,
            then sentence structure, then paragraph organization, and finally semantic coherence.
            This mirrors how humans learn language - sounds → words → grammar → meaning.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function NeuronVisualizationSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Looking Inside: Interpretable Neurons</CardTitle>
        <CardDescription>
          Individual neurons learn specific, human-interpretable functions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-slate-700">
          When Karpathy examined the hidden state activations, he discovered that individual
          neurons had learned specific, interpretable functions - without being explicitly
          programmed to do so. Here are some remarkable examples:
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {NEURON_VISUALIZATIONS.map((neuron) => (
            <div
              key={neuron.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <h4 className="font-semibold text-slate-900 mb-1">{neuron.title}</h4>
              <p className="text-sm text-slate-600 mb-3">{neuron.description}</p>

              <div className="bg-slate-900 rounded-lg p-3 mb-3">
                <pre className="text-xs text-cyan-400 font-mono whitespace-pre">
                  {neuron.visualization}
                </pre>
              </div>

              <p className="text-xs text-slate-500 italic">{neuron.insight}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-primary-50 border border-primary-200 p-4">
          <h4 className="font-semibold text-primary-900 mb-2">Why This Matters</h4>
          <p className="text-sm text-primary-800">
            These interpretable neurons demonstrate that neural networks don&apos;t just memorize -
            they learn <em>abstractions</em>. The URL detector neuron has learned the concept of
            &quot;being inside a URL&quot; from pure character sequences. This emergent abstraction
            is a key insight into how deep learning works.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function Module5Content() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle as="h2">The Unreasonable Effectiveness in Action</CardTitle>
          <CardDescription>
            Karpathy&apos;s char-rnn experiments demonstrated what RNNs can learn from raw text
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            In 2015, Andrej Karpathy trained a simple character-level RNN on various text corpora
            and was surprised by the results. The model learned not just to generate plausible text,
            but to capture the deep structure of each domain - from the rhythm of Shakespeare&apos;s
            iambic pentameter to the syntax of C code.
          </p>
          <p className="text-slate-700 leading-relaxed">
            These experiments became legendary in the ML community because they showed that a
            relatively simple model could learn remarkably complex patterns. Let&apos;s explore
            what the model learned from each dataset.
          </p>
        </CardContent>
      </Card>

      {/* Stakeholder Explanations */}
      <ExplanationCards items={experimentExplanations} title="Explain These Experiments to Your Stakeholders" />

      {/* Experiments Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">The Experiments</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <ExperimentCard experiment={EXPERIMENT_SAMPLES.shakespeare} />
          <ExperimentCard experiment={EXPERIMENT_SAMPLES.paulGraham} />
          <ExperimentCard experiment={EXPERIMENT_SAMPLES.wikipedia} />
          <ExperimentCard experiment={EXPERIMENT_SAMPLES.latex} />
          <ExperimentCard experiment={EXPERIMENT_SAMPLES.linuxKernel} />
          <ExperimentCard experiment={EXPERIMENT_SAMPLES.babyNames} />
        </div>
      </div>

      {/* Training Progression */}
      <TrainingProgressionSection />

      {/* Neuron Visualization */}
      <NeuronVisualizationSection />

      {/* Key Takeaways */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardHeader>
          <CardTitle className="text-emerald-900">Key Takeaways from the Experiments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              'The same architecture learns vastly different domains - no domain-specific engineering needed',
              'Character-level models learn hierarchical structure: chars → words → sentences → documents',
              'Training progression reveals learning dynamics: structure before semantics',
              'Individual neurons develop interpretable functions (URL detection, quote tracking, bracket counting)',
              'Model quality scales with data size and training time - a precursor to modern scaling laws',
            ].map((takeaway, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-white/50 p-3"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  {index + 1}
                </span>
                <p className="text-slate-700">{takeaway}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection to Modern AI */}
      <Card>
        <CardHeader>
          <CardTitle as="h2">From char-rnn to GPT: The Legacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            These experiments, while using a now-outdated architecture, established principles
            that power today&apos;s language models:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Then (char-rnn, 2015)</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• 3-layer LSTM, ~10M parameters</li>
                <li>• Trained on 1-100MB text</li>
                <li>• Character-level prediction</li>
                <li>• Could generate plausible text</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Now (GPT-4, 2023+)</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Transformer, ~1T+ parameters</li>
                <li>• Trained on petabytes of text</li>
                <li>• Token-level (subword) prediction</li>
                <li>• Emergent reasoning abilities</li>
              </ul>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-4 italic">
            The core insight remains the same: train a model to predict the next token,
            and it will learn the structure of the domain. Scale it up, and remarkable
            capabilities emerge.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Module5Content
