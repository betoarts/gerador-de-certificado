import { Award, RotateCcw } from 'lucide-react'

export default function Header({ currentStep, onReset }) {
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

      {currentStep > 1 && (
        <button className="btn btn-secondary" onClick={onReset}>
          <RotateCcw size={14} />
          Recomeçar
        </button>
      )}
    </header>
  )
}
