'use client'

import { Equation, InlineEquation } from '@/components/equations'
import type { SymbolDefinition } from '@/components/equations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, ExplanationCards } from '@/components/ui'
import type { ExplanationItem } from '@/components/ui'
import { Quiz } from '@/components/interactive/quiz/Quiz'
import { MODULE_6_QUIZ } from '@/content/module-6/quiz'

// Symbol definitions for encoder equation
const encoderSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#2563eb}{h_{enc}}',
    color: 'blue',
    meaning: 'Encoder hidden state',
    details: 'The compressed representation of the entire input sequence',
  },
  {
    symbol: '\\color{#16a34a}{RNN_{enc}}',
    color: 'green',
    meaning: 'Encoder RNN',
    details: 'Processes input sequence and builds up context',
  },
  {
    symbol: '\\color{#ea580c}{x_1, ..., x_n}',
    color: 'orange',
    meaning: 'Input sequence',
    details: 'The source sequence (e.g., French sentence, image features)',
  },
]

// Symbol definitions for decoder equation
const decoderSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#dc2626}{y_t}',
    color: 'red',
    meaning: 'Output at time t',
    details: 'The generated token at each timestep',
  },
  {
    symbol: '\\color{#16a34a}{RNN_{dec}}',
    color: 'green',
    meaning: 'Decoder RNN',
    details: 'Generates output sequence conditioned on encoder state',
  },
  {
    symbol: '\\color{#2563eb}{h_{enc}}',
    color: 'blue',
    meaning: 'Encoder hidden state',
    details: 'Context from the encoder, typically used to initialize decoder',
  },
  {
    symbol: '\\color{#9333ea}{y_1, ..., y_{t-1}}',
    color: 'purple',
    meaning: 'Previous outputs',
    details: 'Previously generated tokens (autoregressive)',
  },
]

// Symbol definitions for image captioning
const captioningSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#2563eb}{v}',
    color: 'blue',
    meaning: 'Visual features',
    details: 'CNN output - a vector capturing image content',
  },
  {
    symbol: '\\color{#16a34a}{CNN}',
    color: 'green',
    meaning: 'Convolutional Neural Network',
    details: 'Extracts visual features (e.g., VGG, ResNet)',
  },
  {
    symbol: '\\color{#ea580c}{I}',
    color: 'orange',
    meaning: 'Input image',
    details: 'Raw pixel values of the image',
  },
  {
    symbol: '\\color{#dc2626}{h_0}',
    color: 'red',
    meaning: 'Initial hidden state',
    details: 'RNN initialized with visual features',
  },
]

// Stakeholder explanations for encoder-decoder
const encoderDecoderExplanations: ExplanationItem[] = [
  {
    audience: 'business',
    label: 'The Universal Translator Pattern',
    content: 'The encoder-decoder architecture is like a skilled interpreter: first, fully understand the source (encoder), then produce the output in a new form (decoder). This same pattern powers Google Translate, image captioning, and speech-to-text - any task where you need to transform one sequence into another.',
  },
  {
    audience: 'technical',
    label: 'Sequence-to-Sequence Learning',
    content: 'Encoder-decoder (seq2seq) consists of two RNNs: the encoder compresses variable-length input into a fixed-size context vector, and the decoder generates output autoregressively conditioned on this context. The bottleneck is problematic for long sequences - attention mechanisms address this.',
  },
  {
    audience: 'casual',
    label: 'Compress, Then Generate',
    content: 'Think of it like reading a book in Spanish, summarizing the key points in your head, then writing that summary in English. The encoder "reads" the input, the context vector is your mental summary, and the decoder "writes" the output.',
  },
]

