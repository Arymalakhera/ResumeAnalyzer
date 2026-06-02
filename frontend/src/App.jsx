import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, Loader2, FileText, CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, Sparkles, Target, Briefcase, Hash, Copy, Check, Eye, X, ChevronDown, User, Settings, LogOut, ArrowRight, Plus, Heart, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { supabase } from './supabaseClient';
import JobFitDashboard from './components/JobFitDashboard';

// --- PREMIUM REUSABLE UI COMPONENTS (MINDLY STYLE) --- //

const LOADING_MESSAGES = [
  "Parsing candidate details...",
  "Running ATS compatibility algorithms...",
  "Cross-referencing industry standard metrics...",
  "Identifying critical structural weaknesses...",
  "Generating actionable feedback...",
  "Formatting optimization dashboard..."
];

export const InteractiveLoader = () => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const totalDuration = 7000;
    const intervalTime = 50;
    const increment = 100 / (totalDuration / intervalTime);

    const progressTimer = setInterval(() => {
      setProgress(prev => Math.min(prev + increment, 96)); // Halt at 96% until real response
    }, intervalTime);

    const messageTimer = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, totalDuration / LOADING_MESSAGES.length);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(4px)" }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-center justify-center py-24 px-4"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-serif text-2xl text-slate-900 dark:text-white">Analyzing Profile</h2>
          <span className="font-mono text-sm font-bold text-violet-600 dark:text-violet-400">{Math.floor(progress)}%</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6 shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
          />
        </div>

        {/* Dynamic Animated Text */}
        <div className="h-6 overflow-hidden relative w-full text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 absolute w-full"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// 1. Pill CTA Button (Mindly style with static float shadow)
export const InteractiveButton = ({ children, onClick, disabled, className, type = "button", variant = "primary" }) => {
  const btnClass = variant === "primary" ? "mindly-btn-primary" : "mindly-btn-secondary";
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`flex items-center justify-center font-medium py-3 px-6 text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${btnClass} ${className}`}
    >
      {children}
    </motion.button>
  );
};

