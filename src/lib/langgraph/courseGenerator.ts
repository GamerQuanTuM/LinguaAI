import { StateGraph, Annotation } from "@langchain/langgraph";
import { z } from "zod";
import { deepseek } from "../model";

export const CourseGenState = Annotation.Root({
  language: Annotation<string>(),
  level: Annotation<string>(),
  dailyMinutes: Annotation<number>(),
  
  coursePlan: Annotation<any>(),
});

// Zod schema to enforce output structure from Gemini
const CourseModuleSchema = z.object({
  name: z.string().describe("The name of the module, e.g., 'Greetings and Introductions'."),
  topics: z.array(z.string()).describe("List of topics covered in this module."),
  type: z.enum(["grammar", "vocabulary", "mixed"]).describe("Primary focus of the module."),
});

const CoursePlanSchema = z.object({
  title: z.string().describe("Catchy title for the language course."),
  modules: z.array(CourseModuleSchema).describe("An ordered list of modules from start to finish for this level."),
});

// LangGraph node to handle generation
async function generateCourseNode(state: typeof CourseGenState.State) {

  const structuredModel = deepseek.withStructuredOutput(CoursePlanSchema);
  
  const prompt = `You are an expert language curriculum designer. 
  Create a comprehensive course syllabus for a student learning ${state.language} at the ${state.level} level.
  The student plans to study ${state.dailyMinutes} minutes per day.
  Break the course down into logically ordered modules that cover necessary grammar and vocabulary for this level.
  Return the plan in the requested JSON structure.`;

  const response = await structuredModel.invoke(prompt);

  return {
    coursePlan: response,
  };
}

const workflow = new StateGraph(CourseGenState)
  .addNode("generateCourse", generateCourseNode)
  .addEdge("__start__", "generateCourse")
  .addEdge("generateCourse", "__end__");

export const courseGeneratorApp = workflow.compile();
