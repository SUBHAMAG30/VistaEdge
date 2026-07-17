import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEYs
});

// resumeData = { skills, projects, experience, education }
export async function generateInterviewQuestion(resumeData) {
  try {
    const resumeSummary = `
      Skills: ${resumeData.skills?.join(", ") || "N/A"}
      Experience: ${resumeData.experience
        ?.map((exp) => `${exp.role} at ${exp.company}`)
        .join("; ") || "N/A"}
      Projects: ${resumeData.projects?.map((proj) => proj.name).join(", ") || "N/A"}
      Education: ${resumeData.education || "N/A"}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a technical interviewer preparing one concise question based on the candidate’s resume.",
        },
        {
          role: "user",
          content: `Here is the candidate's resume:\n${resumeSummary}\n\nGenerate a single relevant interview question.`,
        },
      ],
      max_tokens: 150,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI Error:", error);

    // Handle rate limit / quota exceeded
    if (error.status === 429) {
      return "⚠️ You have exceeded your OpenAI quota or hit a rate limit. Please check your plan and billing details.";
    }

    // Handle invalid key
    if (error.status === 401) {
      return "❌ Invalid API key. Please update your OpenAI key.";
    }

    // Fallback for other errors
    return "❌ Failed to generate a question. Please try again later.";
  }
}
