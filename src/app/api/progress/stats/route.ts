import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user!.userId;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Sunday
    weekStart.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Fetch all daily lessons (acts as lesson completion log)
    const allLessons = await prisma.dailyLesson.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      select: { date: true, vocabulary: true, grammar: true }
    });

    // Fetch weekend test scores
    const tests = await prisma.weekendTest.findMany({
      where: { userId, score: { not: null } },
      orderBy: { takenAt: 'desc' },
      select: { score: true, takenAt: true, testContent: true }
    });

    // Fetch the user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, language: true, createdAt: true }
    });

    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Compute stats
    const totalDaysLearned = allLessons.length;
    const totalVocab = allLessons.reduce((acc, l) => acc + ((l.vocabulary as any[])?.length || 0), 0);
    const totalGrammar = allLessons.reduce((acc, l) => acc + ((l.grammar as any[])?.length || 0), 0);

    // Week streak: consecutive days from today going backwards
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lessonDatesSet = new Set(allLessons.map(l => {
      const d = new Date(l.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }));
    for (let i = 0; i <= 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      if (lessonDatesSet.has(d.getTime())) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    // This week's lessons (Mon-Sun)
    const weekLessons = allLessons.filter(l => new Date(l.date) >= weekStart);
    const weekVocab = weekLessons.reduce((acc, l) => acc + ((l.vocabulary as any[])?.length || 0), 0);
    const weekGrammar = weekLessons.reduce((acc, l) => acc + ((l.grammar as any[])?.length || 0), 0);

    // Last 30 days activity — one entry per day for the chart
    const last30 = allLessons.filter(l => new Date(l.date) >= thirtyDaysAgo).map(l => ({
      date: new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      vocab: (l.vocabulary as any[])?.length || 0,
      grammar: (l.grammar as any[])?.length || 0,
    }));

    // Average test score
    const avgScore = tests.length 
      ? Math.round(tests.reduce((acc, t) => acc + (t.score || 0), 0) / tests.length) 
      : null;

    return NextResponse.json({
      totalDaysLearned,
      totalVocab,
      totalGrammar,
      streak,
      weekDaysActive: weekLessons.length,
      weekVocab,
      weekGrammar,
      level: user.level,
      language: user.language,
      memberSince: user.createdAt,
      last30,
      tests: tests.map(t => ({
        score: t.score,
        takenAt: t.takenAt,
      })),
      avgTestScore: avgScore,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Progress fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
});
