import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Camera, 
  Lock, 
  Unlock, 
  Check, 
  Sparkles,
  Palette,
  Type,
  Image as ImageIcon,
  X,
  Loader2
} from 'lucide-react'

// Import of the decoration images
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
  { id: 'default', name: 'Default', family: "'Chillax', sans-serif" },
  { id: 'panchang', name: 'Panchang', family: "'Panchang', sans-serif" },
  { id: 'telma', name: 'Telma', family: "'Telma', cursive" },
  { id: 'audiowide', name: 'Audiowide', family: "'Audiowide', sans-serif" },
  { id: 'kumar', name: 'Kumar One', family: "'Kumar One Outline', system-ui" },
  { id: 'unifraktur', name: 'Unifraktur', family: "'UnifrakturCook', cursive" },
]

const avatarDecorations = [
  { id: 'none', name: 'None', src: null, style: {} },
  { id: 'chomp', name: 'Chomp', src: chomp, style: { position: 'absolute', top: '-60%', left: '-60px', width: '220%', height: '220%', objectFit: 'contain', pointerEvents: 'none', zIndex: 20 } },
  { id: 'xmas', name: 'xmas', src: xmas, style: { position: 'absolute', top: '-60%', left: '-60px', width: '220%', height: '220%', objectFit: 'contain', pointerEvents: 'none', zIndex: 20 } },
  { id: 'catonsie', name: 'snoozing cat', src: catonsie, style: { position: 'absolute', top: '-60%', left: '-60px', width: '220%', height: '220%', objectFit: 'contain', pointerEvents: 'none', zIndex: 20 } },
  { id: 'astral_aura', name: 'astral aura', src: astral_aura, style: { position: 'absolute', top: '-60%', left: '-60px', width: '220%', height: '220%', objectFit: 'contain', pointerEvents: 'none', zIndex: 20 } },
  { id: 'aurora', name: 'aurora', src: aurora, style: { position: 'absolute', top: '-60%', left: '-60px', width: '220%', height: '220%', objectFit: 'contain', pointerEvents: 'none', zIndex: 20 } },
  { id: 'hood_crimson', name: 'hood crimson', src: hood_crimson, style: { position: 'absolute', top: '-60%', left: '-60px', width: '220%', height: '220%', objectFit: 'contain', pointerEvents: 'none', zIndex: 20 } },
  { id: 'hood_dark', name: 'hood dark', src: hood_dark, style: { position: 'absolute', top: '-60%', left: '-60px', width: '220%', height: '220%', objectFit: 'contain', pointerEvents: 'none', zIndex: 20 } },
  { id: 'neon_cat_hoodie_black', name: 'neon cat hoodie black', src: neon_cat_hoodie_black, style: { position: 'absolute', top: '-60%', left: '-60px', width: '220%', height: '220%', objectFit: 'contain', pointerEvents: 'none', zIndex: 20 } },
  { id: 'neon_cat_hoodie_blue', name: 'neon cat hoodie blue', src: neon_cat_hoodie_blue, style: { position: 'absolute', top: '-60%', left: '-60px', width: '220%', height: '220%', objectFit: 'contain', pointerEvents: 'none', zIndex: 20 } },
  { id: 'neon_cat_hoodie_pink', name: 'neon cat hoodie pink', src: neon_cat_hoodie_pink, style: { position: 'absolute', top: '-60%', left: '-60px', width: '220%', height: '220%', objectFit: 'contain', pointerEvents: 'none', zIndex: 20 } },
  { id: 'neon_cat_hoodie', name: 'neon cat hoodie', src: neon_cat_hoodie, style: { position: 'absolute', top: '-60%', left: '-60px', width: '220%', height: '220%', objectFit: 'contain', pointerEvents: 'none', zIndex: 20 } },
]

const nameEffects = [
  { id: 'solid', name: 'Solid', getStyle: (color) => ({ color: color }) },
  { id: 'gradient', name: 'Gradient', getStyle: (color, accent) => ({ background: `linear-gradient(135deg, ${color}, ${accent})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', textFillColor: 'transparent', color: 'transparent' }) },
  { id: 'neon', name: 'Neon', getStyle: (color) => ({ color: '#fff', textShadow: `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}` }) },
  { id: 'pop', name: 'Pop', getStyle: (color, accent) => ({ color: '#fff', textShadow: `3px 3px 0px ${color}, 6px 6px 0px ${accent}40` }) },
  { id: 'glow', name: 'Glow', getStyle: (color) => ({ color: color, filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color}80)` }) },
]

