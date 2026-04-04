import { useState, useEffect, useRef, useCallback } from 'react'
import { Palette, Type, Image, FileSignature, ArrowLeft, Wand2, Upload as UploadIcon, X, Eye, ChevronDown, FileText } from 'lucide-react'
import { getPreview, uploadAsset } from '../services/api'
import RichTextEditor from './RichTextEditor'

const CERT_WIDTH = 1122
const CERT_HEIGHT = 793

export default function TemplateEditor({ records, templateConfig, onConfigChange, onGenerate, onBack }) {
  const [previewHtml, setPreviewHtml] = useState('')
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewScale, setPreviewScale] = useState(0.5)
  const [openSections, setOpenSections] = useState({ cores: true, tipografia: false, imagens: false, assinatura: false, texto: false, verso: false })
  const iframeRef = useRef(null)
  const previewContainerRef = useRef(null)
  const bgInputRef = useRef(null)
  const logoInputRef = useRef(null)
  const sigInputRef = useRef(null)

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const calcScale = useCallback(() => {
    if (!previewContainerRef.current) return
    const { clientWidth, clientHeight } = previewContainerRef.current
    const padX = 32
    const padY = 32
    const scaleX = (clientWidth - padX) / CERT_WIDTH
    const scaleY = (clientHeight - padY) / CERT_HEIGHT
    setPreviewScale(Math.min(scaleX, scaleY, 1))
  }, [])

  useEffect(() => {
    calcScale()
    const observer = new ResizeObserver(calcScale)
    if (previewContainerRef.current) observer.observe(previewContainerRef.current)
    return () => observer.disconnect()
  }, [calcScale])

  const updateConfig = (key, value) => {
    onConfigChange({ ...templateConfig, [key]: value })
  }

  const handleImageUpload = async (file, type) => {
    try {
      const result = await uploadAsset(file, type)
      if (result.success) {
        const configKey = type === 'background' ? 'backgroundImage'
          : type === 'logo' ? 'logoImage'
          : 'signatureImage'
        updateConfig(configKey, result.dataUrl)
      }
    } catch (err) {
      console.error('Upload error:', err)
    }
  }

  const loadPreview = useCallback(async () => {
    if (records.length === 0) return
    setIsLoadingPreview(true)
    try {
      const result = await getPreview(records[0], templateConfig)
      if (result.success) {
        setPreviewHtml(result.html)
      }
    } catch (err) {
      console.error('Preview error:', err)
    } finally {
      setIsLoadingPreview(false)
    }
  }, [records, templateConfig])

  useEffect(() => {
    const timeout = setTimeout(loadPreview, 500)
    return () => clearTimeout(timeout)
  }, [loadPreview])

  useEffect(() => {
    if (previewHtml && iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      doc.open()
      doc.write(previewHtml)
      doc.close()
    }
  }, [previewHtml])

  return (
    <div className="template-editor">
      {/* Sidebar */}
      <div className="editor-sidebar">
        {/* Colors */}
        <div className="editor-section">
          <div className="editor-section-header" onClick={() => toggleSection('cores')}>
            <Palette size={14} />
            <h3>Cores</h3>
            <ChevronDown size={14} className={`toggle-icon ${openSections.cores ? 'open' : ''}`} />
          </div>
          {openSections.cores && (
            <div className="editor-section-body">
              <div className="form-group">
                <label className="label">Cor Primária</label>
                <div className="color-input-group">
                  <input type="color" className="color-swatch" value={templateConfig.primaryColor} onChange={(e) => updateConfig('primaryColor', e.target.value)} />
                  <input type="text" className="input-field" value={templateConfig.primaryColor} onChange={(e) => updateConfig('primaryColor', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Cor Secundária</label>
                <div className="color-input-group">
                  <input type="color" className="color-swatch" value={templateConfig.secondaryColor} onChange={(e) => updateConfig('secondaryColor', e.target.value)} />
                  <input type="text" className="input-field" value={templateConfig.secondaryColor} onChange={(e) => updateConfig('secondaryColor', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Cor do Texto</label>
                <div className="color-input-group">
                  <input type="color" className="color-swatch" value={templateConfig.textColor} onChange={(e) => updateConfig('textColor', e.target.value)} />
                  <input type="text" className="input-field" value={templateConfig.textColor} onChange={(e) => updateConfig('textColor', e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Typography */}
        <div className="editor-section">
          <div className="editor-section-header" onClick={() => toggleSection('tipografia')}>
            <Type size={14} />
            <h3>Tipografia</h3>
            <ChevronDown size={14} className={`toggle-icon ${openSections.tipografia ? 'open' : ''}`} />
          </div>
          {openSections.tipografia && (
            <div className="editor-section-body">
              <div className="form-group">
                <label className="label">Fonte dos Títulos</label>
                <select className="input-field" value={templateConfig.fontFamily} onChange={(e) => updateConfig('fontFamily', e.target.value)}>
                  <option value="Playfair Display">Playfair Display (Clássica)</option>
                  <option value="Great Vibes">Great Vibes (Cursiva)</option>
                  <option value="Inter">Inter (Moderna)</option>
                  <option value="Georgia">Georgia (Serifada)</option>
                  <option value="Times New Roman">Times New Roman (Formal)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Texto do Título</label>
                <input type="text" className="input-field" value={templateConfig.titleText} onChange={(e) => updateConfig('titleText', e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* Images */}
        <div className="editor-section">
          <div className="editor-section-header" onClick={() => toggleSection('imagens')}>
            <Image size={14} />
            <h3>Imagens</h3>
            <ChevronDown size={14} className={`toggle-icon ${openSections.imagens ? 'open' : ''}`} />
          </div>
          {openSections.imagens && (
            <div className="editor-section-body">
              <div className="form-group">
                <label className="label">Imagem de Fundo</label>
                {templateConfig.backgroundImage ? (
                  <div>
                    <img src={templateConfig.backgroundImage} alt="Background" className="image-preview-thumb" />
                    <div className="image-preview-row" style={{ marginTop: '0.25rem' }}>
                      <button className="remove-image-btn" onClick={() => updateConfig('backgroundImage', '')}>
                        <X size={10} /> Remover
                      </button>
                      <button className="image-upload-btn" style={{ flex: 1 }} onClick={() => bgInputRef.current?.click()}>
                        <UploadIcon size={12} /> Trocar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="image-upload-btn" onClick={() => bgInputRef.current?.click()}>
                    <UploadIcon size={12} /> Upload Background
                  </button>
                )}
                <input ref={bgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'background')} />
              </div>
              <div className="form-group">
                <label className="label">Logo</label>
                {templateConfig.logoImage ? (
                  <div>
                    <img src={templateConfig.logoImage} alt="Logo" className="image-preview-thumb" />
                    <div className="image-preview-row" style={{ marginTop: '0.25rem' }}>
                      <button className="remove-image-btn" onClick={() => updateConfig('logoImage', '')}>
                        <X size={10} /> Remover
                      </button>
                      <button className="image-upload-btn" style={{ flex: 1 }} onClick={() => logoInputRef.current?.click()}>
                        <UploadIcon size={12} /> Trocar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="image-upload-btn" onClick={() => logoInputRef.current?.click()}>
                    <UploadIcon size={12} /> Upload Logo
                  </button>
                )}
                <input ref={logoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'logo')} />
              </div>
            </div>
          )}
        </div>

        {/* Signature */}
        <div className="editor-section">
          <div className="editor-section-header" onClick={() => toggleSection('assinatura')}>
            <FileSignature size={14} />
            <h3>Assinatura</h3>
            <ChevronDown size={14} className={`toggle-icon ${openSections.assinatura ? 'open' : ''}`} />
          </div>
          {openSections.assinatura && (
            <div className="editor-section-body">
              <div className="form-group">
                <label className="label">Imagem da Assinatura</label>
                {templateConfig.signatureImage ? (
                  <div>
                    <img src={templateConfig.signatureImage} alt="Assinatura" className="image-preview-thumb" />
                    <div className="image-preview-row" style={{ marginTop: '0.25rem' }}>
                      <button className="remove-image-btn" onClick={() => updateConfig('signatureImage', '')}>
                        <X size={10} /> Remover
                      </button>
                      <button className="image-upload-btn" style={{ flex: 1 }} onClick={() => sigInputRef.current?.click()}>
                        <UploadIcon size={12} /> Trocar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="image-upload-btn" onClick={() => sigInputRef.current?.click()}>
                    <UploadIcon size={12} /> Upload Assinatura
                  </button>
                )}
                <input ref={sigInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'signature')} />
              </div>
              <div className="form-group">
                <label className="label">Nome do Assinante</label>
                <input type="text" className="input-field" value={templateConfig.signatureName} onChange={(e) => updateConfig('signatureName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="label">Cargo / Título</label>
                <input type="text" className="input-field" value={templateConfig.signatureTitle} onChange={(e) => updateConfig('signatureTitle', e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="editor-section">
          <div className="editor-section-header" onClick={() => toggleSection('texto')}>
            <Type size={14} />
            <h3>Texto Descritivo</h3>
            <ChevronDown size={14} className={`toggle-icon ${openSections.texto ? 'open' : ''}`} />
          </div>
          {openSections.texto && (
            <div className="editor-section-body">
              <div className="form-group">
                <label className="label">Texto do certificado (use {'{{nome}}'}, {'{{curso}}'}, {'{{data}}'}, {'{{carga_horaria}}'}, {'{{cpf}}'})</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={templateConfig.descriptionTemplate}
                  onChange={(e) => updateConfig('descriptionTemplate', e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Course Content / Verso */}
        <div className="editor-section">
          <div className="editor-section-header" onClick={() => toggleSection('verso')}>
            <FileText size={14} />
            <h3>Verso (Conteúdo)</h3>
            <ChevronDown size={14} className={`toggle-icon ${openSections.verso ? 'open' : ''}`} />
          </div>
          {openSections.verso && (
            <div className="editor-section-body">
              <div className="form-group">
                <label className="label">Conteúdo Programático do Curso</label>
                <RichTextEditor
                  value={templateConfig.courseContent}
                  onChange={(val) => updateConfig('courseContent', val)}
                  placeholder="Ao inserir texto aqui, uma 2ª página (verso) será gerada. Você pode usar negrito e listas."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="editor-preview">
        <div className="preview-toolbar">
          <h3><Eye size={14} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />Preview ao Vivo</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              {Math.round(previewScale * 100)}%
            </span>
            <button className="btn btn-secondary" onClick={loadPreview} disabled={isLoadingPreview}>
              {isLoadingPreview ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Wand2 size={14} />}
              Atualizar
            </button>
          </div>
        </div>

        <div className="preview-frame" ref={previewContainerRef}>
          {isLoadingPreview && !previewHtml ? (
            <div className="loading-overlay">
              <div className="spinner" />
              <p>Carregando preview...</p>
            </div>
          ) : (
            <div
              className="preview-scaler"
              style={{
                width: CERT_WIDTH,
                height: CERT_HEIGHT,
                transform: `scale(${previewScale})`,
                transformOrigin: 'center center',
              }}
            >
              <iframe ref={iframeRef} title="Certificate Preview" />
            </div>
          )}
        </div>

        <div className="editor-actions">
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={14} />
            Voltar
          </button>
          <button className="btn btn-primary" onClick={onGenerate}>
            <Wand2 size={14} />
            Gerar {records.length} Certificados
          </button>
        </div>
      </div>
    </div>
  )
}
