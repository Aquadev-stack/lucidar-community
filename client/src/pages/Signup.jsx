import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Github } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'

export default function Signup() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' })
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    acceptTerms: false
  })

  const steps = [
    { number: 1, label: 'Account' },
    { number: 2, label: 'Verify' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.acceptTerms) {
      setModal({ isOpen: true, title: 'Terms Required', message: 'Please accept the terms and privacy policy.', type: 'error' })
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Persist the created user so ProfileSetup can prefill username/email
        if (data?.user) {
          localStorage.setItem('lucidar_user', JSON.stringify(data.user))
        }
        setModal({ 
          isOpen: true, 
          title: 'Welcome to Lucidar!', 
          message: 'Your account has been created successfully. Let\'s get you signed in.',
          type: 'success'
        })
      } else {
        setModal({ 
          isOpen: true, 
          title: 'Registration Failed', 
          message: data.error || 'Something went wrong. Please try again.',
          type: 'error'
        })
      }
    } catch (error) {
      setModal({ 
        isOpen: true, 
        title: 'Connection Error', 
        message: 'Unable to reach the server. Please make sure the backend is running.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleModalClose = () => {
    setModal({ ...modal, isOpen: false })
    if (modal.type === 'success') {
      navigate('/onboardingslides')
    }
  }

  return (
    <div className="min-h-screen bg-lucidar-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lucidar-lime/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lucidar-green/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <img 
              src="/assets/img/logo.png" 
              alt="Lucidar logo" 
              className="h-28 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-gray-400 mt-2">Join the future of the creators community</p>
        </div>

        {/* Progress steps */}
        <div className="flex justify-center mb-6">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                1 >= s.number ? 'bg-lucidar-lime text-lucidar-bg' : 'bg-gray-800 text-gray-500'
              }`}>
                {1 > s.number ? <Check size={16} /> : s.number}
              </div>
              <span className={`ml-2 text-sm ${1 >= s.number ? 'text-white' : 'text-gray-500'}`}>
                {s.label}
              </span>
              {idx < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-3 ${1 > s.number ? 'bg-lucidar-lime' : 'bg-gray-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-lucidar-dark/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 shadow-2xl">
          {/* Social signup */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 transition-colors text-sm text-gray-300">
              <Github size={18} />
              GitHub
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 transition-colors text-sm text-gray-300">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-lucidar-bg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-lucidar-lime transition-colors"
                  placeholder="lucide_tag"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-lucidar-bg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-lucidar-lime transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg bg-lucidar-bg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-lucidar-lime transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Min 8 chars, 1 number, 1 special char</p>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 text-sm text-gray-400 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                className="mt-0.5 rounded border-gray-700 bg-lucidar-bg text-lucidar-lime focus:ring-lucidar-lime" 
              />
              <span>
                I agree to the{' '}
                <a href="#" className="text-lucidar-lime hover:underline">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-lucidar-lime hover:underline">Privacy Policy</a>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!formData.acceptTerms || isLoading}
              className="w-full py-2.5 bg-lucidar-lime text-lucidar-bg rounded-lg font-semibold hover:bg-lucidar-yellow transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-5 h-5 text-lucidar-bg" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-lucidar-lime hover:text-lucidar-yellow transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>

      <Modal 
        isOpen={modal.isOpen} 
        onClose={handleModalClose}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  )
}
