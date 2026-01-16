import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import 'katex/dist/katex.min.css'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'The Unreasonable Effectiveness of RNNs',
  description:
    'An interactive learning experience for understanding Recurrent Neural Networks based on Andrej Karpathy\'s influential blog post.',
  keywords: ['RNN', 'machine learning', 'deep learning', 'LSTM', 'neural networks', 'AI'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-white antialiased">
        {children}
      </body>
    </html>
  )
}
