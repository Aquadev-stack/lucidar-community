import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Camera, 
  Lock, 
  Unlock, 
  ChevronRight, 
  Check, 
  Sparkles,
  Palette,
  Type,
  Image as ImageIcon,
  X
} from 'lucide-react'

// Mock data for avatar decorations - I'll explain how to get real ones below
const avatarDecorations = [
  { id: 'none', name: 'None', src: null, preview: null },
  { id: 'cat-pink', name: 'Cat Onesie', src: '/assets/decorations/chomp.png', category: 'cute' },
  { id: 'cyber-frame', name: 'Cyber Frame', src: '/assets/decorations/xmas.gif', category: 'gaming' },
  { id: 'fire-ring', name: 'Fire Ring', src: '/assets/decorations/fire.png', category: 'animated' },
  { id: 'neon-circle', name: 'Neon', src: '/assets/decorations/neon.png', category: 'animated' },
  { id: 'pixel-cat', name: 'Pixel Cat', src: '/assets/decorations/pixel-cat.png', category: 'retro' },
  { id: 'angel-wings', name: 'Angel', src: '/assets/decorations/angel.png', category: 'fantasy' },
  { id: 'devil-horns', name: 'Devil', src: '/assets/decorations/devil.png', category: 'fantasy' },
]

// Name style effects like Discord
const nameEffects = [
  { id: 'solid', name: 'Solid', gradient: false },
  { id: 'gradient', name: 'Gradient', gradient: true },
  { id: 'neon', name: 'Neon', glow: true },
  { id: 'pop', name: 'Pop', shadow: true },
]

// Fonts like Discord Nitro
const fonts = [
  { id: 'default', name: 'Default', family: 'sans-serif' },
  { id: 'sakura', name: 'Sakura', family: "'Sakura', cursive" },
  { id: 'vampyre', name: 'Vampyre', family: "'Vampyre', serif" },
  { id: 'cute', name: 'Cute', family: "'Cute', cursive" },
  { id: 'pixel', name: 'Pixel', family: "'Pixel', monospace" },
  { id: 'bold', name: 'Bold', family: "'Bold', sans-serif" },
]

// Color presets
const colorPresets = [
  '#ccff00', // Lucidar lime
  '#00ff88', // Green
  '#00ccff', // Cyan
  '#ff0066', // Pink
  '#ff6600', // Orange
  '#9900ff', // Purple
  '#ff0000', // Red
  '#ffff00', // Yellow
]

