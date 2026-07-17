import { useState } from "react"
import { generateInterviewQuestion } from "@/api/openai"
import { db } from "@/firebase/config"
import { doc, getDoc } from "firebase/firestore"
import { useAuth } from "@/auth/AuthProvider"

export default function Interviews() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [submittedAnswer, setSubmittedAnswer] = useState("")
  const [resumeText, setResumeText] = useState("")

  // Fetch resume text from Firestore
  const fetchResumeText = async () => {
    if (!user) return ""
    const snap = await getDoc(doc(db, "resumes", user.uid))
    if (snap.exists()) {
      return snap.data().text
    }
    return ""
  }

  const handleStartInterview = async () => {
    setLoading(true)

    // fetch resume dynamically
    const text = await fetchResumeText()
    if (!text) {
      alert("Please upload your resume first in the Resume section!")
      setLoading(false)
      return
    }

    setResumeText(text)

    // Generate question using resume
    const q = await generateInterviewQuestion(text)
    setQuestion(q)
    setAnswer("")
    setSubmittedAnswer("")
    setLoading(false)
  }

  const handleSubmitAnswer = (e) => {
    e.preventDefault()
    setSubmittedAnswer(answer)
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Mock Interview</h1>

      {/* Start Interview Button */}
      <button
        onClick={handleStartInterview}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
      >
        {loading ? "Generating..." : "Start Interview"}
      </button>

      {/* Show Resume Extract (optional) */}
      {resumeText && (
        <div className="mt-4 text-gray-400 text-sm">
          <p><strong>Using Resume:</strong> {resumeText.slice(0, 120)}...</p>
        </div>
      )}

      {/* Question Display */}
      {question && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">Your Question:</h2>
          <p className="mt-2">{question}</p>

          {/* Answer Form */}
          <form onSubmit={handleSubmitAnswer} className="mt-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white resize-none"
              rows={5}
              placeholder="Type your answer here..."
              required
            />
            <button
              type="submit"
              className="mt-3 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
            >
              Submit Answer
            </button>
          </form>
        </div>
      )}

      {/* Show Submitted Answer */}
      {submittedAnswer && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">Your Answer:</h2>
          <p className="mt-2 whitespace-pre-line">{submittedAnswer}</p>
        </div>
      )}
    </div>
  )
}
