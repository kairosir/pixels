'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface SelectedPixel {
  x: number
  y: number
}

export default function PixelSelector() {
  const { data: session } = useSession()
  const [selectedPixels, setSelectedPixels] = useState<SelectedPixel[]>([])
  const [isSelecting, setIsSelecting] = useState(false)

  const handlePurchase = async () => {
    if (!session || selectedPixels.length === 0) return

    try {
      // Создаем сессию оплаты в Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pixels: selectedPixels,
          userId: session.user.id,
        }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Ошибка при создании сессии оплаты:', error)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <button
            className={`px-4 py-2 rounded-md mr-2 ${
              isSelecting
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setIsSelecting(!isSelecting)}
          >
            {isSelecting ? 'Отменить выбор' : 'Выбрать пиксели'}
          </button>
          <span className="text-sm text-gray-600">
            Выбрано: {selectedPixels.length} ({selectedPixels.length}$)
          </span>
        </div>
        {selectedPixels.length > 0 && (
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={handlePurchase}
          >
            Купить выбранные пиксели
          </button>
        )}
      </div>
    </div>
  )
} 