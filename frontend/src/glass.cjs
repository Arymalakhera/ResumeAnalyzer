const fs = require('fs');
let code = fs.readFileSync('App.jsx', 'utf8');

// Inject core glassmorphism default classes into LiftCard 
code = code.replace(
  'className={`rounded-3xl p-6 transition-colors duration-300 ease-out backdrop-blur-xl ${className}`}',
  'className={`rounded-3xl p-6 transition-colors duration-300 ease-out backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${className}`}'
);

// Strip out the opaque bg overrides from the individual cards 
// so the glassmorphism defaults can shine through cleanly.
code = code.replaceAll('bg-slate-900/80', '');
code = code.replaceAll('bg-slate-900/60', '');
code = code.replaceAll('bg-indigo-950/20', '');
code = code.replaceAll('bg-emerald-950/20', '');
code = code.replaceAll('bg-rose-950/20', '');
code = code.replaceAll('bg-cyan-950/20', '');
code = code.replaceAll('border border-slate-800', '');
code = code.replaceAll('border border-indigo-900/50', '');
code = code.replaceAll('border border-emerald-900/50', '');
code = code.replaceAll('border border-rose-900/50', '');
code = code.replaceAll('border border-cyan-900/50', '');

fs.writeFileSync('App.jsx', code);
