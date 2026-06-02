const fs = require('fs');
let jsx = fs.readFileSync('App.jsx', 'utf8');

// 1. Correctly apply the custom background gradient
jsx = jsx.replace(
  /bg-white\/5 bg-gradient-to-br from-rose-50 via-teal-50 to-amber-50/g,
  'bg-custom-gradient'
);

// 2. Make the cards dark
const replacements = [
  [/bg-white\/10/g, 'bg-slate-950/60'],
  [/bg-white\/5/g, 'bg-slate-950/40'],
  [/border-white\/20/g, 'border-slate-800'],
  [/border-white\/10/g, 'border-slate-800/50'],
  // Fix the PulseUploadArea text to be visible on dark cards
  [/text-white\/60/g, 'text-slate-400'],
  [/text-white\/80/g, 'text-slate-300'],
  [/text-white\/90/g, 'text-slate-200'],
  // Button background for secondary
  [/bg-slate-950\/60 hover:bg-slate-950\/60/g, 'bg-slate-900 hover:bg-slate-800'], // This fixes a potential double match
];

replacements.forEach(([regex, replacement]) => {
  jsx = jsx.replace(regex, replacement);
});

// For interactive button, the text is currently slate-900, which is good on teal.
// But we might have changed it. Let's ensure primary button text is dark.
jsx = jsx.replace('text-slate-900 border-0', 'text-slate-900 border-0');

fs.writeFileSync('App.jsx', jsx);
console.log('Made it dark');
