import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
router.post("/practice-feedback", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { qa } = req.body;
    if (!qa || qa.length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }
    const filteredQA = qa.filter(
      item => item.answer && item.answer.trim() !== ""
    );
    if (filteredQA.length === 0) {
      return res.status(400).json({ error: "No valid answers provided" });
    }
    const transcript = filteredQA
    .map(item => `
    Question: ${item.question}
    Answer: ${item.answer}
    `)
      .join("\n");
    const safeTranscript = transcript.slice(0, 2000);
    const prompt = `
    You are an English speaking tutor.
    Here are student responses:
    ${safeTranscript}
    First, correct the student's sentences.
    Then give short and helpful feedback.
    FORMAT:
    {
      "corrected": "all corrected sentences combined",
      "feedback": "clear and short feedback"
    }
    IMPORTANT:
    -Return ONLY ONE JSON object.
    -Do NOT return multiple JSON objects.
    -Combine all feedback into one.
    {
    "corrected":"combined corrected sentence",
    "feedback":"combined feedback"
    }
    `;
    const response = await axios.post(
      "https://ai.dinoiki.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 200
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const aiContent = response.data?.choices?.[0]?.message?.content;
    if (!aiContent) {
      console.error("❌ AI RESPONSE KOSONG:", response.data);
      return res.status(500).json({
        error: "AI response kosong"
      });
    }
    let text = aiContent;
        text = text.replace(/```json/g, "")
                  .replace(/```/g, "")
                  .trim();
    let result;
    try {
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonString = text.slice(firstBrace, lastBrace + 1);
        result = JSON.parse(jsonString);
      }
    } catch (e) {
      console.error("❌ JSON PARSE ERROR:", text);
    }
    if (!result || !result.corrected || !result.feedback) {
      return res.json({
        corrected: "Correction unavailable",
        feedback: "Feedback unavailable"
      });
    }
    res.json({
      corrected:
    typeof result.corrected === "string"
      ? result.corrected
      : JSON.stringify(result.corrected),
    feedback:
      typeof result.feedback === "string"
        ? result.feedback
        : JSON.stringify(result.feedback)
      });
    } catch (error) {
    console.error("❌ PRACTICE FEEDBACK ERROR:");
    console.error("MESSAGE:", error.message);
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("FULL:", error);
    res.status(500).json({
      error: "Practice feedback failed",
      detail: error.response?.data || error.message
    });
  }
});

export default router;