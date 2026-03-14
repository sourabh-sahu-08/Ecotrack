import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

async function test() {
  console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Set" : "Not Set");
  console.log("API_KEY:", process.env.API_KEY ? "Set" : "Not Set");
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: "Hello"
    });
    console.log("Success:", response.text);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
