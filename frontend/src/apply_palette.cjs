const fs = require('fs');

// UPDATE index.css
let css = fs.readFileSync('index.css', 'utf8');

// Replace selection and body bg colors
css = css.replace(/bg-slate-50 text-slate-800/g, 'bg-[#0D120E] text-[#E8E9E0]');
css = css.replace(/selection:bg-teal-500\/30 selection:text-teal-900/g, 'selection:bg-[#6D7E5F]/50 selection:text-[#E8E9E0]');
css = css.replace(/bg-slate-50/g, 'bg-[#0D120E]');
css = css.replace(/bg-slate-300/g, 'bg-[#6D7E5F]');
css = css.replace(/border-slate-50/g, 'border-[#0D120E]');
css = css.replace(/bg-slate-400/g, 'bg-[#92A079]');

// Replace gradient
css = css.replace(/linear-gradient\(to right bottom, #a8709b, #915c86, #7b4972, #66375f, #51254c\)/g, 'linear-gradient(to right bottom, #0D120E, #45553D, #6D7E5F)');

fs.writeFileSync('index.css', css);


// UPDATE App.jsx
let jsx = fs.readFileSync('App.jsx', 'utf8');

const replacements = [
  // Backgrounds and overlays
  [/bg-slate-950\/60/g, 'bg-[#0D120E]/80'],
  [/bg-slate-950\/40/g, 'bg-[#45553D]/40'],
  [/bg-slate-900/g, 'bg-[#45553D]'],
  [/bg-slate-800/g, 'bg-[#6D7E5F]'],
  
  // Borders
  [/border-slate-800\/50/g, 'border-[#6D7E5F]/30'],
  [/border-slate-800/g, 'border-[#6D7E5F]/50'],
  
  // Text
  [/text-white/g, 'text-[#E8E9E0]'],
  [/text-slate-200/g, 'text-[#E8E9E0]'],
  [/text-slate-300/g, 'text-[#C4C8AC]'],
  [/text-slate-400/g, 'text-[#C4C8AC]'],
  [/text-slate-900/g, 'text-[#0D120E]'], // Ensure buttons have dark text

  // Accents (Teal -> Olive)
  [/text-teal-400/g, 'text-[#92A079]'],
  [/text-teal-500/g, 'text-[#6D7E5F]'],
  [/bg-teal-400/g, 'bg-[#92A079]'],
  [/hover:bg-teal-300/g, 'hover:bg-[#C4C8AC]'],
  [/border-teal-400/g, 'border-[#92A079]'],
  [/bg-teal-400\/5/g, 'bg-[#92A079]/5'],
  [/bg-teal-400\/20/g, 'bg-[#92A079]/20'],
  
  // Specific gradients
  [/from-teal-300 via-emerald-400 to-cyan-500/g, 'from-[#C4C8AC] via-[#92A079] to-[#6D7E5F]'],
  [/from-white via-teal-100 to-teal-300/g, 'from-[#E8E9E0] via-[#C4C8AC] to-[#92A079]'],
  [/from-rose-50 via-teal-50 to-amber-50/g, 'from-[#0D120E] via-[#45553D] to-[#6D7E5F]'],
  
  // Background blobs
  [/bg-rose-200\/50/g, 'bg-[#6D7E5F]/20'],
  [/bg-teal-200\/50/g, 'bg-[#92A079]/20'],
  [/bg-amber-200\/50/g, 'bg-[#C4C8AC]/20'],

  // Shadows/rgba colors
  [/rgba\(45,212,191/g, 'rgba(146,160,121'], // #92A079 is RGB 146, 160, 121

  // Leftover hardcoded text
  [/text-emerald-400/g, 'text-[#92A079]'],
  [/text-rose-300/g, 'text-[#C4C8AC]'],
  [/bg-rose-950\/40/g, 'bg-[#45553D]/40'],
  [/border-rose-500\/40/g, 'border-[#6D7E5F]/40'],
  [/shadow-\[0_0_10px_rgba\(244,63,94,0\.15\)\]/g, 'shadow-[0_0_10px_rgba(109,126,95,0.15)]'],
  [/hover:shadow-\[0_0_15px_rgba\(244,63,94,0\.4\)\]/g, 'hover:shadow-[0_0_15px_rgba(109,126,95,0.4)]'],
];

replacements.forEach(([regex, replacement]) => {
  jsx = jsx.replace(regex, replacement);
});

fs.writeFileSync('App.jsx', jsx);
console.log('Applied new palette.');
