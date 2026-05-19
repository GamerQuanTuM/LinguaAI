import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { testGeneratorApp } from '@/lib/langgraph/testGenerator';
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware';

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user!.userId;

    // Fetch user and the recent learned items (e.g. from the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        learnedItems: {
          where: {
            createdAt: { gte: sevenDaysAgo }
          },
          select: { type: true, content: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Invoke LangGraph Test Generator
    const initialState = {
        language: user.language,
        level: user.level,
        recentLearnedItems: user.learnedItems,
        testContent: null
    };

    const finalState = await testGeneratorApp.invoke(initialState);
    const generatedTest = finalState.testContent;

    // Save the test in the database
    const weekendTest = await prisma.weekendTest.create({
        data: {
            userId: user.id,
            testContent: generatedTest,
            // Score starts as null, filled when they submit
        }
    });

    return NextResponse.json({
        testId: weekendTest.id,
        test: generatedTest 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Test generation error:", error);
    return NextResponse.json(
        { error: error.message || "Failed to generate test" }, 
        { status: 500 }
    );
  }
});
