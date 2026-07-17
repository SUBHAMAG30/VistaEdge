// src/api/generateQuestion.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ⚠️ Keep your key in .env only
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resumeData } = req.body;

  if (!resumeData) {
    return res.status(400).json({ error: "Resume data is required" });
  }

  const resumeSummary = `
    Skills: ${resumeData.skills?.join(", ") || "N/A"}
    Experience: ${resumeData.experience?.map(e => `${e.role} at ${e.company}`).join("; ") || "N/A"}
    Projects: ${resumeData.projects?.map(p => p.name).join(", ") || "N/A"}
    Education: ${resumeData.education || "N/A"}
  `;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a technical interviewer preparing one concise question."
        },
        {
          role: "user",
          content: `Here is the candidate's resume:\n${resumeSummary}\nGenerate a single interview question.`
        }
      ],
      max_tokens: 150
    });

    res.status(200).json({ question: response.choices[0].message.content.trim() });
  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ error: "Failed to generate question. Try again later." });
  }
}
