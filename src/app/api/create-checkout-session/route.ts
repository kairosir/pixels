import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pixels, userId } = body

    // Проверяем, не заняты ли выбранные пиксели
    const existingPixels = await prisma.pixel.findMany({
      where: {
        OR: pixels.map((p: { x: number; y: number }) => ({
          x: p.x,
          y: p.y,
        })),
      },
    })

    if (existingPixels.length > 0) {
      return NextResponse.json(
        { error: 'Некоторые из выбранных пикселей уже заняты' },
        { status: 400 }
      )
    }

    // Создаем сессию оплаты в Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Пиксели',
              description: `Покупка ${pixels.length} пикселей`,
            },
            unit_amount: 100, // $1 в центах
          },
          quantity: pixels.length,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
      metadata: {
        userId,
        pixels: JSON.stringify(pixels),
      },
    })

    // Создаем запись о покупке
    await prisma.purchase.create({
      data: {
        userId,
        pixelCount: pixels.length,
        totalAmount: pixels.length,
        stripeId: session.id,
        coordinates: pixels,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Ошибка при создании сессии оплаты:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 