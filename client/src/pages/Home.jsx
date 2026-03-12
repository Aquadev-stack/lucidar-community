import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  LogOut, User, MessageSquareMore, Home as HomeIcon,
  PlusCircle, Bell, Search, Settings, Store, Users,
  ShoppingBag, Gamepad2, Code2, Palette, TrendingUp,
  Heart, Share2, MoreHorizontal, Image as ImageIcon,
  Menu, X, Zap, Loader2, Hash, Bookmark, Send,
  Sparkles, Crown, Gem, ArrowLeft, Clock, Globe,
  CheckCircle2, AlertTriangle, Flame, Settings2,
  Wand2, Wallet, CreditCard, TrendingUp as TrendingIcon,
  Play, Pause, Volume2, VolumeX, Maximize2, Pin,
  Trash2, Link as LinkIcon, Flag, MessageCircle,
  Eye, Award, Star, Zap as ZapIcon, Gift, Target,
  Activity, Cpu, Layers, Aperture, Hexagon, Triangle, Lock,
  Pentagon, Octagon, Circle, Square, Diamond, Crown as CrownIcon,
  Tag, Plus, Unlock
} from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import LiquidGlassBackground from '../components/LiquidGlassBackground'

// Global Styles Component for Custom Scrollbar
const GlobalStyles = () => (
  <style>{`
    /* Custom Scrollbar - Sleek & Modern */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, rgba(204, 255, 0, 0.3) 0%, rgba(0, 255, 136, 0.3) 100%);
      border-radius: 10px;
      border: 1px solid rgba(204, 255, 0, 0.1);
      backdrop-filter: blur(10px);
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, rgba(204, 255, 0, 0.5) 0%, rgba(0, 255, 136, 0.5) 100%);
      box-shadow: 0 0 10px rgba(204, 255, 0, 0.3);
    }
    
    /* Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: rgba(204, 255, 0, 0.3) rgba(255, 255, 255, 0.02);
    }
    
    /* Hide scrollbar for mobile but keep functionality */
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    /* Smooth scroll behavior */
    html {
      scroll-behavior: smooth;
    }
    
    /* Selection color */
    ::selection {
      background: rgba(204, 255, 0, 0.3);
      color: #fff;
    }
  `}</style>
)

// Confetti Component
const Confetti = ({ active }) => {
  if (!active) return null
  
  const colors = ['#ccff00', '#00ff88', '#00ccff', '#ff0066', '#ffd700', '#ff6600']
  const pieces = Array.from({ length: 50 })
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {pieces.map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
              y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0, 
              scale: 0,
              rotate: 0
            }}
            animate={{ 
              x: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              scale: Math.random() * 1.5 + 0.5,
              rotate: Math.random() * 720
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              borderRadius: Math.random() > 0.5 ? '50%' : '2px'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <CheckCircle2 className="text-[#00ff88]" size={20} />,
    error: <AlertTriangle className="text-red-500" size={20} />,
    info: <Sparkles className="text-[#ccff00]" size={20} />
  }

  const colors = {
    success: 'border-[#00ff88]/30 bg-[#00ff88]/10',
    error: 'border-red-500/30 bg-red-500/10',
    info: 'border-[#ccff00]/30 bg-[#ccff00]/10'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl border ${colors[type]} backdrop-blur-xl flex items-center gap-3 shadow-2xl`}
    >
      {icons[type]}
      <span className="font-medium text-sm">{message}</span>
    </motion.div>
  )
}

// Tooltip Component
const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 border border-white/10 rounded-lg text-xs whitespace-nowrap z-50"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Modal Component
const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-[#0a0f1a] border border-white/10 rounded-2xl w-full ${maxWidth} overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl`}
        >
          {title && (
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">
              <h3 className="font-bold text-lg">{title}</h3>
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hashtag Modal Component
const HashtagModal = ({ isOpen, onClose, onAddTag, existingTags }) => {
  const [inputValue, setInputValue] = useState('')
  const [suggestions] = useState(['NFT', 'Art', 'Gaming', 'Crypto', 'Dev', 'Design', 'Music', 'Trading', 'Anime', 'Tech', 'Web3', 'AI', 'Creator', 'Stream'])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onAddTag(inputValue.replace('#', ''))
      setInputValue('')
      onClose()
    }
  }

  const filteredSuggestions = suggestions.filter(
    tag => !existingTags.includes(tag.toLowerCase()) && 
    tag.toLowerCase().includes(inputValue.replace('#', '').toLowerCase())
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Hashtag" maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccff00]" size={20} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter hashtag..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#ccff00]/50 transition-all"
            autoFocus
          />
        </div>
        
        {filteredSuggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Suggested</p>
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.slice(0, 6).map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    onAddTag(tag)
                    onClose()
                  }}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#ccff00]/20 border border-white/10 hover:border-[#ccff00]/30 text-sm text-gray-300 hover:text-[#ccff00] transition-all"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-full py-3 bg-[#ccff00] text-[#0a0f1a] rounded-xl font-bold hover:bg-[#b8e600] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Tag
        </button>
      </form>
    </Modal>
  )
}

// Skeleton Loading Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/10 rounded ${className}`} />
)

// Post Skeleton
const PostSkeleton = () => (
  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
    <div className="flex gap-3 mb-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-24 w-full rounded-xl mb-4" />
    <div className="flex gap-4">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
)

