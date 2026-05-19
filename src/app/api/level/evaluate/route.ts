import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { levelEvaluatorApp } from '@/lib/langgraph/levelEvaluator';
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware';

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user!.userId;

    // Fetch total learned items
    const learnedItemsCount = await prisma.learnedItem.count({
        where: { userId }
    });

    // Fetch days studied (unique dates in Progress)
    const daysStudiedCount = await prisma.progress.count({
        where: { userId }
    });

    // Fetch tests to calculate average score
    const tests = await prisma.weekendTest.findMany({
        where: { 
            userId,
            score: { not: null }
        },
        select: { score: true }
    });

    const averageTestScore = tests.length > 0
        ? tests.reduce((acc, curr) => acc + (curr.score || 0), 0) / tests.length
        : 0;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Invoke LangGraph Evaluator
    const initialState = {
        language: user.language,
        currentLevel: user.level,
        learnedItemsCount,
        averageTestScore,
        daysStudied: daysStudiedCount,
        evaluationResult: null
    };

    const finalState = await levelEvaluatorApp.invoke(initialState);
    const evaluation = finalState.evaluationResult;

    // If passed, update the user to the new level
    if (evaluation.passLevel && evaluation.recommendedNextLevel) {
        await prisma.user.update({
            where: { id: userId },
            data: { level: evaluation.recommendedNextLevel }
        });
    }

    return NextResponse.json({
        evaluation,
        newLevel: evaluation.passLevel ? evaluation.recommendedNextLevel : user.level
    }, { status: 200 });

  } catch (error: any) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
        { error: error.message || "Failed to evaluate level" }, 
        { status: 500 }
    );
  }
});
