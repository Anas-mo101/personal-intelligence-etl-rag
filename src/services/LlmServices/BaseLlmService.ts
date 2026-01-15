import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";

const oai = new OpenAI({
  baseURL: process.env.LLM_BASE_URL || "http://ollama:11434/v1",
  apiKey: "ollama", // Required but ignored by Ollama
});

const instructorClient = Instructor({
  client: oai,
  mode: "JSON", 
});

export {
    instructorClient
}