// ProfileEditor.jsx - The Holographic Command Center (Clean Edition)
import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, Check, X, Sparkles, Palette, Type, Image as ImageIcon, 
  Zap, Globe, MapPin, Link as LinkIcon, AtSign, 
  ChevronRight, Save, RotateCcw, Award, User,
  Upload, Trash2
} from 'lucide-react'

// Decoration imports
import chomp from '/assets/decorations/chomp.gif'
import xmas from '/assets/decorations/xmas.png'
import catonsie from '/assets/decorations/catonsie.gif'
import astral_aura from '/assets/decorations/astral_aura.png'
import aurora from '/assets/decorations/aurora.png'
import hood_crimson from '/assets/decorations/hood_crimson.png'
import hood_dark from '/assets/decorations/hood_dark.png'
import neon_cat_hoodie_black from '/assets/decorations/neon_cat_hoodie_black.png'
import neon_cat_hoodie_blue from '/assets/decorations/neon_cat_hoodie_blue.png'
import neon_cat_hoodie_pink from '/assets/decorations/neon_cat_hoodie_pink.png'
import neon_cat_hoodie from '/assets/decorations/neon_cat_hoodie.png'

const fonts = [
  { id: 'default', name: 'Chillax', family: "'Chillax', sans-serif", preview: 'Aa' },
  { id: 'technor', name: 'Technor', family: "'Technor', sans-serif", preview: 'Aa' },
  { id: 'panchang', name: 'Panchang', family: "'Panchang', sans-serif", preview: 'Aa' },
  { id: 'telma', name: 'Telma', family: "'Telma', cursive", preview: 'Aa' },
  { id: 'audiowide', name: 'Audiowide', family: "'Audiowide', sans-serif", preview: 'Aa' },
  { id: 'kumar', name: 'Kumar One', family: "'Kumar One Outline', system-ui", preview: 'Aa' },
  { id: 'unifraktur', name: 'Unifraktur', family: "'UnifrakturCook', cursive", preview: 'Aa' },
  { id: 'syncopate', name: 'Syncopate', family: "'Syncopate', sans-serif", preview: 'Aa' },
]

const avatarDecorations = [
  { id: 'none', name: 'None', src: null, rarity: 'common' },
  { id: 'chomp', name: 'Chomp', src: chomp, rarity: 'legendary' },
  { id: 'xmas', name: 'Festive', src: xmas, rarity: 'rare' },
  { id: 'catonsie', name: 'Snooze', src: catonsie, rarity: 'epic' },
  { id: 'astral_aura', name: 'Astral', src: astral_aura, rarity: 'legendary' },
  { id: 'aurora', name: 'Aurora', src: aurora, rarity: 'mythic' },
  { id: 'hood_crimson', name: 'Crimson', src: hood_crimson, rarity: 'rare' },
  { id: 'hood_dark', name: 'Shadow', src: hood_dark, rarity: 'epic' },
  { id: 'neon_cat_hoodie_black', name: 'Neon Black', src: neon_cat_hoodie_black, rarity: 'rare' },
  { id: 'neon_cat_hoodie_blue', name: 'Neon Blue', src: neon_cat_hoodie_blue, rarity: 'rare' },
  { id: 'neon_cat_hoodie_pink', name: 'Neon Pink', src: neon_cat_hoodie_pink, rarity: 'epic' },
  { id: 'neon_cat_hoodie', name: 'Neon Classic', src: neon_cat_hoodie, rarity: 'common' },
]

const nameEffects = [
  { id: 'solid', name: 'Solid', description: 'Clean & Bold' },
  { id: 'gradient', name: 'Gradient', description: 'Dual-tone Flow' },
  { id: 'neon', name: 'Neon', description: 'Cyber Glow' },
  { id: 'pop', name: 'Pop', description: '3D Shadow' },
  { id: 'glow', name: 'Glow', description: 'Aura Effect' },
  { id: 'glitch', name: 'Glitch', description: 'Digital Distortion' },
]

const colorPresets = [
  { color: '#ccff00', name: 'Lucidar Lime' },
  { color: '#00ff88', name: 'Matrix Green' },
  { color: '#00ccff', name: 'Cyber Cyan' },
  { color: '#ff0066', name: 'Neon Pink' },
  { color: '#ff6600', name: 'Sunset Orange' },
  { color: '#9900ff', name: 'Void Purple' },
  { color: '#ff0000', name: 'Crimson' },
  { color: '#ffff00', name: 'Highlighter' },
  { color: '#ffffff', name: 'Pure White' },
  { color: '#ff00ff', name: 'Magenta' },
  { color: '#00ffff', name: 'Aqua' },
  { color: '#ffd700', name: 'Gold' },
]

