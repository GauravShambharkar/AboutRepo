import dotenv from "dotenv";
dotenv.config();

async function test() {
  const apiKey = process.env.GROQ_API_KEY;
  console.log("GROQ API Key exists:", !!apiKey);
  if (!apiKey) {
    console.log("Please make sure GROQ_API_KEY is defined in your environment or .env file.");
    return;
  }

  try {
    console.log("Sending test request to Groq API...");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: "Hello! Respond with 'Groq Integration Success!' and nothing else." }],
        temperature: 0.5,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log("Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error during Groq API call:", err);
  }
}

test();
