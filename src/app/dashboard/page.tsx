import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  // TODO: Заменить на реального пользователя после настройки аутентификации
  const userId = 'test-user'
  
  const pixels = await prisma.pixel.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const purchases = await prisma.purchase.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Личный кабинет</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Мои пиксели */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Мои пиксели</h2>
          {pixels.length > 0 ? (
            <div className="space-y-4">
              {pixels.map((pixel) => (
                <div 
                  key={pixel.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="text-sm text-gray-600">
                      Координаты: ({pixel.x}, {pixel.y})
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-4 h-4 rounded-sm border border-gray-200"
                        style={{ backgroundColor: pixel.color }}
                      />
                      <span className="text-sm">{pixel.color}</span>
                    </div>
                  </div>
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => {/* TODO: Добавить изменение цвета */}}
                  >
                    Изменить цвет
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">У вас пока нет купленных пикселей</p>
          )}
        </div>

        {/* История покупок */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">История покупок</h2>
          {purchases.length > 0 ? (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div 
                  key={purchase.id}
                  className="p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium">
                        {purchase.pixelCount} пикселей
                      </p>
                      <p className="text-sm text-gray-600">
                        ${purchase.totalAmount}
                      </p>
                    </div>
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${purchase.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'}
                    `}>
                      {purchase.status === 'completed' ? 'Завершено' : 'В процессе'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(purchase.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">История покупок пуста</p>
          )}
        </div>
      </div>
    </div>
  )
} 