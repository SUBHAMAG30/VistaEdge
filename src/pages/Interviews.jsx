import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Mic, MicOff, Play, Save, UploadCloud, FileText, CheckCircle2 } from "lucide-react";

export default function Interviews() {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [error, setError] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

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

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF resumes are supported.");
      return;
    }
    try {
      const text = await file.text(); 
      const resumeObj = { text };
      setResumeData(resumeObj);
      if (user) {
        await setDoc(doc(db, "resumes", user.uid), resumeObj);
      }
      setError("");
    } catch (err) {
      setError("Failed to process resume.");
    }
  };

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer(transcript);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

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

  const handleStartInterview = async () => {
    if (!resumeData) {
      setError("Please upload or build a resume first.");
      return;
    }
    setLoading(true);
    try {
      const payload = resumeData.text ? { text: resumeData.text } : { ...resumeData };
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generateQuestions`, {
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
      setError("Failed to connect to the AI engine. Is the backend running?");
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
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans text-gray-800">
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
          <Play size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Mock Interview</h1>
          <p className="text-gray-500 text-sm mt-1">Answer dynamically generated questions tailored to your resume.</p>
        </div>
      </div>

      {!questions.length && (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div>
              <h2 className="text-xl font-bold">Resume Context</h2>
              <p className="text-sm text-gray-500">We'll use this data to generate your questions.</p>
            </div>
            {resumeData && <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium"><CheckCircle2 size={16}/> Ready</span>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
              <UploadCloud className="text-gray-400 mb-2" size={32} />
              <span className="text-sm font-medium text-gray-600">Upload PDF Resume</span>
              <input type="file" accept="application/pdf" onChange={handleResumeUpload} className="hidden" />
            </label>
            
            <div className="flex-1 flex flex-col justify-center p-6 border-2 border-gray-100 rounded-2xl bg-gray-50">
              <FileText className="text-purple-500 mb-2" size={32} />
              <span className="text-sm font-medium text-gray-600">Using Built Resume</span>
              <span className="text-xs text-gray-400">Pulled directly from Firestore</span>
            </div>
          </div>

          <button
            onClick={handleStartInterview}
            disabled={loading || !resumeData}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? "Initializing AI Engine..." : "Start Interview"}
          </button>
          
          {error && <p className="text-red-500 text-sm mt-4 text-center bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
        </div>
      )}

      {currentQuestion && (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Question {currentIndex + 1}
            </h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-bold rounded-full">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          
          <p className="text-lg text-gray-700 font-medium leading-relaxed mb-6">
            "{currentQuestion}"
          </p>

          <form onSubmit={handleSubmitAnswer}>
            <div className="relative">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-transparent focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-gray-700 placeholder-gray-400 resize-none min-h-[150px]"
                placeholder="Type your answer or click the microphone to speak..."
                required
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "hidden"}`}></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-bold transition-all ${
                  isRecording 
                    ? "border-red-200 bg-red-50 text-red-600" 
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                {isRecording ? "Stop Recording" : "Use Microphone"}
              </button>

              <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all">
                <Save size={20} /> Save Answer
              </button>

              {currentIndex < questions.length - 1 && (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Next Question
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {Object.keys(submittedAnswers).length > 0 && (
        <div className="mt-8 bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <h2 className="text-xl font-bold mb-6 border-b pb-2">Interview Transcript</h2>
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="font-bold text-gray-800 mb-2">Q{idx + 1}: {q}</p>
                <p className="text-gray-600 leading-relaxed">
                  {submittedAnswers[idx] || <span className="text-gray-400 italic">Not answered yet</span>}
                </p>
              
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}