// Stakeholder explanations for image captioning
const captioningExplanations: ExplanationItem[] = [
  {
    audience: 'business',
    label: 'When AI Learned to See and Speak',
    content: 'Image captioning was a watershed moment: it proved AI could bridge perception and language. This technology now powers alt-text generation for accessibility, photo organization in your phone, and content moderation at scale. It is the foundation of multimodal AI.',
  },
  {
    audience: 'technical',
    label: 'CNN + RNN Pipeline',
    content: 'The CNN acts as a visual encoder, extracting a feature vector from the penultimate layer. This vector initializes the RNN hidden state or is fed as input at each timestep. Training uses cross-entropy loss on ground-truth captions. Beam search improves generation quality.',
  },
  {
    audience: 'casual',
    label: 'Teaching AI to Describe Pictures',
    content: 'The CNN looks at the image and says "I see a dog, grass, and a ball." The RNN takes those observations and strings them into a sentence: "A dog is playing with a ball on the grass." Two AIs working together, each doing what it does best.',
  },
]

// Stakeholder explanations for translation
const translationExplanations: ExplanationItem[] = [
  {
    audience: 'business',
    label: 'The Dawn of Neural Translation',
    content: 'In 2016, Google switched from phrase-based statistical translation to neural machine translation, achieving the biggest single quality improvement in the history of the product. This architecture processed 100+ billion words daily and became the foundation for modern translation services.',
  },
  {
    audience: 'technical',
    label: 'Neural Machine Translation (NMT)',
    content: 'NMT uses encoder-decoder with bidirectional LSTM encoders. Key innovations: reversing source sentences improved results (puts related words closer during decoding), multi-layer stacking increased capacity, and attention mechanisms (next module) solved the long-sequence problem.',
  },
  {
    audience: 'casual',
    label: 'Beyond Word-by-Word Translation',
    content: 'Old translators worked word-by-word: "Je suis" becomes "I am." Neural translation reads the whole sentence first, understands the meaning, then writes it fresh in the new language - handling idioms, grammar differences, and context naturally.',
  },
]

// Stakeholder explanations for speech recognition
const speechExplanations: ExplanationItem[] = [
  {
    audience: 'business',
    label: 'Voice as Interface',
    content: 'Speech recognition transformed how we interact with devices. Siri, Alexa, and Google Assistant all rely on RNN-based acoustic models. The technology has achieved human-parity on benchmark tasks and processes billions of voice queries daily.',
  },
  {
    audience: 'technical',
    label: 'CTC and Sequence Transduction',
    content: 'Speech uses spectrograms as input to bidirectional LSTMs. Connectionist Temporal Classification (CTC) handles alignment between audio frames and characters without explicit segmentation. Modern systems combine acoustic models with language models for improved accuracy.',
  },
  {
    audience: 'casual',
    label: 'From Sound Waves to Words',
    content: 'The RNN listens to a stream of sound and figures out what you said. It is not matching sounds to a dictionary - it is learned to understand how speech flows, handling accents, background noise, and the way words blend together in natural speech.',
  },
]

