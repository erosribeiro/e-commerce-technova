import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const p = await params;
    const product = await prisma.product.findUnique({
      where: { slug: p.slug },
      include: {
        categoryRecord: true,
      },
    });

    if (!product) {
      return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
