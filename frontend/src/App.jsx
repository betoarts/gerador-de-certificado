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
    bodyFontFamily: 'Inter',
    titleText: 'CERTIFICADO DE CONCLUSÃO',
    descriptionTemplate: 'Certificamos que <strong>{{nome}}</strong> concluiu com êxito o curso de <strong>{{curso}}</strong>, com carga horária de <strong>{{carga_horaria}} horas</strong>, concluído em <strong>{{data}}</strong>.',
    signatureName: 'Diretor(a) de Ensino',
    signatureTitle: 'Coordenação Acadêmica',
    backgroundImage: '',
    logoImage: '',
    signatureImage: '',
  })
  const [generatedCertificates, setGeneratedCertificates] = useState([])
  const [zipName, setZipName] = useState(null)
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
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
      <Header currentStep={step} onReset={handleReset} />

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