export function Module6Content() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Module 6: Beyond Text - RNNs in Vision, Speech, and Translation</CardTitle>
          <CardDescription>
            How RNNs became the universal glue connecting different AI capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            Until now, we have focused on RNNs for text. But the real breakthrough came when
            researchers realized RNNs could be the <strong>interface between different modalities</strong>.
            See an image? Describe it with an RNN. Hear speech? Transcribe it with an RNN. Translate
            between languages? Encode with one RNN, decode with another.
          </p>
          <p className="text-slate-700 leading-relaxed">
            This module covers the encoder-decoder architecture and its applications to image captioning,
            machine translation, and speech recognition. These innovations from 2014-2016 represented
            the state of the art before Transformers - and the underlying principles still inform
            modern multimodal AI.
          </p>
        </CardContent>
      </Card>

      {/* The Encoder-Decoder Paradigm */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔄</span>
            <span className="text-sm font-medium text-blue-700">Core Architecture</span>
          </div>
          <CardTitle className="text-blue-900">The Encoder-Decoder Paradigm</CardTitle>
          <CardDescription className="text-blue-700">
            One architecture to transform them all
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={encoderDecoderExplanations} />

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">The Two-Stage Process</h4>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h5 className="font-medium text-blue-900 mb-3">Stage 1: Encode</h5>
                <Equation
                  latex="h_{enc} = RNN_{enc}(x_1, x_2, ..., x_n)"
                  label="Encoder"
                  symbols={encoderSymbols}
                />
                <p className="text-sm text-blue-700 mt-3">
                  The encoder reads the entire input sequence and compresses it into a
                  fixed-size <strong>context vector</strong> - the final hidden state.
                </p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h5 className="font-medium text-green-900 mb-3">Stage 2: Decode</h5>
                <Equation
                  latex="y_t = RNN_{dec}(h_{enc}, y_1, ..., y_{t-1})"
                  label="Decoder"
                  symbols={decoderSymbols}
                />
                <p className="text-sm text-green-700 mt-3">
                  The decoder generates output one token at a time, conditioned on the
                  context vector and its previous outputs.
                </p>
              </div>
            </div>
          </div>

          {/* Visual diagram */}
          <div className="mt-6 rounded-lg bg-slate-50 p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Information Flow</h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 font-mono text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-orange-100 text-orange-800 px-3 py-2 rounded">Input Sequence</span>
                <span className="text-slate-400">→</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded">Encoder RNN</span>
                <span className="text-slate-400">→</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-200 text-purple-900 px-4 py-2 rounded-full font-bold">Context Vector</span>
                <span className="text-slate-400">→</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-2 rounded">Decoder RNN</span>
                <span className="text-slate-400">→</span>
              </div>
              <span className="bg-red-100 text-red-800 px-3 py-2 rounded">Output Sequence</span>
            </div>
            <p className="text-sm text-slate-600 mt-4 text-center">
              The context vector is the information bottleneck - it must capture everything needed to generate the output.
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mt-4">
            <h5 className="font-medium text-amber-900 mb-2">The Bottleneck Problem</h5>
            <p className="text-amber-800 text-sm">
              Compressing an entire sentence (or image) into a single vector works for short sequences but
              degrades for longer ones. This limitation motivated <strong>attention mechanisms</strong>, which
              we will cover in the next module.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Image Captioning */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🖼️</span>
            <span className="text-sm font-medium text-purple-700">Application 1</span>
          </div>
          <CardTitle className="text-purple-900">Image Captioning: CNN + RNN</CardTitle>
          <CardDescription className="text-purple-700">
            Teaching AI to describe what it sees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={captioningExplanations} />

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">The Architecture</h4>
            <p className="text-slate-700 mb-4">
              Image captioning combines two powerful architectures: a CNN for visual understanding and an
              RNN for language generation.
            </p>

            <div className="rounded-lg bg-slate-50 p-4 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">1</span>
                <div className="flex-1">
                  <span className="font-medium text-slate-900">Extract visual features</span>
                  <p className="text-sm text-slate-600 mt-1">
                    Pass image through pre-trained CNN (VGG, ResNet). Take output of penultimate layer.
                  </p>
                  <div className="mt-2 bg-white p-2 rounded border text-sm font-mono">
                    <InlineEquation latex="v = CNN(I) \in \mathbb{R}^{4096}" />
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">2</span>
                <div className="flex-1">
                  <span className="font-medium text-slate-900">Initialize RNN with visual features</span>
                  <p className="text-sm text-slate-600 mt-1">
                    Transform features to initialize hidden state, or feed as input at each timestep.
                  </p>
                  <div className="mt-2 bg-white p-2 rounded border text-sm font-mono">
                    <InlineEquation latex="h_0 = W_v \cdot v" />
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">3</span>
                <div className="flex-1">
                  <span className="font-medium text-slate-900">Generate caption autoregressively</span>
                  <p className="text-sm text-slate-600 mt-1">
                    RNN predicts one word at a time, feeding output back as next input.
                  </p>
                  <div className="mt-2 bg-white p-2 rounded border text-sm font-mono">
                    <InlineEquation latex="p(w_t | w_1...w_{t-1}, I)" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example */}
          <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h5 className="font-medium text-purple-900 mb-3">Example Caption Generation</h5>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded p-3">
                <div className="w-full h-32 bg-gradient-to-br from-green-200 to-blue-200 rounded flex items-center justify-center text-4xl mb-2">
                  🐕🎾🌳
                </div>
                <p className="text-xs text-slate-500 text-center">Hypothetical image</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-700"><strong>CNN extracts:</strong></p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Dog detector: 0.95</li>
                  <li>• Ball detector: 0.87</li>
                  <li>• Outdoor scene: 0.92</li>
                  <li>• Grass texture: 0.78</li>
                </ul>
                <p className="text-sm text-slate-700 mt-3"><strong>RNN generates:</strong></p>
                <p className="text-sm font-mono bg-white p-2 rounded border text-purple-800">
                  &quot;A dog is playing with a ball in the park&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-100 p-4 mt-4">
            <h5 className="font-medium text-slate-900 mb-2">Historical Impact</h5>
            <p className="text-slate-700 text-sm">
              The 2014 paper &quot;Show and Tell&quot; (Vinyals et al.) achieved BLEU scores that were considered
              impossible just years earlier. This proved that deep learning could bridge perception and language -
              a key step toward multimodal AI systems like GPT-4V and Gemini.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Machine Translation */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌐</span>
            <span className="text-sm font-medium text-green-700">Application 2</span>
          </div>
          <CardTitle className="text-green-900">Machine Translation</CardTitle>
          <CardDescription className="text-green-700">
            The application that revolutionized an industry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={translationExplanations} />

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Encoder-Decoder for Translation</h4>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm font-mono">
                  <span className="text-blue-700 font-bold">French:</span>
                  <span className="bg-blue-100 px-2 py-1 rounded">&quot;Je&quot;</span>
                  <span className="bg-blue-100 px-2 py-1 rounded">&quot;suis&quot;</span>
                  <span className="bg-blue-100 px-2 py-1 rounded">&quot;etudiant&quot;</span>
                  <span className="text-slate-400">→</span>
                  <span className="bg-purple-200 px-3 py-1 rounded-full font-bold">h</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono">
                  <span className="text-green-700 font-bold">English:</span>
                  <span className="bg-purple-200 px-3 py-1 rounded-full font-bold">h</span>
                  <span className="text-slate-400">→</span>
                  <span className="bg-green-100 px-2 py-1 rounded">&quot;I&quot;</span>
                  <span className="bg-green-100 px-2 py-1 rounded">&quot;am&quot;</span>
                  <span className="bg-green-100 px-2 py-1 rounded">&quot;a&quot;</span>
                  <span className="bg-green-100 px-2 py-1 rounded">&quot;student&quot;</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-4">
                The context vector <InlineEquation latex="h" /> captures the meaning of the French sentence,
                allowing the decoder to generate the English translation word by word.
              </p>
            </div>
          </div>

          {/* Key innovations */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Key Innovations</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-green-200 bg-white p-4">
                <h5 className="font-medium text-green-900 mb-2">Reverse Source Sequence</h5>
                <p className="text-sm text-slate-600">
                  Surprisingly, reversing the source sentence improved results significantly.
                  &quot;Je suis etudiant&quot; becomes &quot;etudiant suis Je&quot;. This puts the first
                  words of source and target closer together in the computation graph.
                </p>
              </div>
              <div className="rounded-lg border border-green-200 bg-white p-4">
                <h5 className="font-medium text-green-900 mb-2">Bidirectional Encoding</h5>
                <p className="text-sm text-slate-600">
                  Run two RNNs - one forward, one backward - and concatenate their hidden states.
                  This gives each position context from both past and future.
                </p>
              </div>
              <div className="rounded-lg border border-green-200 bg-white p-4">
                <h5 className="font-medium text-green-900 mb-2">Deep Stacking</h5>
                <p className="text-sm text-slate-600">
                  Stack multiple LSTM layers (4-8 layers typical). Each layer operates on the
                  hidden states of the previous layer, building increasingly abstract representations.
                </p>
              </div>
              <div className="rounded-lg border border-green-200 bg-white p-4">
                <h5 className="font-medium text-green-900 mb-2">Beam Search</h5>
                <p className="text-sm text-slate-600">
                  Instead of greedily picking the highest-probability word, maintain the top-k
                  candidates and explore multiple translation paths in parallel.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 border border-green-200 p-4 mt-4">
            <h5 className="font-medium text-green-900 mb-2">The 2016 Revolution</h5>
            <p className="text-green-800 text-sm">
              When Google switched to Neural Machine Translation in 2016, users noticed immediately.
              The quality improvement was so dramatic that some initially thought it was a bug.
              GNMT reduced translation errors by 55-85% compared to the previous phrase-based system.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Speech Recognition */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎤</span>
            <span className="text-sm font-medium text-slate-700">Application 3</span>
          </div>
          <CardTitle>Speech Recognition</CardTitle>
          <CardDescription>
            From sound waves to transcribed text
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={speechExplanations} />

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">The Speech Pipeline</h4>
            <div className="rounded-lg bg-slate-50 p-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">1</span>
                <div className="flex-1">
                  <span className="font-medium text-slate-900">Audio to Spectrogram</span>
                  <p className="text-sm text-slate-600 mt-1">
                    Convert raw audio waveform to mel-frequency spectrograms - 2D images of sound over time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-700">2</span>
                <div className="flex-1">
                  <span className="font-medium text-slate-900">Bidirectional LSTM</span>
                  <p className="text-sm text-slate-600 mt-1">
                    Process spectrograms with stacked bidirectional LSTMs to extract acoustic features.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">3</span>
                <div className="flex-1">
                  <span className="font-medium text-slate-900">CTC Decoding</span>
                  <p className="text-sm text-slate-600 mt-1">
                    Use Connectionist Temporal Classification to align variable-length audio to text without explicit segmentation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-medium text-orange-700">4</span>
                <div className="flex-1">
                  <span className="font-medium text-slate-900">Language Model Fusion</span>
                  <p className="text-sm text-slate-600 mt-1">
                    Combine acoustic model output with language model to improve fluency and correct errors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 p-4">
            <h5 className="font-medium text-slate-900 mb-3">The Alignment Challenge</h5>
            <p className="text-slate-700 text-sm mb-3">
              A key challenge in speech recognition: there is no one-to-one correspondence between audio
              frames and characters. The same word spoken at different speeds produces different numbers
              of frames.
            </p>
            <div className="bg-slate-50 p-3 rounded font-mono text-sm">
              <div className="mb-2 text-slate-600">Audio frames: [frame1] [frame2] [frame3] [frame4] [frame5] [frame6]</div>
              <div className="text-slate-600">CTC output:   &nbsp;&nbsp;H&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;l&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;l&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;o</div>
              <div className="mt-2 text-green-700">Collapsed:&nbsp;&nbsp;&nbsp;&nbsp;&quot;Hello&quot;</div>
            </div>
            <p className="text-slate-600 text-xs mt-2">
              CTC introduces a blank symbol (-) to handle variable-length alignment, then collapses repeated characters.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Visual Question Answering */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">❓</span>
            <span className="text-sm font-medium text-slate-700">Application 4</span>
          </div>
          <CardTitle>Visual Question Answering (VQA)</CardTitle>
          <CardDescription>
            Understanding images through natural language questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-700 leading-relaxed">
            VQA combines everything: visual understanding from CNNs, language understanding from RNNs,
            and reasoning to produce answers. Given an image and a question, the model must understand
            both and generate an appropriate response.
          </p>

          <div className="rounded-lg bg-slate-50 p-4">
            <h5 className="font-medium text-slate-900 mb-3">Example VQA Interaction</h5>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded p-3">
                <div className="w-full h-32 bg-gradient-to-br from-blue-200 to-yellow-200 rounded flex items-center justify-center text-4xl mb-2">
                  🏖️👨‍👩‍👧‍👦⛱️
                </div>
                <p className="text-xs text-slate-500 text-center">Beach scene</p>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-sm text-blue-800"><strong>Q:</strong> What are the people doing?</p>
                  <p className="text-sm text-blue-600"><strong>A:</strong> Playing on the beach</p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-sm text-green-800"><strong>Q:</strong> How many people are there?</p>
                  <p className="text-sm text-green-600"><strong>A:</strong> Four</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <p className="text-sm text-purple-800"><strong>Q:</strong> Is it sunny?</p>
                  <p className="text-sm text-purple-600"><strong>A:</strong> Yes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="font-medium text-slate-900 mb-3">Architecture Overview</h5>
            <div className="rounded-lg border border-slate-200 p-4 font-mono text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-orange-600">Image</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-blue-600">CNN</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-purple-600">Visual Features (v)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">Question</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-blue-600">LSTM</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-purple-600">Question Features (q)</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-purple-600">v ⊕ q</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-blue-600">MLP</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-red-600">Answer</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              The visual and question features are combined (often via element-wise multiplication or concatenation)
              and passed through a classifier to predict the answer.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* RNNs as Universal Glue */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🧩</span>
            <span className="text-sm font-medium text-amber-700">Key Insight</span>
          </div>
          <CardTitle className="text-amber-900">
            RNNs as the Universal Glue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            The remarkable insight from this era (2014-2017) was that RNNs could serve as a
            <strong> universal interface</strong> between different types of data. Any input that
            could be encoded as a sequence could be processed by an RNN, and any output that
            could be generated sequentially could be produced by an RNN.
          </p>

          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <div className="rounded-lg border border-amber-200 bg-white/50 p-4">
              <h5 className="font-medium text-amber-900 mb-2">Input: Anything</h5>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Images (via CNN)</li>
                <li>• Audio (via spectrograms)</li>
                <li>• Text (via embeddings)</li>
                <li>• Video (frame by frame)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-200 bg-white/50 p-4">
              <h5 className="font-medium text-amber-900 mb-2">Process: RNN</h5>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Encode to context vector</li>
                <li>• Maintain hidden state</li>
                <li>• Decode autoregressively</li>
                <li>• End-to-end training</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-200 bg-white/50 p-4">
              <h5 className="font-medium text-amber-900 mb-2">Output: Anything</h5>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Text (captions, translations)</li>
                <li>• Labels (classification)</li>
                <li>• Speech (text-to-speech)</li>
                <li>• Actions (reinforcement learning)</li>
              </ul>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mt-4">
            This universality was both RNNs&apos; greatest strength and their limitation. While they
            could theoretically handle any sequence task, the bottleneck of compressing information
            through fixed-size hidden states limited their practical performance on long sequences.
            The attention mechanism, which we will cover next, addressed this limitation and eventually
            led to the Transformer architecture that dominates today.
          </p>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h5 className="font-semibold text-slate-900 mb-3">Key Equations</h5>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><strong>Encoder:</strong> <InlineEquation latex="h_{enc} = RNN_{enc}(x_1...x_n)" /></li>
                <li><strong>Decoder:</strong> <InlineEquation latex="y_t = RNN_{dec}(h_{enc}, y_{<t})" /></li>
                <li><strong>Image features:</strong> <InlineEquation latex="v = CNN(I)" /></li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h5 className="font-semibold text-slate-900 mb-3">Key Applications</h5>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• <strong>Image Captioning:</strong> CNN + RNN generates descriptions</li>
                <li>• <strong>Translation:</strong> Encoder-decoder across languages</li>
                <li>• <strong>Speech:</strong> Bidirectional LSTM with CTC</li>
                <li>• <strong>VQA:</strong> Multimodal fusion for QA</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h5 className="font-semibold text-slate-900 mb-3">Key Concepts</h5>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• <strong>Encoder-decoder:</strong> Compress input, then generate output</li>
              <li>• <strong>Context vector:</strong> Fixed-size representation of entire input (the bottleneck)</li>
              <li>• <strong>Autoregressive generation:</strong> Output one token at a time, feeding back as input</li>
              <li>• <strong>Multimodal fusion:</strong> Combining features from different modalities</li>
            </ul>
          </div>
          <p className="text-slate-600 text-sm mt-4">
            In the next module, we will see how attention mechanisms solved the bottleneck problem and
            revolutionized sequence modeling - eventually leading to the Transformer architecture that
            powers modern AI.
          </p>
        </CardContent>
      </Card>

      {/* Knowledge Check Quiz */}
      <Card>
        <CardHeader>
          <CardTitle>Test Your Knowledge</CardTitle>
          <CardDescription>
            Check your understanding of encoder-decoder architectures and multimodal applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Quiz config={MODULE_6_QUIZ} />
        </CardContent>
      </Card>
    </div>
  )
}

export default Module6Content