// 2. Mindly Card Container (with soft shadows and high border-radius)
export const LiftCard = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 50 }}
      className={`mindly-card p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
};

// 3. Compact Dotted Upload Area
export const PulseUploadArea = ({ file, onFileChange }) => {
  return (
    <motion.label
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className="relative cursor-pointer bg-white/40 hover:bg-white/70 text-slate-800 px-6 py-8 rounded-[24px] font-medium transition-all duration-300 mb-5 border border-slate-200/60 hover:border-slate-400/50 flex flex-col items-center w-full text-center group overflow-hidden shadow-inner"
    >
      {/* Background soft color shift */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-indigo-500/0 group-hover:from-violet-500/5 group-hover:to-indigo-500/5 transition-all duration-500" />

      {/* Moving border animation on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent animate-pulse" />
      </div>

      <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/40 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-all duration-300 shadow-inner dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]">
        {file ? (
          <FileText className="w-6 h-6 text-violet-600 dark:text-violet-400" />
        ) : (
          <UploadCloud className="w-6 h-6 text-violet-500 dark:text-violet-400" />
        )}
      </div>

      <span className="text-slate-800 dark:text-slate-200 mb-1 font-semibold text-sm transition-colors">
        {file ? "Resume Loaded" : "Upload Your resume"}
      </span>
      <span className="text-slate-500 dark:text-slate-400 text-xs font-light transition-colors">
        {file ? file.name : "Drag & drop, or browse your device"}
      </span>
      <input type="file" className="hidden" accept=".pdf,.docx" onChange={onFileChange} />
    </motion.label>
  );
};

// 4. Elegant Progress Bar
export const SmoothProgress = ({ percentage, colorClass = "from-violet-500 to-indigo-500" }) => {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative border border-slate-200/30">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className={`absolute top-0 left-0 bg-gradient-to-r ${colorClass} h-full rounded-full`}
      />
    </div>
  );
};

// 5. Mini Resume background floaters (matching A4 layout with styled lines)
export const MiniResume = ({ id, rotate, style }) => {
  return (
    <div
      className="floating-mini-resume absolute w-14 h-20 bg-white/90 border border-slate-200/60 shadow-[0_4px_12px_rgba(0,0,0,0.03)] rounded-[3px] p-2 flex flex-col gap-1.5 pointer-events-none select-none z-0"
      style={{ ...style, transform: `rotate(${rotate}deg)` }}
    >
      {/* Mini Profile Header */}
      <div className="w-2/3 h-1 bg-slate-300/80 rounded-[1px]" />

      {/* Mini resume details blocks */}
      <div className="flex flex-col gap-1 flex-grow">
        <div className="w-full h-[2px] bg-slate-200/70 rounded-[0.5px]" />
        <div className="w-5/6 h-[2px] bg-slate-200/70 rounded-[0.5px]" />
        <div className="w-11/12 h-[2px] bg-slate-200/70 rounded-[0.5px]" />
        <div className="w-2/3 h-[2px] bg-slate-200/70 rounded-[0.5px]" />
      </div>

      {/* Mini tags */}
      <div className="flex justify-between items-center mt-1">
        <div className="w-2/5 h-[2px] bg-violet-200/80 rounded-[0.5px]" />
        <div className="w-1/4 h-[2px] bg-indigo-200/80 rounded-[0.5px]" />
      </div>
    </div>
  );
};


// --- MAIN APP --- //
function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showImprovedResume, setShowImprovedResume] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "comparer"
  const [jobDescription, setJobDescription] = useState("");
  const [isJobRoleMode, setIsJobRoleMode] = useState(false);

  // Blur-in effect states
  const heroSentence = "Your resume deserves a profile that stands out";

  // Mascot Mouse tracking states
  const [mascotLook, setMascotLook] = useState({ x: 0, y: 0 });

  // Auth States (Supabase)
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || false;
  });

  // Apply Dark Mode to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // GSAP Animation Ref for Floating Mini Resumes
  const containerRef = useRef(null);

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

  // Snappy Blur-in Animation Trigger handled by Framer Motion directly on the element

  // Mascot Eye Tracking MouseMove listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate normalized delta coordinates relative to screen center
      const x = (e.clientX / window.innerWidth) - 0.5; // range -0.5 to 0.5
      const y = (e.clientY / window.innerHeight) - 0.5; // range -0.5 to 0.5
      setMascotLook({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GSAP Smooth Float Animations for Mini Resumes
  useEffect(() => {
    if (!result && !loading && containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.floating-mini-resume');

      elements.forEach((el, index) => {
        // Floating loop using GSAP
        gsap.to(el, {
          y: 'random(-15, -30)',
          x: 'random(-10, 10)',
          rotation: '+=random(-6, 6)',
          duration: 'random(4, 6)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.4
        });
      });
    }
  }, [result, loading]);

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
    const textToCopy = `=== SKORE.AI RESUME ANALYSIS ===\nScore: ${result.score}/10\nPercentile: Top ${100 - percentile}%\n\nSTRENGTHS:\n${result.strengths?.map(s => `- ${s}`).join('\n')}\n\nAREAS TO IMPROVE:\n${result.weaknesses?.map(w => `- ${w}`).join('\n')}\n\nACTIONABLE TIPS:\n${result.tips?.map(t => `- ${t}`).join('\n')}\n\nMISSING KEYWORDS (ATS):\n${result.smart_keywords?.join(', ')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleImprovedResume = () => {
    if (!result || !result.improved_resume_text) return alert("No improved resume text generated yet.");
    setShowImprovedResume(!showImprovedResume);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Send file to backend
  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    setLoading(true);
    setShowUploadModal(false);

    const formData = new FormData();
    formData.append('resume', file);
    if (isJobRoleMode && jobDescription.trim()) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to analyze resume. Verify that your backend server is active and Gemini API key is valid.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate eye pupil dynamic positioning values (translation offset)
  // Multiply the normalized value (-0.5 to 0.5) by a larger factor to make the movement visible
  const pupilStyle = {
    transform: `translate(${mascotLook.x * 16}px, ${mascotLook.y * 18}px)`
  };

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col justify-between py-6 px-4 relative font-sans overflow-x-hidden">
      
      {/* Background Spot Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-400/30 dark:bg-violet-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[120px] opacity-70 animate-blob pointer-events-none z-0" />
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-300/30 dark:bg-fuchsia-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[120px] opacity-60 pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-indigo-300/30 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[120px] opacity-60 pointer-events-none z-0" />

      {/* Background Floaters - Small A4 Miniature Resumes animated smoothly via GSAP */}
      {!loading && !result && (
        <>
          <MiniResume rotate={-10} style={{ top: '16%', left: '8%' }} />
          <MiniResume rotate={12} style={{ top: '22%', right: '10%' }} />
          <MiniResume rotate={8} style={{ top: '55%', left: '6%' }} />
          <MiniResume rotate={-15} style={{ top: '65%', right: '8%' }} />
          <MiniResume rotate={6} style={{ bottom: '20%', left: '30%' }} />
          <MiniResume rotate={-8} style={{ bottom: '15%', right: '35%' }} />
        </>
      )}

      {/* Dynamic Floating Orbs / Tokens (from reference image) */}
      <div className="absolute top-[32%] left-[16%] md:left-[24%] z-10 hidden sm:block">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 rounded-full bg-[#FFDF7B] flex items-center justify-center border-4 border-white shadow-lg shadow-yellow-500/10 cursor-pointer"
        >
          <Plus className="w-5 h-5 text-slate-800" />
        </motion.div>
      </div>

      <div className="absolute top-[28%] right-[16%] md:right-[22%] z-10 hidden sm:block">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 rounded-full bg-[#C2C9FF] flex items-center justify-center border-4 border-white shadow-lg shadow-indigo-500/10 cursor-pointer"
        >
          <Heart className="w-5 h-5 text-indigo-600" />
        </motion.div>
      </div>

      {/* Adorable peeking Mascot at the center bottom (Breathes & looks at cursor!) */}
      {!loading && !result && (
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 z-0 pointer-events-none hidden md:block">
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-28 h-28 bg-[#B5BAFF] rounded-t-full shadow-[0_0_20px_rgba(181,186,255,0.4),inset_0_2px_4px_rgba(255,255,255,0.6)] flex flex-col items-center justify-center pt-6 px-4"
          >
            {/* Blushing cute pink cheeks */}
            <div className="absolute bottom-7 left-4 w-4 h-2.5 bg-[#FFA5C0]/65 rounded-full filter blur-[1px]" />
            <div className="absolute bottom-7 right-4 w-4 h-2.5 bg-[#FFA5C0]/65 rounded-full filter blur-[1px]" />

            {/* Happy smiling mouth */}
            <div className="absolute bottom-6 w-3 h-1.5 border-b-[3px] border-slate-700/80 rounded-b-full" />

            {/* Eyes Container */}
            <div className="flex gap-4 justify-center items-center">
              {/* Left Eye */}
              <div className="w-5 h-7 bg-white rounded-full flex items-center justify-center relative shadow-sm overflow-hidden border border-slate-100">
                <div
                  className="absolute w-3 h-3 bg-slate-900 rounded-full transition-transform duration-75 ease-out flex items-start justify-end p-0.5"
                  style={pupilStyle}
                >
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
              </div>

              {/* Right Eye */}
              <div className="w-5 h-7 bg-white rounded-full flex items-center justify-center relative shadow-sm overflow-hidden border border-slate-100">
                <div
                  className="absolute w-3 h-3 bg-slate-900 rounded-full transition-transform duration-75 ease-out flex items-start justify-end p-0.5"
                  style={pupilStyle}
                >
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Frame Container */}
      <div className="w-full max-w-6xl mx-auto flex-grow flex flex-col justify-between z-10 relative">

        {/* Minimal Nav Header */}
        <nav className="w-full flex justify-between items-center mb-12 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Skore.ai
            </span>
          </div>

          <div className="relative flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-2 mr-1 sm:mr-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/50"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            {user ? (
              <div>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 rounded-full transition-all shadow-sm"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="avatar" className="w-6 h-6 rounded-full border border-violet-200 dark:border-violet-800 object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center text-[10px] font-bold uppercase">
                      {(user.user_metadata?.full_name || 'U').charAt(0)}
                    </div>
                  )}
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-xs hidden md:block">{user.user_metadata?.full_name || user.email}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                </button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-white border border-slate-200/60 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-slate-100 text-xs bg-slate-50/50">
                        <div className="font-semibold text-slate-900 truncate">{user.user_metadata?.full_name || 'User'}</div>
                        <div className="text-slate-500 truncate text-[10px] mt-0.5">{user.email}</div>
                      </div>
                      <div className="p-1.5">
                        <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition-all">
                          <Settings className="w-3.5 h-3.5" /> Account Settings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-500 hover:bg-rose-50/5 hover:text-rose-600 rounded-lg transition-all mt-0.5"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button onClick={() => setShowAuthModal(true)} className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-medium text-sm transition-colors">Log In</button>
                <InteractiveButton onClick={() => setShowUploadModal(true)} className="px-5 py-2">
                  Get Started
                </InteractiveButton>
              </>
            )}
          </div>
        </nav>

        {/* Dynamic Workflow Area */}
        <div className="flex-grow flex flex-col justify-center px-4">
          <AnimatePresence mode="wait">

            {/* Step 1: Mindly Centered Landing Screen */}
            {!loading && !result && (
              <motion.div
                key="landing-hero"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center justify-center flex-grow pt-4 pb-20 md:pb-24 relative"
              >
                {/* Serif Elegant Central Header (Framer Blur In!) */}
                <motion.h1
                  initial={{ filter: "blur(12px)", opacity: 0, y: 15 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#1E1E22] dark:text-white tracking-tight max-w-4xl mb-6 leading-[1.12] min-h-[4rem] sm:min-h-[6rem] lg:min-h-[8rem]"
                >
                  {heroSentence}
                </motion.h1>

                {/* Paragraph Context */}
                <motion.p
                  initial={{ filter: "blur(8px)", opacity: 0, y: 10 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  className="text-sm md:text-base text-[#6E6E77] dark:text-slate-400 font-sans font-light max-w-xl mb-8 leading-relaxed"
                >
                  Evaluate your technical keywords, analyze structural weaknesses, and rewrite weak bullet points instantly with the precision of Gemini AI.
                </motion.p>

                {/* Statically Elevated Floating Pill Button with 3D Rim Lighting */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 z-20 mb-16 w-full px-4"
                >
                  <InteractiveButton
                    onClick={() => { setIsJobRoleMode(false); setShowUploadModal(true); }}
                    className="w-full sm:w-auto px-10 py-4 text-lg bg-[#1E1E22] text-white shadow-[0_25px_50px_rgba(26,26,29,0.45),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-slate-700/60 hover:shadow-[0_30px_60px_rgba(26,26,29,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 rounded-full flex justify-center items-center gap-3"
                  >
                    Start Here
                    <ArrowRight className="w-5 h-5 opacity-90" />
                  </InteractiveButton>
                  <InteractiveButton
                    onClick={() => { setIsJobRoleMode(true); setShowUploadModal(true); }}
                    className="w-full sm:w-auto px-8 py-4 text-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-[0_10px_30px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-slate-200 dark:border-slate-700 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:-translate-y-1 transition-all duration-300 rounded-full flex justify-center items-center gap-3"
                  >
                    Analyze for Job Role
                    <Target className="w-5 h-5 opacity-80" />
                  </InteractiveButton>
                </motion.div>

                {/* Fanned out presentation cards at the bottom (Snappy Spring Hover!) */}
                <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-4 md:gap-6 pt-6 z-10 relative overflow-visible">

                  {/* Left Card: Rotated slightly left, snaps straight and floats up on hover */}
                  <motion.div
                    initial={{ opacity: 0, rotate: -4, y: 25 }}
                    animate={{ opacity: 1, rotate: -4, y: 12 }}
                    whileHover={{ rotate: 0, y: -16, scale: 1.05, transition: { type: "spring", stiffness: 800, damping: 15 } }}
                    transition={{ type: "spring", stiffness: 450, damping: 25, opacity: { delay: 0.6, duration: 0.5 }, y: { delay: 0.6 } }}
                    className="w-72 h-44 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.06),inset_0_2px_6px_rgba(255,255,255,0.8)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_2px_6px_rgba(255,255,255,0.05)] rounded-3xl p-6 flex flex-col justify-between items-center text-center sm:translate-x-4 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center overflow-hidden shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] border border-white/60 dark:border-slate-700/50">
                      <User className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="font-serif text-base text-slate-800 dark:text-slate-200 leading-snug px-2">
                      Why do I get rejected by ATS filters even with a good stack?
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Structural Analysis</span>
                  </motion.div>

                  {/* Center Card: Direct Straight, floats up significantly on hover */}
                  <motion.div
                    initial={{ opacity: 0, rotate: 0, y: 25 }}
                    animate={{ opacity: 1, rotate: 0, y: 0 }}
                    whileHover={{ rotate: 0, y: -24, scale: 1.05, transition: { type: "spring", stiffness: 800, damping: 15 } }}
                    transition={{ type: "spring", stiffness: 450, damping: 25, opacity: { delay: 0.7, duration: 0.5 }, y: { delay: 0.7 } }}
                    className="w-72 h-48 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white dark:border-slate-800 shadow-[0_16px_50px_rgba(0,0,0,0.08),inset_0_2px_8px_rgba(255,255,255,0.9)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.5),inset_0_2px_8px_rgba(255,255,255,0.05)] rounded-3xl p-6 flex flex-col justify-between items-center text-center z-10 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center overflow-hidden shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] border border-white/60 dark:border-slate-700/50">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="font-serif text-base text-slate-800 dark:text-slate-200 leading-snug px-2">
                      How do I write high-quantified software achievements?
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Auto Rewriter</span>
                  </motion.div>

                  {/* Right Card: Rotated slightly right, snaps straight and floats up on hover */}
                  <motion.div
                    initial={{ opacity: 0, rotate: 4, y: 25 }}
                    animate={{ opacity: 1, rotate: 4, y: 12 }}
                    whileHover={{ rotate: 0, y: -16, scale: 1.05, transition: { type: "spring", stiffness: 800, damping: 15 } }}
                    transition={{ type: "spring", stiffness: 450, damping: 25, opacity: { delay: 0.8, duration: 0.5 }, y: { delay: 0.8 } }}
                    className="w-72 h-44 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.06),inset_0_2px_6px_rgba(255,255,255,0.8)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_2px_6px_rgba(255,255,255,0.05)] rounded-3xl p-6 flex flex-col justify-between items-center text-center sm:-translate-x-4 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center overflow-hidden shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] border border-white/60 dark:border-slate-700/50">
                      <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-serif text-base text-slate-800 dark:text-slate-200 leading-snug px-2">
                      What keywords is Your profile missing for modern Senior roles?
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Keyword Audit</span>
                  </motion.div>

                </div>
              </motion.div>
            )}

            {/* Step 2: Interactive Loading State */}
            {loading && <InteractiveLoader />}

            {/* Step 3: Good/Bad/Improve Results Dashboard */}
            {result && !loading && (
              result.is_job_role_match ? (
                <JobFitDashboard result={result} />
              ) : (
              <motion.div
                key="results-dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col gap-6 py-6"
              >
                {/* Personalized Hero / Profile Header */}
                <motion.div 
                  initial={{ filter: "blur(10px)", opacity: 0, y: -10 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                    <div>
                      <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
                        Hey <span className="text-violet-600">{result.personal_info?.name || result.candidate_name || "User"}</span>,
                        <br/>here is your Analysis.
                      </h2>
                    </div>
                    <div className="flex flex-col gap-1 text-right bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm backdrop-blur-sm">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest">{result.personal_info?.current_role || "Professional Profile"}</span>
                      <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        {result.personal_info?.email && <span>{result.personal_info.email}</span>}
                        {result.personal_info?.phone && <span>• {result.personal_info.phone}</span>}
                      </div>
                    </div>
                  </div>
                  
                  {/* Tab Navigation */}
                  <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-full w-full max-w-sm mb-4 border border-slate-200/50 dark:border-slate-800/50">
                    <button 
                      onClick={() => setActiveTab("dashboard")}
                      className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold transition-all duration-300 ${activeTab === "dashboard" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                      Analysis Dashboard
                    </button>
                    <button 
                      onClick={() => setActiveTab("comparer")}
                      className={`flex-1 py-2 px-4 rounded-full text-xs font-semibold transition-all duration-300 ${activeTab === "comparer" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                      Smart Resume Builder
                    </button>
                  </div>
                </motion.div>

                {/* Top Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2 w-full border-b border-slate-100 dark:border-slate-800 pb-4">
                  <InteractiveButton variant="secondary" onClick={() => { setResult(null); setFile(null); }} className="px-5 py-2 text-xs">
                    ← Upload Another
                  </InteractiveButton>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <InteractiveButton variant="secondary" onClick={handleCopy} className="flex-1 sm:flex-none px-4 py-2 text-xs">
                      {copied ? <Check className="w-3.5 h-3.5 mr-2 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                      {copied ? 'Copied JSON' : 'Export Full JSON'}
                    </InteractiveButton>
                  </div>
                </div>

                {activeTab === "dashboard" ? (
                  /* 3-Column Good/Bad/Improve Grid */
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full"
                  >
                    
                    {/* Column 1: The Good (Strengths & Score) */}
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif text-xl text-slate-800 dark:text-slate-200">The Good</h3>
                      </div>
                      
                      {/* Score Card */}
                      <LiftCard className="flex flex-col items-center justify-center p-6 border-t-4 border-emerald-400">
                        <h4 className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-4">ATS Match Score</h4>
                        <div className="relative inline-flex items-center justify-center mb-4">
                          <svg className="w-24 h-24 transform -rotate-90">
                            <circle cx="48" cy="48" r="42" stroke="rgba(0,0,0,0.03)" strokeWidth="4" fill="transparent" />
                            <motion.circle
                              cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="4" fill="transparent"
                              initial={{ strokeDashoffset: 264 }}
                              whileInView={{ strokeDashoffset: 264 - (264 * (result.score || 0)) / 10 }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                              viewport={{ once: true }}
                              strokeDasharray={264}
                              strokeLinecap="round"
                              className="text-emerald-500 drop-shadow-sm"
                            />
                          </svg>
                          <span className="absolute text-2xl font-serif font-black text-slate-800 dark:text-slate-200">
                            {result.score || 0}<span className="text-xs text-slate-400 font-light font-sans">/10</span>
                          </span>
                        </div>
                        <SmoothProgress percentage={percentile} colorClass="from-emerald-400 to-emerald-600" />
                      </LiftCard>

                      {/* Strengths List */}
                      <LiftCard className="p-6">
                        <h4 className="text-slate-500 dark:text-slate-400 font-semibold text-xs mb-4 uppercase tracking-wider">Verified Strengths</h4>
                        <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 font-light">
                          {result.strengths && result.strengths.map((item, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2 text-emerald-500 mt-0.5">•</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </LiftCard>
                    </div>

                    {/* Column 2: The Bad (Alerts & Keywords) */}
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-500 shadow-sm border border-rose-200 dark:border-rose-800">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif text-xl text-slate-800 dark:text-slate-200">The Bad</h3>
                      </div>
                      
                      {/* Weaknesses List */}
                      <LiftCard className="p-6 border-t-4 border-rose-400">
                        <h4 className="text-slate-500 dark:text-slate-400 font-semibold text-xs mb-4 uppercase tracking-wider">Core Alerts</h4>
                        <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 font-light">
                          {result.weaknesses && result.weaknesses.map((item, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2 text-rose-500 mt-0.5">•</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </LiftCard>

                      {/* Missing Keywords */}
                      <LiftCard className="p-6">
                        <h4 className="text-slate-500 dark:text-slate-400 font-semibold text-xs mb-4 uppercase tracking-wider flex items-center">
                          <Hash className="w-3 h-3 mr-1" /> Missing Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.smart_keywords && result.smart_keywords.map((keyword, idx) => (
                            <span key={idx} className="px-3 py-1 bg-rose-50 border border-rose-100 text-rose-700 font-medium text-[11px] rounded-full transition-all">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </LiftCard>
                    </div>

                    {/* Column 3: To Improve (Tips & Fit) */}
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-200 dark:border-amber-800">
                          <Lightbulb className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif text-xl text-slate-800 dark:text-slate-200">To Improve</h3>
                      </div>

                      {/* Actionable Tips */}
                      <LiftCard className="p-6 border-t-4 border-amber-400">
                        <h4 className="text-slate-500 dark:text-slate-400 font-semibold text-xs mb-4 uppercase tracking-wider">Actionable Fixes</h4>
                        <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 font-light">
                          {result.tips && result.tips.map((item, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2 text-amber-500 mt-0.5">•</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </LiftCard>

                      {/* Recommended Roles Summary */}
                      {result.recommended_roles && result.recommended_roles.length > 0 && (
                        <LiftCard className="p-6">
                          <h4 className="text-slate-500 dark:text-slate-400 font-semibold text-xs mb-4 uppercase tracking-wider flex items-center">
                            <Target className="w-3 h-3 mr-1" /> Best Role Fits
                          </h4>
                          <div className="flex flex-col gap-3">
                            {result.recommended_roles.map((role, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="font-medium text-slate-700 dark:text-slate-300">{role.title}</span>
                                <span className="font-bold text-violet-600">{role.match_percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </LiftCard>
                      )}
                    </div>

                  </motion.div>
                ) : (
                  /* Side-by-Side Comparer View */
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full flex flex-col gap-8"
                  >
                    {result.resume_sections && result.resume_sections.length > 0 ? (
                      result.resume_sections.map((section, idx) => (
                        <div key={idx} className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                          {/* Section Header */}
                          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-serif text-lg text-slate-800 dark:text-slate-200 font-bold">{section.section_name}</h3>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(section.enhanced_text);
                                alert(`Copied enhanced ${section.section_name} to clipboard!`);
                              }}
                              className="text-[10px] uppercase tracking-widest font-semibold text-violet-600 hover:text-violet-700 bg-violet-100 px-3 py-1.5 rounded-full transition-all"
                            >
                              Copy Optimized
                            </button>
                          </div>
                          
                          {/* 2-Column Comparer */}
                          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                            {/* Original */}
                            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50">
                              <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mb-4 block flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Your Original Text
                              </span>
                              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-h-96 overflow-y-auto">
                                {section.original_text}
                              </pre>
                            </div>
                            
                            {/* Enhanced */}
                            <div className="p-6 bg-violet-50/30 dark:bg-violet-900/10">
                              <span className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold tracking-widest uppercase mb-4 block flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span> AI Optimized Text
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
                        No sections available. (Ensure Gemini returned the resume_sections array).
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Minimal Footer */}
        <footer className="w-full text-center py-6 mt-12 border-t border-slate-200/30 text-[10px] text-slate-400 font-light flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Skore.ai. All rights reserved. Designed with premium pastel interface matrices.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 transition-colors">System Status</a>
          </div>
        </footer>

      </div>

      {/* Upload File Modal Frame (No Mock Option!) */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center pt-2">
                <h2 className="font-serif text-2xl text-slate-900 dark:text-white mb-4 text-center">
                  {isJobRoleMode ? "Targeted Job Analysis" : "Analyze Your Profile"}
                </h2>

                {isJobRoleMode && (
                  <textarea 
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the Job Description here..."
                    className="w-full h-32 mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none shadow-inner"
                  />
                )}

                <PulseUploadArea file={file} onFileChange={handleFileChange} />

                <InteractiveButton
                  onClick={handleUpload}
                  disabled={!file}
                  className="w-full py-3.5 text-xs font-semibold tracking-wide mt-4"
                >
                  Analyze Architecture <ArrowRight className="w-4 h-4 ml-2" />
                </InteractiveButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Authentication Modal (Supabase) */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center py-4">
                <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/40 rounded-2xl flex items-center justify-center border border-violet-200/50 dark:border-violet-700/50 mb-5">
                  <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
                <h2 className="font-serif text-2xl text-slate-900 dark:text-white mb-2 text-center">Unlock Cloud Storage</h2>
                <p className="text-slate-500 dark:text-slate-400 text-center mb-8 px-4 text-xs font-light leading-relaxed">
                  Sign in instantly with your Google Identity to securely save, compare, and version-track your resume reviews.
                </p>

                <InteractiveButton
                  onClick={handleGoogleLogin}
                  className="w-full py-3.5 text-sm bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 flex items-center justify-center gap-3 font-semibold shadow-md"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                  Continue with Google
                </InteractiveButton>
              </div>

              <div className="mt-4 text-center text-[10px] text-slate-400 font-light">
                Secured by Supabase Identity Protocol
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;