const badges = [
  { id: 'early_adopter', name: 'Early Adopter', color: '#ccff00', description: 'Joined during beta' },
  { id: 'creator', name: 'Creator', color: '#ff0066', description: 'Published 10+ posts' },
  { id: 'gamer', name: 'Gamer', color: '#00ccff', description: 'Level 10+ in games' },
  { id: 'developer', name: 'Dev', color: '#00ff88', description: 'Contributed code' },
  { id: 'trader', name: 'Trader', color: '#ffd700', description: '50+ trades completed' },
  { id: 'verified', name: 'Verified', color: '#ffffff', description: 'Identity confirmed by admin' },
]

const rarityColors = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
  mythic: '#ec4899',
}

export default function ProfileEditor() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const coverInputRef = useRef(null)
  const [activeSection, setActiveSection] = useState('identity')
  const [saveStatus, setSaveStatus] = useState('idle')
  
  const [profile, setProfile] = useState({
    displayName: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    avatar: null,
    coverPhoto: null,
    decoration: 'none',
    primaryColor: '#ccff00',
    accentColor: '#00ff88',
    font: 'default',
    effect: 'solid',
    badges: ['early_adopter'],
    showEmail: false,
    status: 'online',
  })

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        const response = await fetch('http://localhost:3000/api/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          const user = data.user
          
          setProfile(prev => ({
            ...prev,
            displayName: user.display_name || user.username,
            username: user.username,
            email: user.email,
            bio: user.bio || '',
            location: user.location || '',
            website: user.website || '',
            avatar: user.avatar,
            coverPhoto: user.cover_photo,
            decoration: user.decoration || 'none',
            primaryColor: user.primary_color || '#ccff00',
            accentColor: user.accent_color || '#00ff88',
            font: user.font || 'default',
            effect: user.effect || 'solid',
            badges: user.badges || ['early_adopter'],
          }))
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
        const stored = JSON.parse(localStorage.getItem('user') || '{}')
        if (stored.username) {
          setProfile(prev => ({
            ...prev,
            ...stored,
            displayName: stored.display_name || stored.username,
          }))
        }
      }
    }
    
    loadUser()
  }, [navigate])

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, [type]: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (type) => {
    setProfile(prev => ({ ...prev, [type]: null }))
  }

  const handleSave = async () => {
    setSaveStatus('saving')
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          display_name: profile.displayName,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          avatar: profile.avatar,
          cover_photo: profile.coverPhoto,
          decoration: profile.decoration,
          primary_color: profile.primaryColor,
          accent_color: profile.accentColor,
          font: profile.font,
          effect: profile.effect,
        })
      })

      if (response.ok) {
        const data = await response.json()
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        localStorage.setItem('user', JSON.stringify({ 
          ...currentUser, 
          ...data.user,
          display_name: data.user.display_name,
        }))
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        throw new Error('Save failed')
      }
    } catch (err) {
      console.error('Save error:', err)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const getNameStyle = useCallback(() => {
    const { effect, primaryColor, accentColor } = profile
    const base = { fontFamily: fonts.find(f => f.id === profile.font)?.family }
    
    switch(effect) {
      case 'gradient':
        return {
          ...base,
          background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }
      case 'neon':
        return {
          ...base,
          color: '#fff',
          textShadow: `0 0 5px ${primaryColor}, 0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`,
        }
      case 'pop':
        return {
          ...base,
          color: '#fff',
          textShadow: `4px 4px 0px ${primaryColor}, 8px 8px 0px ${accentColor}40`,
        }
      case 'glow':
        return {
          ...base,
          color: primaryColor,
          filter: `drop-shadow(0 0 12px ${primaryColor})`,
        }
      case 'glitch':
        return {
          ...base,
          color: primaryColor,
          textShadow: `2px 0 ${accentColor}, -2px 0 ${primaryColor}`,
          animation: 'glitch 1s infinite',
        }
      default:
        return { ...base, color: primaryColor }
    }
  }, [profile])

  const sections = [
    { id: 'identity', label: 'Identity', icon: User, color: '#ccff00' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: '#00ccff' },
    { id: 'decorations', label: 'Decorations', icon: Sparkles, color: '#ff0066' },
    { id: 'badges', label: 'Badges', icon: Award, color: '#ffd700' },
  ]

  return (
    <div className="min-h-screen bg-[#050810] text-white overflow-x-hidden font-['Chillax']">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(${profile.primaryColor}10 1px, transparent 1px), linear-gradient(90deg, ${profile.primaryColor}10 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Top Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#050810]/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
            <h1 className="text-lg font-bold font-['Technor'] tracking-wider hidden sm:block">
              PROFILE<span style={{ color: profile.primaryColor }}> EDITOR</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all relative overflow-hidden text-sm sm:text-base"
              style={{ 
                backgroundColor: saveStatus === 'saved' ? '#00ff88' : saveStatus === 'error' ? '#ff0066' : profile.primaryColor,
                color: '#050810'
              }}
            >
              {saveStatus === 'saving' ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                  <RotateCcw size={18} />
                </motion.div>
              ) : saveStatus === 'saved' ? (
                <Check size={18} />
              ) : (
                <Save size={18} />
              )}
              <span className="hidden sm:inline">
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save Changes'}
              </span>
              <span className="sm:hidden">
                {saveStatus === 'saving' ? '...' : saveStatus === 'saved' ? 'OK' : saveStatus === 'error' ? '!' : 'Save'}
              </span>
            </button>
          </div>
        </div>
      </motion.nav>

      <div className="pt-16 flex flex-col lg:flex-row min-h-screen">
        {/* Left Sidebar - Navigation */}
        <motion.aside 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0a0f1a]/50 backdrop-blur-sm flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible flex-shrink-0"
        >
          <div className="p-2 lg:p-4 flex lg:flex-col gap-1 min-w-max lg:min-w-0">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all relative overflow-hidden group whitespace-nowrap ${
                  activeSection === section.id ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                {activeSection === section.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-full hidden lg:block"
                    style={{ backgroundColor: section.color }}
                  />
                )}
                <section.icon 
                  size={20} 
                  style={{ color: activeSection === section.id ? section.color : '#9ca3af' }}
                />
                <span className={`font-medium ${activeSection === section.id ? 'text-white' : 'text-gray-400'}`}>
                  {section.label}
                </span>
                {activeSection === section.id && (
                  <ChevronRight size={16} className="ml-auto hidden lg:block" style={{ color: section.color }} />
                )}
              </button>
            ))}
          </div>

          {/* Quick Stats - Desktop only */}
          <div className="mt-auto p-4 border-t border-white/10 hidden lg:block">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Profile Completion</span>
                <span style={{ color: profile.primaryColor }}>85%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: profile.primaryColor }}
                />
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content Area - Full Width */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              
              {/* IDENTITY SECTION */}
              {activeSection === 'identity' && (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-[#ccff00]/10">
                      <User className="text-[#ccff00]" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold font-['Technor']">Identity</h2>
                      <p className="text-gray-400 text-sm">Who you are in the Lucidar universe</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:gap-6">
                    {/* Image Upload Section */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Avatar Upload */}
                      <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Camera size={14} /> Profile Picture
                        </label>
                        <div className="relative aspect-square max-w-[200px] mx-auto sm:mx-0 rounded-xl overflow-hidden bg-[#050810] border-2 border-dashed border-white/20 group">
                          {profile.avatar ? (
                            <>
                              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                >
                                  <Upload size={20} />
                                </button>
                                <button
                                  onClick={() => removeImage('avatar')}
                                  className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-red-400"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </>
                          ) : (
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors"
                            >
                              <Upload size={32} />
                              <span className="text-xs">Click to upload</span>
                            </button>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'avatar')}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {/* Cover Upload */}
                      <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <ImageIcon size={14} /> Cover Photo
                        </label>
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-[#050810] border-2 border-dashed border-white/20 group">
                          {profile.coverPhoto ? (
                            <>
                              <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  onClick={() => coverInputRef.current?.click()}
                                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                >
                                  <Upload size={20} />
                                </button>
                                <button
                                  onClick={() => removeImage('coverPhoto')}
                                  className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-red-400"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </>
                          ) : (
                            <button
                              onClick={() => coverInputRef.current?.click()}
                              className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors"
                            >
                              <Upload size={32} />
                              <span className="text-xs">Click to upload cover</span>
                            </button>
                          )}
                          <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'coverPhoto')}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Display Name */}
                    <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        Display Name
                        <span className="text-xs text-gray-500">(Visible to everyone)</span>
                      </label>
                      <input
                        type="text"
                        value={profile.displayName}
                        onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-[#050810] border border-white/10 text-white text-lg focus:outline-none focus:border-[#ccff00] transition-colors"
                        style={{ fontFamily: fonts.find(f => f.id === profile.font)?.family }}
                        placeholder="Enter your display name"
                      />
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <AtSign size={12} />
                        <span>@{profile.username}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <label className="text-sm font-medium text-gray-300">About Me</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        maxLength={250}
                        className="w-full px-4 py-3 rounded-xl bg-[#050810] border border-white/10 text-white focus:outline-none focus:border-[#ccff00] transition-colors resize-none"
                        placeholder="Tell the world your story..."
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Markdown supported</span>
                        <span>{profile.bio.length}/250</span>
                      </div>
                    </div>

                    {/* Location & Website */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <MapPin size={14} /> Location
                        </label>
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-[#050810] border border-white/10 text-white focus:outline-none focus:border-[#ccff00] transition-colors"
                          placeholder="City, Country"
                        />
                      </div>
                      
                      <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Globe size={14} /> Website
                        </label>
                        <input
                          type="text"
                          value={profile.website}
                          onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-[#050810] border border-white/10 text-white focus:outline-none focus:border-[#ccff00] transition-colors"
                          placeholder="yourwebsite.com"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* APPEARANCE SECTION */}
              {activeSection === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-[#00ccff]/10">
                      <Palette className="text-[#00ccff]" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold font-['Technor']">Appearance</h2>
                      <p className="text-gray-400 text-sm">Colors, fonts, and visual effects</p>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Zap size={18} className="text-[#00ccff]" />
                      Color Palette
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Primary Color */}
                      <div className="space-y-3">
                        <label className="text-sm text-gray-400">Primary Color</label>
                        <div className="flex gap-2 flex-wrap">
                          {colorPresets.map((preset) => (
                            <button
                              key={preset.color}
                              onClick={() => setProfile(prev => ({ ...prev, primaryColor: preset.color }))}
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 transition-all ${
                                profile.primaryColor === preset.color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                              }`}
                              style={{ backgroundColor: preset.color }}
                              title={preset.name}
                            />
                          ))}
                        </div>
                        <input 
                          type="color" 
                          value={profile.primaryColor}
                          onChange={(e) => setProfile(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-full h-10 rounded-lg cursor-pointer bg-transparent"
                        />
                      </div>

                      {/* Accent Color */}
                      <div className="space-y-3">
                        <label className="text-sm text-gray-400">Accent Color</label>
                        <div className="flex gap-2 flex-wrap">
                          {colorPresets.map((preset) => (
                            <button
                              key={preset.color}
                              onClick={() => setProfile(prev => ({ ...prev, accentColor: preset.color }))}
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 transition-all ${
                                profile.accentColor === preset.color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                              }`}
                              style={{ backgroundColor: preset.color }}
                              title={preset.name}
                            />
                          ))}
                        </div>
                        <input 
                          type="color" 
                          value={profile.accentColor}
                          onChange={(e) => setProfile(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="w-full h-10 rounded-lg cursor-pointer bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fonts */}
                  <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Type size={18} className="text-[#00ccff]" />
                      Typography
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {fonts.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => setProfile(prev => ({ ...prev, font: font.id }))}
                          className={`p-3 sm:p-4 rounded-xl border transition-all text-center ${
                            profile.font === font.id
                              ? 'border-[#00ccff] bg-[#00ccff]/10'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <span 
                            style={{ fontFamily: font.family }} 
                            className="text-xl sm:text-2xl block mb-1 sm:mb-2"
                          >
                            {font.preview}
                          </span>
                          <span className="text-xs text-gray-400">{font.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Effects */}
                  <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles size={18} className="text-[#00ccff]" />
                      Name Effects
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {nameEffects.map((effect) => (
                        <button
                          key={effect.id}
                          onClick={() => setProfile(prev => ({ ...prev, effect: effect.id }))}
                          className={`p-3 sm:p-4 rounded-xl border transition-all relative overflow-hidden ${
                            profile.effect === effect.id
                              ? 'border-[#00ccff] bg-[#00ccff]/10'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div 
                            className="text-base sm:text-lg font-bold mb-1"
                            style={effect.id === 'gradient' ? {
                              background: `linear-gradient(135deg, ${profile.primaryColor}, ${profile.accentColor})`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            } : effect.id === 'neon' ? {
                              color: '#fff',
                              textShadow: `0 0 10px ${profile.primaryColor}`,
                            } : effect.id === 'pop' ? {
                              color: '#fff',
                              textShadow: `3px 3px 0px ${profile.primaryColor}`,
                            } : effect.id === 'glow' ? {
                              color: profile.primaryColor,
                              filter: `drop-shadow(0 0 8px ${profile.primaryColor})`,
                            } : { color: profile.primaryColor }}
                          >
                            Preview
                          </div>
                          <p className="text-xs text-gray-400">{effect.name}</p>
                          <p className="text-[10px] text-gray-600 hidden sm:block">{effect.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* DECORATIONS SECTION */}
              {activeSection === 'decorations' && (
                <motion.div
                  key="decorations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-[#ff0066]/10">
                      <Sparkles className="text-[#ff0066]" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold font-['Technor']">Decorations</h2>
                      <p className="text-gray-400 text-sm">Frame your avatar with unique cosmetics</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {avatarDecorations.map((deco) => (
                      <button
                        key={deco.id}
                        onClick={() => setProfile(prev => ({ ...prev, decoration: deco.id }))}
                        className={`relative aspect-square rounded-2xl border-2 transition-all overflow-hidden group ${
                          profile.decoration === deco.id
                            ? 'border-[#ff0066] bg-[#ff0066]/10'
                            : 'border-white/10 hover:border-white/30 bg-white/5'
                        }`}
                      >
                        {deco.src ? (
                          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                            <img 
                              src={deco.src} 
                              alt={deco.name}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                            />
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-gray-600" />
                          </div>
                        )}
                        
                        {deco.rarity && deco.rarity !== 'common' && (
                          <div 
                            className="absolute top-2 right-2 w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                            style={{ backgroundColor: rarityColors[deco.rarity] }}
                            title={deco.rarity}
                          />
                        )}
                        
                        {profile.decoration === deco.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#ff0066]/20">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#ff0066] flex items-center justify-center">
                              <Check size={20} className="text-white" />
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-xs sm:text-sm font-medium text-white">{deco.name}</p>
                          <p className="text-[10px] sm:text-xs capitalize" style={{ color: rarityColors[deco.rarity] }}>
                            {deco.rarity}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* BADGES SECTION - View Only */}
              {activeSection === 'badges' && (
                <motion.div
                  key="badges"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-[#ffd700]/10">
                      <Award className="text-[#ffd700]" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold font-['Technor']">Badges</h2>
                      <p className="text-gray-400 text-sm">Your achievements and recognitions</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:gap-4">
                    {badges.map((badge) => {
                      const isUnlocked = profile.badges?.includes(badge.id)
                      
                      return (
                        <div
                          key={badge.id}
                          className={`p-3 sm:p-4 rounded-2xl border transition-all flex items-center gap-3 sm:gap-4 ${
                            isUnlocked 
                              ? 'bg-white/5 border-white/10' 
                              : 'bg-black/20 border-white/5 opacity-50'
                          }`}
                        >
                          <div 
                            className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ 
                              backgroundColor: isUnlocked ? `${badge.color}20` : 'transparent',
                              border: `2px solid ${isUnlocked ? badge.color : '#374151'}`
                            }}
                          >
                            <div 
                              className="w-5 h-5 sm:w-7 sm:h-7 rounded-full"
                              style={{ backgroundColor: isUnlocked ? badge.color : '#374151' }}
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-white text-sm sm:text-base">{badge.name}</h3>
                              {isUnlocked && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00ff88]/20 text-[#00ff88]">
                                  OWNED
                                </span>
                              )}
                              {badge.id === 'verified' && isUnlocked && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00ccff]/20 text-[#00ccff]">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-400">{badge.description}</p>
                          </div>

                          {!isUnlocked && (
                            <div className="text-right flex-shrink-0">
                              <span className="text-xs text-gray-500">Locked</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-sm text-gray-400">
                      Some badges are awarded automatically, while others require admin verification.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}