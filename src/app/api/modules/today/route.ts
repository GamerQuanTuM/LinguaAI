import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user!.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLesson = await prisma.dailyLesson.findUnique({
      where: {
        userId_date: {
          userId,
          date: today
        }
      }
    });

    if (!todayLesson) {
      return NextResponse.json({ lesson: null, hasCompleted: false }, { status: 200 });
    }

    return NextResponse.json({
      lesson: {
        vocabulary: todayLesson.vocabulary,
        grammar: todayLesson.grammar,
        date: todayLesson.date,
      },
      hasCompleted: true
    }, { status: 200 });

  } catch (error: any) {
    console.error("Today lesson fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch today's lesson" }, { status: 500 });
  }
});
