import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Mascot({ mood = "happy", className = "", scale = 1 }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (mood !== "happy" && mood !== "success") return;
    
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5; // -0.5 to 0.5
      const y = (e.clientY / window.innerHeight) - 0.5; // -0.5 to 0.5
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mood]);

  // Pupil translation based on mouse
  const pupilStyle = (mood === "happy" || mood === "success") ? {
    transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 14}px)`
  } : {};

  // Custom colors and styles depending on mood
  const getBodyBg = () => {
    switch (mood) {
      case "loading": return "bg-[#A3ACFF] dark:bg-[#3f438c]"; // Curious bluish-violet
      case "success": return "bg-[#96EBA6] dark:bg-[#20663d]"; // Happy green
      case "error": return "bg-[#FFB9B9] dark:bg-[#7a1e1e]"; // Sad red
      default: return "bg-[#B3B9FF] dark:bg-[#343b87]"; // Standard cute blue
    }
  };

  return (
    <div className={`pointer-events-none select-none flex items-center justify-center ${className}`} style={{ transform: `scale(${scale})`, transformOrigin: 'center bottom' }}>
      <motion.div
        animate={mood === "loading" ? {
          y: [0, -8, 0],
          scaleY: [1, 0.95, 1.05, 1]
        } : mood === "success" ? {
          y: [0, -12, 0],
          scaleY: [1, 0.85, 1.1, 1],
          rotate: [0, -3, 3, 0]
        } : {
          y: [0, 4, 0]
        }}
        transition={mood === "loading" ? {
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut"
        } : mood === "success" ? {
          duration: 1.2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeOut"
        } : {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`relative w-28 h-24 rounded-t-[48px] rounded-b-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center pt-4 ${getBodyBg()} transition-colors duration-500`}
      >
        {/* Blush Cheeks */}
        {mood !== "error" && (
          <motion.div 
            animate={mood === "success" ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute bottom-6 left-3 w-4 h-2.5 bg-[#FFA5C0]/65 rounded-full filter blur-[1px]"
          />
        )}
        {mood !== "error" && (
          <motion.div 
            animate={mood === "success" ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute bottom-6 right-3 w-4 h-2.5 bg-[#FFA5C0]/65 rounded-full filter blur-[1px]"
          />
        )}
        {mood === "error" && (
          <>
            <div className="absolute bottom-6 left-4 w-4 h-2.5 bg-blue-300/40 rounded-full filter blur-[1px]" />
            <div className="absolute bottom-6 right-4 w-4 h-2.5 bg-blue-300/40 rounded-full filter blur-[1px]" />
          </>
        )}

        {/* Mouth */}
        {mood === "happy" && (
          <div className="absolute bottom-5 w-3 h-1.5 border-b-[3px] border-slate-800 dark:border-b-slate-100 rounded-b-full" />
        )}
        {mood === "success" && (
          <div className="absolute bottom-[18px] w-4 h-3 bg-rose-400 rounded-b-full border-b-[2.5px] border-x-[1px] border-slate-800 dark:border-slate-100 flex items-center justify-center overflow-hidden">
            <div className="w-2.5 h-1.5 bg-rose-500 rounded-full mt-1.5" />
          </div>
        )}
        {mood === "loading" && (
          <div className="absolute bottom-5 w-2.5 h-2.5 border-[2px] border-slate-800 dark:border-slate-100 rounded-full bg-slate-900/10 dark:bg-white/10" />
        )}
        {mood === "error" && (
          <div className="absolute bottom-6 w-3.5 h-1.5 border-t-[2.5px] border-slate-800 dark:border-t-slate-100 rounded-t-full" />
        )}

        {/* Eyes Container */}
        <div className="flex gap-4 justify-center items-center">
          {/* Left Eye */}
          <div className="w-5 h-7 bg-white rounded-full flex items-center justify-center relative shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
            {mood === "loading" ? (
              <motion.div
                animate={{
                  x: [0, 3, 0, -3, 0],
                  y: [0, -4, 0, 4, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-3 h-3 bg-slate-900 rounded-full"
              />
            ) : mood === "error" ? (
              <div className="w-3 h-[2px] bg-slate-700 rotate-45 relative">
                <div className="w-3 h-[2px] bg-slate-700 -rotate-90 absolute" />
              </div>
            ) : mood === "success" ? (
              <div className="w-3.5 h-1 border-b-[2.5px] border-slate-800 dark:border-b-slate-100 rounded-b-full mb-2" />
            ) : (
              <div
                className="absolute w-3 h-3 bg-slate-900 rounded-full transition-transform duration-75 ease-out flex items-start justify-end p-0.5"
                style={pupilStyle}
              >
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
            )}
          </div>

          {/* Right Eye */}
          <div className="w-5 h-7 bg-white rounded-full flex items-center justify-center relative shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
            {mood === "loading" ? (
              <motion.div
                animate={{
                  x: [0, -3, 0, 3, 0],
                  y: [0, 4, 0, -4, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-3 h-3 bg-slate-900 rounded-full"
              />
            ) : mood === "error" ? (
              <div className="w-3 h-[2px] bg-slate-700 -rotate-45 relative">
                <div className="w-3 h-[2px] bg-slate-700 rotate-90 absolute" />
              </div>
            ) : mood === "success" ? (
              <div className="w-3.5 h-1 border-b-[2.5px] border-slate-800 dark:border-b-slate-100 rounded-b-full mb-2" />
            ) : (
              <div
                className="absolute w-3 h-3 bg-slate-900 rounded-full transition-transform duration-75 ease-out flex items-start justify-end p-0.5"
                style={pupilStyle}
              >
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
