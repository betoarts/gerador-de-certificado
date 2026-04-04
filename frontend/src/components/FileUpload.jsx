import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet } from 'lucide-react'
import { uploadExcel } from '../services/api'

export default function FileUpload({ onSuccess, onError }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) await processFile(file)
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (file) await processFile(file)
  }

  const processFile = async (file) => {
    if (!file.name.endsWith('.xlsx')) {
      onError('Apenas arquivos .xlsx são aceitos')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      onError('Arquivo muito grande. Máximo: 10MB')
      return
    }

    setIsLoading(true)
    try {
      const result = await uploadExcel(file)
      if (result.success) {
        onSuccess(result)
      } else {
        onError(result.error || 'Erro ao processar arquivo')
      }
    } catch (err) {
      onError(err.response?.data?.error || 'Erro ao enviar arquivo. Verifique se o backend está rodando.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="upload-container">
      <div className="upload-hero">
        <h2>📄 Envie sua Planilha</h2>
        <p>Faça upload do arquivo Excel com os dados dos participantes</p>
      </div>

      <div
        className={`upload-dropzone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        {isLoading ? (
          <div className="loading-overlay">
            <div className="spinner" />
            <p className="upload-text">Processando planilha...</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              {isDragOver ? <FileSpreadsheet size={48} /> : <Upload size={48} />}
            </div>
            <p className="upload-text">
              Arraste o arquivo aqui ou <span className="upload-text-accent">clique para selecionar</span>
            </p>
            <p className="upload-hint">Aceita apenas arquivos .xlsx (máx. 10MB)</p>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          onChange={handleFileSelect}
          className="upload-file-input"
        />
      </div>

      <div className="upload-expected">
        <h3>Colunas esperadas na planilha:</h3>
        <div className="expected-columns">
          <span className="column-tag">Nome</span>
          <span className="column-tag">Curso</span>
          <span className="column-tag">Data de Conclusão</span>
          <span className="column-tag">Carga Horária</span>
        </div>
      </div>
    </div>
  )
}
