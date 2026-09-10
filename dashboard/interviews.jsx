import { useState } from "react"
import { db } from "@/firebase/config"
import { doc, getDoc } from "firebase/firestore"
import { useAuth } from "@/auth/AuthProvider"
import { Play, FileText, Loader2, ArrowLeft, ArrowRight, Save } from "lucide-react"

export default function Interviews() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [resumeText, setResumeText] = useState("")

  // Array of 5 questions
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const [answer, setAnswer] = useState("")
  const [submittedAnswers, setSubmittedAnswers] = useState({})

  const [evaluating, setEvaluating] = useState(false)
  const [evaluations, setEvaluations] = useState({})

  // Fetch resume text from Firestore
  const fetchResumeText = async () => {
    if (!user) return ""
    const snap = await getDoc(doc(db, "resumes", user.uid))
    if (snap.exists()) {
      return snap.data().text || JSON.stringify(snap.data())
    }
    return ""
  }

  const handleStartInterview = async () => {
    setLoading(true)

    const text = await fetchResumeText()
    if (!text) {
      alert("Please save your resume in the Resume Builder first!")
      setLoading(false)
      return
    }

    setResumeText(text)

    try {
      // 🔧 FIX: Directly call your multiple-questions backend route
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generateQuestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: { text }, count: 5 }),
      });

      const data = await res.json();

      if (res.ok && data.questions) {
        setQuestions(data.questions)
        setCurrentIndex(0)
        setAnswer("")
        setSubmittedAnswers({})
        setEvaluations({})
      } else {
        throw new Error("Failed to generate questions")
      }
    } catch (error) {
      console.error("Failed to fetch questions", error)
      alert("Failed to generate questions. Make sure your backend is running.")
    }

    setLoading(false)
  }

  // 🔹 Navigation Functions
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      // Refill the text box with their past answer if they want to edit it
      setAnswer(submittedAnswers[prevIndex] || "");
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setAnswer(submittedAnswers[nextIndex] || "");
    }
  }

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    // 1. Save the raw text immediately
    setSubmittedAnswers((prev) => ({
      ...prev,
      [currentIndex]: answer,
    }));

    setEvaluating(true);

    try {
      // 2. Call backend to grade the answer
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/evaluateAnswer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questions[currentIndex], answer }),
      });
      const evalData = await res.json();

      if (res.ok) {
        setEvaluations((prev) => ({
          ...prev,
          [currentIndex]: evalData,
        }));
      }
    } catch (err) {
      console.error("Evaluation failed:", err);
    } finally {
      setEvaluating(false);

      // 3. AUTO-ADVANCE: If not on the last question, jump to the next one automatically!
      if (currentIndex < questions.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setAnswer(submittedAnswers[nextIndex] || "");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans text-gray-800">

      {/* 🔹 Header Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
          <Play size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mock Interview</h1>
          <p className="text-gray-500 text-sm mt-1">Answer dynamically generated questions tailored to your resume.</p>
        </div>
      </div>

      {/* 🔹 Initialization Card */}
      {questions.length === 0 && (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-6">
          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
            {loading ? "Analyzing Resume & Generating Questions..." : "Start Interview"}
          </button>
        </div>
      )}

      {/* 🔹 Active Question Display */}
      {questions.length > 0 && (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all">

          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-purple-600">Question {currentIndex + 1} of {questions.length}</h2>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className={`h-2 w-8 rounded-full ${i === currentIndex ? "bg-purple-600" : i < currentIndex ? "bg-purple-300" : "bg-gray-200"}`}></div>
              ))}
            </div>
          </div>

          <p className="text-lg text-gray-800 font-medium leading-relaxed mb-6">
            {questions[currentIndex]}
          </p>

          <form onSubmit={handleSubmitAnswer}>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-4 rounded-2xl border border-gray-200 bg-transparent focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-gray-700 placeholder-gray-400 resize-none min-h-[150px]"
              placeholder="Type your answer here..."
              required
            />

            {/* 🔹 Navigation & Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0 || evaluating}
                className="flex-1 flex justify-center items-center gap-2 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                <ArrowLeft size={18} /> Previous
              </button>

              <button
                type="submit"
                disabled={evaluating}
                className="flex-[2] flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-md disabled:opacity-70"
              >
                {evaluating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {evaluating ? "Evaluating..." : currentIndex === questions.length - 1 ? "Submit Final Answer" : "Save & Continue"}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1 || evaluating}
                className="flex-1 flex justify-center items-center gap-2 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 🔹 Interview Transcript & AI Feedback */}
      {Object.keys(submittedAnswers).length > 0 && (
        <div className="mt-8 bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <h2 className="text-xl font-bold mb-6 border-b pb-2">Live AI Feedback</h2>
          <div className="space-y-6">
            {questions.map((q, idx) => {

              if (!submittedAnswers[idx]) return null;
              const evaluation = evaluations[idx];

              return (
                <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-gray-800">Q{idx + 1}: {q}</p>
                    <button
                      onClick={() => {
                        setCurrentIndex(idx);
                        setAnswer(submittedAnswers[idx]);
                      }}
                      className="text-xs font-bold text-purple-600 hover:underline"
                    >
                      Edit Answer
                    </button>
                  </div>

                  <div className="text-gray-600 mb-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-2">Your Answer</span>
                    {submittedAnswers[idx]}
                  </div>

                  {evaluation ? (
                    <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 space-y-3">
                      <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-2">
                          ✨ AI Evaluation
                        </span>
                        <span className={`px-3 py-1 text-white font-bold text-sm rounded-full shadow-sm ${evaluation.score >= 8 ? "bg-green-500" :
                            evaluation.score >= 5 ? "bg-yellow-500" : "bg-red-500"
                          }`}>
                          Score: {evaluation.score}/10
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        <strong className="text-purple-900">Feedback:</strong> {evaluation.feedback}
                      </p>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        <strong className="text-purple-900">Pro-Tip:</strong> {evaluation.improvement}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-purple-600 font-medium p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <Loader2 className="animate-spin" size={20} />
                      Analyzing response with Groq AI...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}