import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware';

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const { learnedVocabulary, learnedGrammar } = await req.json();

    const userId = req.user!.userId;

    // Build the data payload array for prisma createMany
    const learnedData: any[] = [];

    if (learnedVocabulary && Array.isArray(learnedVocabulary)) {
        learnedVocabulary.forEach(word => {
            learnedData.push({
                userId,
                type: 'vocabulary',
                content: word,
                mastered: true
            });
        });
    }

    if (learnedGrammar && Array.isArray(learnedGrammar)) {
        learnedGrammar.forEach(rule => {
            learnedData.push({
                userId,
                type: 'grammar',
                content: rule,
                mastered: true
            });
        });
    }

    if (learnedData.length > 0) {
        // Use createMany with skipDuplicates to ignore items the user already knows
        await prisma.learnedItem.createMany({
            data: learnedData,
            skipDuplicates: true,
        });
    }

    // Update Progress table (Today's date truncated to midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.progress.upsert({
        where: {
            userId_date: {
                userId,
                date: today
            }
        },
        update: {
            lessonsDone: { increment: 1 }
        },
        create: {
            userId,
            date: today,
            lessonsDone: 1
        }
    });

    return NextResponse.json({
      message: 'Progress saved successfully',
      itemsLearned: learnedData.length
    }, { status: 200 });

  } catch (error: any) {
    console.error("Progress save error:", error);
    return NextResponse.json(
        { error: error.message || "Failed to save progress" }, 
        { status: 500 }
    );
  }
});
