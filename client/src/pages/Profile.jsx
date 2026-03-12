// Profile.jsx - Lucidar Community Profile with Real-time LP
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  User, Settings, Share2, MoreHorizontal, Trophy, Zap,
  MapPin, Link as LinkIcon, Calendar, ArrowLeft, MessageCircle,
  Wallet, TrendingUp, ShoppingBag, Users, Star, Shield, Gem,
  Activity, Hash, Copy, CheckCircle2, AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LiquidGlassBackground from '../components/LiquidGlassBackground'

// Import verified badges
import verifiedNormal from '/assets/verified/verified_normal.png'
import verifiedGolden from '/assets/verified/verified_golden.png'

export default function Profile() {
  const navigate = useNavigate()
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [copied, setCopied] = useState(false)
  const [lpPulse, setLpPulse] = useState(false)

  useEffect(() => {
    fetchProfile()
    // Real-time LP updates every 30 seconds for demo
    const interval = setInterval(() => {
      if (isOwnProfile) refreshLP()
    }, 30000)
    return () => clearInterval(interval)
  }, [username, isOwnProfile])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      const targetUsername = username || currentUser.username
      setIsOwnProfile(targetUsername === currentUser.username)
      
      const response = await fetch(`http://localhost:3000/api/profile/${targetUsername}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setUser(data.user)
        if (targetUsername === currentUser.username) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    } finally {
      setLoading(false)
    }
  }

  // Simulate real-time LP refresh
  const refreshLP = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.user.lucid_points !== user?.lucid_points) {
          setLpPulse(true)
          setUser(prev => ({ ...prev, lucid_points: data.user.lucid_points }))
          setTimeout(() => setLpPulse(false), 1000)
        }
      }
    } catch (err) {
      console.error('Failed to refresh LP:', err)
    }
  }

  const copyWalletAddress = () => {
    // Mock wallet address based on username
    const mockAddress = `0x${user.username}...${user.id?.toString().slice(-4) || '0000'}`
    navigator.clipboard.writeText(mockAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getNameStyle = () => {
    if (!user) return {}
    switch(user.effect || 'solid') {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${user.primary_color || '#ccff00'}, ${user.accent_color || '#00ff88'})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }
      case 'neon':
        return {
          color: '#fff',
          textShadow: `0 0 10px ${user.primary_color || '#ccff00'}`,
        }
      case 'glow':
        return {
          color: user.primary_color || '#ccff00',
          filter: `drop-shadow(0 0 8px ${user.primary_color || '#ccff00'})`,
        }
      default:
        return { color: user.primary_color || '#ccff00' }
    }
  }

  const getVerifiedBadge = () => {
    if (!user?.verified_type) return null
    return user.verified_type === 'golden' ? verifiedGolden : verifiedNormal
  }

  // Parse badges from JSON string
  const getBadges = () => {
    try {
      return JSON.parse(user?.badges || '[]')
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-[#ccff00] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!user) return null

  const badges = getBadges()

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white relative overflow-x-hidden pb-20">
      <LiquidGlassBackground />

      {/* Floating LP Indicator - Top Right */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 right-4 z-50 flex items-center gap-2"
      >
        <div className="bg-black/60 backdrop-blur-xl border border-[#ccff00]/30 rounded-full px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
          <span className="text-xs text-gray-400 hidden sm:block">LP Balance</span>
          <motion.span 
            animate={lpPulse ? { scale: [1, 1.2, 1] } : {}}
            className="font-bold text-[#ccff00] font-mono"
          >
            {user.lucid_points?.toLocaleString() || 0}
          </motion.span>
          <Zap size={14} className="text-[#ccff00]" />
        </div>
      </motion.div>

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      {/* === COVER === */}
      <div className="h-48 sm:h-56 md:h-64 relative overflow-hidden">
        {user.cover_photo ? (
          <img src={user.cover_photo} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div 
            className="w-full h-full relative"
            style={{
              background: `linear-gradient(135deg, ${user.primary_color || '#ccff00'}20, ${user.accent_color || '#00ff88'}15, #0a0f1a)`
            }}
          >
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, ${user.primary_color || '#ccff00'}30 0%, transparent 50%),
                               radial-gradient(circle at 80% 80%, ${user.accent_color || '#00ff88'}20 0%, transparent 50%)`,
            }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent" />
      </div>

      {/* === PROFILE INFO === */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative -mt-16 sm:-mt-20">
          
          {/* Avatar & Actions Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
            {/* Avatar */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div 
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#0a0f1a] bg-gray-800 relative"
                style={{ boxShadow: `0 0 0 3px ${user.primary_color || '#ccff00'}` }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <User size={48} className="text-gray-500" />
                  </div>
                )}
              </div>
              
              {/* Decoration */}
              {user.decoration && user.decoration !== 'none' && (
                <div className="absolute -inset-4 pointer-events-none">
                  <img 
                    src={`/assets/decorations/${user.decoration}.png`}
                    alt=""
                    className="w-full h-full object-contain"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
              
              {/* Verified Badge */}
              {user.verified_type && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 z-20">
                  <img src={getVerifiedBadge()} alt="Verified" className="w-full h-full object-contain" />
                </div>
              )}
              
              {/* Online Status */}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#00ff88] rounded-full border-4 border-[#0a0f1a] z-10" />
            </motion.div>

            {/* Actions */}
            <div className="flex-1 w-full sm:w-auto flex gap-2 mt-4 sm:mt-0 sm:mb-2">
              {isOwnProfile ? (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/profileeditor')}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Settings size={18} />
                  <span>Edit Profile</span>
                </motion.button>
              ) : (
                <>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-2.5 bg-[#ccff00] text-[#0a0f1a] rounded-full font-bold hover:bg-[#b8e600] transition-colors"
                  >
                    Follow
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-colors"
                  >
                    <MessageCircle size={20} />
                  </motion.button>
                </>
              )}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-colors"
              >
                <Share2 size={20} />
              </motion.button>
            </div>
          </div>

          {/* Name & Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 
                className="text-2xl sm:text-3xl font-bold"
                style={{ ...getNameStyle(), fontFamily: "'Technor', sans-serif" }}
              >
                {user.display_name || user.username}
              </h1>
              {badges.includes('early_adopter') && (
                <span className="px-2 py-1 rounded-full bg-[#ccff00]/20 text-[#ccff00] text-xs font-bold border border-[#ccff00]/30">
                  EARLY
                </span>
              )}
            </div>
            
            <p className="text-gray-500 font-mono text-sm mb-4">@{user.username}</p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm mb-4">
              <button className="hover:text-[#ccff00] transition-colors">
                <span className="font-bold text-white text-lg">{user.following?.toLocaleString() || 0}</span>
                <span className="text-gray-500 ml-1">Following</span>
              </button>
              <button className="hover:text-[#ccff00] transition-colors">
                <span className="font-bold text-white text-lg">{user.followers?.toLocaleString() || 0}</span>
                <span className="text-gray-500 ml-1">Followers</span>
              </button>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Shield size={14} className="text-[#00ccff]" />
                <span className="font-bold">{user.reputation || 100}</span>
                <span className="text-gray-500 text-xs">REP</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20">
                <Zap size={14} className="text-[#ccff00]" />
                <span className="font-bold text-[#ccff00]">Lvl {user.level || 1}</span>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-gray-300 text-base leading-relaxed mb-4 max-w-2xl">
                {user.bio}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} /> {user.location}
                </span>
              )}
              {user.website && (
                <a href={`https://${user.website}`} className="flex items-center gap-1.5 hover:text-[#ccff00] transition-colors">
                  <LinkIcon size={14} /> {user.website}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> 
                Joined {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
              </span>
            </div>
          </div>

          {/* LUCID POINTS WALLET CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 rounded-3xl bg-gradient-to-br from-[#ccff00]/20 via-[#ccff00]/10 to-transparent border border-[#ccff00]/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#ccff00]/20 flex items-center justify-center border border-[#ccff00]/30">
                  <Wallet size={28} className="text-[#ccff00]" />
                </div>
                <div>
                  <p className="text-sm text-[#ccff00]/80 font-medium uppercase tracking-wider">Lucid Points</p>
                  <motion.h2 
                    key={user.lucid_points}
                    initial={lpPulse ? { scale: 1.2, color: '#fff' } : {}}
                    animate={{ scale: 1, color: '#ccff00' }}
                    className="text-3xl sm:text-4xl font-bold text-[#ccff00] font-mono"
                  >
                    {user.lucid_points?.toLocaleString() || 0}
                    <span className="text-lg ml-1">LP</span>
                  </motion.h2>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="flex items-center gap-2 bg-black/30 rounded-full px-4 py-2 border border-white/10">
                <span className="text-xs text-gray-400 font-mono">
                  0x{user.username?.slice(0, 6)}...{user.id?.toString().slice(-4) || '0000'}
                </span>
                <button 
                  onClick={copyWalletAddress}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {copied ? <CheckCircle2 size={14} className="text-[#00ff88]" /> : <Copy size={14} className="text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="relative z-10 flex gap-3 mt-4 pt-4 border-t border-[#ccff00]/20">
              <button className="flex-1 py-2.5 rounded-xl bg-[#ccff00] text-[#0a0f1a] font-bold text-sm hover:bg-[#b8e600] transition-colors">
                Send LP
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition-colors border border-white/20">
                Receive
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition-colors border border-white/20">
                History
              </button>
            </div>
          </motion.div>

          {/* MARKETPLACE STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Items Listed', value: user.trades || 0, icon: ShoppingBag, color: '#00ff88' },
              { label: 'Sales Made', value: 0, icon: TrendingUp, color: '#00ccff' },
              { label: 'Total Volume', value: '0 LP', icon: Activity, color: '#ff0066', isText: true },
              { label: 'Rating', value: '5.0 ★', icon: Star, color: '#ffd700', isText: true },
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <Icon size={20} style={{ color: stat.color }} className="mb-2" />
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>

          {/* LEVEL PROGRESS */}
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-[#ffd700]" />
                <span className="font-bold">Level {user.level || 1}</span>
              </div>
              <span className="text-xs text-gray-500">
                {user.current_xp || 0} / {(user.level || 1) * 1000} XP
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((user.current_xp || 0) / ((user.level || 1) * 1000)) * 100}%` }}
                className="h-full rounded-full bg-gradient-to-r from-[#ccff00] to-[#00ff88]"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Earn XP by posting, trading, and engaging with the community
            </p>
          </div>

          {/* TABS */}
          <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
            {['Posts', 'Listings', 'Reviews', 'Activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab.toLowerCase() ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ccff00]" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="min-h-[300px]"
            >
              {activeTab === 'listings' ? (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-500">No active listings</p>
                  <button 
                    onClick={() => navigate('/marketplace/create')}
                    className="mt-4 px-6 py-2 bg-[#ccff00] text-[#0a0f1a] rounded-full font-bold text-sm hover:bg-[#b8e600] transition-colors"
                  >
                    Create Listing
                  </button>
                </div>
              ) : activeTab === 'reviews' ? (
                <div className="text-center py-12">
                  <Star size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-500">No reviews yet</p>
                  <p className="text-sm text-gray-600 mt-2">Complete trades to earn reviews</p>
                </div>
              ) : activeTab === 'activity' ? (
                <div className="space-y-3">
                  {[
                    { action: 'Joined Lucidar', time: user.created_at, icon: CheckCircle2, color: '#00ff88' },
                    { action: 'Earned Early Adopter badge', time: user.created_at, icon: Star, color: '#ccff00' },
                    { action: `Received ${user.lucid_points || 100} LP signup bonus`, time: user.created_at, icon: Zap, color: '#ffd700' },
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${item.color}20` }}
                        >
                          <Icon size={18} style={{ color: item.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{item.action}</p>
                          <p className="text-xs text-gray-500">
                            {item.time ? new Date(item.time).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Hash size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-500">No posts yet</p>
                  <button 
                    onClick={() => navigate('/create')}
                    className="mt-4 px-6 py-2 bg-white/10 text-white rounded-full font-medium text-sm hover:bg-white/20 transition-colors border border-white/20"
                  >
                    Create Post
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}