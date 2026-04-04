import { Award, RotateCcw, Download, Upload } from 'lucide-react'
import { useRef } from 'react'

export default function Header({ currentStep, onReset, onExportConfig, onImportConfig }) {
  const fileInputRef = useRef(null)

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const config = JSON.parse(evt.target.result)
        onImportConfig(config)
      } catch {
        alert('Arquivo inválido. Certifique-se de importar um JSON de configuração válido.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <Award size={20} />
        </div>
        <div>
          <div className="header-title">CertificadoPro</div>
          <div className="header-subtitle">GERADOR DE CERTIFICADOS</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {/* Export config */}
        <button className="btn btn-secondary" onClick={onExportConfig} title="Exportar configuração do template">
          <Download size={14} />
          Exportar Config
        </button>

        {/* Import config */}
        <button className="btn btn-secondary" onClick={handleImportClick} title="Importar configuração do template">
          <Upload size={14} />
          Importar Config
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {currentStep > 1 && (
          <button className="btn btn-secondary" onClick={onReset}>
            <RotateCcw size={14} />
            Recomeçar
          </button>
        )}
      </div>
    </header>
  )
}
