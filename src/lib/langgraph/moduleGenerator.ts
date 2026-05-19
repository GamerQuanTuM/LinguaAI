import { StateGraph, Annotation } from "@langchain/langgraph";
import { z } from "zod";
import { model } from "../model";

export const ModuleGenState = Annotation.Root({
  language: Annotation<string>(),
  level: Annotation<string>(),
  moduleType: Annotation<string>(),
  previouslyLearnedItems: Annotation<string[]>(),
  lessonContent: Annotation<any>(),
});

// Zod schema to enforce output structure from Gemini
const VocabularyItemSchema = z.object({
  word: z.string().describe("The word or phrase in the target language."),
  translation: z.string().describe("Translation into English."),
  example: z.string().describe("An example sentence using the word in the target language."),
  exampleTranslation: z.string().describe("English translation of the example sentence."),
});

const ConjugationFormSchema = z.object({
  label: z.string().describe("Label for this conjugation form, e.g. 'Present Formal', 'Past Tense', 'Negative'."),
  value: z.string().describe("The actual conjugated form in the target language."),
});

const ConjugationTableSchema = z.object({
  type: z.string().describe("Type/name of conjugation pattern, e.g. '아/어요 Present Tense', 'ㄷ Irregular'."),
  forms: z.array(ConjugationFormSchema).describe("List of conjugation forms for this pattern."),
});

const IrregularItemSchema = z.object({
  base: z.string().describe("The base/dictionary form of the word."),
  result: z.string().describe("The irregular conjugated result form."),
  note: z.string().describe("A brief note explaining what NOT to do or why it is irregular."),
});

const GrammarRuleSchema = z.object({
  ruleName: z.string().describe("The name of the grammar rule, e.g. 'Subject Particles 이/가', 'Past Tense -았/었어요'."),
  explanation: z.string().describe("A concise, clear explanation of how this rule works in 2-4 sentences."),
  examples: z.array(z.string()).min(3).describe("At least 3 example sentences in the target language demonstrating the rule, formatted as 'Target language sentence (English translation)'."),
  conjugations: z.array(ConjugationTableSchema).optional().describe("If the rule involves verb/adjective conjugation patterns (especially for Korean, Japanese, Spanish etc.), provide the conjugation table here. Omit if not applicable."),
  irregulars: z.array(IrregularItemSchema).optional().describe("If the rule has notable irregular forms or exceptions, list them here. This is especially important for Korean ㄷ/ㅂ/르 irregulars, Japanese godan verbs, etc. Omit if not applicable."),
});

const LessonSchema = z.object({
  title: z.string().describe("Title of this specific daily lesson."),
  vocabulary: z.array(VocabularyItemSchema).describe("List of exactly 10 new vocabulary words."),
  grammar: z.array(GrammarRuleSchema).describe("List of exactly 4 new grammar rules."),
});

// LangGraph node to handle generation
async function generateModuleNode(state: typeof ModuleGenState.State) {
  const structuredModel = model.withStructuredOutput(LessonSchema);

  const prompt = `You are an expert language teacher specializing in ${state.language}. 
  Create a new daily lesson for a student learning ${state.language} at the ${state.level} level.
  
  CRITICAL: The student has ALREADY LEARNED the following items. DO NOT INCLUDE ANY OF THESE IN YOUR LESSON:
  [ ${state.previouslyLearnedItems.join(", ")} ]
  
  You MUST provide EXACTLY 10 new vocabulary words with example sentences.
  You MUST provide EXACTLY 4 new grammar rules.

  For grammar rules:
  - Provide a clear explanation
  - Provide at least 3 example sentences with translations, formatted as: "Target sentence (English)"
  - If the rule involves conjugation patterns (e.g. Korean verb endings like -아/어요, -았/었어요, particles, etc.), add the full conjugation table in the "conjugations" field
  - If the rule has irregular forms or exceptions (e.g. Korean ㄷ/ㅂ/르/ㅅ irregular verbs, 하다 verbs, etc.), list them in the "irregulars" field
  - Be specific: for Korean always include conjugation tables for verb/adjective ending rules. For languages with gendered nouns or verb conjugation, cover those patterns.

  Ensure the difficulty strictly matches the ${state.level} level.`;

  const response = await structuredModel.invoke(prompt);

  return {
    lessonContent: response,
  };
}

const workflow = new StateGraph(ModuleGenState)
  .addNode("generateModule", generateModuleNode)
  .addEdge("__start__", "generateModule")
  .addEdge("generateModule", "__end__");

export const moduleGeneratorApp = workflow.compile();
