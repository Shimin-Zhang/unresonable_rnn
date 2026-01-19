'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, ExplanationCards } from '@/components/ui'
import { Equation, InlineEquation } from '@/components/equations'
import type { ExplanationItem } from '@/components/ui'
import type { SymbolDefinition } from '@/components/equations'

// BPTT gradient symbols
const bpttSymbols: SymbolDefinition[] = [
  {
    symbol: '\\frac{\\partial L}{\\partial W}',
    color: 'blue',
    meaning: 'Gradient of loss w.r.t. weights',
    details: 'What we need to compute for learning',
  },
  {
    symbol: '\\frac{\\partial L}{\\partial h_t}',
    color: 'green',
    meaning: 'Gradient at timestep t',
    details: 'Error signal at each position in sequence',
  },
  {
    symbol: '\\frac{\\partial h_t}{\\partial h_{t-1}}',
    color: 'orange',
    meaning: 'Jacobian between timesteps',
    details: 'How hidden state at t depends on t-1',
  },
]

// Implementation tracks
const TRACKS = {
  numpy: {
    id: 'numpy',
    title: 'Track A: NumPy from Scratch',
    subtitle: '~100 lines of pure Python',
    difficulty: 'Educational',
    timeEstimate: '2-3 hours',
    description: 'Karpathy\'s minimal char-rnn implementation. Perfect for understanding every operation.',
    color: 'blue',
    pros: ['Deep understanding of internals', 'No framework magic', 'See every gradient flow'],
    cons: ['Slow training', 'No GPU support', 'Manual everything'],
    code: `"""
Minimal character-level RNN in NumPy
Based on Andrej Karpathy's min-char-rnn.py
"""
import numpy as np

# Hyperparameters
hidden_size = 100
seq_length = 25
learning_rate = 1e-1

# Read data
data = open('input.txt', 'r').read()
chars = list(set(data))
data_size, vocab_size = len(data), len(chars)
char_to_ix = {ch: i for i, ch in enumerate(chars)}
ix_to_char = {i: ch for i, ch in enumerate(chars)}

# Model parameters
Wxh = np.random.randn(hidden_size, vocab_size) * 0.01
Whh = np.random.randn(hidden_size, hidden_size) * 0.01
Why = np.random.randn(vocab_size, hidden_size) * 0.01
bh = np.zeros((hidden_size, 1))
by = np.zeros((vocab_size, 1))

def lossFun(inputs, targets, hprev):
    """Forward pass, loss, backward pass"""
    xs, hs, ys, ps = {}, {}, {}, {}
    hs[-1] = np.copy(hprev)
    loss = 0

    # Forward pass
    for t in range(len(inputs)):
        xs[t] = np.zeros((vocab_size, 1))
        xs[t][inputs[t]] = 1  # one-hot encoding
        hs[t] = np.tanh(Wxh @ xs[t] + Whh @ hs[t-1] + bh)
        ys[t] = Why @ hs[t] + by
        ps[t] = np.exp(ys[t]) / np.sum(np.exp(ys[t]))  # softmax
        loss += -np.log(ps[t][targets[t], 0])

    # Backward pass: compute gradients
    dWxh = np.zeros_like(Wxh)
    dWhh = np.zeros_like(Whh)
    dWhy = np.zeros_like(Why)
    dbh = np.zeros_like(bh)
    dby = np.zeros_like(by)
    dhnext = np.zeros_like(hs[0])

    for t in reversed(range(len(inputs))):
        dy = np.copy(ps[t])
        dy[targets[t]] -= 1  # backprop into y
        dWhy += dy @ hs[t].T
        dby += dy
        dh = Why.T @ dy + dhnext
        dhraw = (1 - hs[t] ** 2) * dh  # tanh backprop
        dbh += dhraw
        dWxh += dhraw @ xs[t].T
        dWhh += dhraw @ hs[t-1].T
        dhnext = Whh.T @ dhraw

    # Clip gradients to prevent explosion
    for dparam in [dWxh, dWhh, dWhy, dbh, dby]:
        np.clip(dparam, -5, 5, out=dparam)

    return loss, dWxh, dWhh, dWhy, dbh, dby, hs[len(inputs)-1]

# Training loop
n, p = 0, 0
mWxh = np.zeros_like(Wxh)  # Adagrad memory
mWhh = np.zeros_like(Whh)
mWhy = np.zeros_like(Why)
mbh = np.zeros_like(bh)
mby = np.zeros_like(by)
smooth_loss = -np.log(1.0/vocab_size) * seq_length

while True:
    if p + seq_length + 1 >= len(data) or n == 0:
        hprev = np.zeros((hidden_size, 1))
        p = 0

    inputs = [char_to_ix[ch] for ch in data[p:p+seq_length]]
    targets = [char_to_ix[ch] for ch in data[p+1:p+seq_length+1]]

    loss, dWxh, dWhh, dWhy, dbh, dby, hprev = lossFun(inputs, targets, hprev)
    smooth_loss = smooth_loss * 0.999 + loss * 0.001

    # Adagrad parameter update
    for param, dparam, mem in zip(
        [Wxh, Whh, Why, bh, by],
        [dWxh, dWhh, dWhy, dbh, dby],
        [mWxh, mWhh, mWhy, mbh, mby]
    ):
        mem += dparam * dparam
        param += -learning_rate * dparam / np.sqrt(mem + 1e-8)

    if n % 1000 == 0:
        print(f'iter {n}, loss: {smooth_loss:.4f}')

    p += seq_length
    n += 1`,
  },
  pytorch: {
    id: 'pytorch',
    title: 'Track B: PyTorch Production',
    subtitle: 'GPU-accelerated LSTM',
    difficulty: 'Practical',
    timeEstimate: '3-4 hours',
    description: 'Production-ready implementation with LSTM, GPU training, and proper validation.',
    color: 'purple',
    pros: ['GPU acceleration', 'Automatic differentiation', 'Production-ready patterns'],
    cons: ['Some framework abstraction', 'Need to understand PyTorch', 'More boilerplate'],
    code: `"""
Production-ready character-level LSTM in PyTorch
"""
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

class CharDataset(Dataset):
    def __init__(self, text, seq_length):
        self.text = text
        self.seq_length = seq_length
        self.chars = sorted(list(set(text)))
        self.char_to_idx = {c: i for i, c in enumerate(self.chars)}
        self.idx_to_char = {i: c for i, c in enumerate(self.chars)}
        self.vocab_size = len(self.chars)

    def __len__(self):
        return len(self.text) - self.seq_length

    def __getitem__(self, idx):
        chunk = self.text[idx:idx + self.seq_length + 1]
        input_seq = torch.tensor([self.char_to_idx[c] for c in chunk[:-1]])
        target_seq = torch.tensor([self.char_to_idx[c] for c in chunk[1:]])
        return input_seq, target_seq

class CharLSTM(nn.Module):
    def __init__(self, vocab_size, embed_size, hidden_size, num_layers, dropout=0.5):
        super().__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.embedding = nn.Embedding(vocab_size, embed_size)
        self.lstm = nn.LSTM(
            embed_size, hidden_size, num_layers,
            batch_first=True, dropout=dropout if num_layers > 1 else 0
        )
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_size, vocab_size)

    def forward(self, x, hidden=None):
        embed = self.embedding(x)
        output, hidden = self.lstm(embed, hidden)
        output = self.dropout(output)
        logits = self.fc(output)
        return logits, hidden

    def init_hidden(self, batch_size, device):
        h0 = torch.zeros(self.num_layers, batch_size, self.hidden_size).to(device)
        c0 = torch.zeros(self.num_layers, batch_size, self.hidden_size).to(device)
        return (h0, c0)

def train_epoch(model, dataloader, criterion, optimizer, device, clip=1.0):
    model.train()
    total_loss = 0

    for batch_idx, (inputs, targets) in enumerate(dataloader):
        inputs, targets = inputs.to(device), targets.to(device)
        batch_size = inputs.size(0)

        hidden = model.init_hidden(batch_size, device)
        optimizer.zero_grad()

        outputs, _ = model(inputs, hidden)
        loss = criterion(outputs.view(-1, outputs.size(-1)), targets.view(-1))

        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), clip)  # Gradient clipping!
        optimizer.step()

        total_loss += loss.item()

    return total_loss / len(dataloader)

def generate(model, dataset, seed_text, length=200, temperature=0.8, device='cuda'):
    model.eval()
    chars = [dataset.char_to_idx[c] for c in seed_text]
    hidden = model.init_hidden(1, device)

    # Process seed
    for char_idx in chars[:-1]:
        x = torch.tensor([[char_idx]]).to(device)
        _, hidden = model(x, hidden)

    # Generate
    generated = list(seed_text)
    x = torch.tensor([[chars[-1]]]).to(device)

    for _ in range(length):
        logits, hidden = model(x, hidden)
        probs = torch.softmax(logits[0, 0] / temperature, dim=0)
        char_idx = torch.multinomial(probs, 1).item()
        generated.append(dataset.idx_to_char[char_idx])
        x = torch.tensor([[char_idx]]).to(device)

    return ''.join(generated)

# Training script
if __name__ == '__main__':
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    # Hyperparameters
    EMBED_SIZE = 128
    HIDDEN_SIZE = 512
    NUM_LAYERS = 2
    DROPOUT = 0.5
    SEQ_LENGTH = 100
    BATCH_SIZE = 64
    LEARNING_RATE = 0.002
    EPOCHS = 50

    # Load data
    with open('shakespeare.txt', 'r') as f:
        text = f.read()

    dataset = CharDataset(text, SEQ_LENGTH)
    dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

    model = CharLSTM(
        dataset.vocab_size, EMBED_SIZE, HIDDEN_SIZE, NUM_LAYERS, DROPOUT
    ).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=3)

    for epoch in range(EPOCHS):
        loss = train_epoch(model, dataloader, criterion, optimizer, device)
        scheduler.step(loss)
        print(f'Epoch {epoch+1}, Loss: {loss:.4f}')

        if (epoch + 1) % 5 == 0:
            sample = generate(model, dataset, 'ROMEO:', length=200)
            print(f'\\nSample:\\n{sample}\\n')`,
  },
  huggingface: {
    id: 'huggingface',
    title: 'Track C: Hugging Face',
    subtitle: 'Fastest to production',
    difficulty: 'Practical',
    timeEstimate: '1-2 hours',
    description: 'Use pretrained GPT-2 with fine-tuning. Get impressive results with minimal code.',
    color: 'green',
    pros: ['Pretrained knowledge', 'State-of-the-art results', 'Minimal code'],
    cons: ['Black box model', 'Large model size', 'Less educational'],
    code: `"""
Fine-tune GPT-2 on custom text using Hugging Face
"""
from transformers import (
    GPT2LMHeadModel,
    GPT2Tokenizer,
    TextDataset,
    DataCollatorForLanguageModeling,
    Trainer,
    TrainingArguments
)

def load_dataset(file_path, tokenizer, block_size=128):
    return TextDataset(
        tokenizer=tokenizer,
        file_path=file_path,
        block_size=block_size
    )

def fine_tune_gpt2(train_file, output_dir, epochs=3):
    # Load pretrained model and tokenizer
    model = GPT2LMHeadModel.from_pretrained('gpt2')
    tokenizer = GPT2Tokenizer.from_pretrained('gpt2')

    # Prepare dataset
    train_dataset = load_dataset(train_file, tokenizer)
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer, mlm=False
    )

    # Training arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        overwrite_output_dir=True,
        num_train_epochs=epochs,
        per_device_train_batch_size=4,
        save_steps=500,
        save_total_limit=2,
        prediction_loss_only=True,
        logging_steps=100,
        warmup_steps=500,
        learning_rate=5e-5,
        fp16=True,  # Mixed precision for speed
    )

    # Train
    trainer = Trainer(
        model=model,
        args=training_args,
        data_collator=data_collator,
        train_dataset=train_dataset,
    )

    trainer.train()
    trainer.save_model()
    tokenizer.save_pretrained(output_dir)

    return model, tokenizer

def generate_text(model, tokenizer, prompt, max_length=200, temperature=0.8):
    model.eval()

    input_ids = tokenizer.encode(prompt, return_tensors='pt')

    output = model.generate(
        input_ids,
        max_length=max_length,
        temperature=temperature,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        num_return_sequences=1,
        pad_token_id=tokenizer.eos_token_id
    )

    return tokenizer.decode(output[0], skip_special_tokens=True)

# Usage
if __name__ == '__main__':
    # Fine-tune on Shakespeare
    model, tokenizer = fine_tune_gpt2(
        train_file='shakespeare.txt',
        output_dir='./shakespeare-gpt2',
        epochs=3
    )

    # Generate text
    prompt = "ROMEO: O, she doth teach the torches"
    generated = generate_text(model, tokenizer, prompt)
    print(generated)`,
  },
}

