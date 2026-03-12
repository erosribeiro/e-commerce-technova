import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// Helper to authenticate route handlers
function authenticate(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string, email: string };
    return decoded.sub; // userId
  } catch (error) {
    return null;
  }
}

// GET User's Wishlist
export async function GET(request: Request) {
  const userId = authenticate(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wishlist: true,
      },
    });

    if (!user) {
       return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.wishlist);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
