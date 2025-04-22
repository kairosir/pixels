import PixelCanvas from '@/components/PixelCanvas'
import Header from '@/components/Header'
import PixelSelector from '@/components/PixelSelector'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 relative">
        <PixelCanvas />
        <PixelSelector />
      </div>
    </div>
  )
}