// Share Modal Component
const ShareModal = ({ isOpen, onClose, postUrl, postContent }) => {
  const [copied, setCopied] = useState(false)

  const shareOptions = [
    { name: 'Copy Link', icon: LinkIcon, color: '#ccff00', action: () => {
      navigator.clipboard.writeText(postUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }},
    { name: 'WhatsApp', icon: MessageCircle, color: '#25D366', url: `https://wa.me/?text=${encodeURIComponent(postContent + ' ' + postUrl)}` },
    { name: 'Twitter', icon: Share2, color: '#1DA1F2', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(postContent)}&url=${encodeURIComponent(postUrl)}` },
    { name: 'Facebook', icon: Globe, color: '#4267B2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}` },
    { name: 'LinkedIn', icon: Users, color: '#0077b5', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}` }
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Post" maxWidth="max-w-sm">
      <div className="grid grid-cols-1 gap-3">
        {shareOptions.map((option) => (
          <button
            key={option.name}
            onClick={() => option.action ? option.action() : window.open(option.url, '_blank')}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${option.color}20` }}
            >
              <option.icon size={24} style={{ color: option.color }} />
            </div>
            <span className="font-medium">{option.name === 'Copy Link' && copied ? 'Copied!' : option.name}</span>
            {option.name === 'Copy Link' && copied && <CheckCircle2 className="ml-auto text-[#00ff88]" size={20} />}
          </button>
        ))}
      </div>
    </Modal>
  )
}

// Video Player Component
const VideoPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef(null)
  const controlsTimeoutRef = useRef(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2000)
  }

  return (
    <div 
      className="relative rounded-xl overflow-hidden bg-black group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full max-h-96 object-cover"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      />
      
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Play size={32} className="text-white ml-1" fill="white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
          >
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
              </button>
              <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-[#ccff00] rounded-full" />
              </div>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <Maximize2 size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hashtag Highlighter
const HighlightedContent = ({ content }) => {
  const parts = content.split(/(#[a-zA-Z0-9_]+)/g)
  
  return (
    <p className="text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith('#')) {
          return (
            <span 
              key={i} 
              className="text-[#ccff00] hover:underline cursor-pointer font-medium"
            >
              {part}
            </span>
          )
        }
        return part
      })}
    </p>
  )
}

