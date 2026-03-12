import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react'

import onboarding1 from '/assets/img/onboarding-1.png'
import onboarding2 from '/assets/img/onboarding-2.png'
import onboarding3 from '/assets/img/onboarding-3.png'
import onboarding4 from '/assets/img/onboarding-4.png'

export default function OnboardingSlides() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const slides = [
    {
      image: onboarding1,
      title: 'See Everything',
      desc: 'Discover creators, communities, and opportunities all in one place.',
      accent: 'from-[#ccff00]/40 via-[#00ff88]/30 to-[#ccff00]/20',
      glow: 'bg-[#ccff00]',
      bgGlow: 'bg-[#ccff00]/30',
    },
    {
      image: onboarding2,
      title: 'Take Control',
      desc: 'Manage trades, projects, and connections through an intuitive interface.',
      accent: 'from-[#00ff88]/40 via-[#ccff00]/30 to-[#00ff88]/20',
      glow: 'bg-[#00ff88]',
      bgGlow: 'bg-[#00ff88]/30',
    },
    {
      image: onboarding3,
      title: 'Customize Everything',
      desc: 'Build your unique identity with animated avatars and Lucid-style effects.',
      accent: 'from-[#ccff00]/50 via-[#ffff00]/30 to-[#ccff00]/20',
      glow: 'bg-[#ccff00]',
      bgGlow: 'bg-[#ccff00]/40',
    },
    {
      image: onboarding4,
      title: 'Trade Securely',
      desc: 'Buy, sell, and exchange with confidence using our built-in escrow system.',
      accent: 'from-[#00ff88]/40 via-[#ccff00]/40 to-[#ffff00]/20',
      glow: 'bg-[#00ff88]',
      bgGlow: 'bg-[#00ff88]/30',
    },
  ]

  const slide = slides[current]
  const isLast = current === slides.length - 1

  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image()
      img.src = s.image
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (isLast) {
          navigate('/profilesetup')
        } else {
          setDirection(1)
          setCurrent((c) => Math.min(c + 1, slides.length - 1))
        }
      } else if (e.key === 'ArrowLeft') {
        if (current > 0) {
          setDirection(-1)
          setCurrent((c) => Math.max(c - 1, 0))
        }
      } else if (e.key === 'Escape') {
        skip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [current, isLast, navigate])

  const next = () => {
    if (isLast) {
      navigate('/profilesetup')
    } else {
      setDirection(1)
      setCurrent((c) => c + 1)
    }
  }

  const prev = () => {
    if (current > 0) {
      setDirection(-1)
      setCurrent((c) => c - 1)
    }
  }

  const skip = () => navigate('/profilesetup')

  const goToSlide = (index) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050810] via-[#0a0f1a] to-[#050810]" />
      
      {/* Animated glows */}
      <motion.div 
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className={`absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 rounded-full ${slide.bgGlow} opacity-20 blur-[80px] sm:blur-[100px]`}
      />
      <motion.div 
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-[#ccff00]/10 blur-[80px] sm:blur-[120px]"
      />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-20">
        <button 
          onClick={prev}
          disabled={current === 0}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all ${
            current === 0 
              ? 'opacity-0 pointer-events-none' 
              : 'bg-white/5 hover:bg-white/10 text-white hover:text-[#ccff00]'
          }`}
        >
          <ArrowLeft size={18} />
        </button>

        <button 
          onClick={skip}
          className="text-xs font-medium text-gray-500 hover:text-[#ccff00] transition-colors uppercase tracking-widest"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-sm sm:max-w-md z-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-[#070a12]/80 backdrop-blur-2xl border border-gray-800 shadow-2xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} opacity-30`} />
              
              <div className="relative p-6 sm:p-8 pt-10 sm:pt-12">
                {/* Image */}
                <div className="relative mb-6 sm:mb-8 flex justify-center">
                  <motion.div
                    initial={{ scale: 0.8, rotate: -5 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="relative"
                  >
                    <div className={`absolute inset-0 ${slide.glow} blur-3xl opacity-50 scale-125`} />
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="relative w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-2xl"
                    />
                    
                    {isLast && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-[#ccff00] rounded-full flex items-center justify-center shadow-lg shadow-[#ccff00]/30"
                      >
                        <Check size={16} sm:size={20} className="text-[#0a0f1a]" strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Text */}
                <div className="text-center mb-6 sm:mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 mb-3 sm:mb-4"
                  >
                    <Sparkles size={12} sm:size={14} className="text-[#ccff00]" />
                    <span className="text-xs text-[#ccff00] font-medium uppercase tracking-wider">Step {current + 1} of 4</span>
                  </motion.div>

                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-4 text-white"
                  >
                    {slide.title}
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 text-base sm:text-lg leading-relaxed px-2"
                  >
                    {slide.desc}
                  </motion.p>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mb-6 sm:mb-8">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                      style={{ width: i === current ? 32 : 8 }}
                    >
                      <div className="absolute inset-0 bg-gray-700" />
                      {i === current && (
                        <motion.div 
                          layoutId="activeDot"
                          className="absolute inset-0 bg-[#ccff00]"
                        />
                      )}
                      {i < current && (
                        <div className="absolute inset-0 bg-[#00ff88]/50" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Button */}
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={next}
                    className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl overflow-hidden bg-[#ccff00] text-[#0a0f1a] font-semibold text-base sm:text-lg hover:bg-[#b8e600] transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-lg shadow-[#ccff00]/20"
                  >
                    {isLast ? 'Get Started' : 'Next'}
                    <ArrowRight size={18} sm:size={20} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}