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
      desc: 'Discover creators, communities, and opportunities all in one place. Your hub for gaming, development, and creative collaboration.',
      accent: 'from-lucidar-lime/40 via-lucidar-green/30 to-lucidar-lime/20',
      glow: 'bg-lucidar-lime',
      bgGlow: 'bg-lucidar-lime/30',
    },
    {
      image: onboarding2,
      title: 'Take Control',
      desc: 'Navigate your digital world with precision. Manage trades, projects, and connections through an intuitive interface designed for creators.',
      accent: 'from-lucidar-green/40 via-lucidar-lime/30 to-lucidar-green/20',
      glow: 'bg-lucidar-green',
      bgGlow: 'bg-lucidar-green/30',
    },
    {
      image: onboarding3,
      title: 'Customize Everything',
      desc: 'Build your unique identity with animated avatars, profile themes, and Lucid-style effects that make you stand out from the crowd.',
      accent: 'from-lucidar-lime/50 via-lucidar-yellow/30 to-lucidar-lime/20',
      glow: 'bg-lucidar-lime',
      bgGlow: 'bg-lucidar-lime/40',
    },
    {
      image: onboarding4,
      title: 'Trade Securely',
      desc: 'Buy, sell, and exchange with confidence. Our built-in escrow system protects every transaction until both parties are satisfied.',
      accent: 'from-lucidar-green/40 via-lucidar-lime/40 to-lucidar-yellow/20',
      glow: 'bg-lucidar-green',
      bgGlow: 'bg-lucidar-green/30',
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
    <div className="min-h-screen bg-lucidar-bg relative overflow-hidden flex items-center justify-center p-6" style={{ fontFamily: "'Chillax', sans-serif" }}>
      <motion.div 
        key={`bg-${current}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-br from-lucidar-dark via-lucidar-bg to-lucidar-dark"
      />
      
      <motion.div 
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className={`absolute top-20 left-20 w-72 h-72 rounded-full ${slide.bgGlow} opacity-20 blur-[100px]`}
      />
      <motion.div 
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-lucidar-lime/10 blur-[120px]"
      />

      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <button 
          onClick={prev}
          disabled={current === 0}
          className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all ${
            current === 0 
              ? 'opacity-0 pointer-events-none' 
              : 'bg-white/5 hover:bg-white/10 text-white hover:text-lucidar-lime'
          }`}
        >
          <ArrowLeft size={20} />
        </button>

        <button 
          onClick={skip}
          className="text-xs font-medium text-gray-500 hover:text-lucidar-lime transition-colors uppercase tracking-widest"
          style={{ fontFamily: "'Technor', sans-serif" }}
        >
          Skip
        </button>
      </div>

      <div className="relative w-full max-w-md z-10">
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
            <div className="relative overflow-hidden rounded-[2.5rem] bg-lucidar-dark/80 backdrop-blur-2xl border border-gray-800 shadow-2xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} opacity-30`} />
              
              <div className="relative p-8 pt-12">
                <div className="relative mb-8 flex justify-center">
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
                      className="relative w-64 h-64 object-contain drop-shadow-2xl"
                    />
                    
                    {isLast && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="absolute -top-2 -right-2 w-10 h-10 bg-lucidar-lime rounded-full flex items-center justify-center shadow-lg shadow-lucidar-lime/30"
                      >
                        <Check size={20} className="text-lucidar-bg" strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                <div className="text-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lucidar-lime/10 border border-lucidar-lime/20 mb-4"
                  >
                    <Sparkles size={14} className="text-lucidar-lime" />
                    <span className="text-xs text-lucidar-lime font-medium uppercase tracking-wider" style={{ fontFamily: "'Technor', sans-serif" }}>Step {current + 1} of 4</span>
                  </motion.div>

                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-semibold mb-4 text-white"
                    style={{ fontFamily: "'Technor', sans-serif" }}
                  >
                    {slide.title}
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 text-lg leading-relaxed"
                  >
                    {slide.desc}
                  </motion.p>
                </div>

                <div className="flex justify-center gap-2 mb-8">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                      style={{ width: i === current ? 40 : 8 }}
                    >
                      <div className="absolute inset-0 bg-gray-700" />
                      {i === current && (
                        <motion.div 
                          layoutId="activeDot"
                          className="absolute inset-0 bg-lucidar-lime"
                        />
                      )}
                      {i < current && (
                        <div className="absolute inset-0 bg-lucidar-green/50" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={next}
                    className="group relative px-8 py-4 rounded-2xl overflow-hidden bg-lucidar-lime text-lucidar-bg font-semibold text-lg hover:bg-lucidar-yellow transition-all duration-300 flex items-center gap-3 shadow-lg shadow-lucidar-lime/20"
                    style={{ fontFamily: "'Technor', sans-serif" }}
                  >
                    {isLast ? 'Get Started' : 'Next'}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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