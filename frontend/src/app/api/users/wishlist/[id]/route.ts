import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

function authenticate(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string, email: string };
    return decoded.sub;
  } catch (error) {
    return null;
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = authenticate(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const p = await params;
    const productId = p.id;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wishlist: true }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Toggle wishlist item
    const isWished = user.wishlist.some(item => item.id === productId);

    if (isWished) {
      await prisma.user.update({
        where: { id: userId },
        data: {
           wishlist: {
            disconnect: { id: productId }
           }
        }
      });
      return NextResponse.json({ message: 'Product removed from wishlist' });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
           wishlist: {
            connect: { id: productId }
           }
        }
      });
      return NextResponse.json({ message: 'Product added to wishlist' });
    }
  } catch (error) {
    console.error('Wishlist error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
