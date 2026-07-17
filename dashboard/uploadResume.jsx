import { useState } from "react"
import * as pdfjsLib from "pdfjs-dist"
import "pdfjs-dist/build/pdf.worker.entry"
import { db } from "@/firebase/config"
import { doc, setDoc } from "firebase/firestore"
import { useAuth } from "@/auth/AuthProvider"

export default function uploadResume() {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let text = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map((item) => item.str).join(" ")
      text += pageText + "\n"
    }
    return text
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return alert("Please select a file!")
    setLoading(true)

    const text = await extractTextFromPDF(file)
    await setDoc(doc(db, "resumes", user.uid), { text })

    alert("Resume uploaded and saved!")
    setLoading(false)
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Upload Your Resume</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-gray-300"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          {loading ? "Processing..." : "Upload Resume"}
        </button>
      </form>
    </div>
  )
}
