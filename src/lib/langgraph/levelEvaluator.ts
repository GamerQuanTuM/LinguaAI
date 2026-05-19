import { StateGraph, Annotation } from "@langchain/langgraph";
import { z } from "zod";
import { model } from "../model";

export const EvaluatorState = Annotation.Root({
  language: Annotation<string>(),
  currentLevel: Annotation<string>(),
  learnedItemsCount: Annotation<number>(),
  averageTestScore: Annotation<number>(),
  daysStudied: Annotation<number>(),
  
  evaluationResult: Annotation<any>(),
});

// Zod schema to enforce output structure from Gemini
const EvaluationSchema = z.object({
  passLevel: z.boolean().describe("Whether the student has learned enough and scored high enough to pass to the next level."),
  reasoning: z.string().describe("Explanation for why the student passed or needs more time."),
  recommendedNextLevel: z.string().describe("The name of the next level if passing (e.g., if A1, then A2). If not passing, repeat current level.").optional(),
});

// LangGraph node to handle generation
async function evaluateLevelNode(state: typeof EvaluatorState.State) {
  const structuredModel = model.withStructuredOutput(EvaluationSchema);
  
  const prompt = `You are a strict language evaluator assessing a student learning ${state.language} at the ${state.currentLevel} level.
  
  Student Data:
  - Total items learned (vocabulary + grammar): ${state.learnedItemsCount}
  - Days studied: ${state.daysStudied}
  - Average weekend test score: ${state.averageTestScore}%
  
  Criteria for passing a level (e.g., A1 to A2):
  - Must have learned at least 150 items.
  - Must have an average test score above 75%.
  - Must have studied for at least 14 days.
  
  Evaluate if the student passes this level based on the strict criteria above.`;

  const response = await structuredModel.invoke(prompt);

  return {
    evaluationResult: response,
  };
}

const workflow = new StateGraph(EvaluatorState)
  .addNode("evaluateLevel", evaluateLevelNode)
  .addEdge("__start__", "evaluateLevel")
  .addEdge("evaluateLevel", "__end__");

export const levelEvaluatorApp = workflow.compile();
