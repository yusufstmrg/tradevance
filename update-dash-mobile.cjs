const fs = require('fs');
let c = fs.readFileSync('src/Dashboard.tsx', 'utf8');

// 1. Add imports
c = c.replace("import { LogOut } from 'lucide-react';", "import { LogOut, Menu, X } from 'lucide-react';");

// 2. Add state
c = c.replace(
  "export default function Dashboard() {\n    const { userData, logout } = useAuth();", 
  "export default function Dashboard() {\n    const { userData, logout } = useAuth();\n    const [activeView, setActiveView] = React.useState('Command Center');\n    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);"
);

// 3. Update sidebar classes
c = c.replace(
  'className="w-64 bg-[#101922] border-r border-gray-800 flex flex-col h-full flex-shrink-0"',
  'className={`w-64 bg-[#101922] border-r border-gray-800 flex flex-col h-full flex-shrink-0 fixed md:relative z-50 transform transition-transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}'
);

// 4. Add close button to sidebar for mobile
c = c.replace(
  '<div className="flex flex-col">\n                        <span className="font-bold text-sm tracking-wide text-white">TRADEVANCE</span>\n                        <span className="text-[8px] text-[#75818d] tracking-widest uppercase">AI Global Trade Network</span>\n                    </div>\n                </div>',
  '<div className="flex flex-col flex-1">\n                        <span className="font-bold text-sm tracking-wide text-white">TRADEVANCE</span>\n                        <span className="text-[8px] text-[#75818d] tracking-widest uppercase">AI Global Trade Network</span>\n                    </div>\n                    <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white"><X size={20}/></button>\n                </div>'
);

// 5. Update NavItem usages
c = c.replace(/<NavItem\s+icon=\{([^}]+)\}\s+label="([^"]+)"(\s+active)?\s*\/>/g, (match, icon, label) => {
  return `<NavItem icon={<${icon.replace(/<\/?/g, '')}/>} label="${label}" active={activeView === "${label}"} onClick={() => { setActiveView("${label}"); setMobileMenuOpen(false); }} />`;
});

// 6. Fix Top Bar to add hamburger menu
c = c.replace(
  '<header className="h-16 border-b border-gray-800 bg-[#0c131b] flex items-center justify-between px-6 flex-shrink-0">',
  '<header className="h-16 border-b border-gray-800 bg-[#0c131b] flex items-center justify-between px-4 md:px-6 flex-shrink-0">\n                      <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-400 hover:text-white mr-4"><Menu size={24}/></button>'
);

// 7. Make top bar search hidden on mobile
c = c.replace(
  '<div className="flex items-center bg-[#15202b] border border-gray-700 rounded-lg overflow-hidden w-96">',
  '<div className="hidden md:flex items-center bg-[#15202b] border border-gray-700 rounded-lg overflow-hidden w-96">'
);

// 8. Make header actions less on mobile
c = c.replace(
  '<div className="flex items-center gap-6">',
  '<div className="flex items-center gap-3 md:gap-6">'
);
c = c.replace(
  '<div className="flex items-center gap-4 text-gray-400">',
  '<div className="hidden md:flex items-center gap-4 text-gray-400">'
);
c = c.replace(
  '<div className="flex items-center gap-3 border-l border-gray-800 pl-6">',
  '<div className="flex items-center gap-3 md:border-l border-gray-800 md:pl-6">'
);
c = c.replace(
  '<div className="text-right">',
  '<div className="text-right hidden sm:block">'
);

// 9. Wrap the dashboard content so we can render different views
// Find where the "Command Center" content starts and ends.
// Content starts after </header>.
// We will replace ` {/* SCROLLABLE DASHBOARD */}` with conditional rendering.
const dashboardStartToken = '{/* SCROLLABLE DASHBOARD */}';
const dashboardStartIdx = c.indexOf(dashboardStartToken);
if (dashboardStartIdx > -1) {
  const insertIndex = dashboardStartIdx + dashboardStartToken.length;
  c = c.slice(0, insertIndex) + '\n                  {activeView === "Command Center" ? (\n                  <>' + c.slice(insertIndex);
}

// Find where main ends
const mainEndIdx = c.lastIndexOf('</main>');
if (mainEndIdx > -1) {
  // close the fragment and add other views
  const otherViews = `
                  </>
                  ) : activeView === "Trade Network" ? (
                      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#070b10]">
                          <h1 className="text-2xl font-bold mb-6">Trade Network</h1>
                          <div className="bg-[#101922] rounded-xl border border-gray-800 p-8 text-center text-gray-400">
                              <Network size={48} className="mx-auto mb-4 opacity-50" />
                              <h2 className="text-lg font-bold text-white mb-2">Network Directory</h2>
                              <p className="text-sm">Connect with verified buyers and suppliers. Module is ready for live data integration.</p>
                          </div>
                      </main>
                  ) : activeView === "Opportunities" ? (
                      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#070b10]">
                          <h1 className="text-2xl font-bold mb-6">Opportunities</h1>
                          <div className="bg-[#101922] rounded-xl border border-gray-800 p-8 text-center text-gray-400">
                              <Target size={48} className="mx-auto mb-4 opacity-50" />
                              <h2 className="text-lg font-bold text-white mb-2">Live RFQs</h2>
                              <p className="text-sm">Real-time matching engine is active. Awaiting RFQ payload.</p>
                          </div>
                      </main>
                  ) : activeView === "AI Trade Copilot" ? (
                      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#070b10]">
                          <h1 className="text-2xl font-bold mb-6">AI Trade Copilot</h1>
                          <div className="bg-[#101922] rounded-xl border border-gray-800 p-8 text-center text-gray-400">
                              <Bot size={48} className="mx-auto mb-4 opacity-50" />
                              <h2 className="text-lg font-bold text-white mb-2">Intelligence Agent</h2>
                              <p className="text-sm">Your AI Copilot is online and ready to assist with negotiation and market analysis.</p>
                          </div>
                      </main>
                  ) : (
                      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#070b10] flex items-center justify-center">
                          <div className="text-center text-gray-500">
                              <ShieldCheck size={48} className="mx-auto mb-4 opacity-30" />
                              <h2 className="text-xl font-bold text-gray-400 mb-2">{activeView}</h2>
                              <p>This module is secure and pending production rollout.</p>
                          </div>
                      </main>
                  )}`;
  c = c.slice(0, mainEndIdx) + otherViews + c.slice(mainEndIdx + 7); // replace </main> because it's inside the fragment now.
}

// Update NavItem definition to accept onClick
c = c.replace(
  'function NavItem({icon, label, active=false}: any) {\n    return (\n        <a href="#" className={`flex',
  'function NavItem({icon, label, active=false, onClick}: any) {\n    return (\n        <a href="#" onClick={(e) => { e.preventDefault(); if(onClick) onClick(); }} className={`flex'
);

fs.writeFileSync('src/Dashboard.tsx', c);
console.log("Dashboard updated!");