const colorPresets = [
  '#ccff00', '#00ff88', '#00ccff', '#ff0066', '#ff6600', 
  '#9900ff', '#ff0000', '#ffff00', '#ffffff', '#ff00ff'
]

export default function ProfileSetup() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const coverInputRef = useRef(null)
  
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

  const [activeTab, setActiveTab] = useState('basic')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorPickerTarget, setColorPickerTarget] = useState('primary')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Load user data from auth - EXACTLY like ProfileEditor
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        // Try to fetch from backend first (like ProfileEditor)
        const response = await fetch('http://localhost:3000/api/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          const user = data.user
          
          setProfile(prev => ({
            ...prev,
            displayName: user.display_name || user.username || '',
            username: user.username || '',
            email: user.email || '',
            bio: user.bio || '',
            avatar: user.avatar || null,
            coverPhoto: user.cover_photo || null,
            decoration: user.decoration || 'none',
            primaryColor: user.primary_color || '#ccff00',
            accentColor: user.accent_color || '#00ff88',
            font: user.font || 'default',
            effect: user.effect || 'solid',
          }))
        } else {
          // Fallback to localStorage
          const stored = JSON.parse(localStorage.getItem('user') || '{}')
          if (stored.username) {
            setProfile(prev => ({
              ...prev,
              displayName: stored.display_name || stored.username || '',
              username: stored.username || '',
              email: stored.email || '',
              avatar: stored.avatar || null,
              coverPhoto: stored.cover_photo || null,
            }))
          }
        }
      } catch (err) {
        console.error('Failed to load user:', err)
        // Fallback to localStorage
        const stored = JSON.parse(localStorage.getItem('user') || '{}')
        if (stored.username) {
          setProfile(prev => ({
            ...prev,
            displayName: stored.display_name || stored.username || '',
            username: stored.username || '',
            email: stored.email || '',
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

  // EXACTLY like ProfileEditor - send base64 directly
  const handleSubmit = async () => {
    setIsSaving(true)
    setSaveError(null)
    
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    try {
      // Send base64 images directly - just like ProfileEditor does!
      const response = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          display_name: profile.displayName,
          bio: profile.bio,
          location: profile.location || '',
          website: profile.website || '',
          avatar: profile.avatar,        // Base64 string or null
          cover_photo: profile.coverPhoto, // Base64 string or null
          decoration: profile.decoration,
          primary_color: profile.primaryColor,
          accent_color: profile.accentColor,
          font: profile.font,
          effect: profile.effect,
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Update stored user data with new profile
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = { 
          ...currentUser, 
          ...data.user,
          display_name: data.user?.display_name || profile.displayName,
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        localStorage.setItem('lucidar_user', JSON.stringify(updatedUser))
        localStorage.setItem('userProfile', JSON.stringify(updatedUser))
        navigate('/home')
      } else {
        const errorText = await response.text()
        throw new Error(errorText || 'Save failed')
      }
    } catch (err) {
      console.error('Failed to save profile:', err)
      setSaveError(err.message || 'Failed to save profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const currentEffect = nameEffects.find(e => e.id === profile.effect)
  const nameStyle = currentEffect?.getStyle(profile.primaryColor, profile.accentColor) || {}

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white pb-24 md:pb-8 font-['Chillax']">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold font-['Technor']">
            Set Up Profile
          </h1>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-[#ccff00] text-[#0a0f1a] rounded-lg font-semibold text-sm hover:bg-[#b8e600] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Error Message */}
        {saveError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {saveError}
          </div>
        )}

        {/* Profile Preview Card */}
        <div className="relative rounded-2xl overflow-hidden bg-[#070a12] border border-gray-800">
          {/* Cover Photo */}
          <div className="relative h-32 sm:h-48 bg-gradient-to-br from-gray-800 to-gray-900">
            {profile.coverPhoto ? (
              <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${profile.primaryColor}20, ${profile.accentColor}20)` }} />
            )}
            <button onClick={() => coverInputRef.current?.click()} className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-colors">
              <Camera size={18} className="text-white" />
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverPhoto')} className="hidden" />
          </div>

          {/* Avatar Section */}
          <div className="px-4 sm:px-6 pb-6">
            <div className="relative -mt-12 sm:-mt-16 mb-4 flex justify-between items-end">
              <div className="relative">
                <div className="relative w-24 h-24">
                  {profile.decoration !== 'none' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      <img src={avatarDecorations.find(d => d.id === profile.decoration)?.src} alt="decoration" style={{ position: 'absolute', width: '400%', objectFit: 'contain', top: '-6.9%', left: '-7%' }} />
                    </div>
                  )}
                  <div className="w-[83px] h-[83px] rounded-full overflow-hidden border-4 border-[#070a12] bg-gray-800 relative" style={{ boxShadow: `0 0 0 2px ${profile.primaryColor}40` }}>
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon size={32} /></div>
                    )}
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-[#ccff00] text-[#0a0f1a] rounded-full hover:bg-[#b8e600] transition-colors z-20">
                    <Camera size={16} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} className="hidden" />
                </div>
              </div>
              <div className="mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: `${profile.primaryColor}15`, borderColor: `${profile.primaryColor}40`, color: profile.primaryColor }}>
                  New Member
                </span>
              </div>
            </div>

            {/* Name Preview */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold transition-all duration-300" style={{ ...nameStyle, fontFamily: fonts.find(f => f.id === profile.font)?.family }}>
                {profile.displayName || 'Your Name'}
              </h2>
              <p className="text-gray-400 font-medium text-sm">@{profile.username || 'username'}</p>
            </div>
            {profile.bio && <p className="mt-3 text-sm text-gray-300 leading-relaxed">{profile.bio}</p>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-[#070a12] rounded-xl border border-gray-800">
          {[ { id: 'basic', label: 'Basic', icon: ImageIcon }, { id: 'appearance', label: 'Style', icon: Palette }, { id: 'decorations', label: 'Decorations', icon: Sparkles } ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-[#ccff00] text-[#0a0f1a]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          
          {/* BASIC INFO */}
          {activeTab === 'basic' && (
            <motion.div key="basic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Display Name</label>
                <input type="text" value={profile.displayName} onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))} placeholder="How you want to be called" className="w-full px-4 py-3 rounded-xl bg-[#070a12] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#ccff00] transition-colors" style={{ fontFamily: fonts.find(f => f.id === profile.font)?.family }} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <input type="text" value={profile.username} readOnly className="w-full pl-8 pr-4 py-3 rounded-xl bg-[#070a12] border border-gray-700 text-gray-400 cursor-not-allowed focus:outline-none" />
                </div>
                <p className="text-xs text-gray-500">This comes from your account</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center justify-between">
                  Email
                  <button onClick={() => setProfile(prev => ({ ...prev, showEmail: !prev.showEmail }))} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#ccff00] transition-colors">
                    {profile.showEmail ? <Unlock size={12} /> : <Lock size={12} />}
                    {profile.showEmail ? 'Public' : 'Private'}
                  </button>
                </label>
                <input type="email" value={profile.email} readOnly className="w-full px-4 py-3 rounded-xl bg-[#070a12] border border-gray-700 text-gray-400 cursor-not-allowed focus:outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">About Me</label>
                <textarea value={profile.bio} onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))} placeholder="Tell us about yourself..." rows={3} maxLength={190} className="w-full px-4 py-3 rounded-xl bg-[#070a12] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#ccff00] transition-colors resize-none" />
                <p className="text-xs text-gray-500 text-right">{profile.bio.length}/190</p>
              </div>
            </motion.div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <motion.div key="appearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Type size={16} className="text-[#ccff00]" /> Display Font</label>
                <div className="grid grid-cols-4 gap-2">
                  {fonts.map(font => (
                    <button key={font.id} onClick={() => setProfile(prev => ({ ...prev, font: font.id }))} className={`p-3 rounded-xl border transition-all text-center ${profile.font === font.id ? 'border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]' : 'border-gray-700 hover:border-gray-600 text-gray-300'}`}>
                      <span style={{ fontFamily: font.family }} className="text-lg block mb-1">Gg</span>
                      <span className="text-[10px] leading-tight block">{font.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Name Effect</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {nameEffects.map(effect => (
                    <button key={effect.id} onClick={() => setProfile(prev => ({ ...prev, effect: effect.id }))} className={`p-3 rounded-xl border transition-all relative overflow-hidden ${profile.effect === effect.id ? 'border-[#ccff00] bg-[#ccff00]/10' : 'border-gray-700 hover:border-gray-600'}`}>
                      <span className="text-lg font-bold block" style={effect.getStyle(profile.primaryColor, profile.accentColor)}>Aa</span>
                      <p className="text-xs text-gray-400 mt-1">{effect.name}</p>
                      {profile.effect === effect.id && <div className="absolute top-1 right-1 w-4 h-4 bg-[#ccff00] rounded-full flex items-center justify-center"><Check size={10} className="text-[#0a0f1a]" /></div>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Palette size={16} className="text-[#ccff00]" /> Profile Colors</label>
                <div className="p-4 rounded-xl bg-[#070a12] border border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div><span className="text-sm text-gray-300 block">Primary Color</span><span className="text-xs text-gray-500">Affects name, badges, borders</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-mono">{profile.primaryColor}</span>
                      <button onClick={() => { setColorPickerTarget('primary'); setShowColorPicker(true); }} className="w-10 h-10 rounded-lg border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: profile.primaryColor }} />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {colorPresets.map(color => <button key={color} onClick={() => setProfile(prev => ({ ...prev, primaryColor: color }))} className={`w-8 h-8 rounded-lg border-2 transition-all ${profile.primaryColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: color }} />)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#070a12] border border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div><span className="text-sm text-gray-300 block">Accent Color</span><span className="text-xs text-gray-500">Used for gradients and glows</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-mono">{profile.accentColor}</span>
                      <button onClick={() => { setColorPickerTarget('accent'); setShowColorPicker(true); }} className="w-10 h-10 rounded-lg border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: profile.accentColor }} />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {colorPresets.map(color => <button key={color} onClick={() => setProfile(prev => ({ ...prev, accentColor: color }))} className={`w-8 h-8 rounded-lg border-2 transition-all ${profile.accentColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: color }} />)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* DECORATIONS TAB */}
          {activeTab === 'decorations' && (
            <motion.div key="decorations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <p className="text-sm text-gray-400">Choose a frame for your avatar</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {avatarDecorations.map(deco => (
                  <button key={deco.id} onClick={() => setProfile(prev => ({ ...prev, decoration: deco.id }))} className={`relative aspect-square rounded-xl border-2 transition-all overflow-hidden ${profile.decoration === deco.id ? 'border-[#ccff00] bg-[#ccff00]/10' : 'border-gray-700 hover:border-gray-600 bg-[#070a12]'}`}>
                    {deco.src ? <div className="absolute inset-0 flex items-center justify-center p-4"><img src={deco.src} alt={deco.name} className="w-full h-full object-contain" /></div> : <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">None</div>}
                    {profile.decoration === deco.id && <div className="absolute top-1 right-1 w-5 h-5 bg-[#ccff00] rounded-full flex items-center justify-center"><Check size={12} className="text-[#0a0f1a]" /></div>}
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] text-gray-400 truncate px-1">{deco.name}</span>
                  </button>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-[#070a12] border border-gray-700"><p className="text-xs text-gray-500 text-center">More decorations available in the shop! 🛒</p></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Save Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#0a0f1a]/90 backdrop-blur-xl border-t border-gray-800">
        <button onClick={handleSubmit} disabled={isSaving} className="w-full py-3 bg-[#ccff00] text-[#0a0f1a] rounded-xl font-semibold hover:bg-[#b8e600] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* Color Picker Modal */}
      <AnimatePresence>
        {showColorPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowColorPicker(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#070a12] rounded-2xl p-6 border border-gray-700 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-['Technor']">Pick {colorPickerTarget === 'primary' ? 'Primary' : 'Accent'} Color</h3>
                <button onClick={() => setShowColorPicker(false)}><X size={20} className="text-gray-400 hover:text-white" /></button>
              </div>
              <input type="color" value={colorPickerTarget === 'primary' ? profile.primaryColor : profile.accentColor} onChange={(e) => setProfile(prev => ({ ...prev, [colorPickerTarget === 'primary' ? 'primaryColor' : 'accentColor']: e.target.value }))} className="w-full h-32 rounded-xl cursor-pointer bg-transparent" />
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowColorPicker(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={() => setShowColorPicker(false)} className="px-6 py-2 bg-[#ccff00] text-[#0a0f1a] rounded-lg font-medium hover:bg-[#b8e600] transition-colors">Done</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}