// Training tips
const TRAINING_TIPS = [
  {
    title: 'Gradient Clipping',
    icon: '✂️',
    description: 'Prevent exploding gradients by capping gradient norms',
    code: `# PyTorch
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

# TensorFlow
optimizer = tf.keras.optimizers.Adam(clipnorm=1.0)`,
    why: 'RNNs multiply gradients across time steps. Without clipping, gradients can explode to infinity, causing NaN losses.',
  },
  {
    title: 'Adam Optimizer',
    icon: '🎯',
    description: 'Adaptive learning rates per parameter',
    code: `# Recommended settings for RNNs
optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.001,       # Start here
    betas=(0.9, 0.999),
    eps=1e-8
)`,
    why: 'Adam adapts learning rates based on gradient history, handling the varying scales of RNN gradients better than SGD.',
  },
  {
    title: 'Dropout',
    icon: '💧',
    description: 'Regularization to prevent overfitting',
    code: `# Apply to non-recurrent connections
self.lstm = nn.LSTM(
    input_size, hidden_size,
    dropout=0.5,  # Between LSTM layers
    num_layers=2
)
self.dropout = nn.Dropout(0.5)  # After LSTM`,
    why: 'RNNs easily overfit to training sequences. Dropout randomly zeros activations during training, forcing redundant representations.',
  },
  {
    title: 'Learning Rate Schedule',
    icon: '📉',
    description: 'Reduce learning rate when loss plateaus',
    code: `scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode='min',
    factor=0.5,
    patience=3
)
# After each epoch:
scheduler.step(val_loss)`,
    why: 'Starting with a higher LR finds good regions quickly; reducing it allows fine-tuning without overshooting.',
  },
]

