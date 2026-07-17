// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk"; // ✅ using Groq instead of OpenAI

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // frontend URL
app.use(express.json());

// ✅ Initialize Groq client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ========================
// 🔹 Single Question Route
// ========================
app.post("/generateQuestion", async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ error: "Missing resume data." });
    }

    // 🔹 Detect type of resume (PDF text OR structured form)
    let resumeSummary = "";
    if (resumeData.text) {
      resumeSummary = resumeData.text.slice(0, 2000); // avoid huge prompts
    } else {
      // Build structured summary string
      resumeSummary = `
        Name: ${resumeData.name || "N/A"}
        Email: ${resumeData.email || "N/A"}
        Phone: ${resumeData.phone || "N/A"}
        Skills: ${resumeData.skills || "N/A"}
        Experience: ${resumeData.experience || "N/A"}
        Education: ${resumeData.education || "N/A"}
      `;
    }

    // 🔹 Ask Groq to generate a question
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ current supported model
      messages: [
        {
          role: "system",
          content:
            "You are an interview question generator. Only return the question, no extra text.",
        },
        {
          role: "user",
          content: `Generate a clear, technical interview question based on this resume:\n\n${resumeSummary}`,
        },
      ],
      temperature: 0.7,
    });

    const question = completion.choices[0]?.message?.content?.trim();

    if (!question) {
      return res.status(500).json({ error: "Groq returned no question." });
    }

    res.json({ question });
  } catch (err) {
    console.error("generateQuestion error:", err);
    res.status(500).json({ error: "Failed to generate question." });
  }
});

// ========================
// 🔹 Multiple Questions Route

// ========================
// 🔹 Multiple Questions Route (Fixed)
// ========================
app.post("/generateQuestions", async (req, res) => {
  try {
    const { resumeData, count = 5 } = req.body;

    if (!resumeData) {
      return res.status(400).json({ error: "Missing resume data." });
    }

    // 🔹 Build resume summary (same as single-question route)
    let resumeSummary = "";
    if (resumeData.text) {
      resumeSummary = resumeData.text.slice(0, 2000);
    } else {
      resumeSummary = `
        Name: ${resumeData.name || "N/A"}
        Email: ${resumeData.email || "N/A"}
        Phone: ${resumeData.phone || "N/A"}
        Skills: ${resumeData.skills || "N/A"}
        Experience: ${resumeData.experience || "N/A"}
        Education: ${resumeData.education || "N/A"}
      `;
    }

    // 🔹 Ask Groq for multiple questions
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant", // use same model as single question (stable)
      messages: [
        {
          role: "system",
          content:
            "You are an interview question generator. Only return plain questions, no extra text.",
        },
        {
          role: "user",
          content: `Generate ${count} clear, technical interview questions based on this resume:\n\n${resumeSummary}\n\nReturn them as a JSON array of strings.`,
        },
      ],
      temperature: 0.7,
    });

    let rawOutput = completion.choices[0]?.message?.content?.trim();
    console.log("🔹 Raw Groq Output:", rawOutput);

    let questions = [];
    try {
      questions = JSON.parse(rawOutput);
    } catch (e) {
      // fallback: split by line breaks if not JSON
      questions = rawOutput.split("\n").filter((q) => q.trim().length > 0);
    }

    if (!questions || !Array.isArray(questions)) {
      return res
        .status(500)
        .json({ error: "Groq did not return valid questions." });
    }

    res.json({ questions });
  } catch (err) {
    console.error("generateQuestions error:", err);
    res.status(500).json({ error: "Failed to generate questions." });
  }
});



app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
