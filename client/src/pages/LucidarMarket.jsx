// pages/LucidarMarket.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Lock, Unlock, Crown, ArrowLeft, Gem, 
  ShoppingBag, Palette, Star, Zap, Shield, X
} from 'lucide-react'

export default function LucidarMarket() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [activeCategory, setActiveCategory] = useState('frames')
  const [previewItem, setPreviewItem] = useState(null)
  const [lpBalance, setLpBalance] = useState(0)

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }
      
      try {
        const response = await fetch('http://localhost:3000/api/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setIsPro(data.user.is_pro)
          setLpBalance(data.user.lucid_points || 0)
        }
      } catch (err) {
        console.error('Failed to load user:', err)
      }
    }
    loadUser()
  }, [navigate])

  // Categories matching profile customization
  const categories = [
    { id: 'frames', name: 'Avatar Frames', icon: Palette, description: 'Decorate your profile picture' },
    { id: 'badges', name: 'Profile Badges', icon: Star, description: 'Show off your achievements' },
    { id: 'effects', name: 'Name Effects', icon: Sparkles, description: 'Animated name styles' },
    { id: 'themes', name: 'Profile Themes', icon: Zap, description: 'Customize your profile colors' },
  ]

  // Mock items - REPLACE WITH YOUR ACTUAL UI CONCEPT
  const items = {
    frames: [
      { id: 'neon_ring', name: 'Neon Ring', price: 500, rarity: 'common', preview: '/assets/frames/neon_ring.png' },
      { id: 'gold_crown', name: 'Golden Crown', price: 2000, rarity: 'legendary', preview: '/assets/frames/gold_crown.png', proOnly: true },
      // ... your actual frames
    ],
    badges: [
      { id: 'early_supporter', name: 'Early Supporter', price: 0, rarity: 'rare', description: 'For beta users' },
      { id: 'whale', name: 'LP Whale', price: 5000, rarity: 'epic', description: 'Hold 10k+ LP' },
      // ... your actual badges
    ],
    effects: [
      { id: 'gradient', name: 'Gradient Flow', price: 800, rarity: 'rare', preview: 'gradient' },
      { id: 'neon_pulse', name: 'Neon Pulse', price: 1500, rarity: 'epic', preview: 'neon' },
      // ... your actual effects
    ],
    themes: [
      { id: 'cyberpunk', name: 'Cyberpunk', price: 1200, rarity: 'rare', colors: ['#ccff00', '#ff0066'] },
      { id: 'midnight', name: 'Midnight', price: 1000, rarity: 'common', colors: ['#00ccff', '#9900ff'] },
      // ... your actual themes
    ],
  }

  const rarityColors = {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b',
    mythic: '#ec4899',
  }

  const handlePurchase = async (item) => {
    if (!isPro) return // Shouldn't happen due to UI, but safety check
    
    if (lpBalance < item.price) {
      alert('Insufficient LP balance')
      return
    }
    
    // Implement purchase logic
    console.log('Purchasing:', item)
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white relative overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0f1a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="text-[#ccff00]" size={24} />
                  Lucidar Market
                </h1>
                <p className="text-xs text-gray-500">Exclusive profile customization</p>
              </div>
            </div>

            {/* Status & Balance */}
            <div className="flex items-center gap-3">
              {/* Pro Status */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                isPro 
                  ? 'bg-[#ccff00]/10 border-[#ccff00]/30 text-[#ccff00]' 
                  : 'bg-gray-800/50 border-gray-700 text-gray-500'
              }`}>
                {isPro ? <Unlock size={14} /> : <Lock size={14} />}
                <span className="text-xs font-bold uppercase">
                  {isPro ? 'Unlocked' : 'Locked'}
                </span>
              </div>

              {/* LP Balance (only show if Pro) */}
              {isPro && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30">
                  <Gem size={14} className="text-[#ccff00]" />
                  <span className="text-sm font-bold text-[#ccff00] font-mono">
                    {lpBalance.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Locked State Banner */}
      {!isPro && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gradient-to-r from-gray-900 via-[#0a0f1a] to-gray-900 border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                  <Lock size={32} className="text-gray-500" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-lg font-bold text-gray-300">Preview Mode</h2>
                  <p className="text-sm text-gray-500">
                    Browse all items, but upgrade to Pro to purchase and equip
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/upgrade')}
                className="px-6 py-3 bg-[#ccff00] text-[#0a0f1a] rounded-xl font-bold hover:bg-[#b8e600] transition-all flex items-center gap-2"
              >
                <Crown size={18} />
                Upgrade to Pro
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl min-w-[100px] transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-[#ccff00]/10 border-[#ccff00]/30 text-[#ccff00]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs font-medium text-center">{cat.name}</span>
              </button>
            )
          })}
        </div>

        {/* Category Description */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-1">
            {categories.find(c => c.id === activeCategory)?.name}
          </h2>
          <p className="text-sm text-gray-500">
            {categories.find(c => c.id === activeCategory)?.description}
          </p>
        </div>

        {/* Items Grid - INSERT YOUR UI CONCEPT HERE */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items[activeCategory]?.map((item, idx) => {
            const isLocked = item.proOnly && !isPro
            const canAfford = lpBalance >= item.price
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setPreviewItem(item)}
                className={`relative group cursor-pointer rounded-2xl border overflow-hidden transition-all ${
                  isLocked 
                    ? 'bg-gray-900/50 border-gray-800 opacity-75' 
                    : 'bg-white/5 border-white/10 hover:border-[#ccff00]/30'
                }`}
              >
                {/* Item Preview Area */}
                <div className="aspect-square relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  {/* Placeholder for actual item preview */}
                  <div className="text-center p-4">
                    <div 
                      className="w-20 h-20 mx-auto rounded-xl mb-2"
                      style={{ 
                        background: `linear-gradient(135deg, ${rarityColors[item.rarity]}20, transparent)`,
                        border: `2px solid ${rarityColors[item.rarity]}`
                      }}
                    />
                    <span className="text-xs text-gray-500 capitalize">{item.rarity}</span>
                  </div>
                  
                  {/* Lock overlay for Pro-only items when not Pro */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <Lock size={20} className="text-gray-500" />
                      </div>
                    </div>
                  )}
                  
                  {/* Hover preview button */}
                  {!isLocked && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-[#ccff00] text-[#0a0f1a] rounded-full text-sm font-bold">
                        Preview
                      </span>
                    </div>
                  )}
                </div>

                {/* Item Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-bold ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                      {item.name}
                    </h3>
                    {item.proOnly && (
                      <span className="px-2 py-0.5 bg-[#ccff00]/20 text-[#ccff00] text-[10px] font-bold rounded border border-[#ccff00]/30">
                        PRO
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Gem size={14} className={isLocked ? 'text-gray-600' : 'text-[#ccff00]'} />
                      <span className={`font-mono font-bold ${
                        isLocked ? 'text-gray-600' : 'text-[#ccff00]'
                      }`}>
                        {item.price === 0 ? 'Free' : item.price.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Purchase button (only if Pro and can afford) */}
                    {isPro && !isLocked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePurchase(item)
                        }}
                        disabled={!canAfford}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          canAfford
                            ? 'bg-[#ccff00] text-[#0a0f1a] hover:bg-[#b8e600]'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Buy' : 'Need LP'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Empty state */}
        {(!items[activeCategory] || items[activeCategory].length === 0) && (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-500">No items in this category yet</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewItem(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0a0f1a] border border-white/10 rounded-3xl max-w-md w-full overflow-hidden"
            >
              {/* Preview content - customize with your actual preview */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{previewItem.name}</h3>
                  <button 
                    onClick={() => setPreviewItem(null)}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 mb-4 flex items-center justify-center">
                  <p className="text-gray-500">Item preview visualization</p>
                </div>

                <p className="text-gray-400 text-sm mb-4">{previewItem.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gem size={20} className="text-[#ccff00]" />
                    <span className="text-2xl font-bold text-[#ccff00] font-mono">
                      {previewItem.price === 0 ? 'Free' : previewItem.price.toLocaleString()}
                    </span>
                  </div>
                  
                  {!isPro ? (
                    <button
                      onClick={() => navigate('/upgrade')}
                      className="px-6 py-3 bg-[#ccff00] text-[#0a0f1a] rounded-xl font-bold"
                    >
                      Unlock with Pro
                    </button>
                  ) : lpBalance >= previewItem.price ? (
                    <button
                      onClick={() => handlePurchase(previewItem)}
                      className="px-6 py-3 bg-[#ccff00] text-[#0a0f1a] rounded-xl font-bold hover:bg-[#b8e600]"
                    >
                      Purchase
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-6 py-3 bg-gray-700 text-gray-500 rounded-xl font-bold cursor-not-allowed"
                    >
                      Insufficient LP
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}