import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { FileText, Save, Download, Loader2 } from "lucide-react";

// IMPORTANT: Adjust this import path to point to your actual firebase config file
import { db } from "@/firebase/config"; 
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    portfolio: "",
    education: "",
    skills: "",
    experience: "",
    projects: "",
  });

  // Optional: Auto-fill the form if the user already saved a resume previously
  useEffect(() => {
    const fetchExistingResume = async () => {
      if (user?.uid) {
        const docRef = doc(db, "resumes", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      }
    };
    fetchExistingResume();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveToFirestore = async () => {
    if (!user) {
      setSaveStatus("Error: You must be logged in to save.");
      return;
    }

    setIsSaving(true);
    setSaveStatus("");

    try {
      // Saves the form data to a "resumes" collection, using the user's ID as the document name
      await setDoc(doc(db, "resumes", user.uid), formData);
      setSaveStatus("Resume saved successfully!");
      
      // Short delay so they see the success message before navigating
      setTimeout(() => navigate("/dashboard/interviews"), 1500);
    } catch (error) {
      console.error("Error saving resume:", error);
      setSaveStatus("Failed to save resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text(formData.name || "Your Name", 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);

    // Contact info layout
    doc.text(`Email: ${formData.email}`, 20, 30);
    doc.text(`Phone: ${formData.phone}`, 20, 36);
    if (formData.address) doc.text(`Address: ${formData.address}`, 20, 42);
    if (formData.linkedin) doc.text(`LinkedIn: ${formData.linkedin}`, 120, 30);
    if (formData.github) doc.text(`GitHub: ${formData.github}`, 120, 36);
    if (formData.portfolio) doc.text(`Portfolio: ${formData.portfolio}`, 120, 42);

    let y = 55;

    const addSection = (title, content) => {
      if (content) {
        doc.setFontSize(14);
        doc.setTextColor(40);
        // Section Title
        doc.text(title, 20, y);
        // Underline
        doc.setLineWidth(0.5);
        doc.line(20, y + 2, 190, y + 2);
        y += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(80);
        
        // Split text to handle multi-line textareas properly
        const splitText = doc.splitTextToSize(content, 170);
        doc.text(splitText, 20, y);
        
        // Advance Y based on how many lines were printed
        y += (splitText.length * 5) + 10; 
      }
    };

    addSection("Education", formData.education);
    addSection("Skills", formData.skills);
    addSection("Experience", formData.experience);
    addSection("Projects", formData.projects);

    doc.save(`${formData.name.replace(/\s+/g, '_')}_Resume.pdf`);
  };

  // Reusable input class for the new light-theme UI
  const inputClass = "w-full p-3 rounded-2xl border border-gray-200 bg-transparent focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-gray-700 placeholder-gray-400";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans text-gray-800">
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in your details to generate an ATS-friendly PDF and power your AI interviews.</p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className={inputClass} />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className={inputClass} />
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className={inputClass} />
          <input type="text" name="address" placeholder="City, State" value={formData.address} onChange={handleChange} className={inputClass} />
        </div>

        <h2 className="text-xl font-bold mb-4 border-b pb-2">Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input type="text" name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} className={inputClass} />
          <input type="text" name="github" placeholder="GitHub URL" value={formData.github} onChange={handleChange} className={inputClass} />
          <input type="text" name="portfolio" placeholder="Portfolio/Website" value={formData.portfolio} onChange={handleChange} className={inputClass} />
        </div>

        <h2 className="text-xl font-bold mb-4 border-b pb-2">Professional Details</h2>
        <div className="space-y-4 mb-8">
          <textarea name="education" placeholder="Education (e.g., B.Tech in Computer Science...)" rows="3" value={formData.education} onChange={handleChange} className={inputClass} />
          <textarea name="skills" placeholder="Skills (e.g., React, Node.js, Java, Python...)" rows="3" value={formData.skills} onChange={handleChange} className={inputClass} />
          <textarea name="experience" placeholder="Work Experience" rows="4" value={formData.experience} onChange={handleChange} className={inputClass} />
          <textarea name="projects" placeholder="Projects (e.g., VistaEdge - AI Interview SaaS...)" rows="4" value={formData.projects} onChange={handleChange} className={inputClass} />
        </div>

        {/* Status Message */}
        {saveStatus && (
          <div className={`p-4 rounded-xl mb-6 text-center text-sm font-medium ${saveStatus.includes("Error") || saveStatus.includes("Failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
            {saveStatus}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t">
          <button 
            onClick={generatePDF} 
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all"
          >
            <Download size={20} />
            Download PDF
          </button>
          
          <button 
            onClick={handleSaveToFirestore}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold hover:opacity-90 transition-all shadow-md"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? "Saving..." : "Save & Start Interview"}
          </button>
        </div>
      </div>
    </div>
  );
}