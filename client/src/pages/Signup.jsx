import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Sparkles } from 'lucide-react'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.acceptTerms) {
      setModal({ 
        isOpen: true, 
        title: 'Terms Required', 
        message: 'Please accept the terms and privacy policy.', 
        type: 'error' 
      })
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
        // SURPRISE: Auto-login after signup! No need to login again
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        setModal({ 
          isOpen: true, 
          title: 'Welcome to Lucidar!', 
          message: `Hey @${data.user.username}! Your account is ready. You got ${data.user.lucid_points} LP to start!`,
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
      // Redirect to profile setup instead of onboarding slides
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

        {/* Form */}
        <div className="bg-lucidar-dark/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 shadow-2xl">
          
          {/* Bonus info */}
          <div className="mb-6 p-3 rounded-xl bg-lucidar-lime/10 border border-lucidar-lime/20 flex items-center gap-3">
            <Sparkles className="text-lucidar-lime" size={20} />
            <span className="text-sm text-lucidar-lime">Get 100 LP free when you join!</span>
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