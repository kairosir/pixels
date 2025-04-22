import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const pixels = await prisma.pixel.findMany({
      select: {
        x: true,
        y: true,
        color: true,
        owner: {
          select: {
            name: true,
          },
        },
        message: true,
        link: true,
      },
    })

    return NextResponse.json(pixels)
  } catch (error) {
    console.error('Ошибка при получении пикселей:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { x, y, color, ownerId } = body

    // Проверяем, не занят ли пиксель
    const existingPixel = await prisma.pixel.findUnique({
      where: {
        x_y: {
          x,
          y,
        },
      },
    })

    if (existingPixel) {
      return NextResponse.json(
        { error: 'Этот пиксель уже занят' },
        { status: 400 }
      )
    }

    // Создаем новый пиксель
    const pixel = await prisma.pixel.create({
      data: {
        x,
        y,
        color,
        ownerId,
      },
    })

    return NextResponse.json(pixel)
  } catch (error) {
    console.error('Ошибка при создании пикселя:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
} 