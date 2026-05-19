import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { wordGeneratorApp } from '@/lib/langgraph/wordGenerator';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get('language');

    if (!language) {
      return NextResponse.json({ error: 'Language parameter is required' }, { status: 400 });
    }

    // Get today's date (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter to just the pure date component to ensure it matches perfectly for the day
    // Since Prisma stores full ISO timestamps, we search for exactly today
    
    // Check if we already have a word for this language today
    let wordOfTheDay = await prisma.wordOfTheDay.findFirst({
        where: {
            language: language,
            date: {
               gte: today, // Greater than or equal to start of today
               lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Less than start of tomorrow
            }
        }
    });

    // If it exists globally, return it immediately so all users see the same one
    if (wordOfTheDay) {
        return NextResponse.json({ word: wordOfTheDay }, { status: 200 });
    }

    // If it doesn't exist, we must generate one.
    // First, fetch all historical words for this language to avoid repeating globally
    const pastWords = await prisma.wordOfTheDay.findMany({
        where: { language }
    });
    
    const pastWordStrings = pastWords.map(w => w.word);

    // Invoke LangGraph to generate a unique word
    const initialState = {
        language,
        previouslyGeneratedWords: pastWordStrings,
        wordData: null
    };

    const finalState = await wordGeneratorApp.invoke(initialState);
    const newWordData = finalState.wordData;

    // Save globally so the next user fetches this same word
    wordOfTheDay = await prisma.wordOfTheDay.create({
        data: {
            language,
            date: today,
            word: newWordData.word,
            meaning: newWordData.meaning,
            example: newWordData.example
        }
    });

    return NextResponse.json({ word: wordOfTheDay }, { status: 201 });

  } catch (error: any) {
    console.error("Word of the Day error:", error);
    return NextResponse.json(
        { error: error.message || "Failed to fetch Word of the Day" }, 
        { status: 500 }
    );
  }
}
