import { useState } from 'react'
import JSZip from 'jszip'
import { shareResult } from '../../api/client'

export default function ActionBar({ result, onRunLive, terminalOpen }) {
  const [shareUrl, setShareUrl] = useState(null)
  const [isSharing, setIsSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDownload = async () => {
    const zip = new JSZip()
    const src = zip.folder('src')
    const tests = zip.folder('tests')

    result.migrated_files?.forEach((f) => {
      const filename = f.path.split('/').pop()
      src.file(filename, f.migrated_code || '')
      if (f.tests) tests.file(`test_${filename}`, f.tests)
    })

    // Auto-generate README
    zip.file('README.md', `# Migrated Project\n\nMigrated from ${result.source_language} to ${result.target_language} by GhostWriter.\n\n## Run\n\`\`\`bash\npip install -r requirements.txt\npython src/main.py\n\`\`\`\n\n## Tests\n\`\`\`bash\npytest tests/\n\`\`\`\n`)
    zip.file('requirements.txt', '# Add your dependencies here\n')
    zip.file('.gitignore', '__pycache__/\n*.pyc\n.venv/\n')

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.repo_name || 'migrated'}-modernized.zip`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const { share_url } = await shareResult(result)
      setShareUrl(share_url)
      await navigator.clipboard.writeText(share_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Redis not configured, copy current URL instead
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-white/5 bg-[#0F1117]">
      {/* Run Live */}
      <button
        onClick={onRunLive}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border transition-colors text-xs font-medium
          ${terminalOpen
            ? 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/40'
            : 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/20 hover:bg-[#00FF88]/20'
          }`}
      >
        {terminalOpen ? '▼ Hide Terminal' : '▶ Run Live'}
      </button>

      {/* Download ZIP */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00D4FF] text-[#0F1117]
          hover:bg-[#00D4FF]/90 transition-colors text-xs font-semibold"
      >
        ⬇ Download ZIP
      </button>

      {/* Share */}
      <button
        onClick={handleShare}
        disabled={isSharing}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A1A2E] text-[#E8E8E8]
          border border-white/10 hover:border-[#00D4FF]/30 transition-colors text-xs disabled:opacity-50"
      >
        {copied ? '✓ Copied!' : isSharing ? 'Sharing...' : '🔗 Share'}
      </button>
    </div>
  )
}
