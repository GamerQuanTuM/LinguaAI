import { StateGraph, Annotation } from "@langchain/langgraph";
import { z } from "zod";
import { model } from "../model";

export const WordGenState = Annotation.Root({
  language: Annotation<string>(),
  previouslyGeneratedWords: Annotation<string[]>(), // Global cache to avoid repeats ever
  
  wordData: Annotation<any>(),
});

// Zod schema to enforce output structure from Gemini
const WordOfTheDaySchema = z.object({
  word: z.string().describe("The daily word in the target language."),
  meaning: z.string().describe("Meaning/Translation into English."),
  example: z.string().describe("An example sentence using the word."),
});

// LangGraph node to handle generation
async function generateWordNode(state: typeof WordGenState.State) {
  const structuredModel = model.withStructuredOutput(WordOfTheDaySchema);
  
  const prompt = `You are a language teacher assigning the "Word of the Day" for ${state.language}.
  
  CRITICAL: You must NOT use any of the following words as they have been used before:
  [ ${state.previouslyGeneratedWords.join(", ")} ]
  
  Provide a useful, interesting, or commonly used word in ${state.language} that is not in the list above. 
  Include its meaning and a practical example sentence.`;

  const response = await structuredModel.invoke(prompt);

  return {
    wordData: response,
  };
}

const workflow = new StateGraph(WordGenState)
  .addNode("generateWord", generateWordNode)
  .addEdge("__start__", "generateWord")
  .addEdge("generateWord", "__end__");

export const wordGeneratorApp = workflow.compile();
