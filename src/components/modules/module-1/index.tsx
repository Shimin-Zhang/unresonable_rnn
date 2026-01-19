'use client'

// Module 1: Why Sequences Matter
// Explains the limitation of vanilla neural networks and why RNNs solve
// the variable-length sequence problem.

export { Section1_FixedSizeNetworks } from './Section1_FixedSizeNetworks'
export { Section2_SequenceZoo } from './Section2_SequenceZoo'
export { SequenceArchitectureVisual } from './SequenceArchitectureVisual'
export { Section3_Applications } from './Section3_Applications'
export { Section4_HistoricalContext } from './Section4_HistoricalContext'
export { Section5_KeyTakeaways } from './Section5_KeyTakeaways'

import { Section1_FixedSizeNetworks } from './Section1_FixedSizeNetworks'
import { Section2_SequenceZoo } from './Section2_SequenceZoo'
import { Section3_Applications } from './Section3_Applications'
import { Section4_HistoricalContext } from './Section4_HistoricalContext'
import { Section5_KeyTakeaways } from './Section5_KeyTakeaways'

export function Module1Content() {
  return (
    <div className="space-y-4">
      <Section1_FixedSizeNetworks />
      <Section2_SequenceZoo />
      <Section3_Applications />
      <Section4_HistoricalContext />
      <Section5_KeyTakeaways />
    </div>
  )
}
