import axios from "axios";

export const handler = async (event) => {
  // Hanya menerima POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Method Not Allowed",
      }),
    };
  }

  try {
    console.log("PRACTICE FEEDBACK FUNCTION CALLED");

    // Parse request body
    const body = JSON.parse(event.body || "{}");
    const { qa } = body;

    console.log("QA DATA:", qa);

    if (!qa || !Array.isArray(qa) || qa.length === 0) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "No data provided",
        }),
      };
    }

    // Ambil jawaban yang tidak kosong
    const filteredQA = qa.filter(
      (item) =>
        item.answer &&
        typeof item.answer === "string" &&
        item.answer.trim() !== ""
    );

    if (filteredQA.length === 0) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "No valid answers provided",
        }),
      };
    }

    // Buat transcript
    const transcript = filteredQA
      .map(
        (item) => `
Question: ${item.question || ""}
Answer: ${item.answer}
`
      )
      .join("\n");

    const safeTranscript = transcript.slice(0, 2000);

    const prompt = `
You are an English speaking tutor.

Here are student responses:

${safeTranscript}

First, correct the student's sentences.
Then give short and helpful feedback.

Return ONLY ONE valid JSON object using exactly this format:

{
  "corrected": "all corrected sentences combined",
  "feedback": "clear and short feedback"
}

IMPORTANT:
- Return ONLY ONE JSON object.
- Do NOT return markdown.
- Do NOT use code fences.
- Do NOT return multiple JSON objects.
- Combine all corrections into one "corrected" field.
- Combine all feedback into one "feedback" field.
`;

    // Pastikan API key tersedia
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing");

      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "OPENAI_API_KEY is not configured",
        }),
      };
    }

    // Request ke Dinoiki AI
    const response = await axios.post(
      "https://ai.dinoiki.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 200,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const aiContent =
      response.data?.choices?.[0]?.message?.content?.trim();

    console.log("AI CONTENT:", aiContent);

    if (!aiContent) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "AI returned empty response",
        }),
      };
    }

    // Bersihkan kemungkinan markdown dari response AI
    const cleanedContent = aiContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let result;

    try {
      result = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError);
      console.error("RAW AI CONTENT:", aiContent);

      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Invalid JSON response from AI",
          raw: aiContent,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        corrected: result.corrected || "",
        feedback: result.feedback || "",
      }),
    };
  } catch (error) {
    console.error("PRACTICE FEEDBACK ERROR:", error);

    console.error(
      "ERROR RESPONSE:",
      error.response?.data
    );

    return {
      statusCode: error.response?.status || 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error:
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          error.message ||
          "Internal Server Error",
      }),
    };
  }
};