import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";

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

export const Model = () => {
    const activeLLM = process.env.ACTIVE_LLM?.toLowerCase().trim();
    switch (activeLLM) {
        case "deepseek":
            return deepseekModel();
        case "gemini":
            return geminiModel();
        default:
            return geminiModel();
    }
}

type Model = ChatOpenAI<ChatOpenAICallOptions> | ChatGoogleGenerativeAI;

let _model: Model | null = null;

const getModel = (): Model => {
    if (!_model) {
        _model = Model();
    }
    return _model;
};

// Use a Proxy to lazily load the model. This prevents crashes during module import or build time
// if environment variables are not yet loaded or if keys are missing for an unused model.
export const model = new Proxy({}, {
    get(target, prop, receiver) {
        const instance = getModel();
        const value = Reflect.get(instance, prop, receiver);
        if (typeof value === "function") {
            return value.bind(instance);
        }
        return value;
    }
}) as ReturnType<typeof Model>;

