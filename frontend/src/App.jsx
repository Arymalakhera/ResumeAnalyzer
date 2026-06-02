import { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Loader2, FileText, CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, Sparkles, Target, Briefcase, Hash, Copy, Check, Eye, X, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';

// --- CLEAN REUSABLE UI COMPONENTS --- //

// 1. Interactive Button (Scale + Glow)
export const InteractiveButton = ({ children, onClick, disabled, className, type = "button", variant = "primary" }) => {
  const baseClasses = "flex items-center justify-center font-bold py-3 px-6 rounded-xl transition-colors duration-300 ease-out z-10";
  const glowShadow = variant === "primary" ? "shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]" : "shadow-[0_0_10px_rgba(0,0,0,0.5)]";
  const bgClasses = variant === "primary" ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-0" : "bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white";
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`${baseClasses} ${bgClasses} ${glowShadow} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  );
};

// 2. Lift Card (Hover elevation)
export const LiftCard = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.4, type: "spring", bounce: 0.3 }}
      whileHover={{ y: -8, boxShadow: "0px 15px 35px rgba(16,185,129,0.15)", transition: { duration: 0.3, ease: 'easeOut' } }}
      className={`rounded-3xl p-6 transition-colors duration-300 ease-out backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${className}`}
    >
      {children}
    </motion.div>
  );
};

// 3. Pulse Upload Area
export const PulseUploadArea = ({ file, onFileChange }) => {
  return (
    <motion.label 
      whileHover={{ scale: 1.02, borderColor: 'rgba(16,185,129,0.5)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative cursor-pointer bg-slate-950/80 hover:bg-slate-900 text-white px-8 py-10 rounded-2xl font-medium transition-colors duration-300 mb-6 border-2 border-slate-800 flex flex-col items-center w-full text-center group overflow-hidden z-10 shadow-lg"
    >
      {/* Background dynamic glow */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-500" />
      
      {/* Pulse ring indicating upload action requirement */}
      {!file && (
        <div className="absolute inset-0 rounded-2xl border border-emerald-500/30 animate-ping opacity-20 pointer-events-none" style={{ animationDuration: '3s' }} />
      )}
      
      <motion.div 
        animate={file ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 bg-slate-900 border border-slate-700/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-500 z-10 shadow-inner"
      >
        {file ? <FileText className="w-8 h-8 text-emerald-400" /> : <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 transition-colors duration-300" />}
      </motion.div>

      <span className="text-emerald-400 mb-2 font-bold text-lg z-10 transition-colors">{file ? "Document Engaged" : "Initialize Matrix Upload"}</span>
      <span className="text-slate-400 text-sm z-10 transition-colors">{file ? file.name : "Tap here, or push PDF/DOCX to Dropzone"}</span>
      <input type="file" className="hidden z-10" accept=".pdf,.docx" onChange={onFileChange} />
    </motion.label>
  );
};

// 4. Smooth Progress Bar
export const SmoothProgress = ({ percentage, colorClass = "from-emerald-500 to-cyan-400" }) => {
  return (
    <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden  shadow-inner relative">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, type: "spring", stiffness: 50, damping: 15 }}
        viewport={{ once: true }}
        className={`absolute top-0 left-0 bg-gradient-to-r ${colorClass} h-full rounded-full`}
      />
    </div>
  );
};


// --- MAIN APP COMPONENT --- //
function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [useMockData, setUseMockData] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showImprovedResume, setShowImprovedResume] = useState(false);

  // Auth States (Supabase)
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session) setShowAuthModal(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    } catch (error) {
      console.error('Supabase Auth error:', error);
      alert('Failed to connect to Google Auth API.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowProfileDropdown(false);
  };

  const percentile = result && result.score ? Math.min(99, Math.max(1, Math.round((result.score / 10) * 100) - 5)) : 0;

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `=== AI RESUME ANALYSIS ===\nScore: ${result.score}/10\nPercentile: Top ${100 - percentile}%\n\nSTRENGTHS:\n${result.strengths?.map(s => `- ${s}`).join('\n')}\n\nAREAS TO IMPROVE:\n${result.weaknesses?.map(w => `- ${w}`).join('\n')}\n\nACTIONABLE TIPS:\n${result.tips?.map(t => `- ${t}`).join('\n')}\n\nMISSING KEYWORDS (ATS):\n${result.smart_keywords?.join(', ')}`;
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleImprovedResume = () => {
    if (!result || !result.improved_resume_text) return alert("No improved resume text generated by AI yet. Ensure 'Use Mock Data' is on or the backend provided it.");
    setShowImprovedResume(!showImprovedResume);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  // Send file to our backend
  const handleUpload = async () => {
    if (!file && !useMockData) return alert("Please select a file first!");

    setLoading(true);

    if (useMockData) {
      setTimeout(() => {
        setResult({
          score: 8.5,
          strengths: ["Strong academic background with relevant degrees.", "Clear progression in career roles and responsibilities.", "Excellent use of action verbs in bullet points."],
          weaknesses: ["Lacks quantifiable achievements in recent roles.", "Formatting is slightly inconsistent in the education section.", "Missing a dedicated skills summary."],
          tips: ["Add specific metrics to quantify your impact (e.g., 'Increased sales by 20%').", "Ensure consistent font sizes and spacing throughout the document.", "Include a top skills section to quickly highlight your core competencies to ATS systems."],
          smart_keywords: ["Agile Methodologies", "CI/CD Pipeline", "RESTful APIs", "GraphQL", "Test-Driven Development", "Microservices Architecture", "Performance Optimization"],
          recommended_roles: [
            { title: "Senior React Developer", match_percentage: 85, matching_skills: ["React", "JavaScript", "Tailwind CSS"], missing_skills: ["TypeScript", "Next.js"], improvement_suggestion: "Migrating some of your past projects to TypeScript will significantly increase your fit for modern frontend roles." },
            { title: "Full Stack Software Engineer", match_percentage: 60, matching_skills: ["React", "Node.js API Development"], missing_skills: ["Docker", "AWS", "System Architecture"], improvement_suggestion: "Incorporate cloud deployments and containerization to demonstrate end-to-end backend mastery." }
          ],
          improved_resume_text: "JOHN DOE\nSoftware Engineer\n\nSUMMARY\nHighly skilled Full Stack Developer with 5+ years of experience building modern web architectures using React and Node.js.\n\nEXPERIENCE\n- Tech Corp (2020 - Present)"
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
    <div className="min-h-screen bg-slate-950 bg-gradient-to-br from-slate-950 via-emerald-950/10 to-slate-950 text-white flex flex-col items-center py-8 md:py-16 px-4 relative overflow-hidden font-sans">
      
      {/* Background Blobs (Emerald, Cyan, Teal) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[128px] animate-blob z-0 pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[128px] animate-blob animation-delay-2000 z-0 pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-teal-600/20 rounded-full mix-blend-screen filter blur-[128px] animate-blob animation-delay-4000 z-0 pointer-events-none" />

      {/* Top Navbar */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-20 mb-12 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="font-bold text-xl md:text-2xl tracking-tight text-slate-100">Resumex<span className="text-emerald-400">.AI</span></span>
        </div>

        <div className="relative">
          {user ? (
            <div>
              <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-slate-900 border border-slate-700 hover:border-emerald-500/50 rounded-xl transition-colors shadow-sm">
                {user.user_metadata?.avatar_url ? (
                   <img src={user.user_metadata.avatar_url} alt="avatar" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-emerald-500/50 object-cover" />
                ) : (
                   <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-xs md:text-sm font-bold shadow-inner uppercase">{(user.user_metadata?.full_name || 'U').charAt(0)}</div>
                )}
                <span className="font-medium text-slate-200 text-sm hidden md:block">{user.user_metadata?.full_name || user.email}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-50 backdrop-blur-xl">
                    <div className="p-4 border-b border-slate-800 text-sm bg-slate-950/50"><div className="font-bold text-white truncate">{user.user_metadata?.full_name || 'User'}</div><div className="text-slate-400 truncate text-xs mt-0.5">{user.email}</div></div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors"><Settings className="w-4 h-4" /> Account Settings</button>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors mt-1"><LogOut className="w-4 h-4" /> Sign Out</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <InteractiveButton variant="secondary" onClick={() => setShowAuthModal(true)} className="px-5 py-2.5 text-sm">
              <User className="w-4 h-4 mr-2" /> Sign In
            </InteractiveButton>
          )}
        </div>
      </div>

      {/* Main Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12 z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-6 tracking-tight pb-2">AI Resume Analyzer</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">Upload your document and receive an instant breakdown of your strengths, weaknesses, and actionable tips via our precision analyzer.</p>
      </motion.div>

      {/* Step-Based Reveal State Machine */}
      <AnimatePresence mode="wait">
        
        {/* Step 1: Upload Section */}
        {!loading && !result && (
          <motion.div key="upload" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.4 }} className="w-full max-w-xl z-20 mb-8" >
            <div className=" backdrop-blur-xl  rounded-3xl p-8 shadow-2xl flex flex-col items-center">
              
              <PulseUploadArea file={file} onFileChange={handleFileChange} />

              <div className="flex items-center gap-3 w-full mb-6 z-10">
                <div className="h-px bg-slate-800 flex-1"></div>
                <label className="flex items-center cursor-pointer text-sm text-slate-400 hover:text-slate-300 transition-colors">
                  <input type="checkbox" checked={useMockData} onChange={() => setUseMockData(!useMockData)} className="mr-3 accent-emerald-500 w-4 h-4 rounded bg-slate-950 border-slate-800" />
                  Bypass live verification (Local Mock)
                </label>
                <div className="h-px bg-slate-800 flex-1"></div>
              </div>

              <InteractiveButton onClick={handleUpload} disabled={!file && !useMockData} className="w-full py-4 text-lg bg-gradient-to-r from-emerald-600 to-cyan-600">
                Analyze My Resume <Sparkles className="w-5 h-5 ml-2" />
              </InteractiveButton>
            </div>
          </motion.div>
        )}

        {/* Step 2: Dedicated Loading Screen */}
        {loading && (
          <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }} transition={{ duration: 0.6, ease: "easeInOut" }} className="w-full max-w-md z-20 flex flex-col items-center justify-center py-16">
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-t-4 border-emerald-500 rounded-full drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"></motion.div>
               <motion.div animate={{ rotate: -360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-2 border-b-4 border-cyan-500 rounded-full drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"></motion.div>
               <Loader2 className="w-10 h-10 text-white animate-spin absolute" />
            </div>
            
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">Analyzing your resume...</h2>
            <div className="h-6 overflow-hidden relative w-full text-center">
              <motion.div animate={{ y: [0, -24, -48, -72, -96] }} transition={{ duration: 5, ease: "steps(4)", repeat: Infinity }} className="text-slate-400 font-medium tracking-wide">
                <div className="h-6 flex items-center justify-center">Extracting ATS keywords...</div>
                <div className="h-6 flex items-center justify-center">Evaluating structural logic...</div>
                <div className="h-6 flex items-center justify-center">Cross-referencing industry standard...</div>
                <div className="h-6 flex items-center justify-center">Computing percentile score...</div>
                <div className="h-6 flex items-center justify-center">Finalizing output matrix...</div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 3 & 4: Results Dashboard (Score & Suggestions Fade-in) */}
        {result && !loading && (
          <motion.div key="results" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, type: "spring", bounce: 0.4 }} className="w-full max-w-6xl z-10 flex flex-col gap-6 relative">
            
            {/* Top Action Bar */}
            <div className="flex justify-between items-center mb-2 w-full">
              <InteractiveButton variant="secondary" onClick={() => { setResult(null); setFile(null); }} className="px-4 py-2 text-sm border-slate-700 bg-slate-900/50 hover:bg-slate-800">
                ↺ Analyze Another
              </InteractiveButton>
              <div className="flex gap-4">
                <InteractiveButton variant="secondary" onClick={handleCopy} className="px-4 py-2 text-sm">
                  {copied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied to Clipboard' : 'Copy Suggestions'}
                </InteractiveButton>
                <InteractiveButton onClick={handleToggleImprovedResume} className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500">
                  <Eye className="w-4 h-4 mr-2" /> {showImprovedResume ? "Hide" : "View"} Improved Resume
                </InteractiveButton>
              </div>
            </div>

            {/* Bento Box Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
              
              {/* --- TIER 1: THE ANCHOR --- */}
              {/* Large Main Card: Overall Score */}
              <LiftCard className="md:col-span-8   flex flex-col md:flex-row items-center justify-around relative overflow-hidden group p-8">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp className="w-48 h-48 text-emerald-400 transform translate-x-8 -translate-y-8" /></div>
                
                <div className="flex flex-col items-center justify-center relative z-10 mb-6 md:mb-0 w-full md:w-1/2">
                  <h3 className="text-slate-400 font-medium mb-4 uppercase tracking-wider text-sm">Overall Score</h3>
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                      <motion.circle 
                        cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        initial={{ strokeDashoffset: 528 }} whileInView={{ strokeDashoffset: 528 - (528 * (result.score || 0)) / 10 }}
                        transition={{ duration: 1.5, type: "spring", bounce: 0.1 }} viewport={{ once: true }}
                        strokeDasharray={528} strokeLinecap="round" className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                      />
                    </svg>
                    <span className="absolute text-6xl font-black text-white">{result.score || 0}<span className="text-2xl text-slate-500">/10</span></span>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col relative z-10">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Resume Strength</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Your profile ranks firmly in the top tier of candidates. Focus on structural edge-cases to maximize ATS visibility.</p>
                  </div>
                  <div className="w-full flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-300 flex items-center"><span className="mr-2 text-lg">🔥</span> Beats applicants</span>
                      <span className="text-sm font-bold text-amber-400">{percentile}%</span>
                    </div>
                    <SmoothProgress percentage={percentile} colorClass="from-amber-500 via-orange-400 to-rose-500" />
                  </div>
                </div>
              </LiftCard>

              {/* Medium Card 1: Executive Summary */}
              <LiftCard delay={0.1} className="md:col-span-4   flex flex-col justify-center relative overflow-hidden group p-8">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles className="w-32 h-32 text-blue-400" /></div>
                <h3 className="text-xl font-bold text-white mb-4 relative z-10 flex items-center"><Sparkles className="w-5 h-5 text-blue-400 mr-2" /> AI Summary</h3>
                <p className="text-slate-300 leading-relaxed relative z-10 text-sm">
                  {result.score >= 8 ? "Excellent resume! It's highly competitive and well-structured. Just a few minor tweaks away from perfection." : 
                   result.score >= 6 ? "Good foundation, but there is significant room for improvement." : 
                   "This resume requires a major overhaul. Focus on the core weaknesses below."}
                </p>
              </LiftCard>

              {/* --- TIER 2: THE AUDIT --- */}
              {/* Medium Card 2: ATS Keywords */}
              <LiftCard delay={0.15} className="md:col-span-4   flex flex-col h-full hover: p-6">
                <div className="flex items-center mb-6"><div className="p-2.5 bg-indigo-500/20 rounded-xl mr-3"><Hash className="w-5 h-5 text-indigo-400" /></div><h3 className="text-lg font-bold text-indigo-50">Smart ATS Keywords</h3></div>
                <div className="flex flex-wrap gap-2 relative z-10 content-start">
                  {result.smart_keywords && result.smart_keywords.map((keyword, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 font-medium text-xs rounded-lg">{keyword}</span>
                  ))}
                </div>
              </LiftCard>

              {/* Medium Card 3: Strengths */}
              <LiftCard delay={0.2} className="md:col-span-4   flex flex-col h-full hover: p-6">
                <div className="flex items-center mb-6"><div className="p-2.5 bg-emerald-500/20 rounded-xl mr-3"><CheckCircle2 className="w-5 h-5 text-emerald-400" /></div><h3 className="text-lg font-bold text-emerald-50">Strengths</h3></div>
                <ul className="space-y-3 flex-1 text-sm">
                  {result.strengths && result.strengths.slice(0, 4).map((item, i) => <li key={i} className="flex items-start text-emerald-200/80"><span className="mr-2 text-emerald-400 mt-0.5">•</span><span className="leading-relaxed">{item}</span></li>)}
                </ul>
              </LiftCard>

              {/* Medium Card 4: Weaknesses */}
              <LiftCard delay={0.25} className="md:col-span-4   flex flex-col h-full hover: p-6">
                <div className="flex items-center mb-6"><div className="p-2.5 bg-rose-500/20 rounded-xl mr-3"><AlertTriangle className="w-5 h-5 text-rose-400" /></div><h3 className="text-lg font-bold text-rose-50">Areas to Improve</h3></div>
                <ul className="space-y-3 flex-1 text-sm">
                  {result.weaknesses && result.weaknesses.slice(0, 4).map((item, i) => <li key={i} className="flex items-start text-rose-200/80"><span className="mr-2 text-rose-400 mt-0.5">•</span><span className="leading-relaxed">{item}</span></li>)}
                </ul>
              </LiftCard>

              {/* --- TIER 3: ACTION & ROLES --- */}
              {/* Small Card 1: Tips */}
              <LiftCard delay={0.3} className="md:col-span-6   flex flex-col p-6">
                <div className="flex items-center mb-6"><div className="p-2.5 bg-cyan-500/20 rounded-xl mr-3"><Lightbulb className="w-5 h-5 text-cyan-400" /></div><h3 className="text-lg font-bold text-cyan-50">Actionable Tips</h3></div>
                <ul className="space-y-3 flex-1 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  {result.tips && result.tips.map((item, i) => <li key={i} className="flex items-start text-cyan-200/80"><span className="mr-2 text-cyan-400 mt-0.5">•</span><span className="leading-relaxed">{item}</span></li>)}
                </ul>
              </LiftCard>

              {/* Small Card 2: Top Job Role */}
              {result.recommended_roles && result.recommended_roles.length > 0 && (
                <LiftCard delay={0.35} className="md:col-span-6   flex flex-col p-6 group hover:bg-slate-800/80">
                  <div className="flex items-center mb-6"><div className="p-2.5 bg-emerald-500/20 rounded-xl mr-3"><Target className="w-5 h-5 text-emerald-400" /></div><h3 className="text-lg font-bold text-emerald-50">Top Recommended Role</h3></div>
                  
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                         <h4 className="text-xl font-bold text-slate-100">{result.recommended_roles[0].title}</h4>
                         <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30 whitespace-nowrap">{result.recommended_roles[0].match_percentage}% Match</span>
                      </div>
                      
                      <div className="mb-4 grid grid-cols-2 gap-4">
                         <div>
                           <span className="text-xs text-slate-500 uppercase font-bold mb-2 block">Key Matches</span>
                           <div className="flex flex-wrap gap-1.5">
                              {result.recommended_roles[0].matching_skills.slice(0, 3).map((skill, i) => <span key={i} className="text-xs bg-slate-800 text-emerald-400 px-2 py-1 rounded border border-slate-700/50">{skill}</span>)}
                           </div>
                         </div>
                         <div>
                           <span className="text-xs text-slate-500 uppercase font-bold mb-2 block">Missing Highlights</span>
                           <div className="flex flex-wrap gap-2">
                              {result.recommended_roles[0].missing_skills.slice(0, 4).map((skill, i) => (
                                <motion.span whileHover={{ scale: 1.05 }} key={i} className="text-xs bg-rose-950/40 text-rose-300 font-bold px-2.5 py-1.5 rounded-md border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.15)] filter drop-shadow hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all cursor-crosshair">
                                  {skill}
                                </motion.span>
                              ))}
                           </div>
                         </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 bg-slate-950/50 p-4 rounded-xl ">
                      <p className="text-xs text-slate-300 leading-relaxed"><span className="text-emerald-400 font-bold mr-1">Pro Tip:</span>{result.recommended_roles[0].improvement_suggestion}</p>
                    </div>
                  </div>
                </LiftCard>
              )}
            </div>

            {/* Improved Resume Section */}
            <AnimatePresence>
              {showImprovedResume && result.improved_resume_text && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }} className="w-full mt-2 overflow-hidden">
                  <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.05)] relative relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><FileText className="w-64 h-64 text-emerald-400" /></div>
                    <div className="flex items-center justify-between mb-8 relative z-10 border-b border-slate-800 pb-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl mr-4"><Copy className="w-6 h-6 text-emerald-400" /></div>
                        <div>
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">AI Rewritten Resume</h3>
                          <p className="text-slate-400 text-sm mt-1">Copy and paste this structurally optimized content.</p>
                        </div>
                      </div>
                      <InteractiveButton onClick={() => navigator.clipboard.writeText(result.improved_resume_text)} variant="secondary" className="hidden md:flex">Copy Text</InteractiveButton>
                    </div>
                    <div className="prose prose-invert prose-slate max-w-none relative z-10">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 leading-relaxed shadow-inner">
                        {result.improved_resume_text}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Authentication Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-slate-900  rounded-3xl p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(16,185,129,0.15)]">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg mb-6"><Sparkles className="w-8 h-8 text-white" /></div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3 text-center">Unlock Full Access</h2>
                <p className="text-slate-400 text-center mb-8 px-4 text-sm">Sign in securely with Google to immediately save your analyzed resumes to the cloud.</p>
                
                <InteractiveButton onClick={handleGoogleLogin} className="w-full py-4 text-lg bg-white hover:bg-slate-100 text-slate-900 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                  Continue with Google
                </InteractiveButton>
              </div>
              
              <div className="mt-4 text-center text-xs text-slate-500">
                Secured by Supabase Identity
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;