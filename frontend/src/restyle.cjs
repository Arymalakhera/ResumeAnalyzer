const fs = require('fs');
let jsx = fs.readFileSync('App.jsx', 'utf8');

const replacements = [
  // Typography
  [/text-slate-800/g, 'text-white'],
  [/text-slate-700/g, 'text-white/90'],
  [/text-slate-600/g, 'text-white/80'],
  [/text-slate-500/g, 'text-white/60'],
  [/text-rose-600/g, 'text-teal-400'], // The accent color is now teal
  [/text-rose-500/g, 'text-teal-400'],
  [/text-rose-400/g, 'text-teal-400'],

  // Cards and Backgrounds
  [/bg-white\/60/g, 'bg-white/10'],
  [/bg-white\/50/g, 'bg-white/10'],
  [/bg-white/g, 'bg-white/10'],
  [/bg-slate-50\/80/g, 'bg-white/5'],
  [/bg-slate-50\/50/g, 'bg-white/10'],
  [/bg-slate-50/g, 'bg-white/5'],
  [/bg-slate-100\/80/g, 'bg-white/10'],
  [/bg-slate-100/g, 'bg-white/10'],

  // Borders
  [/border-slate-200\/50/g, 'border-white/10'],
  [/border-slate-200/g, 'border-white/20'],
  [/border-rose-400\/50/g, 'border-teal-400/50'],
  [/border-rose-400\/30/g, 'border-teal-400/30'],

  // Gradients and accents
  [/bg-gradient-to-r from-rose-400 to-teal-400/g, 'bg-teal-400'],
  [/hover:from-rose-300 hover:to-teal-300/g, 'hover:bg-teal-300'],
  [/from-rose-400 via-orange-400 to-teal-400/g, 'from-white via-teal-100 to-teal-300'], // Main title
  [/bg-gradient-to-br from-rose-300 to-teal-300/g, 'bg-teal-400'],
  [/bg-gradient-to-br from-rose-400\/20 to-teal-400\/20/g, 'bg-teal-400/20'],
  [/from-amber-500 via-orange-400 to-rose-500/g, 'from-teal-300 via-emerald-400 to-cyan-500'], // Progress bar
  [/bg-rose-400\/20/g, 'bg-teal-400/20'],
  [/bg-rose-400\/0/g, 'bg-teal-400/0'],
  [/bg-rose-400\/5/g, 'bg-teal-400/5'],
  
  // Shadows
  [/shadow-\[0_0_20px_rgba\(251,113,133,0\.3\)\]/g, 'shadow-[0_0_20px_rgba(45,212,191,0.4)]'],
  [/shadow-\[0_0_40px_rgba\(251,113,133,0\.6\)\]/g, 'shadow-[0_0_40px_rgba(45,212,191,0.6)]'],
  [/rgba\(251,113,133,0\.15\)/g, 'rgba(45,212,191,0.15)'],
  [/rgba\(251,113,133,0\.5\)/g, 'rgba(45,212,191,0.5)'],
  [/rgba\(251,113,133,0\.05\)/g, 'rgba(45,212,191,0.05)'],

  // Misc
  [/accent-rose-400/g, 'accent-teal-400'],
];

replacements.forEach(([regex, replacement]) => {
  jsx = jsx.replace(regex, replacement);
});

// Specific fix for border-white/20 in LiftCard
jsx = jsx.replace('border border-white/10 shadow-xl', 'border border-white/20 shadow-xl');

// Specific fix for InteractiveButton text since we made primary button bg-teal-400
jsx = jsx.replace('bg-teal-400 hover:bg-teal-300 text-white', 'bg-teal-400 hover:bg-teal-300 text-slate-900');

fs.writeFileSync('App.jsx', jsx);
console.log('Restyle complete');
