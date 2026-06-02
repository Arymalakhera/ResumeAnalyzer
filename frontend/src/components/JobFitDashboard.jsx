import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, AlertTriangle, MessageSquare, Copy, Check, Eye } from 'lucide-react';

export default function JobFitDashboard({ result }) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "comparer"
  const [copiedSection, setCopiedSection] = useState(null);

  const handleCopy = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getMatchColor = (score) => {
    if (score >= 80) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 60) return "text-amber-500 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-400";
  };

  const getMatchBg = (score) => {
    if (score >= 80) return "bg-emerald-100 dark:bg-emerald-900/30";
    if (score >= 60) return "bg-amber-100 dark:bg-amber-900/30";
    return "bg-rose-100 dark:bg-rose-900/30";
  };

  return (
    <motion.div
      key="job-fit-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col gap-6 py-6"
    >
      {/* Personalized Profile Header */}
      <motion.div 
        initial={{ filter: "blur(10px)", opacity: 0, y: -10 }}
        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between"
      >
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-2xl font-serif font-bold shadow-lg">
            {(result.personal_info?.name && result.personal_info.name !== "User" && result.personal_info.name !== "Not found") ? result.personal_info.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="text-2xl font-serif text-slate-900 dark:text-white font-semibold">
              {(result.personal_info?.name && result.personal_info.name !== "Not found") ? result.personal_info.name : "Your Match Report"}
            </h2>
            <div className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex flex-wrap gap-x-4 justify-center md:justify-start">
              <span>{result.personal_info?.current_role || "Professional"}</span>
              <span className="hidden md:inline">•</span>
              <span>{result.personal_info?.email !== "Not found" ? result.personal_info?.email : ""}</span>
            </div>
          </div>
        </div>

        {/* Big Match Score */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase mb-1">Role Match</div>
            <div className={`text-4xl font-serif font-bold ${getMatchColor(result.match_percentage)}`}>
              {result.match_percentage}%
            </div>
          </div>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20 ${getMatchBg(result.match_percentage)}`}>
            <Target className={`w-8 h-8 ${getMatchColor(result.match_percentage)}`} />
          </div>
        </div>
      </motion.div>

      {/* Analysis Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-8 shadow-sm"
      >
        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed max-w-4xl font-light">
          {result.match_analysis}
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center w-full my-2">
        <div className="bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 flex gap-1 shadow-inner backdrop-blur-sm">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${activeTab === "overview" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
          >
            <Target className="w-4 h-4" /> Requirements Gap
          </button>
          <button 
            onClick={() => setActiveTab("comparer")}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${activeTab === "comparer" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
          >
            <Eye className="w-4 h-4" /> Tailored Builder
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div 
            key="tab-overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Split Requirements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Requirements */}
              <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-serif text-lg text-emerald-950 dark:text-emerald-50 font-medium">Matched Requirements</h3>
                </div>
                <ul className="space-y-4">
                  {result.matched_requirements?.length > 0 ? result.matched_requirements.map((req, i) => (
                    <li key={i} className="flex gap-3 text-emerald-800 dark:text-emerald-200 text-sm font-light leading-relaxed">
                      <span className="text-emerald-400 dark:text-emerald-500 mt-1 flex-shrink-0">•</span>
                      {req}
                    </li>
                  )) : (
                    <li className="text-emerald-700/50 text-sm italic">No exact matches found.</li>
                  )}
                </ul>
              </div>

              {/* Missing Requirements */}
              <div className="bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-200/50 dark:border-rose-800/50">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="font-serif text-lg text-rose-950 dark:text-rose-50 font-medium">Missing Requirements</h3>
                </div>
                <ul className="space-y-4">
                  {result.missing_requirements?.length > 0 ? result.missing_requirements.map((req, i) => (
                    <li key={i} className="flex gap-3 text-rose-800 dark:text-rose-200 text-sm font-light leading-relaxed">
                      <span className="text-rose-400 dark:text-rose-500 mt-1 flex-shrink-0">•</span>
                      {req}
                    </li>
                  )) : (
                    <li className="text-rose-700/50 text-sm italic">You hit every requirement!</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Predictive Interview Questions */}
            {result.interview_questions && result.interview_questions.length > 0 && (
              <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-3xl p-6 shadow-sm mt-4">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo-200/50 dark:border-indigo-800/50">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-serif text-lg text-indigo-950 dark:text-indigo-50 font-medium">Predictive Interview Questions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.interview_questions.map((q, i) => (
                    <div key={i} className="bg-white/60 dark:bg-slate-900/60 rounded-2xl p-4 border border-indigo-50 dark:border-indigo-800/20 shadow-sm text-sm text-indigo-900 dark:text-indigo-200 font-light leading-relaxed">
                      "{q}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "comparer" && (
          <motion.div 
            key="tab-comparer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8 mt-2"
          >
            {result.resume_sections?.length > 0 ? (
              result.resume_sections.map((section, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg">
                  {/* Section Header */}
                  <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
                    <h3 className="font-serif text-lg text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                      {section.section_name}
                    </h3>
                    
                    <button 
                      onClick={() => handleCopy(section.enhanced_text, section.section_name)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                      {copiedSection === section.section_name ? (
                        <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copy Optimized</>
                      )}
                    </button>
                  </div>
                  
                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                    {/* Original */}
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-950/30">
                      <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mb-4 block">Your Original Text</span>
                      <pre className="whitespace-pre-wrap font-sans text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-h-96 overflow-y-auto">
                        {section.original_text}
                      </pre>
                    </div>
                    
                    {/* Enhanced */}
                    <div className="p-6 bg-violet-50/30 dark:bg-violet-900/10">
                      <span className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold tracking-widest uppercase mb-4 block flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span> Tailored for Role
                      </span>
                      <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800 dark:text-slate-200 leading-relaxed max-h-96 overflow-y-auto">
                        {section.enhanced_text}
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500 text-sm">
                No sections available.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
