import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
router.post("/evaluate-speaking", async (req, res) => {
  try {
    const { qa } = req.body;
    if (!qa || qa.length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }
    const results = [];
    for (const item of qa) {
      if (!item.answer || item.answer.trim() === "") continue;
    const prompt = `
    You are an English speaking examiner.
    Question: ${item.question}
    Answer: ${item.answer}
    Then evaluate using this rubric (score 1-6):
    Pronunciation:
    1 = pronunciation frequently unintelligible
    2 = frequent errors and heavy accent, difficult to understand
    3 = foreign accent, occasional misunderstanding
    4 = noticeable accent but understandable
    5 = minor mispronunciations
    6 = native-like pronunciation
    Grammar:
    1 = almost entirely inaccurate
    2 = constant errors, difficult to communicate
    3 = frequent errors, sometimes unclear
    4 = occasional errors, meaning clear
    5 = few errors
    6 = almost no errors
    Vocabulary:
    1 = very limited vocabulary
    2 = basic vocabulary only
    3 = limited, sometimes inaccurate
    4 = adequate vocabulary
    5 = good and precise vocabulary
    6 = very wide and native-like vocabulary
    Fluency:
    1 = very halting, cannot communicate
    2 = very slow and uneven
    3 = hesitant and incomplete sentences
    4 = some hesitation
    5 = mostly smooth
    6 = effortless and natural
    Comprehension:
    1 = does not answer the question
    2 = mostly irrelevant
    3 = partially relevant
    4 = answers main idea
    5 = mostly appropriate
    6 = fully appropriate and relevant
    IMPORTANT:
    - Evaluate based on the speaking task and student response
    - Be consistent with the rubric
    - Give different scores if necessary
    - Ensure all scores are integers between 1 and 6
    - Do not include any explanation outside JSON
    - Do NOT include explanation.
    - Do NOT include markdown.
    - Do NOT include backticks.
    Return ONLY JSON:
    {
    "correctedText":"",
    "pronunciation":0,
    "grammar":0,
    "vocabulary":0,
    "fluency":0,
    "comprehension":0,
    "feedback":{
    "pronunciation":"",
    "grammar":"",
    "vocabulary":"",
    "fluency":"",
    "comprehension":""
    }
    }
  `;
    const response = await axios.post(
      "https://ai.dinoiki.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 500
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    let text = response.data.choices[0].message.content;
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    let score;
      try {
        score = JSON.parse(text);
      } catch (e) {
        console.error("JSON ERROR:", text);
        continue;
      }
    const clamp = (val) => Math.max(1, Math.min(6, val || 1));
    const pronunciation = clamp(score.pronunciation);
      const grammar = clamp(score.grammar);
      const vocabulary = clamp(score.vocabulary);
      const fluency = clamp(score.fluency);
      const comprehension = clamp(score.comprehension);
      const total =
        pronunciation +
        grammar +
        vocabulary +
        fluency +
        comprehension;
      results.push({
        question: item.question,
        answer: item.answer,
        correctedText: score.correctedText || "No correction provided",
        pronunciation,
        grammar,
        vocabulary,
        fluency,
        comprehension,
        total,
        feedback: score.feedback
      });
    }
    console.log("🔥 RESULTS:", results);
    if (results.length === 0) {
      return res.status(400).json({ error: "No valid answers" });
    }
    const totalAll = results.reduce((sum, r) => sum + r.total, 0);
    const avg = (key) =>
      Math.round(
        results.reduce((sum, r) => sum + r[key], 0) / results.length
      );
    const pronunciationAvg = avg("pronunciation");
    const grammarAvg = avg("grammar");
    const vocabularyAvg = avg("vocabulary");
    const fluencyAvg = avg("fluency");
    const comprehensionAvg = avg("comprehension");
    const maxScore = results.length * 30;
    const finalScore = Math.round((totalAll / maxScore) * 100);
    const mergeFeedback = (key) => {
    const combined = results
      .map(r => r.feedback?.[key])
      .filter(Boolean)
      .join(" ");
      return combined || "No feedback available";
    };
    const finalResult = {
      perQuestion: results,
      summary: {
        pronunciation: pronunciationAvg,
        grammar: grammarAvg,
        vocabulary: vocabularyAvg,
        fluency: fluencyAvg,
        comprehension: comprehensionAvg,
        total: totalAll,
        finalScore,
        feedback: {
          pronunciation: mergeFeedback("pronunciation"),
          grammar: mergeFeedback("grammar"),
          vocabulary: mergeFeedback("vocabulary"),
          fluency: mergeFeedback("fluency"),
          comprehension: mergeFeedback("comprehension")
        }
      }
    };
    console.log("HASIL FINAL:", finalResult);
    res.json(finalResult);
    } catch (error) {
      console.error("EVALUATION ERROR:", error.response?.data || error);
      res.status(500).json({
        error: "Evaluation failed"
      });
    }
  });

export default router; 