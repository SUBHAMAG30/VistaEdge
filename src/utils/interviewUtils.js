// src/utils/interviewUtils.js

/**
 * Helper to call the Express backend for generating questions
 */
export async function generateInterviewQuestion(resumeData) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generateQuestion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeData }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to generate question");
    return data.question;
  } catch (err) {
    console.error("interviewUtils error:", err);
    throw err;
  }
}


// New evaluation helper for evalutaing the answer of the candidate
export async function evaluateInterviewAnswer(question, answer) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/evaluateAnswer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to evaluate answer");
    return data;
  } catch (err) {
    console.error("evaluateInterviewAnswer error:", err);
    throw err;
  }
}