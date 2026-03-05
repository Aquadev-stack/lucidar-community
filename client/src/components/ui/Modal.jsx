import { X, CheckCircle, AlertCircle } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, message, type = 'success' }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-lucidar-dark border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-400">{message}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <button 
          onClick={onClose}
          className="mt-4 w-full py-2 bg-lucidar-lime text-lucidar-bg rounded-lg font-semibold hover:bg-lucidar-yellow transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}