// Common failure modes
const FAILURE_MODES = [
  {
    symptom: 'Loss is NaN',
    causes: ['Exploding gradients', 'Learning rate too high', 'Numerical overflow'],
    solutions: ['Add gradient clipping', 'Lower learning rate (try 1e-4)', 'Use float32 not float16 initially'],
    severity: 'critical',
  },
  {
    symptom: 'Loss stuck high',
    causes: ['Vanishing gradients', 'Learning rate too low', 'Model too small'],
    solutions: ['Use LSTM/GRU instead of vanilla RNN', 'Increase learning rate', 'Add more hidden units'],
    severity: 'high',
  },
  {
    symptom: 'Generates gibberish',
    causes: ['Insufficient training', 'Model not converged', 'Temperature too high'],
    solutions: ['Train longer', 'Check loss is decreasing', 'Lower temperature (try 0.5-0.8)'],
    severity: 'medium',
  },
  {
    symptom: 'Repeats same phrase',
    causes: ['Temperature too low', 'Overfitting', 'Mode collapse'],
    solutions: ['Increase temperature', 'Add dropout', 'Use nucleus sampling (top-p)'],
    severity: 'medium',
  },
  {
    symptom: 'Training very slow',
    causes: ['No GPU', 'Batch size too small', 'Sequence length too long'],
    solutions: ['Use CUDA/MPS', 'Increase batch size', 'Use truncated BPTT'],
    severity: 'low',
  },
  {
    symptom: 'Out of memory',
    causes: ['Batch size too large', 'Sequence too long', 'Model too big'],
    solutions: ['Reduce batch size', 'Use gradient accumulation', 'Use mixed precision (fp16)'],
    severity: 'high',
  },
]

