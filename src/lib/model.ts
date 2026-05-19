import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

const geminiModel = () => {
    if (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY) {
        throw new Error("GOOGLE_API_KEY or GEMINI_API_KEY is not defined");
    }
    return new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        temperature: 0.2,
        apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "",
    });
}


const deepseekModel = () => {
    if (!process.env.NVIDIA_NIM_API_KEY) {
        throw new Error("NVIDIA_NIM_API_KEY is not defined");
    }
    if (!process.env.NVIDIA_NIM_BASE_URL) {
        throw new Error("NVIDIA_NIM_BASE_URL is not defined");
    }
    return new ChatOpenAI({
        model: "deepseek-ai/deepseek-v4-pro",
        temperature: 0.2,
        apiKey: process.env.NVIDIA_NIM_API_KEY,
        configuration: {
            baseURL: process.env.NVIDIA_NIM_BASE_URL,
        },
    });
}


export const gemini = geminiModel();
export const deepseek = deepseekModel();

