
import { fetch } from "undici";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: [path.resolve(process.cwd(), '.env'), path.resolve(process.cwd(), '../.env')] });

function parseAiJson(text: string): any {
  try {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const candidate = match ? match[1] : text;
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(candidate.substring(start, end + 1));
    }
    return JSON.parse(candidate.trim());
  } catch (e) {
    return null;
  }
}

async function test() {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: "Return a JSON object with a 'message' key saying 'Hello'. Include some preamble text before the JSON." }],
      }),
    });

    const data: any = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    console.log("Raw AI Content:", rawContent);
    const parsed = parseAiJson(rawContent);
    console.log("Parsed JSON:", parsed);
    
    if (parsed && parsed.message === 'Hello') {
      console.log("✅ Robust parsing successful!");
    } else {
      console.log("❌ Robust parsing failed.");
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
}

test();
