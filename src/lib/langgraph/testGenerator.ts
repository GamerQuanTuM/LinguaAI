import { StateGraph, Annotation } from "@langchain/langgraph";
import { z } from "zod";
import { model } from "../model";

export const TestGenState = Annotation.Root({
  language: Annotation<string>(),
  level: Annotation<string>(),
  recentLearnedItems: Annotation<any[]>(),
  testContent: Annotation<any>(),
});

// Zod schema to enforce output structure from Gemini
const QuestionSchema = z.object({
  type: z.enum(["multiple-choice", "translate-word", "correct-sentence", "write-sentence"]).describe("The type of question format."),
  questionText: z.string().describe("The test question based on the learned grammar or vocabulary. E.g., 'Translate X to Korean' or 'Correct the error in this sentence: ...'"),
  options: z.array(z.string()).optional().describe("Provide 4 options ONLY if type is multiple-choice. Otherwise empty array."),
  correctAnswer: z.string().describe("The exact expected string answer. For multiple choice, it should match one option exactly. For text inputs, it must be the exact expected typed word or sentence."),
  explanation: z.string().describe("A brief explanation of why the answer is correct."),
});

const WeekendTestSchema = z.object({
  title: z.string().describe("Title of the weekend assessment."),
  questions: z.array(QuestionSchema).describe("List of exactly 10 questions testing the provided materials."),
});

// LangGraph node to handle generation
async function generateTestNode(state: typeof TestGenState.State) {
  const structuredModel = model.withStructuredOutput(WeekendTestSchema);
  
  const learnedStringsContext = state.recentLearnedItems.map(item => `[${item.type.toUpperCase()}] ${item.content}`).join("\n");

  const prompt = `You are an expert language examiner. 
  Create a 10-question weekend test for a student learning ${state.language} at the ${state.level} level.
  
  CRITICAL: You MUST base the questions ONLY on the materials the student learned this week:
  === LEARNED MATERIALS ===
  ${learnedStringsContext}
  === END MATERIALS ===
  
  The 10 questions MUST be a mix of the following types:
  1. "multiple-choice": standard 4 options
  2. "translate-word": Provide meaning in English, ask for the single target word translated directly.
  3. "correct-sentence": Provide a sentence with an error based on the grammar rule, ask the user to type the fully corrected sentence.
  4. "write-sentence": Give a prompt in English, ask them to type the exact translated sentence using the learned grammar/vocab. Make sure it's unambiguous so there's only one correct way to type it.

  Ensure there is exactly one correct text answer per question.`;

  const response = await structuredModel.invoke(prompt);

  return {
    testContent: response,
  };
}

const workflow = new StateGraph(TestGenState)
  .addNode("generateTest", generateTestNode)
  .addEdge("__start__", "generateTest")
  .addEdge("generateTest", "__end__");

export const testGeneratorApp = workflow.compile();
