'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HexColorPicker } from 'react-colorful'

export default function ColorSelectPage() {
  const router = useRouter()
  const [color, setColor] = useState('#000000')
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/set-pixel-colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          color,
          message: message.trim(),
          link: link.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Ошибка при сохранении цветов')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Ошибка при сохранении:', error)
      alert('Произошла ошибка при сохранении цветов')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-center mb-2">
            Выберите цвет для ваших пикселей
          </h1>
          <p className="text-gray-600 text-center">
            Этот цвет будет применен ко всем купленным пикселям
          </p>
        </div>

        <div className="flex justify-center">
          <HexColorPicker color={color} onChange={setColor} />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Сообщение (необязательно)
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ваше сообщение"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ссылка (необязательно)
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`
              px-4 py-2 bg-blue-600 text-white rounded-md
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
            `}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  )
} 