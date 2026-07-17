import { useState } from "react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

export default function ResumeBuilder() {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(formData.name || "Your Name", 20, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);

    // Contact info
    doc.text(`Email: ${formData.email}`, 20, 30);
    doc.text(`Phone: ${formData.phone}`, 20, 36);
    if (formData.address) doc.text(`Address: ${formData.address}`, 20, 42);
    if (formData.linkedin) doc.text(`LinkedIn: ${formData.linkedin}`, 20, 48);
    if (formData.github) doc.text(`GitHub: ${formData.github}`, 20, 54);
    if (formData.portfolio) doc.text(`Portfolio: ${formData.portfolio}`, 20, 60);

    let y = 70;

    const addSection = (title, content) => {
      if (content) {
        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text(title, 20, y);
        y += 6;
        doc.setFontSize(11);
        doc.setTextColor(80);
        doc.text(content, 20, y, { maxWidth: 170 });
        y += 10;
      }
    };

    addSection("Education", formData.education);
    addSection("Skills", formData.skills);
    addSection("Experience", formData.experience);
    addSection("Projects", formData.projects);

    doc.save("resume.pdf");
  };

  return (
    <div className="text-white max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Professional Resume Builder</h1>

      {/* Contact Info */}
      <input type="text" name="name" placeholder="Full Name"
        value={formData.name} onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700" />

      <input type="email" name="email" placeholder="Email"
        value={formData.email} onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700" />

      <input type="text" name="phone" placeholder="Phone"
        value={formData.phone} onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700" />

      <input type="text" name="address" placeholder="Address"
        value={formData.address} onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700" />

      <input type="text" name="linkedin" placeholder="LinkedIn URL"
        value={formData.linkedin} onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700" />

      <input type="text" name="github" placeholder="GitHub URL"
        value={formData.github} onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700" />

      <input type="text" name="portfolio" placeholder="Portfolio/Website"
        value={formData.portfolio} onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700" />

      {/* Resume Sections */}
      <textarea name="education" placeholder="Education"
        value={formData.education} onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700" />

      <textarea name="skills" placeholder="Skills"
        value={formData.skills} onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700" />

      <textarea name="experience" placeholder="Experience"
        value={formData.experience} onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700" />

      <textarea name="projects" placeholder="Projects"
        value={formData.projects} onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-gray-700" />

      <div className="flex gap-4 mt-6">
        <Button onClick={generatePDF} className="px-6 py-2">Download PDF</Button>
        <Button onClick={() => navigate("/dashboard/interviews")} className="px-6 py-2">
          Save & Start Interview
        </Button>
      </div>
    </div>
  );
}
