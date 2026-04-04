import { Download, FileArchive, FileText, RotateCcw } from 'lucide-react'
import { getDownloadUrl, getZipDownloadUrl } from '../services/api'

export default function DownloadPanel({ certificates, zipName, onReset }) {
  const handleDownload = (fileName) => {
    const link = document.createElement('a')
    link.href = getDownloadUrl(fileName)
    link.download = fileName
    link.click()
  }

  const handleDownloadZip = () => {
    const link = document.createElement('a')
    link.href = getZipDownloadUrl(zipName)
    link.download = zipName || 'certificados.zip'
    link.click()
  }

  return (
    <div className="download-container">
      <div className="download-hero">
        <div className="download-hero-icon">🎉</div>
        <h2>Certificados Prontos!</h2>
        <p>{certificates.length} certificados foram gerados com sucesso</p>
      </div>

      <div className="download-main-actions">
        {certificates.length > 1 && (
          <button className="btn btn-primary btn-large" onClick={handleDownloadZip}>
            <FileArchive size={18} />
            Baixar Todos (.zip)
          </button>
        )}
        <button className="btn btn-secondary btn-large" onClick={onReset}>
          <RotateCcw size={18} />
          Gerar Novos
        </button>
      </div>

      <div className="certificates-grid">
        {certificates.map((cert) => (
          <div key={cert.code} className="certificate-card" onClick={() => handleDownload(cert.fileName)}>
            <div className="cert-icon">
              <FileText size={18} />
            </div>
            <div className="cert-info">
              <div className="cert-name">{cert.nome}</div>
              <div className="cert-code">{cert.code}</div>
            </div>
            <button className="btn btn-icon">
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
