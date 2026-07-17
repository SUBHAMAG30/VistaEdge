import { useState, useRef } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { db } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

// ✅ Correct pdfjs imports for Vite
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

GlobalWorkerOptions.workerSrc = pdfjsWorker;


export default function Resume() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const startTime = useRef(null);
  const fileInputRef = useRef(null);

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 🔹 Manual resume form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    skills: "",
    experience: "",
    projects: "",
  });

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveFormResume = async () => {
    if (!user) return alert("Please log in first!");
    try {
      await setDoc(doc(db, "resumes", user.uid), {
        ...formData,
        createdAt: new Date(),
      });
      setSuccess(true);
      navigate("/dashboard/interviews");
    } catch (err) {
      console.error("Error saving form resume:", err);
    }
  };

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   setUploading(true);
  //   setSuccess(false);
  //   setProgress(0);
  //   setTimeLeft(null);
  //   startTime.current = Date.now();

  //   const reader = new FileReader();
  //   reader.onload = async function () {
  //     try {
  //       const typedarray = new Uint8Array(this.result);
  //       const pdf = await pdfjsLib.getDocument(typedarray).promise;

  //       let textContent = "";

  //       for (let i = 1; i <= pdf.numPages; i++) {
  //         const page = await pdf.getPage(i);
  //         const text = await page.getTextContent();
  //         text.items.forEach((item) => {
  //           textContent += item.str + " ";
  //         });

  //         // Update progress
  //         setProgress(Math.round((i / pdf.numPages) * 90));

  //         const elapsed = (Date.now() - startTime.current) / 1000;
  //         const estimatedTotal = (elapsed / i) * pdf.numPages;
  //         setTimeLeft(Math.max(1, Math.round(estimatedTotal - elapsed)));
  //       }

  //       // Save to Firestore
  //       await setDoc(doc(db, "resumes", user.uid), {
  //         text: textContent,
  //         uploadedAt: new Date(),
  //       });

  //       setProgress(100);
  //       setUploading(false);
  //       setSuccess(true);

  //       // Auto navigate to interview
  //       navigate("/interviews");
  //     } catch (error) {
  //       console.error("Error during upload:", error);
  //       setUploading(false);
  //     }
  //   };
  //   reader.readAsArrayBuffer(file);
  // };

  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!user) {
    alert("Please log in first!");
    return;
  }

  setUploading(true);
  setSuccess(false);
  setProgress(0);
  setTimeLeft(null);
  startTime.current = Date.now();

  try {
    // 1️⃣ Upload the file to Firebase Storage
    const storage = getStorage();
    const storageRef = ref(storage, `resumes/${user.uid}/${file.name}`);

    await uploadBytes(storageRef, file);

    // 2️⃣ Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // 3️⃣ Store URL and metadata in Firestore
    await setDoc(doc(db, "resumes", user.uid), {
      resumeURL: downloadURL,
      fileName: file.name,
      uploadedAt: new Date(),
    });

    // 4️⃣ Progress bar done
    setProgress(100);
    setUploading(false);
    setSuccess(true);

    // ✅ Navigate to Interviews page
    navigate("/dashboard/interviews");
  } catch (error) {
    console.error("Error uploading resume:", error);
    alert("Upload failed: " + error.message);
    setUploading(false);
  }
};

  return (
    <div className="text-white max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Resume Section</h1>

      {/* ---- Option 1: Upload PDF ---- */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Upload Resume</h2>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Visible Button */}
        <Button variant="primary" onClick={triggerFileSelect}>
          Choose File
        </Button>

        {uploading && (
          <div className="flex flex-col items-center gap-3 mt-4">
            <div className="w-32 h-32">
              <CircularProgressbar
                value={progress}
                text={`${progress}%`}
                styles={buildStyles({
                  textColor: "#fff",
                  pathColor: "#22c55e",
                  trailColor: "#374151",
                })}
              />
            </div>
            {timeLeft !== null && timeLeft > 0 && (
              <p className="text-gray-400">⏳ Estimated time left: {timeLeft}s</p>
            )}
          </div>
        )}
      </div>


      {/* ---- Option 2: Build Resume ---- */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Build Resume</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleFormChange}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleFormChange}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleFormChange}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />

        <textarea
          name="education"
          placeholder="Education"
          value={formData.education}
          onChange={handleFormChange}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />
        <textarea
          name="skills"
          placeholder="Skills"
          value={formData.skills}
          onChange={handleFormChange}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />
        <textarea
          name="experience"
          placeholder="Experience"
          value={formData.experience}
          onChange={handleFormChange}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />
        <textarea
          name="projects"
          placeholder="Projects"
          value={formData.projects}
          onChange={handleFormChange}
          className="w-full p-2 mb-3 rounded bg-gray-700"
        />

        <Button onClick={saveFormResume} className="mt-4 px-6 py-2">
          Save & Start Interview
        </Button>
      </div>

      {success && (
        <p className="text-green-400 mt-4">
          ✅ Resume saved successfully! Redirecting...
        </p>
      )}
    </div>
  );
}
