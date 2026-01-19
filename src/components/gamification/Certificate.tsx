'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useGamification } from '@/hooks/useGamification'
import { useProgress } from '@/hooks/useProgress'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LEARNING_PATHS } from '@/lib/constants'
import type { Certificate } from '@/lib/types'

interface CertificateGeneratorProps {
  pathId: string
  className?: string
}

export function CertificateGenerator({
  pathId,
  className,
}: CertificateGeneratorProps) {
  const gamification = useGamification()
  const progress = useProgress()
  const [showCertificate, setShowCertificate] = useState(false)
  const [generatedCertificate, setGeneratedCertificate] =
    useState<Certificate | null>(null)

  const path = LEARNING_PATHS[pathId as keyof typeof LEARNING_PATHS]
  if (!path) return null

  const pathModules = path.modules as readonly number[]
  const completedInPath = pathModules.filter((id) =>
    progress.completedModules.includes(id)
  ).length
  const isPathComplete = completedInPath === pathModules.length

  const handleGenerateCertificate = () => {
    if (!isPathComplete) return

    const certificate = gamification.generateCertificate(pathId, path.name)
    setGeneratedCertificate(certificate)
    setShowCertificate(true)
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            Certificate of Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPathComplete ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  Congratulations! You have completed the {path.name} learning
                  path.
                </p>
                <p className="text-green-600 text-sm mt-1">
                  You can now generate your certificate of completion.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerateCertificate}
                className="w-full"
              >
                Generate Certificate
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-slate-700">
                  Complete all modules in the {path.name} path to earn your
                  certificate.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Progress: {completedInPath} / {pathModules.length} modules
                </p>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{
                    width: `${(completedInPath / pathModules.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificate Modal */}
      {showCertificate && generatedCertificate && (
        <CertificateModal
          certificate={generatedCertificate}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  )
}

interface CertificateModalProps {
  certificate: Certificate
  onClose: () => void
}

function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const gamification = useGamification()

  const handleDownload = async () => {
    if (!certificateRef.current) return

    setIsDownloading(true)

    try {
      // Use html2canvas for screenshot approach
      // Note: In production, you might want to use a library like jsPDF + html2canvas
      // For now, we'll use a print-friendly approach
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Certificate - ${certificate.pathName}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: Georgia, 'Times New Roman', serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: #f5f5f5;
                padding: 20px;
              }
              .certificate {
                width: 800px;
                padding: 60px;
                background: linear-gradient(135deg, #fdfbf7 0%, #f5f0e6 100%);
                border: 8px double #c9a961;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
              }
              .icon {
                font-size: 48px;
                margin-bottom: 20px;
              }
              .title {
                font-size: 36px;
                color: #1a1a1a;
                letter-spacing: 4px;
                text-transform: uppercase;
                margin-bottom: 8px;
              }
              .subtitle {
                font-size: 18px;
                color: #666;
                font-style: italic;
              }
              .content {
                text-align: center;
                margin: 40px 0;
              }
              .present-text {
                font-size: 14px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 10px;
              }
              .name {
                font-size: 42px;
                color: #2563eb;
                font-family: 'Brush Script MT', cursive;
                margin-bottom: 20px;
              }
              .completion-text {
                font-size: 16px;
                color: #444;
                line-height: 1.8;
                max-width: 500px;
                margin: 0 auto;
              }
              .path-name {
                font-weight: bold;
                color: #1a1a1a;
              }
              .stats {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin: 40px 0;
                padding: 20px;
                background: rgba(255,255,255,0.5);
                border-radius: 8px;
              }
              .stat {
                text-align: center;
              }
              .stat-value {
                font-size: 24px;
                font-weight: bold;
                color: #2563eb;
              }
              .stat-label {
                font-size: 12px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .footer {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-top: 50px;
                padding-top: 30px;
                border-top: 1px solid #ddd;
              }
              .date {
                font-size: 14px;
                color: #666;
              }
              .signature {
                text-align: center;
              }
              .signature-line {
                width: 200px;
                border-bottom: 1px solid #333;
                margin-bottom: 5px;
              }
              .signature-text {
                font-size: 12px;
                color: #666;
              }
              .id {
                font-size: 10px;
                color: #aaa;
                text-align: center;
                margin-top: 20px;
              }
              @media print {
                body { background: white; padding: 0; }
                .certificate { box-shadow: none; }
              }
            </style>
          </head>
          <body>
            <div class="certificate">
              <div class="header">
                <div class="icon">🎓</div>
                <h1 class="title">Certificate of Completion</h1>
                <p class="subtitle">The Unreasonable Effectiveness of RNNs</p>
              </div>

              <div class="content">
                <p class="present-text">This is to certify that</p>
                <p class="name">${certificate.username}</p>
                <p class="completion-text">
                  has successfully completed the
                  <span class="path-name"> ${certificate.pathName} </span>
                  learning path, demonstrating proficiency in Recurrent Neural Networks,
                  sequence modeling, and deep learning concepts.
                </p>
              </div>

              <div class="stats">
                <div class="stat">
                  <div class="stat-value">${certificate.totalPoints.toLocaleString()}</div>
                  <div class="stat-label">Points Earned</div>
                </div>
                <div class="stat">
                  <div class="stat-value">${certificate.badgesEarned.length}</div>
                  <div class="stat-label">Badges Earned</div>
                </div>
                <div class="stat">
                  <div class="stat-value">${gamification.formatTimeSpent(certificate.totalTimeSpent)}</div>
                  <div class="stat-label">Time Invested</div>
                </div>
              </div>

              <div class="footer">
                <div class="date">
                  <p>Issued on</p>
                  <p><strong>${new Date(certificate.completedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</strong></p>
                </div>
                <div class="signature">
                  <div class="signature-line"></div>
                  <p class="signature-text">RNN Learning Platform</p>
                </div>
              </div>

              <p class="id">Certificate ID: ${certificate.id}</p>
            </div>
            <script>
              window.print();
            </script>
          </body>
          </html>
        `)
        printWindow.document.close()
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate Preview */}
        <div
          ref={certificateRef}
          className="p-8 sm:p-12 bg-gradient-to-br from-amber-50 to-orange-50 border-8 border-double border-amber-600/30"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">🎓</span>
            <h1 className="text-3xl sm:text-4xl font-serif text-slate-800 tracking-widest uppercase">
              Certificate of Completion
            </h1>
            <p className="text-slate-500 mt-2 italic">
              The Unreasonable Effectiveness of RNNs
            </p>
          </div>

          {/* Content */}
          <div className="text-center my-8 sm:my-12">
            <p className="text-slate-500 uppercase tracking-widest text-sm mb-2">
              This is to certify that
            </p>
            <p className="text-4xl sm:text-5xl text-blue-600 font-serif italic my-4">
              {certificate.username}
            </p>
            <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
              has successfully completed the{' '}
              <span className="font-bold text-slate-800">
                {certificate.pathName}
              </span>{' '}
              learning path, demonstrating proficiency in Recurrent Neural
              Networks, sequence modeling, and deep learning concepts.
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 sm:gap-12 my-8 sm:my-12 py-6 bg-white/50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                {certificate.totalPoints.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Points Earned
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                {certificate.badgesEarned.length}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Badges Earned
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {gamification.formatTimeSpent(certificate.totalTimeSpent)}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Time Invested
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end pt-8 border-t border-amber-300/50">
            <div>
              <p className="text-sm text-slate-500">Issued on</p>
              <p className="font-medium text-slate-700">
                {new Date(certificate.completedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-slate-400 mb-1" />
              <p className="text-sm text-slate-500">RNN Learning Platform</p>
            </div>
          </div>

          {/* Certificate ID */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Certificate ID: {certificate.id}
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? 'Preparing...' : 'Download / Print'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Mini certificate display for lists
export function CertificateMini({ certificate }: { certificate: Certificate }) {
  const [showFull, setShowFull] = useState(false)
  const gamification = useGamification()

  return (
    <>
      <div
        className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowFull(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📜</span>
            <div>
              <p className="font-medium text-slate-800">
                {certificate.pathName}
              </p>
              <p className="text-sm text-slate-500">
                Completed{' '}
                {new Date(certificate.completedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-blue-600">
              {certificate.totalPoints.toLocaleString()} pts
            </p>
            <p className="text-xs text-slate-500">
              {certificate.badgesEarned.length} badges
            </p>
          </div>
        </div>
      </div>

      {showFull && (
        <CertificateModal
          certificate={certificate}
          onClose={() => setShowFull(false)}
        />
      )}
    </>
  )
}

// List of all earned certificates
export function CertificateList({ className }: { className?: string }) {
  const { certificates } = useGamification()

  if (certificates.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📜</span> Your Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">
            Complete a learning path to earn your first certificate!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📜</span> Your Certificates ({certificates.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {certificates.map((cert) => (
          <CertificateMini key={cert.id} certificate={cert} />
        ))}
      </CardContent>
    </Card>
  )
}
