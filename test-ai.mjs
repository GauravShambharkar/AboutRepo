import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  console.log("API Key exists:", !!apiKey);
  if (!apiKey) return;

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    console.log("AI client initialized");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Hello",
    });
    console.log("Response:", JSON.stringify(response, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
