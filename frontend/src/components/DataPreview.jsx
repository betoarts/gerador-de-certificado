import { CheckCircle, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react'

export default function DataPreview({ records, errors, onProceed, onBack }) {
  return (
    <div className="data-preview">
      <div className="data-preview-header">
        <h2>📊 Dados Extraídos</h2>
        <div className="data-stats">
          <div className="stat-badge success">
            <CheckCircle size={14} />
            {records.length} válidos
          </div>
          {errors.length > 0 && (
            <div className="stat-badge error">
              <AlertTriangle size={14} />
              {errors.length} erros
            </div>
          )}
        </div>
      </div>

      {errors.length > 0 && (
        <div className="error-list">
          <h4>⚠️ Registros com erros (serão ignorados):</h4>
          <ul>
            {errors.slice(0, 10).map((err, i) => (
              <li key={i}>
                Linha {err.row}: {err.field} — {err.message}
              </li>
            ))}
            {errors.length > 10 && <li>...e mais {errors.length - 10} erros</li>}
          </ul>
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Curso</th>
              <th>Data de Conclusão</th>
              <th>Carga Horária</th>
            </tr>
          </thead>
          <tbody>
            {records.slice(0, 50).map((record, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{record.nome}</td>
                <td>{record.curso}</td>
                <td>{record.data_conclusao}</td>
                <td>{record.carga_horaria}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length > 50 && (
          <p style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Mostrando 50 de {records.length} registros...
          </p>
        )}
      </div>

      <div className="data-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={14} />
          Voltar
        </button>
        <button className="btn btn-primary" onClick={onProceed} disabled={records.length === 0}>
          Customizar Template
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
