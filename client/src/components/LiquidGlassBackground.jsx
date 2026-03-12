import { useEffect, useRef } from 'react'

export default function LiquidGlassBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let time = 0

    // Resize handling
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Simple blob animation
    const blobs = [
      { x: 0.2, y: 0.3, r: 0.15, color: 'rgba(204, 255, 0, 0.15)', speed: 0.0003 },
      { x: 0.8, y: 0.7, r: 0.2, color: 'rgba(0, 255, 136, 0.1)', speed: 0.0002 },
      { x: 0.5, y: 0.5, r: 0.25, color: 'rgba(204, 255, 0, 0.08)', speed: 0.00025 },
      { x: 0.3, y: 0.8, r: 0.12, color: 'rgba(0, 255, 136, 0.12)', speed: 0.00035 },
    ]

    const animate = () => {
      time += 1
      
      // Clear with dark background
      ctx.fillStyle = '#0a0f1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw animated blobs
      blobs.forEach((blob, i) => {
        const offsetX = Math.sin(time * blob.speed + i) * 50
        const offsetY = Math.cos(time * blob.speed * 0.7 + i) * 30
        
        const gradient = ctx.createRadialGradient(
          canvas.width * blob.x + offsetX,
          canvas.height * blob.y + offsetY,
          0,
          canvas.width * blob.x + offsetX,
          canvas.height * blob.y + offsetY,
          canvas.width * blob.r
        )
        
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // Add noise texture overlay (subtle)
      ctx.fillStyle = 'rgba(10, 15, 26, 0.03)'
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        ctx.fillRect(x, y, 2, 2)
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10"
      style={{ filter: 'blur(60px)' }}
    />
  )
}