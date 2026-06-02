import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Eye, Clock, BarChart2, Edit3, Layout, AlertCircle, Wrench, ArrowUpCircle,
  Target, Briefcase, GraduationCap, CheckCircle2, AlertTriangle, Send, XCircle,
  Copy, Check, Sparkles, TrendingUp, ChevronDown, User, Mail, Phone, MapPin, ExternalLink, FolderGit2, Globe
} from 'lucide-react';
import Mascot from './Mascot';

const AnimatedCounter = ({ value, duration = 1.5, suffix = "", startTrigger = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startTrigger) return;

    let start = 0;
    const target = parseInt(value) || 0;
    if (start === target) {
      setCount(target);
      return;
    }
    let totalFrames = Math.round((duration * 1000) / 16);
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // easeOutExpo
      const current = target * (progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress));
      setCount(Math.round(current));
      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(target);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration, startTrigger]);

  return <>{startTrigger ? count : 0}{suffix}</>;
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
};

export default function AnalysisDashboard({ result }) {
  // Determine mode
  const isJobMode = !!result.match_scores;
  
  // Tab state
  const [activeTab, setActiveTab] = useState("analysis");
  const [copiedSection, setCopiedSection] = useState(null);
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);
  const [cardsLoaded, setCardsLoaded] = useState(false);

  const handleCopy = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const hasBuilder = result.resume_sections && result.resume_sections.length > 0;
  const personalInfo = result.personal_info || {};
  const userName = personalInfo.name || result.candidate_name || "there";

  // Helpers
  const getBadgeColor = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes('optimal') || s.includes('clean') || s.includes('safe') || s.includes('yes') || s.includes('good') || s.includes('high') || s.includes('above_average')) return 'blueprint-badge-green';
    if (s.includes('caution') || s.includes('inconsistent') || s.includes('partial') || s.includes('average') || s.includes('medium')) return 'blueprint-badge-amber';
    if (s.includes('risky') || s.includes('poor') || s.includes('no') || s.includes('too_long') || s.includes('too_short') || s.includes('missing') || s.includes('low') || s.includes('below_average')) return 'blueprint-badge-red';
    return 'blueprint-badge-blue';
  };

  const getRedFlagIcon = (severity) => {
    if (severity === 'high') return <XCircle className="blueprint-sug-icon text-rose-500" />;
    if (severity === 'medium') return <AlertTriangle className="blueprint-sug-icon text-amber-500" />;
    return <AlertCircle className="blueprint-sug-icon text-violet-500" />;
  };

  const getPriorityStyle = (priority) => {
    const p = parseInt(priority) || 3;
    switch(p) {
      case 1:
        return {
          bg: 'bg-rose-50/40 dark:bg-rose-950/10 hover:bg-rose-50/60 dark:hover:bg-rose-950/15',
          border: 'border-l-4 border-rose-500',
          text: 'text-rose-700 dark:text-rose-400',
          badgeBg: 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300',
          badgeText: 'Critical Priority',
          iconColor: 'text-rose-500'
        };
      case 2:
        return {
          bg: 'bg-amber-50/40 dark:bg-amber-950/10 hover:bg-amber-50/60 dark:hover:bg-amber-950/15',
          border: 'border-l-4 border-amber-500',
          text: 'text-amber-700 dark:text-amber-400',
          badgeBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
          badgeText: 'High Priority',
          iconColor: 'text-amber-500'
        };
      case 3:
        return {
          bg: 'bg-violet-50/40 dark:bg-violet-950/10 hover:bg-violet-50/60 dark:hover:bg-violet-950/15',
          border: 'border-l-4 border-violet-500',
          text: 'text-violet-700 dark:text-violet-400',
          badgeBg: 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300',
          badgeText: 'Medium Priority',
          iconColor: 'text-violet-500'
        };
      case 4:
        return {
          bg: 'bg-blue-50/40 dark:bg-blue-905/10 hover:bg-blue-50/60 dark:hover:bg-blue-905/15',
          border: 'border-l-4 border-blue-500',
          text: 'text-blue-700 dark:text-blue-400',
          badgeBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
          badgeText: 'Low-Medium Priority',
          iconColor: 'text-blue-500'
        };
      default:
        return {
          bg: 'bg-emerald-50/40 dark:bg-emerald-900/10 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/15',
          border: 'border-l-4 border-emerald-500',
          text: 'text-emerald-700 dark:text-emerald-400',
          badgeBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
          badgeText: 'Low Priority',
          iconColor: 'text-emerald-500'
        };
    }
  };

  return (
    <motion.div
      key="analysis-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="w-full blueprint-root"
    >
      {/* Personalized Greeting & Dossier Card */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 bg-white/40 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <Mascot mood="success" scale={0.75} className="flex-shrink-0" />
          <div className="text-center sm:text-left">
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
              Hey <span className="text-violet-600 dark:text-violet-400 font-bold">{userName.split(' ')[0]}</span>!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl font-light">
              We've thoroughly reviewed every section of your profile. {isJobMode ? "Here is a breakdown of how well your experience aligns with the role." : "Here are our insights on how to improve your overall resume impact."}
            </p>
          </div>
        </div>
        
        {result.personal_info && (
          <div className="flex flex-col gap-2 bg-white/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm min-w-[280px]">
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">Candidate Dossier</span>
            <div className="flex flex-col gap-1.5 mt-1 text-xs">
              {personalInfo.email && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-violet-500" />
                  <span className="truncate max-w-[200px]" title={personalInfo.email}>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-violet-500" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-violet-500" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              
              {/* Social links */}
              {(personalInfo.linkedin || personalInfo.github || personalInfo.portfolio) && (
                <div className="flex gap-3 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {personalInfo.linkedin && (
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/40 rounded-lg text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors" title="LinkedIn (Profile)">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {personalInfo.github && (
                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/40 rounded-lg text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors" title="GitHub (Code)">
                      <FolderGit2 className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {personalInfo.portfolio && (
                    <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/40 rounded-lg text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors" title="Portfolio (Globe)">
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Tabs */}
      {hasBuilder && (
        <div className="flex justify-start mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-800/60 flex gap-1 shadow-sm backdrop-blur-md">
            <button 
              onClick={() => setActiveTab("analysis")}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${activeTab === "analysis" ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}`}
            >
              <BarChart2 className="w-4 h-4" /> {isJobMode ? "Job Fit Analysis" : "General Analysis"}
            </button>
            <button 
              onClick={() => setActiveTab("builder")}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${activeTab === "builder" ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}`}
            >
              <Sparkles className="w-4 h-4" /> Smart Resume Builder
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === "analysis" && (
          <motion.div
            key="tab-analysis"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={containerVariants}
          >
            {/* ----------------------------------------------------- */}
            {/* GENERAL ANALYSIS MODE */}
            {/* ----------------------------------------------------- */}
            {!isJobMode && result.scores && (
              <>
                <p className="blueprint-section-label">Overall scores</p>
                <motion.div className="blueprint-grid" variants={containerVariants} onAnimationComplete={() => setCardsLoaded(true)}>
                  <motion.div 
                    variants={cardVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="blueprint-metric relative overflow-hidden text-emerald-900 dark:text-emerald-100 bg-emerald-50 dark:bg-emerald-900/20"
                  >
                    <Star className="blueprint-watermark text-emerald-500" />
                    <p className="blueprint-metric-label text-emerald-700 dark:text-emerald-300"><Star className="w-4 h-4" /> Overall score</p>
                    <p className="blueprint-metric-value text-emerald-600 dark:text-emerald-400"><AnimatedCounter value={result.scores.overall_score} startTrigger={cardsLoaded} /><span style={{ fontSize: '14px', color: 'inherit', opacity: 0.6 }}>/100</span></p>
                    <p className="blueprint-metric-sub text-emerald-600/80 dark:text-emerald-400/80">{result.scores.overall_verdict}</p>
                  </motion.div>
                  <motion.div 
                    variants={cardVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="blueprint-metric relative overflow-hidden text-blue-900 dark:text-blue-100 bg-blue-50 dark:bg-blue-900/20"
                  >
                    <Eye className="blueprint-watermark text-blue-500" />
                    <p className="blueprint-metric-label text-blue-700 dark:text-blue-300"><Eye className="w-4 h-4" /> ATS compatibility</p>
                    <p className="blueprint-metric-value text-blue-600 dark:text-blue-400"><AnimatedCounter value={result.scores.ats_score} startTrigger={cardsLoaded} /><span style={{ fontSize: '14px', color: 'inherit', opacity: 0.6 }}>/100</span></p>
                    <p className="blueprint-metric-sub text-blue-600/80 dark:text-blue-400/80">{result.scores.ats_verdict}</p>
                  </motion.div>
                  <motion.div 
                    variants={cardVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="blueprint-metric relative overflow-hidden text-violet-900 dark:text-violet-100 bg-violet-50 dark:bg-violet-900/20"
                  >
                    <Clock className="blueprint-watermark text-violet-500" />
                    <p className="blueprint-metric-label text-violet-700 dark:text-violet-300"><Clock className="w-4 h-4" /> Readability</p>
                    <p className="blueprint-metric-value text-violet-600 dark:text-violet-400"><AnimatedCounter value={result.scores.readability_score} startTrigger={cardsLoaded} /><span style={{ fontSize: '14px', color: 'inherit', opacity: 0.6 }}>/100</span></p>
                    <p className="blueprint-metric-sub text-violet-600/80 dark:text-violet-400/80">{result.scores.readability_verdict}</p>
                  </motion.div>
                  <motion.div 
                    variants={cardVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="blueprint-metric relative overflow-hidden text-amber-900 dark:text-amber-100 bg-amber-50 dark:bg-amber-900/20"
                  >
                    <TrendingUp className="blueprint-watermark text-amber-500" />
                    <p className="blueprint-metric-label text-amber-700 dark:text-amber-300"><TrendingUp className="w-4 h-4" /> Impact score</p>
                    <p className="blueprint-metric-value text-amber-605 dark:text-amber-500"><AnimatedCounter value={result.scores.impact_score} startTrigger={cardsLoaded} /><span style={{ fontSize: '14px', color: 'inherit', opacity: 0.6 }}>/100</span></p>
                    <p className="blueprint-metric-sub text-amber-600/80 dark:text-amber-400/80">{result.scores.impact_verdict}</p>
                  </motion.div>
                </motion.div>

                {/* Horizontal Skills Card (General mode) */}
                <motion.div variants={cardVariants} className="mt-6">
                  <p className="blueprint-section-label">Skills & keywords</p>
                  <div className="blueprint-card flex flex-col md:flex-row gap-6 p-5 items-stretch shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-grow flex-1">
                      <p className="blueprint-card-title mb-3 text-emerald-700 dark:text-emerald-400"><Wrench className="w-4 h-4 text-emerald-500" /> Detected Technical Skills & Tools</p>
                      <div className="blueprint-tag-row">
                        {result.detected_skills?.hard_skills?.map((skill, i) => (
                          <span key={`hard-${i}`} className="blueprint-tag match bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold">{skill}</span>
                        ))}
                        {result.detected_skills?.tools_and_platforms?.map((skill, i) => (
                          <span key={`tool-${i}`} className="blueprint-tag bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold">{skill}</span>
                        ))}
                        {(!result.detected_skills?.hard_skills?.length && !result.detected_skills?.tools_and_platforms?.length) && (
                          <span className="text-xs text-slate-400 italic">None detected</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="hidden md:block w-px bg-slate-200 dark:bg-slate-800 self-stretch mx-2"></div>
                    
                    <div className="flex-grow flex-1">
                      <p className="blueprint-card-title mb-3 text-slate-700 dark:text-slate-300"><User className="w-4 h-4 text-slate-500" /> Soft Skills & Certifications</p>
                      <div className="blueprint-tag-row">
                        {result.detected_skills?.soft_skills?.map((skill, i) => (
                          <span key={`soft-${i}`} className="blueprint-tag bg-slate-50/50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">{skill}</span>
                        ))}
                        {result.detected_skills?.certifications?.map((cert, i) => (
                          <span key={`cert-${i}`} className="blueprint-tag bg-violet-50/50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 font-semibold">{cert}</span>
                        ))}
                        {(!result.detected_skills?.soft_skills?.length && !result.detected_skills?.certifications?.length) && (
                          <span className="text-xs text-slate-400 italic">None detected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  {/* Column 1: Writing Quality */}
                  <motion.div variants={cardVariants} className="blueprint-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <p className="blueprint-card-title mb-4 text-slate-800 dark:text-slate-100"><Edit3 className="w-4.5 h-4.5 text-violet-500" /> Writing quality</p>
                      <div className="flex flex-col gap-4">
                        <div className="blueprint-progress-row">
                          <div className="blueprint-progress-label font-medium text-xs">
                            <span>Bullet strength</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{result.writing_quality.bullet_strength_percent}%</span>
                          </div>
                          <div className="blueprint-progress-bar"><div className="blueprint-progress-fill" style={{ width: `${result.writing_quality.bullet_strength_percent}%`, background: '#1D9E75' }}></div></div>
                        </div>
                        <div className="blueprint-progress-row">
                          <div className="blueprint-progress-label font-medium text-xs">
                            <span>Quantified impact</span>
                            <span className="text-amber-600 dark:text-amber-400 font-bold">{result.writing_quality.quantified_impact_percent}%</span>
                          </div>
                          <div className="blueprint-progress-bar"><div className="blueprint-progress-fill" style={{ width: `${result.writing_quality.quantified_impact_percent}%`, background: '#EF9F27' }}></div></div>
                        </div>
                        <div className="blueprint-progress-row">
                          <div className="blueprint-progress-label font-medium text-xs">
                            <span>Action verb usage</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{result.writing_quality.action_verb_percent}%</span>
                          </div>
                          <div className="blueprint-progress-bar"><div className="blueprint-progress-fill" style={{ width: `${result.writing_quality.action_verb_percent}%`, background: '#1D9E75' }}></div></div>
                        </div>
                        <div className="blueprint-progress-row">
                          <div className="blueprint-progress-label font-medium text-xs">
                            <span>Redundancy / filler</span>
                            <span className={`font-bold capitalize ${result.writing_quality.filler_redundancy_level === 'low' ? 'text-emerald-600' : 'text-rose-600'}`}>{result.writing_quality.filler_redundancy_level}</span>
                          </div>
                          <div className="blueprint-progress-bar"><div className="blueprint-progress-fill" style={{ width: result.writing_quality.filler_redundancy_level === 'low' ? '20%' : result.writing_quality.filler_redundancy_level === 'medium' ? '50%' : '95%', background: result.writing_quality.filler_redundancy_level === 'low' ? '#1D9E75' : '#E24B4A' }}></div></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Column 2: Layout Details */}
                  <motion.div variants={cardVariants} className="blueprint-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <p className="blueprint-card-title mb-4 text-slate-800 dark:text-slate-100"><Layout className="w-4.5 h-4.5 text-blue-500" /> Layout details</p>
                      <div className="flex flex-col gap-3">
                        <div className="blueprint-row-item"><span className="blueprint-row-label">Section order</span><span className={`blueprint-badge ${getBadgeColor(result.structure_format.section_order.status)} capitalize`}>{result.structure_format.section_order.status.replace('_', ' ')}</span></div>
                        <div className="blueprint-row-item"><span className="blueprint-row-label">Page length</span><span className="blueprint-row-val">{result.structure_format.page_length.value} pages</span></div>
                        <div className="blueprint-row-item"><span className="blueprint-row-label">Font & spacing</span><span className={`blueprint-badge ${getBadgeColor(result.structure_format.font_spacing.status)} capitalize`}>{result.structure_format.font_spacing.status}</span></div>
                        <div className="blueprint-row-item"><span className="blueprint-row-label">Columns / tables</span><span className={`blueprint-badge ${getBadgeColor(result.structure_format.columns_tables.status)} capitalize`}>{result.structure_format.columns_tables.status}</span></div>
                        <div className="blueprint-row-item"><span className="blueprint-row-label">Header completeness</span><span className={`blueprint-badge ${result.structure_format.header_completeness.missing?.length > 0 ? 'blueprint-badge-amber' : 'blueprint-badge-green'}`}>{result.structure_format.header_completeness.missing?.length > 0 ? 'Missing items' : 'Complete'}</span></div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Column 3: Red Flags */}
                  <motion.div variants={cardVariants} className="blueprint-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <p className="blueprint-card-title mb-4 text-slate-800 dark:text-slate-100"><AlertCircle className="w-4.5 h-4.5 text-rose-500" /> Red flags detected</p>
                      <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto pr-1">
                        {result.red_flags && result.red_flags.length > 0 ? result.red_flags.map((flag, idx) => (
                          <div key={idx} className="blueprint-suggestion">
                            {getRedFlagIcon(flag.severity)}
                            <div className="blueprint-sug-text">
                              {flag.issue}
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Fix: {flag.fix}</span>
                            </div>
                          </div>
                        )) : (
                          <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">No major red flags detected! Excellent job.</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div variants={cardVariants} className="mt-8">
                  <p className="blueprint-section-label">Improvement suggestions (priority order - click to expand)</p>
                  <div className="flex flex-col gap-3">
                    {result.improvement_suggestions && result.improvement_suggestions.map((sug, idx) => {
                      const pStyle = getPriorityStyle(sug.priority);
                      const isExpanded = expandedSuggestion === `general-${idx}`;
                      return (
                        <motion.div 
                          key={idx}
                          whileHover={{ scale: 1.005, x: 4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className={`p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm cursor-pointer transition-all duration-300 flex flex-col gap-2 ${pStyle.border} ${pStyle.bg}`}
                          onClick={() => setExpandedSuggestion(isExpanded ? null : `general-${idx}`)}
                        >
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-3">
                              <ArrowUpCircle className={`w-5 h-5 ${pStyle.iconColor}`} />
                              <span className="font-serif text-sm font-semibold text-slate-800 dark:text-slate-200">{sug.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full ${pStyle.badgeBg}`}>{pStyle.badgeText}</span>
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-slate-400"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </motion.div>
                            </div>
                          </div>
                          
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex flex-col gap-2"
                              >
                                <p className="font-light">{sug.description}</p>
                                <div className={`mt-1 p-2.5 rounded-xl bg-white/50 dark:bg-slate-900/40 text-[11px] font-medium flex items-start gap-2 ${pStyle.text}`}>
                                  <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold block uppercase text-[9px] tracking-wider mb-0.5">Why it matters</span>
                                    {sug.why_it_matters}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}

            {/* ----------------------------------------------------- */}
            {/* JOB ROLE ANALYSIS MODE */}
            {/* ----------------------------------------------------- */}
            {isJobMode && result.match_scores && (
              <>
                <p className="blueprint-section-label">Match overview</p>
                <motion.div className="blueprint-grid" variants={containerVariants} onAnimationComplete={() => setCardsLoaded(true)}>
                  <motion.div 
                    variants={cardVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="blueprint-metric relative overflow-hidden text-violet-900 dark:text-violet-100 bg-violet-50 dark:bg-violet-900/20"
                  >
                    <Target className="blueprint-watermark text-violet-500" />
                    <p className="blueprint-metric-label text-violet-700 dark:text-violet-300"><Target className="w-4 h-4" /> Overall match</p>
                    <p className="blueprint-metric-value text-violet-600 dark:text-violet-400"><AnimatedCounter value={result.match_scores.overall_match_score} startTrigger={cardsLoaded} /><span style={{ fontSize: '14px', color: 'inherit', opacity: 0.6 }}>/100</span></p>
                    <p className="blueprint-metric-sub text-violet-600/80 dark:text-violet-400/80">{result.match_scores.overall_verdict}</p>
                  </motion.div>
                  <motion.div 
                    variants={cardVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="blueprint-metric relative overflow-hidden text-emerald-900 dark:text-emerald-100 bg-emerald-50 dark:bg-emerald-900/20"
                  >
                    <Wrench className="blueprint-watermark text-emerald-500" />
                    <p className="blueprint-metric-label text-emerald-700 dark:text-emerald-300"><Wrench className="w-4 h-4" /> Skills match</p>
                    <p className="blueprint-metric-value text-emerald-600 dark:text-emerald-400"><AnimatedCounter value={result.match_scores.skills_match_score} startTrigger={cardsLoaded} suffix="%" /></p>
                    <p className="blueprint-metric-sub text-emerald-600/80 dark:text-emerald-400/80">Required skills coverage</p>
                  </motion.div>
                  <motion.div 
                    variants={cardVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="blueprint-metric relative overflow-hidden text-blue-900 dark:text-blue-100 bg-blue-50 dark:bg-blue-900/20"
                  >
                    <Briefcase className="blueprint-watermark text-blue-500" />
                    <p className="blueprint-metric-label text-blue-700 dark:text-blue-300"><Briefcase className="w-4 h-4" /> Experience fit</p>
                    <p className="blueprint-metric-value text-blue-600 dark:text-blue-400"><AnimatedCounter value={result.match_scores.experience_match_score} startTrigger={cardsLoaded} suffix="%" /></p>
                    <p className="blueprint-metric-sub text-blue-600/80 dark:text-blue-400/80">{result.experience_alignment.years_candidate.match(/\d+(\.\d+)?/)?.[0] || '1.5'}+ Years Exp</p>
                  </motion.div>
                  <motion.div 
                    variants={cardVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="blueprint-metric relative overflow-hidden text-amber-900 dark:text-amber-100 bg-amber-50 dark:bg-amber-900/20"
                  >
                    <GraduationCap className="blueprint-watermark text-amber-500" />
                    <p className="blueprint-metric-label text-amber-700 dark:text-amber-300"><GraduationCap className="w-4 h-4" /> Education fit</p>
                    <p className="blueprint-metric-value text-amber-600 dark:text-amber-500"><AnimatedCounter value={result.match_scores.education_match_score} startTrigger={cardsLoaded} suffix="%" /></p>
                    <p className="blueprint-metric-sub text-amber-600/80 dark:text-amber-400/80">Keyword coverage: {result.match_scores.keyword_coverage_score}%</p>
                  </motion.div>
                </motion.div>

                {/* Horizontal Skills Card (Job Fit mode) */}
                <motion.div variants={cardVariants} className="mt-6">
                  <p className="blueprint-section-label">Skills alignment</p>
                  <div className="blueprint-card flex flex-col md:flex-row gap-6 p-5 items-stretch shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex-grow flex-1">
                      <p className="blueprint-card-title mb-3 text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched Skills (Strengths)</p>
                      <div className="blueprint-tag-row">
                        {result.skills_gap.matched_skills?.length > 0 ? result.skills_gap.matched_skills.map((skill, i) => (
                          <span key={`match-${i}`} className="blueprint-tag match bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold">{skill}</span>
                        )) : <span className="text-xs text-slate-400 italic">None detected</span>}
                      </div>
                    </div>
                    
                    <div className="hidden md:block w-px bg-slate-200 dark:bg-slate-800 self-stretch mx-2"></div>
                    
                    <div className="flex-grow flex-1">
                      <p className="blueprint-card-title mb-3 text-rose-700 dark:text-rose-400"><XCircle className="w-4 h-4 text-rose-500" /> Gaps & Missing Skills</p>
                      <div className="blueprint-tag-row">
                        {result.skills_gap.missing_skills?.length > 0 || result.skills_gap.partial_skills?.length > 0 ? (
                          <>
                            {result.skills_gap.missing_skills?.map((item, i) => (
                              <span key={`miss-${i}`} className="blueprint-tag miss bg-rose-50/50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-semibold" title={item.importance}>{item.skill}</span>
                            ))}
                            {result.skills_gap.partial_skills?.map((item, i) => (
                              <span key={`partial-${i}`} className="blueprint-tag partial bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-semibold" title={item.note}>{item.skill} (Partial)</span>
                            ))}
                          </>
                        ) : (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> All job requirements met!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* THE 3 REVAMPED CARDS IN JOB ROLE MODE */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  
                  {/* Revamped Card 1: Competitive Benchmark */}
                  <motion.div variants={cardVariants} className="blueprint-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <p className="blueprint-card-title mb-4 text-slate-800 dark:text-slate-100"><Eye className="w-4.5 h-4.5 text-violet-500" /> Competitive benchmark</p>
                      <div className="grid grid-cols-2 gap-3.5">
                        
                        {/* Skill Coverage */}
                        <div className="bg-slate-50/70 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Skills Coverage</span>
                          <div className="mt-2.5 flex items-center gap-1.5">
                            <span className={`blueprint-badge text-[11px] py-0.5 px-2 ${getBadgeColor(result.benchmark.skills_coverage_vs_avg.rating)}`}>
                              {result.benchmark.skills_coverage_vs_avg.rating.replace('_', ' ')}
                            </span>
                          </div>
                          {result.benchmark.skills_coverage_vs_avg.note && (
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light mt-1.5 leading-snug">
                              {result.benchmark.skills_coverage_vs_avg.note}
                            </p>
                          )}
                        </div>

                        {/* Experience Depth */}
                        <div className="bg-slate-50/70 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Exp Depth</span>
                          <div className="mt-2.5 flex items-center gap-1.5">
                            <span className={`blueprint-badge text-[11px] py-0.5 px-2 ${getBadgeColor(result.benchmark.experience_depth_vs_avg.rating)}`}>
                              {result.benchmark.experience_depth_vs_avg.rating.replace('_', ' ')}
                            </span>
                          </div>
                          {result.benchmark.experience_depth_vs_avg.note && (
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light mt-1.5 leading-snug">
                              {result.benchmark.experience_depth_vs_avg.note}
                            </p>
                          )}
                        </div>

                        {/* Portfolio */}
                        <div className="bg-slate-50/70 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Portfolio</span>
                          <div className="mt-2.5 flex items-center gap-1.5">
                            {result.benchmark.portfolio_projects.status.toLowerCase().includes('present') ? (
                              <span className="blueprint-badge blueprint-badge-green text-[11px] py-0.5 px-2">Present</span>
                            ) : (
                              <span className="blueprint-badge blueprint-badge-red text-[11px] py-0.5 px-2">Absent</span>
                            )}
                          </div>
                          {result.benchmark.portfolio_projects.note && (
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light mt-1.5 leading-snug">
                              {result.benchmark.portfolio_projects.note}
                            </p>
                          )}
                        </div>

                        {/* Certifications */}
                        <div className="bg-slate-50/70 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Credentials</span>
                          <div className="mt-2.5 flex items-center gap-1">
                            <span className={`text-[11px] font-bold ${result.benchmark.certifications_vs_avg.count > 0 ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500'}`}>
                              {result.benchmark.certifications_vs_avg.count} Credentials
                            </span>
                          </div>
                          {result.benchmark.certifications_vs_avg.note && (
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-light mt-1.5 leading-snug">
                              {result.benchmark.certifications_vs_avg.note}
                            </p>
                          )}
                        </div>

                      </div>
                    </div>
                  </motion.div>

                  {/* Revamped Card 2: Experience Alignment */}
                  <motion.div variants={cardVariants} className="blueprint-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4">
                    <div>
                      <p className="blueprint-card-title mb-3 text-slate-800 dark:text-slate-100"><Clock className="w-4.5 h-4.5 text-emerald-500" /> Experience alignment</p>
                      
                      {/* Highlighted Years Box */}
                      <div className="flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-3.5">
                        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900 flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            {result.experience_alignment.years_candidate.match(/\d+(\.\d+)?/)?.[0] || '1.5'}
                          </span>
                          <span className="text-[8px] uppercase font-bold text-emerald-500 tracking-wider">Years</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Experience Details</span>
                          <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed mt-0.5">
                            {result.experience_alignment.years_candidate}
                          </p>
                        </div>
                      </div>

                      {/* Leadership & Domain relevance in a horizontal row */}
                      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                        <div className="bg-slate-50/70 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Leadership fit</span>
                          <span className={`blueprint-badge text-center text-[11px] py-0.5 ${result.experience_alignment.leadership_shown ? 'blueprint-badge-green' : 'blueprint-badge-amber'}`}>
                            {result.experience_alignment.leadership_shown ? 'Demonstrated' : 'Not Shown'}
                          </span>
                        </div>
                        <div className="bg-slate-50/70 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Domain fit</span>
                          <span className={`blueprint-badge text-center text-[11px] py-0.5 ${getBadgeColor(result.experience_alignment.domain_relevance?.level || 'high')}`}>
                            {result.experience_alignment.domain_relevance?.level || 'High'}
                          </span>
                        </div>
                      </div>

                      {/* Company stage match description block */}
                      {result.experience_alignment.company_size_match && (
                        <div className="bg-emerald-50/20 dark:bg-emerald-950/10 p-3 rounded-xl border border-emerald-100/30 dark:border-emerald-900/20 text-xs leading-relaxed">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[9px] tracking-wider block mb-1">Company Size Match</span>
                          <p className="text-slate-600 dark:text-slate-400 font-light">
                            {result.experience_alignment.company_size_match}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Revamped Card 3: JD Keyword Coverage & Language Parsing */}
                  <motion.div variants={cardVariants} className="blueprint-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <p className="blueprint-card-title mb-4 text-slate-800 dark:text-slate-100"><Layout className="w-4.5 h-4.5 text-amber-500" /> Language parsing & Keywords</p>
                      
                      <div className="flex flex-col gap-3">
                        {/* Hard Skills */}
                        <div className="blueprint-progress-row">
                          <div className="blueprint-progress-label font-medium text-xs">
                            <span className="text-slate-600 dark:text-slate-300">Hard Skill Keywords</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{result.keyword_coverage.hard_skills_coverage}%</span>
                          </div>
                          <div className="blueprint-progress-bar bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${result.keyword_coverage.hard_skills_coverage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            />
                          </div>
                        </div>

                        {/* Soft Skills */}
                        <div className="blueprint-progress-row">
                          <div className="blueprint-progress-label font-medium text-xs">
                            <span className="text-slate-600 dark:text-slate-300">Soft Skill Keywords</span>
                            <span className="text-violet-600 dark:text-violet-400 font-bold">{result.keyword_coverage.soft_skills_coverage}%</span>
                          </div>
                          <div className="blueprint-progress-bar bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${result.keyword_coverage.soft_skills_coverage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                            />
                          </div>
                        </div>

                        {/* Role phrases */}
                        <div className="blueprint-progress-row">
                          <div className="blueprint-progress-label font-medium text-xs">
                            <span className="text-slate-600 dark:text-slate-300">Role-Specific Phrases</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{result.keyword_coverage.role_specific_phrases_coverage}%</span>
                          </div>
                          <div className="blueprint-progress-bar bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${result.keyword_coverage.role_specific_phrases_coverage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                            />
                          </div>
                        </div>

                        {/* Culture/Values */}
                        <div className="blueprint-progress-row">
                          <div className="blueprint-progress-label font-medium text-xs">
                            <span className="text-slate-600 dark:text-slate-300">Company Values Echo</span>
                            <span className={`${result.keyword_coverage.company_values_coverage > 0 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>{result.keyword_coverage.company_values_coverage}%</span>
                          </div>
                          <div className="blueprint-progress-bar bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${result.keyword_coverage.company_values_coverage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${result.keyword_coverage.company_values_coverage > 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Render missing keywords tags block */}
                      {result.keyword_coverage.top_missing_keywords && result.keyword_coverage.top_missing_keywords.length > 0 && (
                        <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
                          <span className="text-[10px] uppercase font-bold text-rose-500 dark:text-rose-400 tracking-wider block mb-2">Critical Missing Keywords:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {result.keyword_coverage.top_missing_keywords.map((kw, i) => (
                              <span key={`missing-kw-${i}`} className="blueprint-tag miss bg-rose-50/40 dark:bg-rose-900/15 border-rose-200/50 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-[11px] py-1 px-2.5 rounded-full font-medium transition-transform hover:scale-105">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </motion.div>

                </div>

                <motion.div variants={cardVariants} className="mt-8">
                  <p className="blueprint-section-label">Tailoring recommendations (priority order - click to expand)</p>
                  <div className="flex flex-col gap-3">
                    {result.tailoring_recommendations?.map((sug, idx) => {
                      const pStyle = getPriorityStyle(sug.priority);
                      const isExpanded = expandedSuggestion === `job-${idx}`;
                      return (
                        <motion.div 
                          key={idx}
                          whileHover={{ scale: 1.005, x: 4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className={`p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm cursor-pointer transition-all duration-300 flex flex-col gap-2 ${pStyle.border} ${pStyle.bg}`}
                          onClick={() => setExpandedSuggestion(isExpanded ? null : `job-${idx}`)}
                        >
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-3">
                              <Edit3 className={`w-5 h-5 ${pStyle.iconColor}`} />
                              <span className="font-serif text-sm font-semibold text-slate-800 dark:text-slate-200">{sug.title || `Recommendation #${sug.priority}`}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700`}>{sug.type}</span>
                              <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full ${pStyle.badgeBg}`}>{pStyle.badgeText}</span>
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-slate-400"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </motion.div>
                            </div>
                          </div>
                          
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex flex-col gap-2"
                              >
                                <p className="font-light">{sug.instruction}</p>
                                <div className={`mt-1 p-2.5 rounded-xl bg-white/50 dark:bg-slate-900/40 text-[11px] font-medium flex items-start gap-2 ${pStyle.text}`}>
                                  <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold block uppercase text-[9px] tracking-wider mb-0.5">Impact</span>
                                    {sug.impact}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div variants={cardVariants} className="mt-8">
                  <p className="blueprint-section-label">Application verdict</p>
                  <div className="blueprint-card p-6 shadow-sm hover:shadow-md">
                    <div className="flex items-start sm:items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-800">
                        <Send className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-lg font-serif font-medium text-slate-900 dark:text-white mb-1">{result.verdict.headline}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                          {result.verdict.reasoning}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-4 items-center">
                          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300">
                            Match after edits: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{result.verdict.estimated_match_after_edits}%</span>
                          </span>
                          {!result.verdict.ats_will_pass && (
                            <span className="text-xs font-semibold px-3 py-1 bg-rose-50 dark:bg-rose-900/30 rounded-full text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" /> Blocker: {result.verdict.ats_blocker}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {/* ----------------------------------------------------- */}
        {/* SMART RESUME BUILDER MODE */}
        {/* ----------------------------------------------------- */}
        {activeTab === "builder" && hasBuilder && (
          <motion.div 
            key="tab-builder"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8 mt-2"
          >
            {result.resume_sections.map((section, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md"
              >
                {/* Section Header */}
                <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
                  <h3 className="font-serif text-lg text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-ping"></div>
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
