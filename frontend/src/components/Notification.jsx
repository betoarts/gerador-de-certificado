import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react'

export default function Notification({ message, type = 'success', onClose }) {
  const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertTriangle size={18} />,
    warning: <Info size={18} />,
  }

  return (
    <div className={`notification ${type}`}>
      {icons[type]}
      <span>{message}</span>
      <button className="notification-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  )
}
