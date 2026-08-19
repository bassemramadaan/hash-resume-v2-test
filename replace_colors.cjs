const fs = require('fs');

let content = fs.readFileSync('src/pages/HashHuntPage.tsx', 'utf8');

// Colors to replace:
// 1. Text Gray-900 to Navy
content = content.replace(/text-\[\#111827\]/g, 'text-navy');
content = content.replace(/bg-\[\#111827\]/g, 'bg-navy');

// 2. Main Blue #1D4ED8
// Replace buttons
content = content.replace(/bg-\[\#1D4ED8\] hover:bg-\[\#1E40AF\]/g, 'bg-coral hover:bg-coral-hover');
content = content.replace(/bg-\[\#1D4ED8\]/g, 'bg-coral');

// Replace text highlights
content = content.replace(/text-\[\#1D4ED8\]/g, 'text-coral');

// Replace border and rings
content = content.replace(/border-\[\#1D4ED8\]/g, 'border-coral');
content = content.replace(/ring-\[\#1D4ED8\]/g, 'ring-coral');

// 3. Soft Blues
content = content.replace(/bg-\[\#EFF6FF\]/g, 'bg-coral-soft');
content = content.replace(/hover:bg-\[\#EFF6FF\]/g, 'hover:bg-coral-soft');
content = content.replace(/bg-blue-50\/50/g, 'bg-coral-soft/50');
content = content.replace(/bg-blue-50/g, 'bg-coral-soft');
content = content.replace(/border-blue-100/g, 'border-coral/20');
content = content.replace(/border-blue-200/g, 'border-coral/30');
content = content.replace(/decoration-blue-200/g, 'decoration-coral/30');
content = content.replace(/bg-blue-100/g, 'bg-coral-soft');
content = content.replace(/shadow-blue-900\/5/g, 'shadow-navy/5');

// 4. Emerald/Amber accents for features can stay, or we can make them Navy/Coral
content = content.replace(/bg-emerald-100/g, 'bg-navy-soft');

fs.writeFileSync('src/pages/HashHuntPage.tsx', content, 'utf8');
