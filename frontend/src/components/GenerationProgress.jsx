import { useState, useEffect } from 'react'
import { generateCertificates } from '../services/api'

export default function GenerationProgress({ records, templateConfig, onComplete, onError }) {
  const [progress, setProgress] = useState(0)
  const [currentName, setCurrentName] = useState('')
  const [status, setStatus] = useState('generating') // generating | complete | error

  useEffect(() => {
    let cancelled = false

    const generate = async () => {
      try {
        // Simulate progress while backend generates
        const progressInterval = setInterval(() => {
          if (cancelled) return
          setProgress(prev => {
            if (prev >= 90) return 90
            const increment = Math.random() * 8 + 2
            return Math.min(prev + increment, 90)
          })

          // Cycle through names for visual feedback
          const randomIndex = Math.floor(Math.random() * records.length)
          setCurrentName(records[randomIndex]?.nome || '')
        }, 800)

        const result = await generateCertificates(records, templateConfig)

        clearInterval(progressInterval)

        if (cancelled) return

        if (result.success) {
          setProgress(100)
          setStatus('complete')
          setCurrentName('')
          setTimeout(() => onComplete(result), 800)
        } else {
          onError(result.error || 'Erro na geração')
        }
      } catch (err) {
        if (!cancelled) {
          onError(err.response?.data?.error || 'Erro ao gerar certificados. Verifique o backend.')
        }
      }
    }

    generate()
    return () => { cancelled = true }
  }, [records, templateConfig, onComplete, onError])

  return (
    <div className="progress-container">
      <div className="progress-icon">
        {status === 'complete' ? '✅' : '🎓'}
      </div>

      <h2 className="progress-title">
        {status === 'complete' ? 'Certificados Gerados!' : 'Gerando Certificados...'}
      </h2>

      <p className="progress-subtitle">
        {status === 'complete'
          ? `${records.length} certificados prontos para download`
          : `Processando ${records.length} certificados`}
      </p>

      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="progress-text">{Math.round(progress)}% concluído</p>

      {currentName && status !== 'complete' && (
        <p className="progress-current-name">Gerando: {currentName}</p>
      )}
    </div>
  )
}
