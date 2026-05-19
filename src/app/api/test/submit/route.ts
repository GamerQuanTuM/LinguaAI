import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware';

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { testId, score } = await req.json();

    if (!testId || score === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    await prisma.weekendTest.update({
      where: { id: testId },
      data: { score, takenAt: new Date() }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Test submit error:", error);
    return NextResponse.json({ error: "Failed to submit test" }, { status: 500 });
  }
});
