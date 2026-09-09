import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Terminal, Code2, FileText, Cpu, ArrowRight } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider"; // Imported your Auth Provider

export default function Landing() {
  const { user } = useAuth(); // Retrieve the logged-in user state
  const [typedText, setTypedText] = useState("");
  
  // The Java snippet that will be "typed" into the terminal
  const codeSnippet = `class VistaEdge {
    public static void main(String[] args) {
        System.out.println("Initializing AI Interview Engine...");
        
        Candidate Subham = new Candidate();
        Subham.connectLeetCode();
        Subham.generateATSResume();
        
        while (!Subham.isHired()) {
            Subham.practiceDSA();
            Subham.analyzeFeedback();
        }
        
        System.out.println("Offer Accepted. Welcome aboard!");
    }
}`;

  // Typing animation effect
  useEffect(() => {
    let currentLength = 0;
    const typingInterval = setInterval(() => {
      setTypedText(codeSnippet.substring(0, currentLength));
      currentLength++;
      
      if (currentLength > codeSnippet.length) {
        clearInterval(typingInterval);
      }
    }, 25); // Speed of typing in milliseconds

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-20 pb-12 px-4 flex-1">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            🚀 Compile Your Career.
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl">
            🤖 AI-powered mock interviews, live algorithmic practice, and data-driven resume generation. Stop guessing. Start executing.
          </p>
        </div>

        {/* Terminal Window */}
        <div className="w-full max-w-3xl rounded-xl bg-gray-950 border border-gray-800 shadow-2xl shadow-blue-900/20 overflow-hidden mb-12">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="ml-4 flex items-center text-xs text-gray-500 font-mono gap-2">
              <Terminal size={14} /> main.java
            </div>
          </div>
          
          {/* Terminal Body */}
          <div className="p-6 h-64 overflow-y-auto font-mono text-sm md:text-base text-green-400">
            <pre className="whitespace-pre-wrap">{typedText}<span className="animate-pulse">_</span></pre>
          </div>
        </div>

        {/* Conditional Call to Action based on User State */}
        {user ? (
          <Link to="/dashboard" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
            🚀 Launch Dashboard
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        ) : (
          <Link to="/signup" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
            🚀 Execute Startup Sequence
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        )}
      </div>

      {/* Feature Grid (Below the fold) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 pb-20 w-full">
        
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm hover:border-gray-700 transition-colors">
          <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Cpu className="text-purple-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Groq AI Interviews</h3>
          <p className="text-gray-400 text-sm">Experience ultra-low latency conversational AI that adapts to your technical responses in real-time.</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm hover:border-gray-700 transition-colors">
          <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Code2 className="text-blue-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Live DSA Editor</h3>
          <p className="text-gray-400 text-sm">Write, compile, and optimize data structures and algorithms directly in your browser.</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm hover:border-gray-700 transition-colors">
          <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <FileText className="text-green-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">ATS PDF Generation</h3>
          <p className="text-gray-400 text-sm">Transform your profile into a flawlessly formatted, applicant tracking system compliant resume.</p>
        </div>

      </div>
    </div>
  );
}