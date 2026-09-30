const fs = require('fs');
let content = fs.readFileSync('src/Dashboard.tsx', 'utf8');
content = content.replace("import React from 'react';", "import React from 'react';\nimport { useAuth } from './AuthContext';\nimport { LogOut } from 'lucide-react';");
content = content.replace("export default function Dashboard() {", "export default function Dashboard() {\n    const { userData, logout } = useAuth();");
content = content.replace("David Jonathan", "{userData?.name || 'User'}");
content = content.replace("Tradevance Enterprise", "{userData?.company || 'Company'}");
content = content.replace(">DJ<", ">{userData?.name?.slice(0, 2).toUpperCase() || 'U'}<");
// Need to add logout button properly before the closing header tag.
const headerEndIdx = content.indexOf('</header>');
const beforeHeaderEnd = content.slice(0, headerEndIdx);
// Find the last </div> before </header>
const lastDivIdx = beforeHeaderEnd.lastIndexOf('</div>');
const start = content.slice(0, lastDivIdx);
const end = content.slice(lastDivIdx);
// end is "</div>\n                </header>..."
// We want to insert the button right before the last </div>
content = start + '\n                            <button onClick={logout} className="ml-4 text-gray-400 hover:text-red-400"><LogOut size={18}/></button>' + end;
fs.writeFileSync('src/Dashboard.tsx', content);
