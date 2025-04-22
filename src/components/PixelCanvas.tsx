import { useEffect, useRef, useState } from 'react'

interface Pixel {
  x: number
  y: number
  color: string
  owner: {
    name: string | null
  }
  message?: string
  link?: string
}

const CANVAS_SIZE = 1000
const INITIAL_SCALE = 0.1
const MIN_SCALE = 0.05
const MAX_SCALE = 5

export default function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scale, setScale] = useState(INITIAL_SCALE)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [pixels, setPixels] = useState<Pixel[]>([])
  const [hoveredPixel, setHoveredPixel] = useState<Pixel | null>(null)

  // Загрузка пикселей
  useEffect(() => {
    const fetchPixels = async () => {
      try {
        const response = await fetch('/api/pixels')
        const data = await response.json()
        setPixels(data)
      } catch (error) {
        console.error('Ошибка при загрузке пикселей:', error)
      }
    }

    fetchPixels()
  }, [])

  // Отрисовка canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Устанавливаем размер canvas
    canvas.width = CANVAS_SIZE
    canvas.height = CANVAS_SIZE

    // Очищаем canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Рисуем пиксели
    pixels.forEach(pixel => {
      ctx.fillStyle = pixel.color
      ctx.fillRect(pixel.x, pixel.y, 1, 1)
    })

    // Рисуем сетку
    ctx.strokeStyle = '#e5e5e5'
    ctx.lineWidth = 1

    for (let x = 0; x <= CANVAS_SIZE; x += 1) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, CANVAS_SIZE)
      ctx.stroke()
    }

    for (let y = 0; y <= CANVAS_SIZE; y += 1) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(CANVAS_SIZE, y)
      ctx.stroke()
    }
  }, [pixels])

  // Обработчики событий для перемещения и масштабирования
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY
    setScale(prevScale => {
      const newScale = prevScale * (delta > 0 ? 0.9 : 1.1)
      return Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE)
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
      return
    }

    // Определяем координаты пикселя под курсором
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left - offset.x) / scale)
    const y = Math.floor((e.clientY - rect.top - offset.y) / scale)

    const pixel = pixels.find(p => p.x === x && p.y === y)
    setHoveredPixel(pixel || null)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="relative w-full h-full">
      <div 
        className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp()
          setHoveredPixel(null)
        }}
      >
        <div 
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <canvas
            ref={canvasRef}
            className="bg-white"
          />
        </div>
      </div>

      {/* Всплывающая подсказка */}
      {hoveredPixel && (
        <div 
          className="absolute bg-white p-2 rounded-md shadow-lg border border-gray-200 z-10"
          style={{
            left: offset.x + hoveredPixel.x * scale,
            top: offset.y + hoveredPixel.y * scale + 20
          }}
        >
          <p className="text-sm">
            {hoveredPixel.owner.name ? (
              <>
                Владелец: {hoveredPixel.owner.name}
                {hoveredPixel.message && (
                  <span className="block">Сообщение: {hoveredPixel.message}</span>
                )}
              </>
            ) : (
              'Свободный пиксель ($1)'
            )}
          </p>
        </div>
      )}
    </div>
  )
} 