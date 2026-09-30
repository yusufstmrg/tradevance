const fs = require('fs');
let c = fs.readFileSync('src/Dashboard.tsx', 'utf8');

c = c.replace(/className="grid grid-cols-5/g, 'className="grid grid-cols-2 lg:grid-cols-5');
c = c.replace(/className="grid grid-cols-12/g, 'className="grid grid-cols-1 lg:grid-cols-12');
c = c.replace(/className="col-span-5/g, 'className="col-span-1 lg:col-span-5');
c = c.replace(/className="col-span-4/g, 'className="col-span-1 lg:col-span-4');
c = c.replace(/className="col-span-3/g, 'className="col-span-1 lg:col-span-3');
c = c.replace(/className="col-span-6/g, 'className="col-span-1 lg:col-span-6');

// Wait, the line 
// <div className="col-span-3 bg-[#101922] border border-[#c9a34a]/30 ...
// has multiple classes, so let's match `col-span-\d` globally inside className attributes where we need to.
// Actually, `c.replace` with global flag should be fine since the exact strings exist.

fs.writeFileSync('src/Dashboard.tsx', c);
console.log("Grid classes updated!");