// Stakeholder explanations
const implementationExplanations: ExplanationItem[] = [
  {
    audience: 'casual',
    label: 'Dinner Party',
    content: "There are three ways to build an AI text generator: do it all yourself from scratch (like baking bread from wheat), use a power tool that handles the hard parts (like a bread machine), or buy pre-made dough and just bake it (like store-bought). Each approach teaches you different things and takes different amounts of time.",
    highlights: ['from scratch', 'power tool', 'pre-made'],
  },
  {
    audience: 'business',
    label: 'For Managers',
    content: "Implementation choice is a build-vs-buy decision. Track A (NumPy) is for R&D and education. Track B (PyTorch) is for custom solutions requiring full control. Track C (Hugging Face) is fastest to production but less customizable. Most teams should start with Track C for prototyping, then move to Track B if they need customization.",
    highlights: ['build-vs-buy', 'R&D and education', 'fastest to production'],
  },
  {
    audience: 'technical',
    label: 'Technical',
    content: "Track A implements BPTT manually, giving visibility into gradient computation and the tanh derivative chain. Track B uses PyTorch autograd for automatic differentiation, with CuDNN-optimized LSTM kernels. Track C leverages transfer learning from GPT-2's 1.5B parameter pretraining. Each has different memory/compute tradeoffs and debugging characteristics.",
    highlights: ['BPTT manually', 'autograd', 'transfer learning'],
  },
  {
    audience: 'interview',
    label: 'Interview',
    content: "I'd explain the tradeoff between understanding and efficiency. NumPy implementation teaches BPTT mechanics but doesn't scale. PyTorch provides GPU acceleration and autograd while maintaining flexibility. Hugging Face offers pretrained models that capture linguistic knowledge but as black boxes. For production, I'd recommend starting with Hugging Face for quick iteration, then customizing with PyTorch if needed.",
    highlights: ['BPTT mechanics', 'GPU acceleration', 'pretrained models'],
  },
]

