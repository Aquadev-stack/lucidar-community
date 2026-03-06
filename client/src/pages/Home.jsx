import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Zap } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
  
    
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}')
    setUser({ ...userData, ...profile })
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) return <div className="min-h-screen bg-lucidar-bg flex items-center justify-center text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-lucidar-bg text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-lucidar-dark/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-lucidar-lime to-lucidar-green rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-lucidar-bg" />
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: "'Technor', sans-serif" }}>Lucidar</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-lucidar-dark rounded-full border border-gray-700">
              <User size={16} className="text-lucidar-lime" />
              <span className="text-sm">{user.displayName || user.username}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl bg-lucidar-dark border border-gray-800">
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Technor', sans-serif" }}>
            Welcome, <span className="text-lucidar-lime">{user.displayName || user.username}</span>!
          </h1>
          <p className="text-gray-400">Your home feed is coming soon...</p>
        </div>
      </main>
    </div>
  )
}