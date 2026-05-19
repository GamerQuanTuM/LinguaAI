import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { moduleGeneratorApp } from '@/lib/langgraph/moduleGenerator';
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware';

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user!.userId;

    // We only create one daily lesson per user per day.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingDailyLesson = await prisma.dailyLesson.findUnique({
      where: {
        userId_date: {
          userId,
          date: today
        }
      }
    });

    if (existingDailyLesson) {
      return NextResponse.json({
        lesson: {
          title: "Today's Lesson (Review)",
          vocabulary: existingDailyLesson.vocabulary,
          grammar: existingDailyLesson.grammar
        }
      }, { status: 200 });
    }

    // Fetch user and their previously learned items
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        learnedItems: {
          select: { content: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Extract the strings of previously learned items to pass as context
    const previouslyLearnedStrings = user.learnedItems.map(item => item.content);

    // Invoke LangGraph
    const initialState = {
        language: user.language,
        level: user.level,
        moduleType: "daily",
        previouslyLearnedItems: previouslyLearnedStrings,
        lessonContent: null
    };

    const finalState = await moduleGeneratorApp.invoke(initialState);
    const newLesson = finalState.lessonContent;

    // Save it to DB
    await prisma.dailyLesson.create({
      data: {
        userId,
        date: today,
        vocabulary: newLesson.vocabulary,
        grammar: newLesson.grammar
      }
    });

    return NextResponse.json({
      lesson: newLesson 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Module generation error:", error);
    return NextResponse.json(
        { error: error.message || "Failed to generate module" }, 
        { status: 500 }
    );
  }
});
