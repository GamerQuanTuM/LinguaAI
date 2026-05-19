import { NextResponse } from 'next/server';
import { questionGeneratorApp } from '@/lib/langgraph/questionGenerator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, language, difficulty } = body;

    if (!topic || !language || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields: topic, language, difficulty" }, 
        { status: 400 }
      );
    }

    const initialState = {
      topic,
      language,
      difficulty,
      question: "",
      options: [],
      correctAnswer: "",
    };

    // Invoke the compiled LangGraph application with the initial state
    const finalState = await questionGeneratorApp.invoke(initialState);

    // Return the specific structured output pieces
    return NextResponse.json({
      question: finalState.question,
      options: finalState.options,
      correctAnswer: finalState.correctAnswer,
    });
  } catch (error: any) {
    console.error("Error generating question from LangGraph:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate question" }, 
      { status: 500 }
    );
  }
}
