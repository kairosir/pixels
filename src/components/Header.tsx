import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Pixels
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Личный кабинет
            </Link>
            <Link 
              href="/auth/signin" 
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Войти
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
} 