// Create Post Component
const CreatePost = ({ user, onPostCreated, showToast }) => {
  const [content, setContent] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [posting, setPosting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [showHashtagModal, setShowHashtagModal] = useState(false)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)
  const API_URL = 'http://localhost:3000/api'

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) processFile(file)
  }

  const processFile = (file) => {
    if (file.size > 50 * 1024 * 1024) {
      showToast('File must be less than 50MB', 'error')
      return
    }
    
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setFilePreview({
      url,
      type: file.type.startsWith('video/') ? 'video' : 'image'
    })
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const addTag = (tag) => {
    const cleanTag = tag.replace('#', '').trim().toLowerCase()
    if (cleanTag && !selectedTags.includes(cleanTag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, cleanTag])
      showToast(`Added #${cleanTag}`, 'success')
    } else if (selectedTags.length >= 5) {
      showToast('Maximum 5 tags allowed', 'error')
    }
  }

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const createPost = async () => {
    if (!content.trim() && !selectedFile) return
    
    setPosting(true)
    setUploadProgress(0)
    
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('content', content)
      formData.append('tags', JSON.stringify(selectedTags))
      if (selectedFile) {
        formData.append('media', selectedFile)
      }

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const data = await response.json()
        onPostCreated(data.post)
        showToast('Post created successfully!', 'success')
        resetForm()
      } else {
        showToast('Failed to create post', 'error')
      }
    } catch (err) {
      console.error('Failed to create post:', err)
      showToast('Network error', 'error')
    } finally {
      setPosting(false)
      setUploadProgress(0)
    }
  }

  const resetForm = () => {
    setContent('')
    setSelectedFile(null)
    setFilePreview(null)
    setSelectedTags([])
    setIsExpanded(false)
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [content])

  if (!isExpanded) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setIsExpanded(true)}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 cursor-pointer hover:border-[#ccff00]/30 transition-all group hover:shadow-lg hover:shadow-[#ccff00]/5"
      >
        <div className="flex gap-3">
          <div className="relative">
            <div 
              className="w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: user?.primary_color || '#ccff00' }}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <User size={16} className="text-gray-400" />
                </div>
              )}
            </div>
            {user?.is_pro && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#ccff00] rounded-full flex items-center justify-center">
                <Crown size={10} className="text-[#0a0f1a]" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="bg-white/5 rounded-xl px-4 py-3 text-gray-500 group-hover:bg-white/10 transition-colors border border-transparent group-hover:border-white/10">
              What's happening in your world?
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex gap-3 text-gray-400">
                <Tooltip text="Add Image/Video">
                  <ImageIcon size={18} className="group-hover:text-[#ccff00] transition-colors" />
                </Tooltip>
                <Tooltip text="Add Hashtag">
                  <Hash size={18} className="group-hover:text-[#ccff00] transition-colors" />
                </Tooltip>
                <Tooltip text="Add Listing">
                  <ShoppingBag size={18} className="group-hover:text-[#ccff00] transition-colors" />
                </Tooltip>
              </div>
              <span className="text-xs text-gray-500 ml-auto group-hover:text-[#ccff00] transition-colors">Click to create post</span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`backdrop-blur-xl bg-white/5 border rounded-2xl p-4 mb-4 transition-all ${dragActive ? 'border-[#ccff00] bg-[#ccff00]/5' : 'border-white/10'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <AnimatePresence>
          {dragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#ccff00]/10 border-2 border-dashed border-[#ccff00] rounded-2xl flex items-center justify-center z-10 backdrop-blur-sm"
            >
              <div className="text-center">
                <ImageIcon size={48} className="text-[#ccff00] mx-auto mb-2" />
                <p className="text-[#ccff00] font-bold">Drop files here</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mb-4">
          <div className="relative">
            <div 
              className="w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: user?.primary_color || '#ccff00' }}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <User size={16} className="text-gray-400" />
                </div>
              )}
            </div>
            {user?.is_pro && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#ccff00] rounded-full flex items-center justify-center"
              >
                <Crown size={10} className="text-[#0a0f1a]" />
              </motion.div>
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share your thoughts, art, or listings..."
            className="flex-1 bg-transparent border-none text-white text-base placeholder-gray-500 focus:outline-none resize-none min-h-[80px]"
            autoFocus
            maxLength={500}
          />
        </div>

        {content.includes('#') && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap gap-2 mb-3 px-12"
          >
            {['NFT', 'Art', 'Gaming', 'Crypto', 'Dev', 'Design', 'Music', 'Trading', 'Anime', 'Tech']
              .filter(tag => tag.toLowerCase().includes(content.split('#').pop().toLowerCase()))
              .slice(0, 3)
              .map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    const newContent = content.replace(/#[a-zA-Z0-9_]*$/, `#${tag} `)
                    setContent(newContent)
                  }}
                  className="px-3 py-1 rounded-full bg-[#ccff00]/20 text-[#ccff00] text-xs border border-[#ccff00]/30 hover:bg-[#ccff00]/30 transition-colors"
                >
                  #{tag}
                </button>
              ))}
          </motion.div>
        )}

        <AnimatePresence>
          {selectedTags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-3 px-12"
            >
              {selectedTags.map(tag => (
                <motion.span 
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ccff00]/20 text-[#ccff00] text-sm border border-[#ccff00]/30"
                >
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {filePreview && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative mb-3 mx-12 rounded-xl overflow-hidden border border-white/10"
            >
              {filePreview.type === 'video' ? (
                <VideoPlayer src={filePreview.url} />
              ) : (
                <img src={filePreview.url} alt="Preview" className="w-full max-h-64 object-cover" />
              )}
              <button 
                onClick={() => {
                  setSelectedFile(null)
                  setFilePreview(null)
                }}
                className="absolute top-2 right-2 p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors backdrop-blur-sm"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-lg text-xs backdrop-blur-sm">
                {selectedFile?.name}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {posting && uploadProgress > 0 && (
          <div className="mx-12 mb-3">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#ccff00]"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex gap-1">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Tooltip text="Add Image/Video">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-[#ccff00] transition-colors"
              >
                <ImageIcon size={20} />
              </button>
            </Tooltip>
            
            <Tooltip text="Add Hashtag">
              <button 
                onClick={() => setShowHashtagModal(true)}
                className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-[#ccff00] transition-colors"
              >
                <Hash size={20} />
              </button>
            </Tooltip>

            <Tooltip text="Add Emoji">
              <button className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-[#ccff00] transition-colors">
                <Sparkles size={20} />
              </button>
            </Tooltip>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={resetForm}
              className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${content.length > 450 ? 'text-orange-400' : 'text-gray-500'}`}>
                {content.length}/500
              </span>
              <button 
                onClick={createPost}
                disabled={posting || (!content.trim() && !selectedFile)}
                className="px-5 py-2 bg-[#ccff00] text-[#0a0f1a] rounded-full font-bold hover:bg-[#b8e600] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all text-sm hover:shadow-lg hover:shadow-[#ccff00]/20"
              >
                {posting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                Post
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <HashtagModal
        isOpen={showHashtagModal}
        onClose={() => setShowHashtagModal(false)}
        onAddTag={addTag}
        existingTags={selectedTags}
      />
    </>
  )
}

// Post Card Component
const PostCard = ({ post, user, onLike, onDelete, onPin, showToast }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showMenu, setShowMenu] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const isAuthor = user?.id === post.author_id
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLike = async () => {
    const newLiked = !isLiked
    setIsLiked(newLiked)
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1)
    
    try {
      await onLike(post.id)
    } catch (err) {
      setIsLiked(!newLiked)
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    setIsDeleting(true)
    try {
      await onDelete(post.id)
      showToast('Post deleted', 'success')
    } catch (err) {
      showToast('Failed to delete post', 'error')
      setIsDeleting(false)
    }
  }

  const handlePin = async () => {
    try {
      await onPin(post.id)
      showToast(post.is_pinned ? 'Post unpinned' : 'Post pinned', 'success')
    } catch (err) {
      showToast('Failed to pin post', 'error')
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = (now - date) / 1000
    
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`backdrop-blur-xl bg-white/5 border rounded-2xl overflow-hidden transition-all hover:border-white/20 ${post.is_pinned ? 'border-[#ccff00]/50' : 'border-white/10'}`}
    >
      {post.is_pinned && (
        <div className="px-4 py-2 bg-[#ccff00]/10 border-b border-[#ccff00]/20 flex items-center gap-2">
          <Pin size={14} className="text-[#ccff00]" />
          <span className="text-xs text-[#ccff00] font-medium">Pinned Post</span>
        </div>
      )}

      <div className="p-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => window.location.href = `/profile/${post.author.username}`}
        >
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 rounded-full overflow-hidden border-2 bg-gray-800"
              style={{ borderColor: post.author.primary_color || '#ccff00' }}
            >
              {post.author.avatar ? (
                <img src={post.author.avatar} alt={post.author.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={16} className="text-gray-400" />
                </div>
              )}
            </motion.div>
            {post.author.is_pro && (
              <Tooltip text="Pro Member">
                <motion.div 
                  animate={{ 
                    boxShadow: ['0 0 0 0 rgba(204, 255, 0, 0)', '0 0 10px 2px rgba(204, 255, 0, 0.5)', '0 0 0 0 rgba(204, 255, 0, 0)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#ccff00] rounded-full flex items-center justify-center border-2 border-[#0a0f1a]"
                >
                  <Crown size={12} className="text-[#0a0f1a]" />
                </motion.div>
              </Tooltip>
            )}
            {post.author.verified_type && (
              <img 
                src={`/assets/verified/verified_${post.author.verified_type}.png`}
                alt="Verified"
                className="absolute -bottom-1 -right-1 w-5 h-5"
              />
            )}
          </div>
          <div>
            <h4 
              className="font-semibold text-sm group-hover:text-[#ccff00] transition-colors"
              style={{ color: post.author.primary_color || '#ccff00' }}
            >
              {post.author.display_name || post.author.username}
            </h4>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              @{post.author.username}
              <span>·</span>
              <Clock size={10} />
              {formatTime(post.created_at)}
            </p>
          </div>
        </div>
        
        <div className="relative" ref={menuRef}>
          <Tooltip text="More options">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>
          </Tooltip>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-[#0a0f1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20"
              >
                {isAuthor && (
                  <>
                    <button
                      onClick={() => { handlePin(); setShowMenu(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors"
                    >
                      <Pin size={16} className={post.is_pinned ? 'text-[#ccff00]' : 'text-gray-400'} />
                      <span className={post.is_pinned ? 'text-[#ccff00]' : ''}>
                        {post.is_pinned ? 'Unpin Post' : 'Pin Post'}
                      </span>
                    </button>
                    <button
                      onClick={() => { handleDelete(); setShowMenu(false) }}
                      disabled={isDeleting}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-left transition-colors text-red-400"
                    >
                      <Trash2 size={16} />
                      <span>{isDeleting ? 'Deleting...' : 'Delete Post'}</span>
                    </button>
                    <div className="border-t border-white/10" />
                  </>
                )}
                <button
                  onClick={() => { setShowShareModal(true); setShowMenu(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors"
                >
                  <LinkIcon size={16} className="text-gray-400" />
                  <span>Copy Link</span>
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors"
                >
                  <Flag size={16} className="text-gray-400" />
                  <span>Report Post</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-4 pb-3">
        <HighlightedContent content={post.content} />
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map(tag => (
              <motion.span 
                key={tag}
                whileHover={{ scale: 1.05 }}
                onClick={() => window.location.href = `/tag/${tag}`}
                className="px-3 py-1 rounded-full bg-[#ccff00]/10 text-[#ccff00] text-xs border border-[#ccff00]/20 hover:bg-[#ccff00]/20 cursor-pointer transition-colors"
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {post.media_url && (
        <div className="px-4 pb-3">
          {!imageLoaded && <Skeleton className="w-full h-64 rounded-xl" />}
          {post.media_type === 'video' ? (
            <VideoPlayer src={post.media_url} />
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              className="rounded-xl overflow-hidden border border-white/10"
            >
              <img 
                src={post.media_url} 
                alt="Post content" 
                className="w-full max-h-96 object-cover"
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>
          )}
        </div>
      )}

      <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex gap-6">
          <Tooltip text={isLiked ? 'Unlike' : 'Like'}>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              </motion.div>
              <span className="text-xs font-medium">{likesCount}</span>
            </motion.button>
          </Tooltip>
          
          <Tooltip text="Comment">
            <button 
              onClick={() => window.location.href = `/post/${post.id}`}
              className="flex items-center gap-2 text-gray-400 hover:text-[#ccff00] transition-colors"
            >
              <MessageCircle size={18} />
              <span className="text-xs font-medium">{post.comments || 0}</span>
            </button>
          </Tooltip>
          
          <Tooltip text="Share">
            <button 
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-[#00ff88] transition-colors"
            >
              <Share2 size={18} />
              <span className="text-xs font-medium">{post.shares || 0}</span>
            </button>
          </Tooltip>
        </div>
        
        <Tooltip text="Bookmark">
          <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-[#ccff00] transition-colors">
            <Bookmark size={18} />
          </button>
        </Tooltip>
      </div>

      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)}
        postUrl={`${window.location.origin}/post/${post.id}`}
        postContent={post.content}
      />
    </motion.article>
  )
}

// Streak Counter Component
const StreakCounter = ({ streak }) => {
  return (
    <Tooltip text={`${streak} day streak! Keep it up!`}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 cursor-pointer"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <Flame size={18} className="text-orange-500" />
        </motion.div>
        <div>
          <p className="text-xs text-orange-400 font-bold">{streak}</p>
          <p className="text-[10px] text-gray-500">day streak</p>
        </div>
      </motion.div>
    </Tooltip>
  )
}

// Pro Upgrade Modal
const ProUpgradeModal = ({ isOpen, onClose, lpBalance, user, onUpgrade, showToast }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [upgrading, setUpgrading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const plans = {
    monthly: { price: 1000, period: 'month', savings: null },
    yearly: { price: 10000, period: 'year', savings: 'Save 17%' }
  }

  const features = [
    { icon: Sparkles, text: 'Animated avatar frames', color: '#ccff00' },
    { icon: Crown, text: 'Exclusive Pro badge', color: '#ffd700' },
    { icon: Zap, text: 'Priority marketplace listings', color: '#00ff88' },
    { icon: Palette, text: 'Custom profile themes', color: '#ff0066' },
    { icon: Gem, text: 'Access to Lucidar Market', color: '#00ccff' },
    { icon: Target, text: 'Advanced analytics', color: '#ff6600' }
  ]

  const handleUpgrade = async () => {
    const cost = plans[selectedPlan].price
    if (lpBalance < cost) {
      showToast('Insufficient LP balance', 'error')
      return
    }

    setUpgrading(true)
    await new Promise(r => setTimeout(r, 1500))
    setUpgrading(false)
    setShowSuccess(true)
    onUpgrade()
    
    setTimeout(() => {
      setShowSuccess(false)
      onClose()
    }, 3000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={showSuccess ? '' : 'Upgrade to Pro'} maxWidth="max-w-lg">
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <Confetti active={true} />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#ccff00] to-[#00ff88] flex items-center justify-center"
            >
              <Crown size={48} className="text-[#0a0f1a]" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2 text-[#ccff00]">Welcome to Pro!</h3>
            <p className="text-gray-400">You now have access to all exclusive features</p>
          </motion.div>
        ) : (
          <motion.div
            key="upgrade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#ccff00]/10 to-transparent border border-[#ccff00]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#ccff00]/20 flex items-center justify-center">
                  <Gem className="text-[#ccff00]" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Your Balance</p>
                  <p className="text-xl font-bold text-[#ccff00] font-mono">{lpBalance.toLocaleString()} LP</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
                + Top Up
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(plans).map(([key, plan]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPlan(key)}
                  className={`p-4 rounded-2xl border-2 transition-all relative ${
                    selectedPlan === key 
                      ? 'border-[#ccff00] bg-[#ccff00]/10' 
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  {plan.savings && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#ccff00] text-[#0a0f1a] text-xs font-bold rounded-full">
                      {plan.savings}
                    </span>
                  )}
                  <p className="text-gray-400 text-sm capitalize mb-1">{key}</p>
                  <p className="text-2xl font-bold text-white mb-1">{plan.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">LP / {plan.period}</p>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon size={20} style={{ color: feature.color }} />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                  <CheckCircle2 className="ml-auto text-[#00ff88]" size={18} />
                </motion.div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={upgrading || lpBalance < plans[selectedPlan].price}
              className="w-full py-4 bg-[#ccff00] text-[#0a0f1a] rounded-xl font-bold text-lg hover:bg-[#b8e600] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#ccff00]/20"
            >
              {upgrading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : lpBalance < plans[selectedPlan].price ? (
                'Insufficient Balance'
              ) : (
                <>
                  <Crown size={20} />
                  Upgrade Now
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}

// Activity Stats Component
const ActivityStats = () => {
  const [stats, setStats] = useState({
    postsToday: 12,
    likesReceived: 48,
    profileViews: 156,
    engagement: 85
  })

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
      <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
        <Activity size={16} className="text-[#00ff88]" />
        Today's Activity
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
          <p className="text-2xl font-bold text-[#ccff00] group-hover:scale-110 transition-transform inline-block">{stats.postsToday}</p>
          <p className="text-xs text-gray-500">Posts</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
          <p className="text-2xl font-bold text-[#00ff88] group-hover:scale-110 transition-transform inline-block">{stats.likesReceived}</p>
          <p className="text-xs text-gray-500">Likes</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
          <p className="text-2xl font-bold text-[#00ccff] group-hover:scale-110 transition-transform inline-block">{stats.profileViews}</p>
          <p className="text-xs text-gray-500">Profile Views</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
          <p className="text-2xl font-bold text-[#ff0066] group-hover:scale-110 transition-transform inline-block">{stats.engagement}%</p>
          <p className="text-xs text-gray-500">Engagement</p>
        </div>
      </div>
    </div>
  )
}

// Lucidar Market Sidebar Item Component
const LucidarMarketSidebarItem = ({ user, navigate }) => {
  const isPro = user?.is_pro
  
  return (
    <button
      onClick={() => navigate('/lucidar-market')}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm relative overflow-hidden group ${
        window.location.pathname === '/lucidar-market'
          ? 'bg-gradient-to-r from-[#ccff00]/20 to-[#00ff88]/10 border border-[#ccff00]/30 text-[#ccff00]' 
          : 'hover:bg-white/5 border border-transparent text-gray-300 hover:text-white'
      }`}
    >
      <div className={`p-1.5 rounded-lg transition-colors ${
        isPro 
          ? 'bg-[#ccff00]/20 text-[#ccff00]' 
          : 'bg-gray-700/50 text-gray-500 group-hover:bg-gray-600/50'
      }`}>
        <Sparkles size={18} />
      </div>
      
      <div className="flex-1 text-left">
        <span className="font-medium block">Lucidar Market</span>
        <span className="text-[10px] text-gray-500 block group-hover:text-gray-400">
          {isPro ? 'Exclusive items available' : 'Pro feature - Preview only'}
        </span>
      </div>
      
      {/* Status Badge */}
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${
        isPro 
          ? 'bg-[#ccff00]/20 text-[#ccff00] border-[#ccff00]/30' 
          : 'bg-gray-800 text-gray-500 border-gray-700'
      }`}>
        {isPro ? (
          <>
            <Unlock size={10} />
            <span>UNLOCKED</span>
          </>
        ) : (
          <>
            <Lock size={10} />
            <span>LOCKED</span>
          </>
        )}
      </div>
      
      {/* Hover glow effect for locked state */}
      {!isPro && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
      )}
    </button>
  )
}

// Main Home Component
export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [trending, setTrending] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showProModal, setShowProModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [lpBalance, setLpBalance] = useState(0)
  const [toast, setToast] = useState(null)
  const [streak] = useState(7)
  const [refreshing, setRefreshing] = useState(false)
  const currentYear = new Date().getFullYear()

  const API_URL = 'http://localhost:3000/api'
  const touchStartY = useRef(0)

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    loadAllData()
    
    const interval = setInterval(() => {
      refreshData()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [navigate])

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY
      const diff = touchY - touchStartY.current
      
      if (window.scrollY === 0 && diff > 100 && !refreshing) {
        setRefreshing(true)
        refreshData().then(() => setRefreshing(false))
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [refreshing])

  const loadAllData = async () => {
    setLoading(true)
    await Promise.all([
      fetchUser(),
      fetchFeed(),
      fetchTrending(),
      fetchSuggestions()
    ])
    setLoading(false)
  }

  const refreshData = async () => {
    await Promise.all([
      fetchUser(),
      fetchFeed(true)
    ])
  }

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setLpBalance(data.user.lucid_points || 0)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    } catch (err) {
      console.error('Failed to fetch user:', err)
    }
  }

  const fetchFeed = async (silent = false) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/feed`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (err) {
      console.error('Failed to fetch feed:', err)
    }
  }

  const fetchTrending = async () => {
    try {
      const response = await fetch(`${API_URL}/trending`)
      if (response.ok) {
        const data = await response.json()
        setTrending(data.tags || [])
      }
    } catch (err) {
      console.error('Failed to fetch trending:', err)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/suggestions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.users || [])
      }
    } catch (err) {
      console.error('Failed to fetch suggestions:', err)
    }
  }

  const handleLike = async (postId) => {
    const token = localStorage.getItem('token')
    const post = posts.find(p => p.id === postId)
    const isLiked = post?.is_liked
    
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: isLiked ? 'DELETE' : 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!response.ok) throw new Error('Failed to toggle like')
    
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, is_liked: !isLiked, likes: p.likes + (isLiked ? -1 : 1) }
      }
      return p
    }))
  }

  const handleDelete = async (postId) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!response.ok) throw new Error('Failed to delete')
    
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  const handlePin = async (postId) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/posts/${postId}/pin`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!response.ok) throw new Error('Failed to pin')
    
    setPosts(prev => prev.map(p => {
      if (p.id === postId) return { ...p, is_pinned: !p.is_pinned }
      if (!p.is_pinned && p.id !== postId) return { ...p, is_pinned: false }
      return p
    }))
  }

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev])
    fetchUser()
  }

  const handleProUpgrade = () => {
    setUser(prev => ({ ...prev, is_pro: true, pro_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }))
    setLpBalance(prev => prev - 1000)
  }

  const confirmLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Sidebar items WITHOUT Lucidar Market (it's separate now)
  const sidebarItems = [
    { icon: HomeIcon, label: 'Home', path: '/' },
    { icon: Store, label: 'Marketplace', badge: 'New', path: '/marketplace' },
    { icon: Users, label: 'Communities', path: '/communities' },
    { icon: ShoppingBag, label: 'My Listings', path: '/listings' },
    { icon: Gamepad2, label: 'Gaming', path: '/gaming' },
    { icon: Code2, label: 'Developers', path: '/developers' },
    { icon: Palette, label: 'Creators', path: '/creators' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center text-white">
        <GlobalStyles />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-3 border-[#ccff00] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white relative overflow-x-hidden">
      <GlobalStyles />
      <LiquidGlassBackground />
      
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {refreshing && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#ccff00]/20 backdrop-blur-xl rounded-full border border-[#ccff00]/30 flex items-center gap-2"
          >
            <Loader2 size={16} className="animate-spin text-[#ccff00]" />
            <span className="text-sm text-[#ccff00]">Refreshing...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Logout">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={confirmLogout}
              className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} title="LP Wallet" maxWidth="max-w-md">
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#ccff00]/20 via-[#00ff88]/10 to-transparent border border-[#ccff00]/30 text-center">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#ccff00]/20 flex items-center justify-center"
            >
              <Gem className="text-[#ccff00]" size={32} />
            </motion.div>
            <p className="text-gray-400 text-sm mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-[#ccff00] font-mono mb-1">{lpBalance.toLocaleString()} LP</p>
            <p className="text-xs text-gray-500">≈ ${(lpBalance * 0.01).toFixed(2)} USD</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors hover:border-[#ccff00]/30">
              <div className="w-10 h-10 rounded-lg bg-[#ccff00]/20 flex items-center justify-center">
                <Send className="text-[#ccff00]" size={20} />
              </div>
              <span className="text-xs font-medium">Send</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors hover:border-[#00ff88]/30">
              <div className="w-10 h-10 rounded-lg bg-[#00ff88]/20 flex items-center justify-center">
                <Wallet className="text-[#00ff88]" size={20} />
              </div>
              <span className="text-xs font-medium">Receive</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors hover:border-[#00ccff]/30">
              <div className="w-10 h-10 rounded-lg bg-[#00ccff]/20 flex items-center justify-center">
                <CreditCard className="text-[#00ccff]" size={20} />
              </div>
              <span className="text-xs font-medium">Top Up</span>
            </button>
          </div>
        </div>
      </Modal>

      <ProUpgradeModal 
        isOpen={showProModal} 
        onClose={() => setShowProModal(false)}
        lpBalance={lpBalance}
        user={user}
        onUpgrade={handleProUpgrade}
        showToast={showToast}
      />

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0a0f1a]/95 backdrop-blur-xl border-r border-white/10 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <img src="/assets/img/logo.png" alt="logo" className='w-[120px]'/>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-full overflow-hidden border-2"
                      style={{ borderColor: user?.primary_color || '#ccff00' }}
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                          <User size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{user?.display_name || user?.username}</p>
                      <p className="text-xs text-gray-500">@{user?.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400 mb-3">
                    <span>{user?.following || 0} Following</span>
                    <span>{user?.followers || 0} Followers</span>
                  </div>
                  
                  <div 
                    className="pt-3 border-t border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                    onClick={() => {
                      setSidebarOpen(false)
                      setShowWalletModal(true)
                    }}
                  >
                    <span className="text-xs text-gray-500">Balance</span>
                    <div className="flex items-center gap-2">
                      <Gem className="text-[#ccff00]" size={14} />
                      <span className="text-sm font-bold text-[#ccff00]">{lpBalance.toLocaleString()} LP</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  {sidebarItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate(item.path)
                        setSidebarOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        window.location.pathname === item.path
                          ? 'bg-[#ccff00]/20 border border-[#ccff00]/30 text-[#ccff00]' 
                          : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 bg-[#ccff00] text-[#0a0f1a] text-xs font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                  
                  {/* Lucidar Market in Mobile Sidebar */}
                  <LucidarMarketSidebarItem user={user} navigate={navigate} />
                </div>

                <div className="mb-4">
                  <StreakCounter streak={streak} />
                </div>

                {!user?.is_pro && (
                  <button 
                    onClick={() => {
                      setSidebarOpen(false)
                      setShowProModal(true)
                    }}
                    className="w-full mb-4 p-4 rounded-2xl bg-gradient-to-r from-[#ccff00]/20 to-[#00ff88]/10 border border-[#ccff00]/30 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Crown className="text-[#ccff00]" size={24} />
                      <div>
                        <p className="font-bold text-[#ccff00] text-sm">Lucidar Pro</p>
                        <p className="text-xs text-gray-400">Unlock exclusive features</p>
                      </div>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => {
                    setSidebarOpen(false)
                    setShowLogoutModal(true)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
              
              <Link to="/" className="flex items-center gap-2">
                <img src="/assets/img/logo.png" alt="main logo" className='w-[120px] '/>
              </Link>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search posts, users, items..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#ccff00]/50 transition-all text-sm hover:border-white/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Tooltip text="Messages">
                <button 
                  onClick={() => navigate('/messages')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 relative transition-colors"
                >
                  <MessageSquareMore size={20} className="text-gray-300" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ccff00] text-[#0a0f1a] text-[10px] font-bold rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
              </Tooltip>

              <Tooltip text="Notifications">
                <button 
                  onClick={() => navigate('/notifications')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 relative transition-colors"
                >
                  <Bell size={20} className="text-gray-300" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    5
                  </span>
                </button>
              </Tooltip>

              <Tooltip text="Profile">
                <div 
                  className="relative cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  <div 
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2"
                    style={{ borderColor: user?.primary_color || '#ccff00' }}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <User size={18} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00ff88] rounded-full border-2 border-[#0a0f1a]" />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mt-[120px] pb-24 lg:pb-8 px-4 max-w-7xl mx-auto">
        <div className="flex gap-6 h-[calc(100vh-6rem)]">
          
          {/* Left Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 overflow-y-auto scrollbar-hide">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-3 space-y-1 mb-3">
              {sidebarItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                    window.location.pathname === item.path
                      ? 'bg-[#ccff00]/20 border border-[#ccff00]/30 text-[#ccff00]' 
                      : 'hover:bg-white/5 border border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-1.5 py-0.5 bg-[#ccff00] text-[#0a0f1a] text-[10px] font-bold rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
              
              {/* Lucidar Market Sidebar Item */}
              <LucidarMarketSidebarItem user={user} navigate={navigate} />
            </div>

            <div className="mb-3">
              <StreakCounter streak={streak} />
            </div>

            {!user?.is_pro && (
              <button 
                onClick={() => setShowProModal(true)}
                className="w-full mb-3 p-4 rounded-2xl bg-gradient-to-br from-[#ccff00]/20 via-[#00ff88]/10 to-transparent border border-[#ccff00]/30 text-left group hover:border-[#ccff00]/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#ccff00]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Crown className="text-[#ccff00]" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[#ccff00] text-sm">Lucidar Pro</p>
                    <p className="text-xs text-gray-400">Upgrade your experience</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#ccff00]/80">
                  <Sparkles size={12} />
                  <span>Animated avatars • Pro badge • Priority</span>
                </div>
              </button>
            )}

            <button 
              onClick={() => setShowWalletModal(true)}
              className="w-full mb-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ccff00]/30 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#ccff00]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gem className="text-[#ccff00]" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Balance</p>
                  <p className="text-xl font-bold text-[#ccff00] font-mono">
                    {lpBalance.toLocaleString()} LP
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="flex-1 py-2 bg-[#ccff00] text-[#0a0f1a] rounded-lg font-bold text-xs text-center">Send</span>
                <span className="flex-1 py-2 bg-white/10 text-white rounded-lg font-medium text-xs text-center border border-white/20">Receive</span>
                <span className="flex-1 py-2 bg-[#00ccff]/20 text-[#00ccff] rounded-lg font-medium text-xs text-center border border-[#00ccff]/30">Top Up</span>
              </div>
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm border border-transparent hover:border-red-500/20"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </aside>

          {/* Main Feed */}
          <main className="flex-1 max-w-2xl mx-auto w-full min-w-0 overflow-y-auto scrollbar-hide">
            <CreatePost 
              user={user} 
              onPostCreated={handlePostCreated}
              showToast={showToast}
            />

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {posts.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 text-gray-500 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl"
                  >
                    <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No posts yet</p>
                    <p className="text-sm mb-4">Be the first to share something amazing!</p>
                    <button 
                      onClick={() => document.querySelector('textarea')?.focus()}
                      className="px-6 py-2 bg-[#ccff00] text-[#0a0f1a] rounded-full font-bold hover:bg-[#b8e600] transition-colors"
                    >
                      Create Post
                    </button>
                  </motion.div>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      user={user}
                      onLike={handleLike}
                      onDelete={handleDelete}
                      onPin={handlePin}
                      showToast={showToast}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {posts.length > 0 && (
              <div className="text-center py-8">
                <button className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-400 hover:text-white transition-all hover:border-[#ccff00]/30">
                  Load more posts
                </button>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-72 overflow-y-auto space-y-4 scrollbar-hide">
            {/* REMOVED: LucidarMarket component - now in left sidebar */}

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
              <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                <Flame size={16} className="text-orange-500" />
                Trending Now
              </h3>
              <div className="space-y-3">
                {trending.length === 0 ? (
                  <p className="text-xs text-gray-500">No trending topics</p>
                ) : (
                  trending.slice(0, 5).map((tag, i) => (
                    <div 
                      key={tag.name}
                      onClick={() => navigate(`/tag/${tag.name}`)}
                      className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-600">0{i + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-300 group-hover:text-[#ccff00]">
                            #{tag.name}
                          </p>
                          <p className="text-xs text-gray-500">{tag.post_count?.toLocaleString()} posts</p>
                        </div>
                      </div>
                      <TrendingUp size={14} className="text-gray-600 group-hover:text-[#ccff00]" />
                    </div>
                  ))
                )}
              </div>
            </div>

            <ActivityStats />

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
              <h3 className="font-bold text-white text-sm mb-4">
                Who to follow
              </h3>
              <div className="space-y-3">
                {suggestions.length === 0 ? (
                  <p className="text-xs text-gray-500">No suggestions</p>
                ) : (
                  suggestions.slice(0, 3).map((suggestedUser) => (
                    <div key={suggestedUser.id} className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full overflow-hidden border border-white/10 cursor-pointer"
                        onClick={() => navigate(`/profile/${suggestedUser.username}`)}
                      >
                        {suggestedUser.avatar ? (
                          <img src={suggestedUser.avatar} alt={suggestedUser.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            <User size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/profile/${suggestedUser.username}`)}>
                        <p className="text-sm font-medium text-white truncate">
                          {suggestedUser.display_name || suggestedUser.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">@{suggestedUser.username}</p>
                      </div>
                      <button className="p-1.5 hover:bg-[#ccff00]/20 rounded-lg text-[#ccff00] transition-colors">
                        <PlusCircle size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-xs text-gray-600 flex flex-wrap gap-x-3 gap-y-1 px-2">
              <a href="#" className="hover:text-gray-400 transition-colors">About</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Help</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Press</a>
              <a href="#" className="hover:text-gray-400 transition-colors">API</a>
              <span>© {currentYear} Lucidar</span>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0f1a]/95 backdrop-blur-xl border-t border-white/10 lg:hidden">
        <div className="flex items-center justify-around py-2 px-2">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-xl ${window.location.pathname === '/' ? 'text-[#ccff00]' : 'text-gray-400'}`}
          >
            <HomeIcon size={22} strokeWidth={window.location.pathname === '/' ? 2.5 : 2} />
            <span className="text-[10px]">Home</span>
          </button>
          
          <button
            onClick={() => navigate('/search')}
            className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-gray-400"
          >
            <Search size={22} />
            <span className="text-[10px]">Search</span>
          </button>

          <button
            onClick={() => document.querySelector('textarea')?.focus()}
            className="flex flex-col items-center justify-center -mt-6 w-14 h-14 bg-[#ccff00] text-[#0a0f1a] rounded-full shadow-lg shadow-[#ccff00]/30"
          >
            <PlusCircle size={28} strokeWidth={2.5} />
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-gray-400"
          >
            <Settings2 size={22} />
            <span className="text-[10px]">Settings</span>
          </button>

          <button
            onClick={() => navigate('/discover')}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-xl ${window.location.pathname === '/discover' ? 'text-[#ccff00]' : 'text-gray-400'}`}
          >
            <Wand2 size={22} strokeWidth={window.location.pathname === '/discover' ? 2.5 : 2} />
            <span className="text-[10px]">Discover</span>
          </button>
        </div>
      </footer>

      {/* Desktop Floating Navigation */}
      <footer className="hidden lg:block fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl px-2 py-2 flex items-center gap-1 shadow-2xl">
          <button
            onClick={() => navigate('/')}
            className={`p-3 rounded-xl transition-all ${window.location.pathname === '/' ? 'bg-[#ccff00]/20 text-[#ccff00]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <HomeIcon size={20} />
          </button>
          <button
            onClick={() => navigate('/search')}
            className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Search size={20} />
          </button>
          <button
            onClick={() => document.querySelector('textarea')?.focus()}
            className="p-3 rounded-xl bg-[#ccff00] text-[#0a0f1a] hover:bg-[#b8e600] transition-all mx-1 hover:shadow-lg hover:shadow-[#ccff00]/30"
          >
            <PlusCircle size={24} />
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Settings2 size={20} />
          </button>
          <button
            onClick={() => navigate('/discover')}
            className={`p-3 rounded-xl transition-all ${window.location.pathname === '/discover' ? 'bg-[#ccff00]/20 text-[#ccff00]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Wand2 size={20} />
          </button>
        </div>
      </footer>
    </div>
  )
}