const fs = require('fs');
let c = fs.readFileSync('src/Dashboard.tsx', 'utf8');

c = c.replace(/<NavItem\s+icon=\{\<([A-Za-z0-9]+)\s+size=\{16\}\/>\}\s+label="([^"]+)"(?:\s+active)?\s*\/>/g, (match, iconName, label) => {
  return `<NavItem icon={<${iconName} size={16}/>} label="${label}" active={activeView === "${label}"} onClick={() => { setActiveView("${label}"); setMobileMenuOpen(false); }} />`;
});

fs.writeFileSync('src/Dashboard.tsx', c);
console.log("NavItems fixed!");
