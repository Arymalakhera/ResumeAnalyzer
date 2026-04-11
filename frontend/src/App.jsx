import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Loader2, FileText, CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Send file to our backend
  const handleUpload = async () => {
    if (!file && !useMockData) return alert("Please select a file first!");

    setLoading(true);

    if (useMockData) {
      // Simulate API delay
      setTimeout(() => {
        setResult({
          score: 8.5,
          strengths: [
            "Strong academic background with relevant degrees.",
            "Clear progression in career roles and responsibilities.",
            "Excellent use of action verbs in bullet points."
          ],
          weaknesses: [
            "Lacks quantifiable achievements in recent roles.",
            "Formatting is slightly inconsistent in the education section.",
            "Missing a dedicated skills summary."
          ],
          tips: [
            "Add specific metrics to quantify your impact (e.g., 'Increased sales by 20%').",
            "Ensure consistent font sizes and spacing throughout the document.",
            "Include a top skills section to quickly highlight your core competencies to ATS systems."
          ]
        });
        setLoading(false);
      }, 1500);
      return;
    }

    const formData = new FormData();
    formData.append('resume', file); 

    try {
      const response = await axios.post('http://localhost:5000/api/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setResult(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to analyze resume. Check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-16 px-4 relative overflow-hidden font-sans">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[128px] animate-blob z-0 pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[128px] animate-blob animation-delay-2000 z-0 pointer-events-none" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 z-10"
      >
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-slate-900 border border-slate-800 text-slate-300">
          <Sparkles className="w-4 h-4 mr-2 text-emerald-400" />
          Next-Gen Resume Analysis
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-6 tracking-tight">
          AI Resume Analyzer
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Upload your PDF or DOCX resume and receive an instant, intelligent breakdown of your strengths, weaknesses, and actionable tips.
        </p>
      </motion.div>

      {/* Upload & Mock Toggle Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-xl z-10 mb-8"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center transition-all hover:border-emerald-500/30 group">
          
          <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500 shadow-inner">
            {file ? <FileText className="w-10 h-10 text-emerald-400" /> : <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-emerald-400 transition-colors" />}
          </div>

          <label className="cursor-pointer bg-slate-950 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-medium transition-all mb-6 border border-slate-800 hover:border-emerald-500/50 flex flex-col items-center w-full text-center">
            <span className="text-emerald-400 mb-1">{file ? "File Selected" : "Click to upload"}</span>
            <span className="text-slate-400 text-sm">{file ? file.name : "or drag and drop PDF/DOCX here"}</span>
            <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileChange} />
          </label>

          <div className="flex items-center gap-3 w-full mb-6">
            <div className="h-px bg-slate-800 flex-1"></div>
            <label className="flex items-center cursor-pointer text-sm text-slate-400 hover:text-slate-300 transition-colors">
              <input 
                type="checkbox" 
                checked={useMockData} 
                onChange={() => setUseMockData(!useMockData)}
                className="mr-2 accent-emerald-500 w-4 h-4 rounded bg-slate-950 border-slate-800"
              />
              Use Mock Data (bypass API limits)
            </label>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          <button 
            onClick={handleUpload}
            disabled={(!file && !useMockData) || loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
               <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Processing with AI...</>
            ) : (
              "Analyze My Resume"
            )}
          </button>
        </div>
      </motion.div>

      {/* Results Dashboard */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="w-full max-w-5xl z-10 flex flex-col gap-6"
          >
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Card */}
              <div className="md:col-span-1 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <TrendingUp className="w-32 h-32 text-emerald-400" />
                </div>
                <h3 className="text-slate-400 font-medium mb-6 uppercase tracking-wider text-sm relative z-10">Overall Score</h3>
                <div className="relative inline-flex items-center justify-center relative z-10">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                    <circle 
                      cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={440} strokeDashoffset={440 - (440 * (result.score || 0)) / 10}
                      strokeLinecap="round"
                      className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] transition-all duration-1000 ease-out" 
                    />
                  </svg>
                  <span className="absolute text-5xl font-black text-white">{result.score || 0}<span className="text-2xl text-slate-500">/10</span></span>
                </div>
              </div>

              {/* Quick Summary Card */}
              <div className="md:col-span-2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Sparkles className="w-32 h-32 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">AI Executive Summary</h3>
                <p className="text-slate-300 leading-relaxed relative z-10 text-lg">
                  {result.score >= 8 ? "Excellent resume! It's highly competitive and well-structured. Just a few minor tweaks away from perfection." : 
                   result.score >= 6 ? "Good foundation, but there is significant room for improvement to make it stand out to recruiters." : 
                   "This resume requires a major overhaul. Focus on the core structural weaknesses identified below."}
                </p>
              </div>
            </div>

            {/* Detailed Feedback Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Strengths */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="bg-emerald-950/20 border border-emerald-900/50 rounded-3xl p-6 flex flex-col h-full"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-emerald-500/20 rounded-xl mr-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-50">Strengths</h3>
                </div>
                <ul className="space-y-4 flex-1">
                  {result.strengths && result.strengths.map((item, i) => (
                    <li key={i} className="flex items-start text-emerald-200/80">
                      <span className="mr-3 text-emerald-400 mt-1">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Weaknesses */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-rose-950/20 border border-rose-900/50 rounded-3xl p-6 flex flex-col h-full"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-rose-500/20 rounded-xl mr-4">
                    <AlertTriangle className="w-6 h-6 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold text-rose-50">Areas to Improve</h3>
                </div>
                <ul className="space-y-4 flex-1">
                  {result.weaknesses && result.weaknesses.map((item, i) => (
                    <li key={i} className="flex items-start text-rose-200/80">
                      <span className="mr-3 text-rose-400 mt-1">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Tips */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                className="bg-cyan-950/20 border border-cyan-900/50 rounded-3xl p-6 flex flex-col h-full"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-cyan-500/20 rounded-xl mr-4">
                    <Lightbulb className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-cyan-50">Actionable Tips</h3>
                </div>
                <ul className="space-y-4 flex-1">
                  {result.tips && result.tips.map((item, i) => (
                    <li key={i} className="flex items-start text-cyan-200/80">
                      <span className="mr-3 text-cyan-400 mt-1">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;