import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              About This Course
            </h3>
            <p className="text-sm text-slate-600">
              An interactive learning experience based on Andrej Karpathy&apos;s
              influential blog post &quot;The Unreasonable Effectiveness of Recurrent
              Neural Networks.&quot;
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://karpathy.github.io/2015/05/21/rnn-effectiveness/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-primary-600"
                >
                  Original Blog Post
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/karpathy/char-rnn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-primary-600"
                >
                  char-rnn Repository
                </a>
              </li>
              <li>
                <Link href="/glossary" className="text-slate-600 hover:text-primary-600">
                  Glossary
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Learning Paths</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/?path=conceptual" className="text-slate-600 hover:text-primary-600">
                  Conceptual (Managers)
                </Link>
              </li>
              <li>
                <Link href="/?path=practitioner" className="text-slate-600 hover:text-primary-600">
                  Full Practitioner
                </Link>
              </li>
              <li>
                <Link href="/?path=quickWins" className="text-slate-600 hover:text-primary-600">
                  Quick Wins
                </Link>
              </li>
              <li>
                <Link href="/?path=interviewPrep" className="text-slate-600 hover:text-primary-600">
                  Interview Prep
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          Built for learning. Inspired by Andrej Karpathy.
        </div>
      </div>
    </footer>
  )
}
