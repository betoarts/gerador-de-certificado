import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import DataPreview from './components/DataPreview'
import TemplateEditor from './components/TemplateEditor'
import GenerationProgress from './components/GenerationProgress'
import DownloadPanel from './components/DownloadPanel'
import ValidationPage from './components/ValidationPage'
import Notification from './components/Notification'
import './App.css'

function CertificateApp() {
  const [step, setStep] = useState(1) // 1=upload, 2=preview, 3=editor, 4=generating, 5=download
  const [records, setRecords] = useState([])
  const [errors, setErrors] = useState([])
  const [templateConfig, setTemplateConfig] = useState({
    primaryColor: '#0f4c75',
    secondaryColor: '#1b262c',
    textColor: '#1a1a2e',
    fontFamily: 'Playfair Display',
    titleFontWeight: '700',
    bodyFontFamily: 'Inter',
    bodyFontWeight: '400',
    titleText: 'CERTIFICADO DE CONCLUSÃO',
    showParticipantName: true,
    descriptionTemplate: 'Certificamos que <strong>{{nome}}</strong>, portador do CPF <strong>{{cpf}}</strong>, concluiu com êxito o curso de <strong>{{curso}}</strong>, com carga horária de <strong>{{carga_horaria}} horas</strong>, concluído em <strong>{{data}}</strong>.',
    signatureName: 'Diretor(a) de Ensino',
    signatureTitle: 'Coordenação Acadêmica',
    backgroundImage: '',
    logoImage: '',
    signatureImage: '',
    courseContent: '',
  })
  const [generatedCertificates, setGeneratedCertificates] = useState([])
  const [zipName, setZipName] = useState(null)
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleExportConfig = () => {
    const json = JSON.stringify(templateConfig, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'certificado-config.json'
    a.click()
    URL.revokeObjectURL(url)
    showNotification('Configuração exportada com sucesso!')
  }

  const handleImportConfig = (config) => {
    setTemplateConfig(prev => ({ ...prev, ...config }))
    showNotification('Configuração importada com sucesso!')
  }

  const handleUploadSuccess = (data) => {
    setRecords(data.data)
    setErrors(data.errors || [])
    showNotification(`${data.total} registros carregados com sucesso!`)
    setStep(2)
  }

  const handleProceedToEditor = () => {
    setStep(3)
  }

  const handleGenerate = () => {
    setStep(4)
  }

  const handleGenerationComplete = (result) => {
    setGeneratedCertificates(result.certificates)
    setZipName(result.zipName)
    showNotification(`${result.certificates.length} certificados gerados com sucesso!`)
    setStep(5)
  }

  const handleReset = () => {
    setStep(1)
    setRecords([])
    setErrors([])
    setGeneratedCertificates([])
    setZipName(null)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <FileUpload onSuccess={handleUploadSuccess} onError={(msg) => showNotification(msg, 'error')} />
      case 2:
        return <DataPreview records={records} errors={errors} onProceed={handleProceedToEditor} onBack={() => setStep(1)} />
      case 3:
        return (
          <TemplateEditor
            records={records}
            templateConfig={templateConfig}
            onConfigChange={setTemplateConfig}
            onGenerate={handleGenerate}
            onBack={() => setStep(2)}
          />
        )
      case 4:
        return (
          <GenerationProgress
            records={records}
            templateConfig={templateConfig}
            onComplete={handleGenerationComplete}
            onError={(msg) => { showNotification(msg, 'error'); setStep(3); }}
          />
        )
      case 5:
        return <DownloadPanel certificates={generatedCertificates} zipName={zipName} onReset={handleReset} />
      default:
        return null
    }
  }

  return (
    <div className="app-container">
      <Header
        currentStep={step}
        onReset={handleReset}
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
      />

      {/* Step Indicator */}
      <div className="step-indicator">
        {[
          { num: 1, label: 'Upload' },
          { num: 2, label: 'Dados' },
          { num: 3, label: 'Template' },
          { num: 4, label: 'Gerando' },
          { num: 5, label: 'Download' },
        ].map(({ num, label }) => (
          <div key={num} className={`step-item ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}>
            <div className="step-circle">{step > num ? '✓' : num}</div>
            <span className="step-label">{label}</span>
          </div>
        ))}
      </div>

      <main className="main-content">
        {renderStep()}
      </main>

      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Gerador de Certificados Pro. Desenvolvido por <strong>Humberto Moura Neto</strong>.</p>
      </footer>

      {/* WhatsApp Support Button */}
      <a
        href="https://wa.me/5554991680204"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
        title="Suporte via WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.133 1.535 5.865L.057 23.998l6.304-1.654A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.65-.51-5.17-1.402l-.371-.22-3.741.981 1-3.636-.242-.374A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        <span>Suporte</span>
      </a>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CertificateApp />} />
        <Route path="/validar/:code" element={<ValidationPage />} />
        <Route path="/validar" element={<ValidationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
