import { useState } from 'react'
import LandingPage from './components/LandingPage/LandingPage'
import ProcessingPage from './components/Processing/ProcessingPage'
import ResultsPage from './components/Results/ResultsPage'

// App state machine: landing → processing → results
const SCREENS = {
  LANDING: 'landing',
  PROCESSING: 'processing',
  RESULTS: 'results',
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LANDING)
  const [repoUrl, setRepoUrl] = useState('')
  const [migrationResult, setMigrationResult] = useState(null)
  const [originalFiles, setOriginalFiles] = useState([])

  const handleResurrect = (url) => {
    setRepoUrl(url)
    setScreen(SCREENS.PROCESSING)
  }

  const handleMigrationComplete = (result, fetchedFiles) => {
    setMigrationResult(result)
    setOriginalFiles(fetchedFiles || [])
    setScreen(SCREENS.RESULTS)
  }

  const handleReset = () => {
    setRepoUrl('')
    setMigrationResult(null)
    setOriginalFiles([])
    setScreen(SCREENS.LANDING)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {screen === SCREENS.LANDING && (
        <LandingPage onResurrect={handleResurrect} />
      )}
      {screen === SCREENS.PROCESSING && (
        <ProcessingPage
          repoUrl={repoUrl}
          onComplete={handleMigrationComplete}
          onError={handleReset}
        />
      )}
      {screen === SCREENS.RESULTS && (
        <ResultsPage
          result={migrationResult}
          originalFiles={originalFiles}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
