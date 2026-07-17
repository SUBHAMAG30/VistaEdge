import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export default function Interviews() {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Multiple questions state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [error, setError] = useState("");

  // 🎤 Mic state
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // 🔹 Fetch resume from Firestore
  useEffect(() => {
    const fetchResume = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "resumes", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setResumeData(snap.data());
          setError("");
        } else {
          setError("No resume found. Please upload or build one first.");
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError("Failed to load resume.");
      }
    };
    fetchResume();
  }, [user]);

  // 🔹 Handle Resume Upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF resumes are supported.");
      return;
    }

    try {
      const text = await file.text(); // ⚡ Simple extract (optional: use pdf.js later)
      const resumeObj = { text };
      setResumeData(resumeObj);

      // ✅ Save uploaded resume to Firestore
      if (user) {
        await setDoc(doc(db, "resumes", user.uid), resumeObj);
      }

      setError("");
    } catch (err) {
      console.error("Resume upload failed:", err);
      setError("Failed to process resume.");
    }
  };

  // 🎤 Setup Web Speech API
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer(transcript); // live transcription into the textarea
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  // 🎤 Start/stop recording
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // 🔹 Start interview
  const handleStartInterview = async () => {
    if (!resumeData) {
      setError("Please upload or build a resume first.");
      return;
    }

    setLoading(true);
    try {
      const payload = resumeData.text
        ? { text: resumeData.text }
        : { ...resumeData };

      const res = await fetch("http://localhost:5000/generateQuestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: payload, count: 5 }),
      });

      const data = await res.json();

      if (res.ok) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setAnswer("");
        setSubmittedAnswers({});
        setError("");
      } else {
        setError(data.error || "Failed to generate questions.");
      }
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("Failed to generate questions.");
    }
    setLoading(false);
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    setSubmittedAnswers((prev) => ({
      ...prev,
      [currentIndex]: answer,
    }));
    setAnswer("");
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswer(submittedAnswers[currentIndex + 1] || "");
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="text-white max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mock Interview</h1>

      {/* 🔹 Upload Resume */}
      <div className="p-4 mb-6 bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Upload Resume</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleResumeUpload}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white hover:file:bg-blue-500"
        />
        <p className="mt-2 text-sm text-gray-400">
          Or continue with your saved resume from Resume Builder.
        </p>
      </div>

      {!questions.length && (
        <Button
          onClick={handleStartInterview}
          disabled={loading}
          className="px-6 py-2"
        >
          {loading ? "Generating..." : "Start Interview"}
        </Button>
      )}

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {currentQuestion && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Question {currentIndex + 1}</h2>
            <p className="text-sm text-gray-400">
              {currentIndex + 1} of {questions.length}
            </p>
          </div>
          <p className="mt-2">{currentQuestion}</p>

          {/* Answer Form */}
          <form onSubmit={handleSubmitAnswer} className="mt-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white resize-none"
              rows={5}
              placeholder="Type or use mic to answer..."
              required
            />

            <div className="flex gap-3 mt-3 items-center">
              <Button type="submit" className="px-6 py-2">
                Save Answer
              </Button>
              {currentIndex < questions.length - 1 && (
                <Button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-2"
                >
                  Next Question
                </Button>
              )}

              {/* 🎤 Mic button */}
              <Button
                type="button"
                onClick={toggleRecording}
                className={`px-4 py-2 ${isRecording ? "bg-red-600" : ""}`}
              >
                {isRecording ? "Stop Recording" : "🎤 Start Recording"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Show Submitted Answers */}
      {Object.keys(submittedAnswers).length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Your Answers</h2>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={idx} className="p-3 bg-gray-800 rounded-lg">
                <p className="font-medium">Q{idx + 1}: {q}</p>
                <p className="mt-2 text-gray-300">
                  {submittedAnswers[idx] || "Not answered yet"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
