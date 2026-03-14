import "dotenv/config";
import { fetch } from "undici";

async function test() {
  console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY ? "Set" : "Not Set");

  try {
    const response = await fetch("https://api.groq.ai/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "groq-1",
        input: "Hello",
      }),
    });

    const data = await response.json();
    console.log("Success:", data);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