function TrackSelector({
  selectedTrack,
  onSelectTrack
}: {
  selectedTrack: string
  onSelectTrack: (track: string) => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {Object.values(TRACKS).map((track) => {
        const isSelected = selectedTrack === track.id
        const colorClasses = {
          blue: isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300',
          purple: isSelected ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300',
          green: isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300',
        }

        return (
          <button
            key={track.id}
            onClick={() => onSelectTrack(track.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${colorClasses[track.color as keyof typeof colorClasses]}`}
          >
            <h3 className="font-semibold text-slate-900">{track.title}</h3>
            <p className="text-sm text-slate-600 mb-2">{track.subtitle}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {track.difficulty}
              </span>
              <span className="text-xs text-slate-500">{track.timeEstimate}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function TrackContent({ track }: { track: typeof TRACKS[keyof typeof TRACKS] }) {
  const colorClasses = {
    blue: { header: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700' },
    purple: { header: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700' },
    green: { header: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' },
  }
  const colors = colorClasses[track.color as keyof typeof colorClasses]

  return (
    <Card>
      <CardHeader className={`${colors.header} border-b`}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{track.title}</CardTitle>
            <CardDescription>{track.description}</CardDescription>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
            {track.difficulty}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Pros and Cons */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <h4 className="font-semibold text-emerald-900 mb-2">Advantages</h4>
            <ul className="text-sm text-emerald-800 space-y-1">
              {track.pros.map((pro, i) => (
                <li key={i}>+ {pro}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="font-semibold text-amber-900 mb-2">Trade-offs</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              {track.cons.map((con, i) => (
                <li key={i}>- {con}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Code */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Complete Implementation</h4>
          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono whitespace-pre">
              {track.code}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BPTTSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Backpropagation Through Time (BPTT)</CardTitle>
        <CardDescription>
          How gradients flow backward through sequences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-slate-700">
          Training RNNs requires computing gradients across all timesteps. The chain rule
          creates a product of Jacobians that either vanishes or explodes:
        </p>

        <Equation
          latex="\\frac{\\partial L}{\\partial W} = \\sum_{t=1}^{T} \\frac{\\partial L}{\\partial h_t} \\cdot \\prod_{k=t}^{T} \\frac{\\partial h_k}{\\partial h_{k-1}} \\cdot \\frac{\\partial h_t}{\\partial W}"
          symbols={bpttSymbols}
          symbolTablePosition="below"
          size="lg"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h4 className="font-semibold text-red-900 mb-2">Exploding Gradients</h4>
            <p className="text-sm text-red-800 mb-2">
              When <InlineEquation latex="\|\\frac{\\partial h_k}{\\partial h_{k-1}}\| > 1" />,
              the product grows exponentially.
            </p>
            <p className="text-sm text-red-700 font-medium">
              Solution: Gradient clipping
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="font-semibold text-amber-900 mb-2">Vanishing Gradients</h4>
            <p className="text-sm text-amber-800 mb-2">
              When <InlineEquation latex="\|\\frac{\\partial h_k}{\\partial h_{k-1}}\| < 1" />,
              the product shrinks to zero.
            </p>
            <p className="text-sm text-amber-700 font-medium">
              Solution: LSTM/GRU gating
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-slate-100 border border-slate-300 p-4">
          <h4 className="font-semibold text-slate-900 mb-2">Truncated BPTT</h4>
          <p className="text-sm text-slate-700">
            In practice, we don&apos;t backpropagate through the entire sequence. Instead, we
            split into chunks of length <InlineEquation latex="k" /> (typically 25-100) and only
            propagate gradients within each chunk. This trades some gradient accuracy for
            computational efficiency and memory savings.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function TrainingTipsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Training Tips &amp; Best Practices</CardTitle>
        <CardDescription>
          Techniques that make RNN training actually work
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {TRAINING_TIPS.map((tip) => (
            <div key={tip.title} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{tip.icon}</span>
                <h4 className="font-semibold text-slate-900">{tip.title}</h4>
              </div>
              <p className="text-sm text-slate-600 mb-3">{tip.description}</p>

              <div className="bg-slate-900 rounded-lg p-3 mb-3">
                <pre className="text-xs text-green-400 font-mono whitespace-pre">
                  {tip.code}
                </pre>
              </div>

              <p className="text-sm text-slate-500 italic">
                <strong>Why:</strong> {tip.why}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function FailureModesSection() {
  const severityColors = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Troubleshooting: Common Failure Modes</CardTitle>
        <CardDescription>
          When things go wrong and how to fix them
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Symptom
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Likely Causes
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Solutions
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {FAILURE_MODES.map((mode, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">
                    {mode.symptom}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <ul className="list-disc list-inside space-y-1">
                      {mode.causes.map((cause, i) => (
                        <li key={i}>{cause}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <ul className="list-disc list-inside space-y-1">
                      {mode.solutions.map((solution, i) => (
                        <li key={i}>{solution}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${severityColors[mode.severity as keyof typeof severityColors]}`}>
                      {mode.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export function Module9Content() {
  const [selectedTrack, setSelectedTrack] = useState('pytorch')

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle as="h2">From Theory to Code</CardTitle>
          <CardDescription>
            Three paths from understanding to implementation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            You&apos;ve learned the theory. Now it&apos;s time to build. This module offers three
            implementation tracks, each suited to different goals: deep understanding, production
            deployment, or rapid prototyping.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Choose your track based on what you want to learn and how much time you have.
            Many practitioners go through all three: NumPy for understanding, PyTorch for
            custom solutions, and Hugging Face for quick experiments.
          </p>
        </CardContent>
      </Card>

      {/* Stakeholder Explanations */}
      <ExplanationCards items={implementationExplanations} title="Explain Implementation Choices to Stakeholders" />

      {/* Track Selector and Content */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Choose Your Implementation Track</h2>
        <TrackSelector selectedTrack={selectedTrack} onSelectTrack={setSelectedTrack} />
        <TrackContent track={TRACKS[selectedTrack as keyof typeof TRACKS]} />
      </div>

      {/* BPTT Gradient Equation */}
      <BPTTSection />

      {/* Training Tips */}
      <TrainingTipsSection />

      {/* Failure Modes */}
      <FailureModesSection />

      {/* Key Takeaways */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardHeader>
          <CardTitle className="text-emerald-900">Implementation Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              'Start with the simplest track that meets your needs (usually Track C)',
              'Always use gradient clipping - exploding gradients will ruin your training',
              'Use LSTM/GRU over vanilla RNN unless you have a specific reason not to',
              'Monitor both training and validation loss - overfitting is common',
              'Start with proven hyperparameters, then tune incrementally',
              'Save checkpoints frequently - training can be unstable',
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-white/50 p-3"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  {index + 1}
                </span>
                <p className="text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Module9Content
