import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { wordGeneratorApp } from '@/lib/langgraph/wordGenerator';

export async function GET(req: Request) {
  // 1. Verify Vercel Cron Secret (if defined in env)
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const languages = ["Korean"]; // Korean supported for now
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const results = [];

    for (const language of languages) {
      // Check if we already have a word for this language today
      let wordOfTheDay = await prisma.wordOfTheDay.findFirst({
        where: {
          language,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      });

      if (wordOfTheDay) {
        results.push({ language, status: 'already_exists', word: wordOfTheDay.word });
        continue;
      }

      // Fetch history to avoid repeats
      const pastWords = await prisma.wordOfTheDay.findMany({
        where: { language }
      });
      const pastWordStrings = pastWords.map(w => w.word);

      const initialState = {
        language,
        previouslyGeneratedWords: pastWordStrings,
        wordData: null
      };

      // Generate using LangGraph
      const finalState = await wordGeneratorApp.invoke(initialState);
      const newWordData = finalState.wordData;

      wordOfTheDay = await prisma.wordOfTheDay.create({
        data: {
          language,
          date: today,
          word: newWordData.word,
          meaning: newWordData.meaning,
          example: newWordData.example
        }
      });

      results.push({ language, status: 'generated', word: wordOfTheDay.word });
    }

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error: any) {
    console.error("Vercel Cron Job Error:", error);
    return NextResponse.json({ error: error.message || "Cron job failed" }, { status: 500 });
  }
}
