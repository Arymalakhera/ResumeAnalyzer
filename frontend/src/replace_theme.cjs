const fs = require('fs');

let content = fs.readFileSync('App.jsx', 'utf8');

// Colors replacement mapping
const replacements = [
  // Base background and text
  [/bg-slate-950/g, 'bg-slate-50'],
  [/from-slate-950 via-indigo-950\/20 to-slate-950 text-white/g, 'from-rose-50 via-teal-50 to-amber-50 text-slate-800'],
  [/text-white/g, 'text-slate-800'],
  [/text-slate-400/g, 'text-slate-500'],
  [/text-slate-300/g, 'text-slate-600'],
  [/text-slate-200/g, 'text-slate-700'],
  [/text-slate-100/g, 'text-slate-800'],
  
  // Backgrounds and borders
  [/bg-slate-900/g, 'bg-white'],
  [/bg-slate-800/g, 'bg-slate-100'],
  [/border-slate-700/g, 'border-slate-200'],
  [/border-slate-800/g, 'border-slate-200'],
  [/backdrop-blur-xl bg-white\/5 border border-white\/10/g, 'backdrop-blur-xl bg-white/60 border border-white shadow-xl'],
  
  // Gradients (Fuchsia & Blue -> Peach & Teal)
  [/from-fuchsia-500 to-blue-500/g, 'from-rose-400 to-teal-400'],
  [/from-fuchsia-400 hover:to-blue-400/g, 'from-rose-300 hover:to-teal-300'],
  [/from-fuchsia-400 to-blue-400/g, 'from-rose-400 to-teal-400'],
  [/from-fuchsia-600 to-blue-600/g, 'from-rose-400 to-teal-400'],
  [/from-fuchsia-600 to-purple-600/g, 'from-rose-400 to-teal-400'],
  [/hover:from-fuchsia-500 hover:to-purple-500/g, 'hover:from-rose-500 hover:to-teal-500'],
  [/from-fuchsia-400 via-purple-400 to-blue-400/g, 'from-rose-400 via-orange-400 to-teal-400'],
  [/from-fuchsia-500\/20 to-purple-500\/20/g, 'from-rose-400/20 to-teal-400/20'],
  [/bg-gradient-to-br from-fuchsia-400 to-blue-500/g, 'bg-gradient-to-br from-rose-300 to-teal-300'],
  [/bg-gradient-to-r from-fuchsia-500 to-blue-500/g, 'bg-gradient-to-r from-rose-400 to-teal-400'],
  
  // Specific glow shadows
  [/rgba\(217,70,239,0\.3\)/g, 'rgba(251,113,133,0.3)'],
  [/rgba\(217,70,239,0\.6\)/g, 'rgba(251,113,133,0.6)'],
  [/rgba\(217,70,239,0\.15\)/g, 'rgba(251,113,133,0.15)'],
  [/rgba\(217,70,239,0\.5\)/g, 'rgba(251,113,133,0.5)'],
  [/rgba\(217,70,239,0\.05\)/g, 'rgba(251,113,133,0.05)'],
  [/rgba\(59,130,246,0\.5\)/g, 'rgba(45,212,191,0.5)'],
  [/shadow-fuchsia-500\/20/g, 'shadow-rose-300/50'],
  
  // Text accents
  [/text-fuchsia-400/g, 'text-rose-500'],
  [/text-blue-400/g, 'text-teal-500'],
  [/text-fuchsia-300/g, 'text-rose-600'],
  [/text-fuchsia-50/g, 'text-rose-900'],
  [/text-cyan-50/g, 'text-cyan-900'],
  [/text-emerald-50/g, 'text-emerald-900'],
  [/text-rose-50/g, 'text-red-900'],
  [/text-indigo-50/g, 'text-indigo-900'],
  
  // Borders & Backgrounds accents
  [/border-fuchsia-500\/50/g, 'border-rose-400/50'],
  [/border-fuchsia-500\/30/g, 'border-rose-400/30'],
  [/bg-fuchsia-500\/0/g, 'bg-rose-400/0'],
  [/bg-fuchsia-500\/5/g, 'bg-rose-400/5'],
  [/bg-fuchsia-500\/20/g, 'bg-rose-400/20'],
  [/border-fuchsia-500/g, 'border-rose-400'],
  [/border-blue-500/g, 'border-teal-400'],
  [/accent-fuchsia-500/g, 'accent-rose-400'],
  
  // Blobs
  [/bg-pink-500\/20/g, 'bg-rose-200/50 mix-blend-multiply'],
  [/bg-blue-600\/20/g, 'bg-teal-200/50 mix-blend-multiply'],
  [/bg-purple-600\/20/g, 'bg-amber-200/50 mix-blend-multiply'],
  
  // Other small fixes for light theme
  [/bg-slate-950\/50/g, 'bg-slate-50/50'],
  [/bg-slate-950\/80/g, 'bg-slate-50/80'],
  [/shadow-\[0_8px_30px_rgb\(0,0,0,0\.12\)\]/g, 'shadow-[0_8px_30px_rgb(0,0,0,0.05)]'],
  [/shadow-inner/g, 'shadow-sm'], // Light theme doesn't need heavy inner shadows usually
];

replacements.forEach(([regex, replacement]) => {
  content = content.replace(regex, replacement);
});

// Final cleanup: mix-blend-screen left over
content = content.replace(/mix-blend-screen/g, '');

fs.writeFileSync('App.jsx', content);
console.log('Replacements complete');
