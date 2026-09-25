import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8787;
const MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_, res) => {
  res.json({ ok: true, service: "Nova AI" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not configured on the server." });
    }

    const safeMessages = messages
      .filter(m => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string")
      .slice(-30);

    if (!safeMessages.length) {
      return res.status(400).json({ error: "No message supplied." });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        instructions:
          "You are Nova AI, a helpful, accurate and friendly assistant. " +
          "Answer in the user's language. Prefer concise but useful answers. " +
          "For coding, provide practical and safe solutions. " +
          "Do not claim you performed actions you could not perform.",
        input: safeMessages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "AI provider returned an error."
      });
    }

    const reply =
      data?.output_text ||
      (data?.output || [])
        .flatMap(item => item?.content || [])
        .filter(item => item?.type === "output_text" && typeof item?.text === "string")
        .map(item => item.text)
        .join("\n")
        .trim();

    if (!reply) {
      return res.status(502).json({ error: "AI returned an empty response." });
    }

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`Nova AI server running on port ${PORT}`);
});