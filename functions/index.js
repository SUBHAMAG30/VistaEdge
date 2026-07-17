const functions = require("firebase-functions");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const corsHandler = cors({ origin: ["http://localhost:5173"] });

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

exports.generateQuestion = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    try {
      const { resumeData } = req.body;
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an interview question generator." },
          {
            role: "user",
            content: `Generate an interview question for this resume: ${JSON.stringify(resumeData)}`
          },
        ],
      });

      res.json({ question: completion.choices[0].message.content });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to generate question." });
    }
  });
});
