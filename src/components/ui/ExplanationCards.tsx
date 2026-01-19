'use client'

import { useState, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Audience types for stakeholder explanations
export type AudienceType = 'casual' | 'business' | 'technical' | 'interview'

export interface ExplanationItem {
  audience: AudienceType
  label: string
  content: string
  highlights?: string[] // Key phrases to highlight
}

export interface ExplanationCardsProps {
  items: ExplanationItem[]
  defaultAudience?: AudienceType
  title?: string
  className?: string
}

// Audience metadata for display
const audienceConfig: Record<AudienceType, { icon: string; description: string }> = {
  casual: {
    icon: '🍽️',
    description: 'Dinner Party Version',
  },
  business: {
    icon: '📊',
    description: 'For Your Manager',
  },
  technical: {
    icon: '⚙️',
    description: 'Technical Deep Dive',
  },
  interview: {
    icon: '🎯',
    description: 'Interview Answer',
  },
}

// Highlight key phrases in content
function highlightText(content: string, highlights?: string[]): ReactNode {
  if (!highlights || highlights.length === 0) {
    return content
  }

  // Create regex pattern from highlights (case insensitive)
  const pattern = new RegExp(`(${highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  const parts = content.split(pattern)

  return parts.map((part, index) => {
    const isHighlight = highlights.some(h => h.toLowerCase() === part.toLowerCase())
    if (isHighlight) {
      return (
        <mark
          key={index}
          className="rounded bg-yellow-100 px-0.5 font-medium text-yellow-900"
        >
          {part}
        </mark>
      )
    }
    return part
  })
}

// Copy icon SVG
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

// Check icon SVG for copy confirmation
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// Chevron icon for accordion
function ChevronIcon({ expanded, className }: { expanded: boolean; className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180', className)}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function ExplanationCards({
  items,
  defaultAudience,
  title = 'Explain to Your Stakeholders',
  className,
}: ExplanationCardsProps) {
  const [activeTab, setActiveTab] = useState<AudienceType>(
    defaultAudience || items[0]?.audience || 'casual'
  )
  const [copied, setCopied] = useState(false)
  const [expandedAccordion, setExpandedAccordion] = useState<AudienceType | null>(
    defaultAudience || items[0]?.audience || null
  )

  const activeItem = items.find((item) => item.audience === activeTab)

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }, [])

  const toggleAccordion = useCallback((audience: AudienceType) => {
    setExpandedAccordion((prev) => (prev === audience ? null : audience))
  }, [])

  if (items.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-slate-200 bg-white',
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>

      {/* Desktop: Tab navigation (hidden on mobile) */}
      <div className="hidden border-b border-slate-200 md:block">
        <nav className="flex" aria-label="Audience tabs">
          {items.map((item) => {
            const config = audienceConfig[item.audience]
            const isActive = activeTab === item.audience
            return (
              <button
                key={item.audience}
                onClick={() => setActiveTab(item.audience)}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  'border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
                  isActive
                    ? 'border-primary-600 bg-white text-primary-700'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
                aria-selected={isActive}
                role="tab"
              >
                <span className="mr-1.5">{config.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Desktop: Tab content (hidden on mobile) */}
      {activeItem && (
        <div className="hidden md:block" role="tabpanel">
          <div className="p-4">
            <div className="mb-3 flex items-start justify-between gap-4">
              <p className="text-xs text-slate-500">
                {audienceConfig[activeItem.audience].description}
              </p>
              <button
                onClick={() => handleCopy(activeItem.content)}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5',
                  'text-xs font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  copied
                    ? 'bg-green-50 text-green-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                )}
                aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
              >
                {copied ? (
                  <>
                    <CheckIcon />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="leading-relaxed text-slate-700">
              {highlightText(activeItem.content, activeItem.highlights)}
            </div>
          </div>
        </div>
      )}

      {/* Mobile: Accordion (hidden on desktop) */}
      <div className="md:hidden">
        {items.map((item) => {
          const config = audienceConfig[item.audience]
          const isExpanded = expandedAccordion === item.audience
          return (
            <div
              key={item.audience}
              className="border-b border-slate-200 last:border-b-0"
            >
              <button
                onClick={() => toggleAccordion(item.audience)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-3 text-left',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
                  isExpanded ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'
                )}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2">
                  <span>{config.icon}</span>
                  <span className="text-sm font-medium text-slate-700">
                    {item.label}
                  </span>
                </div>
                <ChevronIcon expanded={isExpanded} className="text-slate-400" />
              </button>
              {isExpanded && (
                <div className="border-t border-slate-100 bg-white px-4 py-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs text-slate-500">{config.description}</p>
                    <button
                      onClick={() => handleCopy(item.content)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-2 py-1',
                        'text-xs font-medium transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                        copied
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
                    >
                      {copied ? (
                        <>
                          <CheckIcon />
                          Copied!
                        </>
                      ) : (
                        <>
                          <CopyIcon />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-sm leading-relaxed text-slate-700">
                    {highlightText(item.content, item.highlights)}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExplanationCards
