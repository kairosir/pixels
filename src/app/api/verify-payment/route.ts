import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    // Получаем информацию о сессии из Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Платеж не был завершен' },
        { status: 400 }
      )
    }

    // Обновляем статус покупки в базе данных
    const purchase = await prisma.purchase.update({
      where: {
        stripeId: sessionId,
      },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, purchase })
  } catch (error) {
    console.error('Ошибка при проверке платежа:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 