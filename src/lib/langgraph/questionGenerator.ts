import { StateGraph, Annotation } from "@langchain/langgraph";
import { z } from "zod";
import { deepseek } from "../model";

// Define the input and output state
export const GraphState = Annotation.Root({
  topic: Annotation<string>(),
  language: Annotation<string>(),
  difficulty: Annotation<string>(),
  
  // Appended output state
  question: Annotation<string>(),
  options: Annotation<string[]>(),
  correctAnswer: Annotation<string>(),
});

// Zod schema to enforce output structure from Gemini
const QuestionSchema = z.object({
  question: z.string().describe("The generated multiple choice question focused on the specified topic and language."),
  options: z.array(z.string()).length(4).describe("Four plausible options for the answer."),
  correctAnswer: z.string().describe("The exact matching string of the correct answer from the provided options."),
});

// LangGraph node to handle generation
async function generateNode(state: typeof GraphState.State) {
  const structuredModel = deepseek.withStructuredOutput(QuestionSchema);
  
  const prompt = `You are an expert language learning assistant. 
  Generate a high-quality multiple choice question for a student learning ${state.language}.
  The topic should be about: ${state.topic}.
  The difficulty level (e.g., beginner, intermediate, advanced, A1, B2, etc.) is: ${state.difficulty}.
  Provide the question, exactly 4 plausible options, and identify the correct answer among those options.`;

  const response = await structuredModel.invoke(prompt);

  return {
    question: response.question,
    options: response.options,
    correctAnswer: response.correctAnswer,
  };
}

// Build the state graph
const workflow = new StateGraph(GraphState)
  .addNode("generateQuestion", generateNode)
  .addEdge("__start__", "generateQuestion")
  .addEdge("generateQuestion", "__end__");

// Compile the graph
export const questionGeneratorApp = workflow.compile();
