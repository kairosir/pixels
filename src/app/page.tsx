import PixelCanvas from '@/components/PixelCanvas'
import Header from '@/components/Header'
import PixelSelector from '@/components/PixelSelector'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 relative">
        <div className="absolute inset-0">
          <PixelCanvas />
          <PixelSelector />
        </div>
      </main>
    </div>
  )
}
