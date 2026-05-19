import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user!.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch all daily lessons from the past (where date < today)
    const history = await prisma.dailyLesson.findMany({
      where: {
        userId,
        date: {
          lt: today
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json({ history }, { status: 200 });

  } catch (error: any) {
    console.error("History fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
});
