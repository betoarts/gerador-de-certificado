import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Search, Award, CheckCircle, XCircle } from 'lucide-react'
import { validateCertificate } from '../services/api'

export default function ValidationPage() {
  const { code: urlCode } = useParams()
  const [code, setCode] = useState(urlCode || '')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!code.trim()) return
    setIsLoading(true)
    setSearched(true)
    try {
      const data = await validateCertificate(code.trim())
      setResult(data)
    } catch (err) {
      if (err.response?.status === 404) {
        setResult({ valid: false })
      } else {
        setResult({ valid: false, error: 'Erro ao consultar. Tente novamente.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-search if URL has code
  useState(() => {
    if (urlCode) handleSearch()
  }, [urlCode])

  return (
    <div className="validation-page">
      <div className="validation-card">
        <Award size={48} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
        <h1>Validar Certificado</h1>
        <p>Insira o código do certificado para verificar sua autenticidade</p>

        <div className="validation-search">
          <input
            type="text"
            className="input-field"
            placeholder="Digite o código do certificado"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-primary" onClick={handleSearch} disabled={isLoading || !code.trim()}>
            {isLoading ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Search size={16} />}
          </button>
        </div>

        {searched && result && (
          <div className={`validation-result ${result.valid ? 'valid' : 'invalid'}`}>
            {result.valid ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <CheckCircle size={24} style={{ color: 'var(--color-success)' }} />
                  <strong style={{ color: 'var(--color-success)', fontSize: '1.1rem' }}>Certificado Válido</strong>
                </div>
                <div className="validation-detail">
                  <span className="validation-detail-label">Nome</span>
                  <span className="validation-detail-value">{result.certificate.nome}</span>
                </div>
                <div className="validation-detail">
                  <span className="validation-detail-label">Curso</span>
                  <span className="validation-detail-value">{result.certificate.curso}</span>
                </div>
                <div className="validation-detail">
                  <span className="validation-detail-label">Data de Conclusão</span>
                  <span className="validation-detail-value">{result.certificate.data_conclusao}</span>
                </div>
                <div className="validation-detail">
                  <span className="validation-detail-label">Carga Horária</span>
                  <span className="validation-detail-value">{result.certificate.carga_horaria}h</span>
                </div>
                <div className="validation-detail">
                  <span className="validation-detail-label">Código</span>
                  <span className="validation-detail-value" style={{ fontFamily: 'monospace' }}>{result.certificate.code}</span>
                </div>
                <div className="validation-detail">
                  <span className="validation-detail-label">Emitido em</span>
                  <span className="validation-detail-value">{new Date(result.certificate.emitido_em).toLocaleString('pt-BR')}</span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <XCircle size={24} style={{ color: 'var(--color-error)' }} />
                <strong style={{ color: 'var(--color-error)' }}>
                  {result.error || 'Certificado não encontrado'}
                </strong>
              </div>
            )}
          </div>
        )}

        <a href="/" style={{ display: 'inline-block', marginTop: '1.5rem', fontSize: 'var(--text-sm)' }}>
          ← Voltar ao gerador
        </a>
      </div>
    </div>
  )
}
