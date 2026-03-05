import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Shield, Users, Gamepad2, ChevronRight, Menu, X } from 'lucide-react'

export default function Welcome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: Shield,
      title: 'Built-in Escrow',
      desc: 'Trade game accounts & digital goods with zero risk. Funds held until both parties confirm.'
    },
    {
      icon: Users,
      title: 'Community First',
      desc: 'Connect with gamers, devs, and anime creators. Real-time chat, voice, and collaboration.'
    },
    {
      icon: Gamepad2,
      title: 'Gaming Native',
      desc: 'Profile themes, animated avatars, and Lucide-style customization for your identity.'
    },
    {
      icon: Zap,
      title: 'Instant Payouts',
      desc: 'Crypto or fiat, your choice. Get paid the second the trade completes.'
    }
  ]

  return (
    <div className="min-h-screen bg-lucidar-bg text-white overflow-hidden relative">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lucidar-lime/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lucidar-green/10 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/img/logo.png" 
            alt="Lucidar logo" 
            className="h-28 w-auto"
          />
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-400 hover:text-lucidar-lime transition-colors">Features</a>
          <a href="#community" className="text-sm text-gray-400 hover:text-lucidar-lime transition-colors">Community</a>
          <a href="#marketplace" className="text-sm text-gray-400 hover:text-lucidar-lime transition-colors">Marketplace</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm text-gray-300 hover:text-white transition-colors"><a href="Login">Sign In</a></button>
          <button className="bg-lucidar-lime text-lucidar-bg px-4 py-2 rounded-lg text-sm font-semibold hover:bg-lucidar-yellow transition-colors">
            <a href="signup">Get Started</a>
          </button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden h-[450px] absolute z-40 top-0 left-0 right-0 bg-lucidar-dark/95 backdrop-blur-lg border-b border-gray-800 px-6 py-4"
        >
          <div className="flex flex-col gap-4 mt-[90px]">
            <a href="#features" className="text-gray-300 py-2">Features</a>
            <a href="#community" className="text-gray-300 py-2">Community</a>
            <a href="#marketplace" className="text-gray-300 py-2">Marketplace</a>
            <hr className="border-gray-800" />
            <button className="text-left text-gray-300 py-2">Sign In</button>
            <button className="bg-lucidar-lime text-lucidar-bg py-3 rounded-lg font-semibold">
              Get Started
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lucidar-lime/10 border border-lucidar-lime/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-lucidar-lime animate-pulse" />
              <span className="text-sm text-lucidar-lime font-medium">Now in Beta</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
              Create. Trade. Connect <br /> Without
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lucidar-lime via-lucidar-yellow to-lucidar-green">
                The Trust Issues
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The first community platform built for gamers with built-in escrow protection. 
              Buy accounts, hire devs, find your squad-without getting scammed.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full sm:flex-1 px-4 py-3 rounded-lg bg-white/5 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-lucidar-lime transition-colors"
              />
              <button className="w-full sm:w-auto px-6 py-3 bg-lucidar-lime text-lucidar-bg rounded-lg font-semibold hover:bg-lucidar-yellow transition-colors flex items-center justify-center gap-2">
                Join Waitlist
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Shield size={16} className="text-lucidar-lime" />
                Open Source Core
              </span>
              <span className="flex items-center gap-2">
                <Zap size={16} className="text-lucidar-lime" />
                0% First Trade
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} className="text-lucidar-lime" />
                12,000+ Waiting
              </span>
            </div>
          </motion.div>

          {/* App Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 lg:mt-24 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              {/* Glow behind */}
              <div className="absolute inset-0 bg-lucidar-lime/20 blur-3xl rounded-3xl" />
              
              {/* Browser mockup */}
              <div className="relative bg-lucidar-dark rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-lucidar-bg border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-800/50 text-xs text-gray-500">
                      <Shield size={12} />
                      lucidar.io/app
                    </div>
                  </div>
                </div>

                {/* App content mock */}
                <div className="flex h-64 md:h-96">
                  {/* Sidebar */}
                  <div className="hidden md:block w-16 bg-lucidar-bg border-r border-gray-800 p-2 space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-lucidar-lime/20 mx-auto" />
                    <div className="w-10 h-10 rounded-lg bg-gray-800 mx-auto" />
                    <div className="w-10 h-10 rounded-lg bg-gray-800 mx-auto" />
                  </div>

                  {/* Main chat */}
                  <div className="flex-1 bg-lucidar-dark p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-lucidar-lime/30" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 bg-gray-800 rounded" />
                        <div className="h-8 w-48 bg-gray-800/50 rounded-lg" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-lucidar-green/30" />
                      <div className="space-y-1">
                        <div className="h-3 w-20 bg-gray-800 rounded" />
                        <div className="h-12 w-64 bg-gray-800/50 rounded-lg" />
                      </div>
                    </div>
                    <div className="flex gap-3 opacity-50">
                      <div className="w-8 h-8 rounded-full bg-gray-700" />
                      <div className="space-y-1">
                        <div className="h-3 w-16 bg-gray-800 rounded" />
                        <div className="h-6 w-32 bg-gray-800/50 rounded-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Members sidebar */}
                  <div className="hidden lg:block w-48 bg-lucidar-bg border-l border-gray-800 p-3">
                    <div className="h-3 w-20 bg-gray-800 rounded mb-3" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-lucidar-lime/30" />
                        <div className="h-2 w-16 bg-gray-800 rounded" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-lucidar-green/30" />
                        <div className="h-2 w-12 bg-gray-800 rounded" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-700" />
                        <div className="h-2 w-20 bg-gray-800 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 px-6 lg:px-12 py-24 bg-lucidar-dark/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400">Built by creators, for creators</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-lucidar-bg border border-gray-800 hover:border-lucidar-lime/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-lucidar-lime/10 flex items-center justify-center mb-4 group-hover:bg-lucidar-lime/20 transition-colors">
                  <feature.icon className="text-lucidar-lime" size={24} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Join the
            <span className="text-lucidar-lime"> Future?</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Be among the first to experience the next generation of gaming communities. 
            Early members get lifetime perks.
          </p>
          <button className="px-8 py-4 bg-lucidar-lime text-lucidar-bg rounded-lg font-bold text-lg hover:bg-lucidar-yellow transition-colors inline-flex items-center gap-2">
            <Zap size={20} />
            Join Waitlist Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/img/logo.png" alt="Lucidar" className="h-28 w-auto" />
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-lucidar-lime transition-colors">Twitter</a>
            <a href="#" className="hover:text-lucidar-lime transition-colors">GitHub</a>
            <a href="#" className="hover:text-lucidar-lime transition-colors">Discord</a>
          </div>
          <p className="text-sm text-gray-600">© 2026 Lucidar. Open source.</p>
        </div>
      </footer>
    </div>
  )
}