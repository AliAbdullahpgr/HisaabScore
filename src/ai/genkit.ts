import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

// Ensure API key is available
const apiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  console.error("GOOGLE_GENAI_API_KEY is not set in environment variables");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey || "",
    }),
  ],
  model: "googleai/gemini-1.5-flash",
});
