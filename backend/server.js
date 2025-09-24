import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch"; 
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();
const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 5,
  message: { error: "⚠️ Too many requests. Please try again in a minute." },
});



app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/api/plan", limiter);

app.post("/api/plan", async (req, res) => {

  const { text } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-8b:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are a STRICT Pomodoro study planner, but friendly and slightly humorous.

Rules:
1. Assume 1 Pomodoro = 25 minutes study + 5 minutes short break.
2. Every 4 Pomodoros, take a 15-minute break.
3. Assume 50 pages per Pomodoro.
4. Maximum output: 5 sentences.
5. Only output calculations. No long advice. You may add a short greeting or tiny humorous remark.
6. End with a one-line daily advice, e.g.: "My advice: study X hours a day using Pomodoro, completing Y Pomodoros daily."
7. If the input is not about study/work tasks with pages/chapters/time, reply exactly:
"I can only help you plan study/work sessions with the Pomodoro technique."

User input: "${text}"
        `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));


    if (data.error) {
      console.error("Gemini API error:", data.error);
      return res.status(429).json({
        error: "⚠️ Gemini quota exceeded. Please try again later.",
      });
    }

    if (data?.candidates?.[0]?.content?.parts?.length > 0) {
      const plan = data.candidates[0].content.parts
        .map((p) => p.text)
        .join("\n");
      res.json({ plan });
    } else {
      console.error("Unexpected Gemini response:", data);
      res.status(500).json({ error: "No valid response from Gemini" });
    }


  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});



app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
