
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: [path.resolve(process.cwd(), '.env'), path.resolve(process.cwd(), '../.env')] });

async function test() {
  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    // Note: The usage in server.ts suggests genAI.models.generateContent
    // But let's see what the object looks like
    console.log("genAI keys:", Object.keys(genAI));
    if ((genAI as any).models) {
        console.log("genAI.models keys:", Object.keys((genAI as any).models));
    }
    
    const response = await (genAI as any).models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Hello, say hi!"
    });
    console.log("Response keys:", Object.keys(response));
    console.log("Response.text type:", typeof response.text);
    if (typeof response.text === 'function') {
        console.log("Response.text() output:", response.text());
    } else {
        console.log("Response.text value:", response.text);
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
}

test();