export default function ProfileSetup() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const coverInputRef = useRef(null)
  
  // Form state
  const [profile, setProfile] = useState({
    displayName: '',
    username: '',
    email: '',
    showEmail: false,
    bio: '',
    avatar: null,
    coverPhoto: null,
    decoration: 'none',
    primaryColor: '#ccff00',
    accentColor: '#00ff88',
    font: 'default',
    effect: 'solid',
  })

  // UI state
  const [activeTab, setActiveTab] = useState('basic') // basic, appearance, decorations
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorPickerTarget, setColorPickerTarget] = useState('primary')

  // Handle image upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          [type]: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Display name is user-controlled, but username/email come from signed-up user session
  const handleDisplayNameChange = (e) => {
    const name = e.target.value
    setProfile(prev => ({
      ...prev,
      displayName: name,
    }))
  }

  useEffect(() => {
    // Prefill from session created during signup/login
    try {
      const rawUser = localStorage.getItem('lucidar_user')
      if (!rawUser) return
      const user = JSON.parse(rawUser)
      setProfile(prev => ({
        ...prev,
        username: user?.username || prev.username,
        email: user?.email || prev.email,
      }))
    } catch {
      // ignore malformed storage
    }
  }, [])

  const handleSubmit = () => {
    // Save to backend/localStorage (MVP)
    localStorage.setItem('userProfile', JSON.stringify(profile))
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-lucidar-bg text-white pb-24 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-lucidar-bg/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Technor', sans-serif" }}>
            Set Up Profile
          </h1>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-lucidar-lime text-lucidar-bg rounded-lg font-semibold text-sm hover:bg-lucidar-yellow transition-colors flex items-center gap-2"
          >
            <Check size={18} />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* === PROFILE PREVIEW CARD (Like Discord) === */}
        <div className="relative rounded-2xl overflow-hidden bg-lucidar-dark border border-gray-800">
          {/* Cover Photo */}
          <div className="relative h-32 sm:h-48 bg-gradient-to-br from-gray-800 to-gray-900">
            {profile.coverPhoto ? (
              <img 
                src={profile.coverPhoto} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-lucidar-lime/20 to-lucidar-green/20" />
            )}
            
            {/* Cover upload button */}
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-colors"
            >
              <Camera size={18} className="text-white" />
            </button>
            <input 
              ref={coverInputRef}
              type="file" 
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'coverPhoto')}
              className="hidden"
            />
          </div>

          {/* Avatar Section */}
          <div className="px-4 sm:px-6 pb-6 ">
            <div className="relative -mt-12 sm:-mt-16 mb-4 flex justify-between items-end">
              {/* Avatar with decoration */}
              <div className="relative ">
                <div className="relative w-[120px] h-[120px] ">
                  {/* Avatar decoration frame */}
                  {profile.decoration !== 'none' && (
                    <img 
                      src={avatarDecorations.find(d => d.id === profile.decoration)?.src}
                      alt="decoration"
                      className="absolute -top-[170px] left-0 w-[350px] h-[450px] object-contain z-10 pointer-events-none"
                    />
                  )}
                  
                  {/* Avatar image */}
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-lucidar-dark bg-gray-800 relative">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>

                  {/* Upload button */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-lucidar-lime text-lucidar-bg rounded-full hover:bg-lucidar-yellow transition-colors z-20"
                  >
                    <Camera size={16} />
                  </button>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'avatar')}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Quick stats or badge */}
              <div className="mb-2">
                <span className="px-3 py-1 rounded-full bg-lucidar-lime/10 border border-lucidar-lime/30 text-lucidar-lime text-xs font-medium">
                  New Member
                </span>
              </div>
            </div>

            {/* Name Preview with Effects */}
            <div className="space-y-1">
              <h2 
                className={`text-2xl sm:text-3xl font-bold ${
                  profile.effect === 'gradient' 
                    ? 'bg-gradient-to-r from-lucidar-lime to-lucidar-green bg-clip-text text-transparent'
                    : profile.effect === 'neon'
                    ? 'text-white drop-shadow-[0_0_10px_rgba(204,255,0,0.8)]'
                    : profile.effect === 'pop'
                    ? 'text-white drop-shadow-[2px_2px_0px_rgba(204,255,0,1)]'
                    : 'text-white'
                }`}
                style={{ fontFamily: fonts.find(f => f.id === profile.font)?.family }}
              >
                {profile.displayName || 'Your Name'} 
                {profile.displayName && (
                  <span className="text-gray-500 text-lg ml-2"></span>
                )}
              </h2>
              <p className="text-gray-400 font-medium">@{profile.username || 'username'}</p>
            </div>

            {/* Bio preview */}
            {profile.bio && (
              <p className="mt-3 text-sm text-gray-300 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* === TABS === */}
        <div className="flex gap-2 p-1 bg-lucidar-dark rounded-xl border border-gray-800">
          {[
            { id: 'basic', label: 'Basic', icon: ImageIcon },
            { id: 'appearance', label: 'Style', icon: Palette },
            { id: 'decorations', label: 'Decorations', icon: Sparkles },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-lucidar-lime text-lucidar-bg' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* === TAB CONTENT === */}
        <AnimatePresence mode="wait">
          
          {/* BASIC INFO TAB */}
          {activeTab === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Display Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Display Name</label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={handleDisplayNameChange}
                  placeholder="How you want to be called"
                  className="w-full px-4 py-3 rounded-xl bg-lucidar-dark border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-lucidar-lime transition-colors"
                  style={{ fontFamily: fonts.find(f => f.id === profile.font)?.family }}
                />
              </div>

              {/* Username (from your account) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <input
                    type="text"
                    value={profile.username}
                    readOnly
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-lucidar-dark border border-gray-700 text-white opacity-80 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500">This comes from your account</p>
              </div>

              {/* Email with privacy toggle */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center justify-between">
                  Email
                  <button
                    onClick={() => setProfile(prev => ({ ...prev, showEmail: !prev.showEmail }))}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-lucidar-lime transition-colors"
                  >
                    {profile.showEmail ? <Unlock size={12} /> : <Lock size={12} />}
                    {profile.showEmail ? 'Public' : 'Private'}
                  </button>
                </label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-lucidar-dark border border-gray-700 text-white placeholder-gray-500 opacity-80 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">About Me</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={190}
                  className="w-full px-4 py-3 rounded-xl bg-lucidar-dark border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-lucidar-lime transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 text-right">{profile.bio.length}/190</p>
              </div>
            </motion.div>
          )}

          {/* APPEARANCE TAB (Fonts & Colors) */}
          {activeTab === 'appearance' && (
            <motion.div
              key="appearance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Font Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Type size={16} className="text-lucidar-lime" />
                  Display Font
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {fonts.map(font => (
                    <button
                      key={font.id}
                      onClick={() => setProfile(prev => ({ ...prev, font: font.id }))}
                      className={`p-3 rounded-xl border transition-all text-center ${
                        profile.font === font.id
                          ? 'border-lucidar-lime bg-lucidar-lime/10 text-lucidar-lime'
                          : 'border-gray-700 hover:border-gray-600 text-gray-300'
                      }`}
                    >
                      <span style={{ fontFamily: font.family }} className="text-lg block mb-1">
                        Gg
                      </span>
                      <span className="text-xs">{font.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Effect */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Name Effect</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {nameEffects.map(effect => (
                    <button
                      key={effect.id}
                      onClick={() => setProfile(prev => ({ ...prev, effect: effect.id }))}
                      className={`p-3 rounded-xl border transition-all ${
                        profile.effect === effect.id
                          ? 'border-lucidar-lime bg-lucidar-lime/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <span className={
                        effect.id === 'gradient' 
                          ? 'bg-gradient-to-r from-lucidar-lime to-lucidar-green bg-clip-text text-transparent font-bold'
                          : effect.id === 'neon'
                          ? 'text-white drop-shadow-[0_0_8px_rgba(204,255,0,0.8)] font-bold'
                          : effect.id === 'pop'
                          ? 'text-white drop-shadow-[2px_2px_0px_rgba(204,255,0,1)] font-bold'
                          : 'text-white font-bold'
                      }>
                        Aa
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{effect.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Palette size={16} className="text-lucidar-lime" />
                  Profile Colors
                </label>
                
                {/* Primary Color */}
                <div className="p-4 rounded-xl bg-lucidar-dark border border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Primary Color</span>
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white/20 cursor-pointer"
                      style={{ backgroundColor: profile.primaryColor }}
                      onClick={() => {
                        setColorPickerTarget('primary')
                        setShowColorPicker(true)
                      }}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {colorPresets.map(color => (
                      <button
                        key={color}
                        onClick={() => setProfile(prev => ({ ...prev, primaryColor: color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          profile.primaryColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* DECORATIONS TAB */}
          {activeTab === 'decorations' && (
            <motion.div
              key="decorations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-400 mb-4">Choose a frame for your avatar</p>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {avatarDecorations.map(deco => (
                  <button
                    key={deco.id}
                    onClick={() => setProfile(prev => ({ ...prev, decoration: deco.id }))}
                    className={`relative aspect-square rounded-xl border-2 transition-all overflow-hidden ${
                      profile.decoration === deco.id
                        ? 'border-lucidar-lime bg-lucidar-lime/10'
                        : 'border-gray-700 hover:border-gray-600 bg-lucidar-dark'
                    }`}
                  >
                    {deco.src ? (
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <img 
                          src={deco.src} 
                          alt={deco.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
                        None
                      </div>
                    )}
                    
                    {profile.decoration === deco.id && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-lucidar-lime rounded-full flex items-center justify-center">
                        <Check size={12} className="text-lucidar-bg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Categories */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {['All', 'Cute', 'Gaming', 'Animated', 'Retro', 'Fantasy'].map(cat => (
                  <button
                    key={cat}
                    className="px-4 py-1.5 rounded-full bg-lucidar-dark border border-gray-700 text-sm text-gray-400 hover:text-white hover:border-gray-600 whitespace-nowrap"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Save Button (Fixed bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-lucidar-bg/90 backdrop-blur-xl border-t border-gray-800">
        <button 
          onClick={handleSubmit}
          className="w-full py-3 bg-lucidar-lime text-lucidar-bg rounded-xl font-semibold hover:bg-lucidar-yellow transition-colors flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Save Profile
        </button>
      </div>

      {/* Color Picker Modal */}
      <AnimatePresence>
        {showColorPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowColorPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-lucidar-dark rounded-2xl p-6 border border-gray-700 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Pick a Color</h3>
                <button onClick={() => setShowColorPicker(false)}>
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              
              <input 
                type="color" 
                value={colorPickerTarget === 'primary' ? profile.primaryColor : profile.accentColor}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  [colorPickerTarget === 'primary' ? 'primaryColor' : 'accentColor']: e.target.value
                }))}
                className="w-full h-32 rounded-xl cursor-pointer"
              />
              
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => setShowColorPicker(false)}
                  className="px-4 py-2 bg-lucidar-lime text-lucidar-bg rounded-lg font-medium"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
