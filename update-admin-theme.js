import fs from 'fs';

let content = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

// Theming overrides
content = content.replace(/font-serif/g, 'font-sans tracking-tight font-semibold');
content = content.replace(/rounded-sm/g, 'rounded-xl');
content = content.replace(/bg-\[#111\]/g, 'bg-[#1e1e1e] shadow-lg');
content = content.replace(/bg-\[#171717\]/g, 'bg-[#151515]');
content = content.replace(/border-white\/5/g, 'border-white/10');
content = content.replace(/border-white\/10/g, 'border-white/15');
content = content.replace(/text-\[#d1d1d1\]\/50/g, 'text-[#a1a1aa]');
content = content.replace(/text-\[#d1d1d1\]\/80/g, 'text-[#d4d4d8]');
content = content.replace(/text-\[#d1d1d1\]\/40/g, 'text-[#71717a]');

// Let's add the background #171717 to the main wrapper
content = content.replace(
  /<div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative">/,
  '<div className="min-h-[100vh] -mt-24 pt-32 pb-24 px-6 md:px-12 w-full bg-[#171717] text-[#d1d1d1]"><div className="max-w-[1400px] mx-auto relative">'
);
// and close that inner div... wait, it's easier to find the last </div> and replace it.
content = content.replace(/<\/div>\n\s*$/m, '</div>\n    </div>\n  );\n}\n');

// Clean up buttons
content = content.replace(/bg-white text-black px-6 py-2.5/g, 'bg-white text-black px-5 py-2.5 rounded-lg shadow-sm font-medium');
content = content.replace(/bg-white text-black px-5 py-2/g, 'bg-white text-black px-4 py-2 rounded-lg shadow-sm font-medium');
content = content.replace(/bg-white text-black px-8 py-2/g, 'bg-white text-black px-6 py-2.5 rounded-lg shadow-sm font-medium');

// Give the layout a subtle grid/pane layout
content = content.replace(
  /<div className="md:w-64 shrink-0 flex flex-col md:border-r border-white\/5 md:pr-8 md:min-h-\[70vh\]">/,
  '<div className="md:w-64 shrink-0 flex flex-col md:border-r border-white/10 md:pr-8 md:min-h-[70vh]">'
);

// Sidebar items active
content = content.replace(/bg-white text-black/g, 'bg-white text-black shadow-md');

fs.writeFileSync('src/pages/Admin.tsx', content);
