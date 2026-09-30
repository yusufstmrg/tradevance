import React from 'react';
import { useAuth } from './AuthContext';
import { LogOut, Menu, X, Network } from 'lucide-react';
import { 
    Search, Globe, Bell, Sun, ChevronDown, LayoutDashboard, Briefcase, Users, Package, FileText, 
    Ship, Activity, LineChart, Target, Bot, ShieldAlert, FileSearch, Building2, CreditCard, 
    Settings, ShieldCheck, PieChart, PanelLeftClose, ChevronUp, MessageSquare, Plus, Check, ArrowRight
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const chartData = [
  { name: 'May 22', value: 580 }, { name: 'May 23', value: 590 }, { name: 'May 24', value: 585 },
  { name: 'May 25', value: 605 }, { name: 'May 26', value: 600 }, { name: 'May 27', value: 615 }, { name: 'May 28', value: 615 }
];

const spendData = [
  { name: 'Sulphur', value: 19.88, color: '#3b82f6' },
  { name: 'Caustic Soda', value: 11.21, color: '#eab308' },
  { name: 'Carbon Black', value: 7.31, color: '#a855f7' },
  { name: 'Industrial Salt', value: 4.36, color: '#22c55e' },
  { name: 'Activated Carbon', value: 3.41, color: '#f97316' },
  { name: 'Others', value: 2.45, color: '#ef4444' },
];

export default function Dashboard() {
    const { userData, logout } = useAuth();
    const [activeView, setActiveView] = React.useState('Command Center');
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    return (
        <div className="flex h-screen bg-[#070b10] text-[#eef2f6] font-sans overflow-hidden">
            
            {/* SIDEBAR */}
            <div className={`w-64 bg-[#101922] border-r border-gray-800 flex flex-col h-full flex-shrink-0 fixed md:relative z-50 transform transition-transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                <div className="p-4 flex items-center gap-2 border-b border-gray-800">
                    <div className="w-8 h-8 border border-[#c9a34a] rounded flex items-center justify-center bg-black">
                        <span className="text-[#e2bc5a] font-bold">T</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-wide text-white">TRADEVANCE</span>
                        <span className="text-[8px] text-[#75818d] tracking-widest uppercase">AI Global Trade Network</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
                    <div>
                        <div className="space-y-0.5">
                            <NavItem icon={<LayoutDashboard size={16}/>} label="Command Center" active={activeView === "Command Center"} onClick={() => { setActiveView("Command Center"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Briefcase size={16}/>} label="My Workspace" active={activeView === "My Workspace"} onClick={() => { setActiveView("My Workspace"); setMobileMenuOpen(false); }} />
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-3">Trade Ecosystem</div>
                        <div className="space-y-0.5">
                            <NavItem icon={<Users size={16}/>} label="Buyers" active={activeView === "Buyers"} onClick={() => { setActiveView("Buyers"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Building2 size={16}/>} label="Suppliers" active={activeView === "Suppliers"} onClick={() => { setActiveView("Suppliers"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Package size={16}/>} label="Products" active={activeView === "Products"} onClick={() => { setActiveView("Products"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Briefcase size={16}/>} label="Trades" active={activeView === "Trades"} onClick={() => { setActiveView("Trades"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<FileText size={16}/>} label="RFQ & Tenders" active={activeView === "RFQ & Tenders"} onClick={() => { setActiveView("RFQ & Tenders"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<FileText size={16}/>} label="Contracts" active={activeView === "Contracts"} onClick={() => { setActiveView("Contracts"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Ship size={16}/>} label="Shipments" active={activeView === "Shipments"} onClick={() => { setActiveView("Shipments"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<FileSearch size={16}/>} label="Documents" active={activeView === "Documents"} onClick={() => { setActiveView("Documents"); setMobileMenuOpen(false); }} />
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-3">Intelligence</div>
                        <div className="space-y-0.5">
                            <NavItem icon={<Activity size={16}/>} label="Market Intelligence" active={activeView === "Market Intelligence"} onClick={() => { setActiveView("Market Intelligence"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<LineChart size={16}/>} label="Price Analytics" active={activeView === "Price Analytics"} onClick={() => { setActiveView("Price Analytics"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<PieChart size={16}/>} label="Supply & Demand" active={activeView === "Supply & Demand"} onClick={() => { setActiveView("Supply & Demand"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Target size={16}/>} label="Opportunity Radar" active={activeView === "Opportunity Radar"} onClick={() => { setActiveView("Opportunity Radar"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Ship size={16}/>} label="Freight Intelligence" active={activeView === "Freight Intelligence"} onClick={() => { setActiveView("Freight Intelligence"); setMobileMenuOpen(false); }} />
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-3">AI Agents</div>
                        <div className="space-y-0.5">
                            <NavItem icon={<Bot size={16}/>} label="AI Agent Orchestration" active={activeView === "AI Agent Orchestration"} onClick={() => { setActiveView("AI Agent Orchestration"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Bot size={16}/>} label="Procurement Agent" active={activeView === "Procurement Agent"} onClick={() => { setActiveView("Procurement Agent"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Bot size={16}/>} label="Negotiation Agent" active={activeView === "Negotiation Agent"} onClick={() => { setActiveView("Negotiation Agent"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Bot size={16}/>} label="Compliance Agent" active={activeView === "Compliance Agent"} onClick={() => { setActiveView("Compliance Agent"); setMobileMenuOpen(false); }} />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-800">
                    <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white w-full px-2">
                        <PanelLeftClose size={16}/> Collapse
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* TOP BAR */}
                <header className="h-16 border-b border-gray-800 bg-[#0c131b] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
                      <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-400 hover:text-white mr-4"><Menu size={24}/></button>
                    <div className="flex items-center gap-4 flex-1">
                        <div className="hidden md:flex items-center bg-[#15202b] border border-gray-700 rounded-lg overflow-hidden w-96">
                            <button className="px-3 py-2 text-sm text-gray-300 border-r border-gray-700 hover:bg-gray-800 flex items-center gap-1">All <ChevronDown size={14}/></button>
                            <div className="flex-1 flex items-center px-3">
                                <Search size={16} className="text-gray-500 mr-2"/>
                                <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="hidden md:flex items-center gap-4 text-gray-400">
                            <button className="hover:text-white"><Globe size={18}/></button>
                            <button className="hover:text-white relative">
                                <Bell size={18}/>
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center border border-[#0c131b]">12</span>
                            </button>
                            <button className="hover:text-white"><Sun size={18}/></button>
                        </div>
                        <div className="flex items-center gap-3 md:border-l border-gray-800 md:pl-6">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-white leading-none mb-1">{userData?.name || 'User'}</div>
                                <div className="text-[11px] text-gray-400 leading-none">{userData?.company || 'Company'}</div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white">{userData?.name?.slice(0, 2).toUpperCase() || 'U'}</div>
                        </div>
                    
                            <button onClick={logout} className="ml-4 text-gray-400 hover:text-red-400"><LogOut size={18}/></button></div>
                </header>

                {/* SCROLLABLE DASHBOARD */}
                  {activeView === "Command Center" ? (
                  <>
                <main className="flex-1 overflow-y-auto p-6 bg-[#070b10] custom-scrollbar">
                    
                    {/* Header */}
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">Welcome back, David!</h1>
                            <p className="text-sm text-gray-400">Here's what's happening in your global trade network today.</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-white font-medium">Thursday, May 29, 2025</div>
                            <div className="text-xs text-gray-400">GMT+7 10:30 AM</div>
                        </div>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <KpiCard title="Active Trades" value="128" trend="+18% vs last 30 days" icon={<Briefcase size={20}/>} color="blue" />
                        <KpiCard title="Trade Value (USD)" value="$48.75M" trend="+24% vs last 30 days" icon={<Activity size={20}/>} color="green" />
                        <KpiCard title="Open RFQs" value="32" trend="+12% vs last 30 days" icon={<FileText size={20}/>} color="purple" />
                        <KpiCard title="Opportunities" value="16" trend="+8% vs last 30 days" icon={<Target size={20}/>} color="orange" />
                        <KpiCard title="Savings Identified" value="$2.41M" trend="+31% vs last 30 days" icon={<LineChart size={20}/>} color="cyan" />
                    </div>

                    {/* Middle Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
                        
                        {/* Global Map */}
                        <div className="col-span-1 lg:col-span-5 bg-[#101922] border border-gray-800 rounded-xl p-4 flex flex-col relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4 z-10">
                                <h2 className="font-bold text-white text-sm">Global Trade Map</h2>
                                <button className="text-xs text-gray-400 flex items-center gap-1 bg-[#15202b] px-2 py-1 rounded border border-gray-700">All Status <ChevronDown size={12}/></button>
                            </div>
                            <div className="flex-1 relative min-h-[250px] bg-map-pattern opacity-80">
                                {/* Simulated map with SVG or CSS background in real app */}
                                <div className="absolute inset-0 bg-[#0c131b] rounded-lg border border-gray-800/50 flex items-center justify-center">
                                    <Globe size={100} className="text-gray-800 opacity-20" />
                                    {/* Simulated dots */}
                                    <div className="absolute top-[40%] left-[60%] w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                                    <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
                                    <div className="absolute top-[60%] left-[80%] w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_10px_#eab308]"></div>
                                </div>
                                
                                <div className="absolute left-4 bottom-4 bg-[#15202b]/90 border border-gray-700 rounded-lg p-3 backdrop-blur-sm z-10">
                                    <div className="text-xs font-bold text-gray-300 mb-2">Shipments</div>
                                    <div className="space-y-1.5 text-[10px]">
                                        <div className="flex justify-between gap-4"><span className="flex items-center gap-1 text-blue-400"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> In Transit</span> <span className="text-white font-medium">43</span></div>
                                        <div className="flex justify-between gap-4"><span className="flex items-center gap-1 text-yellow-400"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div> Loading</span> <span className="text-white font-medium">12</span></div>
                                        <div className="flex justify-between gap-4"><span className="flex items-center gap-1 text-green-400"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> Delivered</span> <span className="text-white font-medium">28</span></div>
                                        <div className="flex justify-between gap-4"><span className="flex items-center gap-1 text-red-400"><div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> Delayed</span> <span className="text-white font-medium">5</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Market Overview */}
                        <div className="col-span-1 lg:col-span-4 bg-[#101922] border border-gray-800 rounded-xl p-4 flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-white text-sm">Market Overview</h2>
                                <div className="flex gap-2">
                                    <button className="text-xs text-gray-400 flex items-center gap-1 bg-[#15202b] px-2 py-1 rounded border border-gray-700">Sulphur (Granular) <ChevronDown size={12}/></button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="text-3xl font-bold text-white">$615.00</div>
                                <div className="text-xs text-green-400 flex items-center gap-1"><ChevronUp size={14}/> 2.45% ($15.00)</div>
                            </div>
                            <div className="flex-1 min-h-[150px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsLineChart data={chartData}>
                                        <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                                        <Tooltip contentStyle={{ backgroundColor: '#15202b', borderColor: '#374151', fontSize: '12px' }} />
                                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                    </RechartsLineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 mt-2 bg-[#15202b] rounded-lg p-1">
                                <button className="px-2 py-1 hover:text-white rounded">1D</button>
                                <button className="px-2 py-1 bg-gray-700 text-white rounded shadow-sm">1W</button>
                                <button className="px-2 py-1 hover:text-white rounded">1M</button>
                                <button className="px-2 py-1 hover:text-white rounded">3M</button>
                                <button className="px-2 py-1 hover:text-white rounded">1Y</button>
                            </div>
                        </div>

                        {/* AI Copilot */}
                        <div className="col-span-1 lg:col-span-3 bg-[#101922] border border-[#c9a34a]/30 rounded-xl flex flex-col overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d8b65c] to-yellow-600"></div>
                            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#15202b]/50">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#d8b65c]"><Bot size={16}/></span>
                                    <h2 className="font-bold text-white text-sm">AI Copilot</h2>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-green-400">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Online
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex gap-3 mb-4">
                                    <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <Bot size={16} className="text-white"/>
                                    </div>
                                    <div>
                                        <div className="text-sm text-white font-medium mb-1">What can I help you with today?</div>
                                        <div className="text-xs text-gray-400 leading-relaxed">Ask anything about global trade, market, suppliers, or your transactions...</div>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-auto">
                                    <button className="w-full text-left text-xs bg-[#15202b] border border-gray-700 hover:border-gray-500 p-2.5 rounded-lg text-gray-300 transition-colors">Find suppliers for 50,000 MT Sulphur</button>
                                    <button className="w-full text-left text-xs bg-[#15202b] border border-gray-700 hover:border-gray-500 p-2.5 rounded-lg text-gray-300 transition-colors">Market trend for Caustic Soda</button>
                                    <button className="w-full text-left text-xs bg-[#15202b] border border-gray-700 hover:border-gray-500 p-2.5 rounded-lg text-gray-300 transition-colors">Best freight rate to Tanga</button>
                                    <button className="w-full text-left text-xs bg-[#15202b] border border-gray-700 hover:border-gray-500 p-2.5 rounded-lg text-gray-300 transition-colors">Check status of Trade TRD-2025-00084</button>
                                </div>
                                <div className="mt-4 relative">
                                    <input type="text" placeholder="Ask Tradevance AI..." className="w-full bg-[#0c131b] border border-gray-700 rounded-lg py-2.5 pl-3 pr-10 text-xs text-white focus:outline-none focus:border-[#d8b65c]" />
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d8b65c]"><MessageSquare size={14}/></button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Lower Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
                        
                        {/* Table */}
                        <div className="col-span-1 lg:col-span-6 bg-[#101922] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                                <h2 className="font-bold text-white text-sm">Active Trades</h2>
                                <a href="#" className="text-xs text-blue-400 hover:underline">View all</a>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="text-gray-500 bg-[#15202b] border-b border-gray-800">
                                        <tr>
                                            <th className="font-medium p-3">Trade ID</th>
                                            <th className="font-medium p-3">Product</th>
                                            <th className="font-medium p-3">Buyer</th>
                                            <th className="font-medium p-3">Seller</th>
                                            <th className="font-medium p-3 text-right">Qty (MT)</th>
                                            <th className="font-medium p-3 text-right">Value (USD)</th>
                                            <th className="font-medium p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800 text-gray-300">
                                        <TableRow id="TRD-2025-00085" product="Sulphur (Granular)" buyer="PT Indo Fertilizer" seller="Sulphur Corp" qty="50,000" val="$30,750,000" status="Negotiation" color="blue" />
                                        <TableRow id="TRD-2025-00084" product="Caustic Soda" buyer="ABC Chemical Ltd" seller="ChemTrade AS" qty="25,000" val="$12,875,000" status="In Transit" color="green" />
                                        <TableRow id="TRD-2025-00083" product="Carbon Black" buyer="Global Tires Inc." seller="Black Carbon GmbH" qty="15,000" val="$9,450,000" status="Contracted" color="purple" />
                                        <TableRow id="TRD-2025-00082" product="Industrial Salt" buyer="PT Garam Indonesia" seller="Saltex Ltd." qty="30,000" val="$3,600,000" status="Delivered" color="gray" />
                                        <TableRow id="TRD-2025-00081" product="Activated Carbon" buyer="WaterPure Ltd." seller="Carbon Solutions" qty="10,000" val="$4,200,000" status="Loading" color="yellow" />
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Opportunities */}
                        <div className="col-span-1 lg:col-span-3 bg-[#101922] border border-gray-800 rounded-xl p-4 flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-white text-sm">Top Opportunities</h2>
                            </div>
                            <div className="space-y-3">
                                <OppItem title="50,000 MT Sulphur" sub="CIF Dar es Salaam" val="Margin est. $1.2M" status="High" color="green" />
                                <OppItem title="30,000 MT Caustic Soda" sub="CIF Mombasa" val="Margin est. $780K" status="High" color="green" />
                                <OppItem title="20,000 MT Carbon Black" sub="CIF Chittagong" val="Margin est. $560K" status="Medium" color="yellow" />
                                <OppItem title="15,000 MT Industrial Salt" sub="CIF Lagos" val="Margin est. $320K" status="Medium" color="yellow" />
                            </div>
                        </div>

                        {/* Alerts & Tasks */}
                        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
                            <div className="bg-[#101922] border border-gray-800 rounded-xl p-4 flex-1">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-bold text-white text-sm flex items-center gap-2"><Bell size={14} className="text-[#d8b65c]"/> Alerts</h2>
                                    <a href="#" className="text-xs text-blue-400 hover:underline">View all</a>
                                </div>
                                <div className="space-y-3 text-xs">
                                    <div className="flex gap-2">
                                        <div className="mt-0.5"><ShieldAlert size={12} className="text-red-400"/></div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-200">Shipment Delay</div>
                                            <div className="text-gray-500">Shipment TRD-2025-00076 delayed at Port Klang</div>
                                        </div>
                                        <div className="text-red-400">10 min ago</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="mt-0.5"><Activity size={12} className="text-yellow-400"/></div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-200">Price Alert</div>
                                            <div className="text-gray-500">Sulphur price increased by 2.45%</div>
                                        </div>
                                        <div className="text-yellow-400">1 hr ago</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="mt-0.5"><FileText size={12} className="text-orange-400"/></div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-200">Document Expiry</div>
                                            <div className="text-gray-500">COA for TRD-2025-00062 will expire in 3 days</div>
                                        </div>
                                        <div className="text-orange-400">2 hr ago</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-[#101922] border border-gray-800 rounded-xl p-4 flex-1">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="font-bold text-white text-sm flex items-center gap-2"><Check size={14} className="text-blue-400"/> My Tasks</h2>
                                    <a href="#" className="text-xs text-blue-400 hover:underline">View all</a>
                                </div>
                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center">
                                        <div><div className="font-bold text-gray-200">Approve Contract</div><div className="text-gray-500">TRD-2025-00085</div></div>
                                        <div className="text-right"><span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded">High</span><div className="text-gray-500 mt-1">Due in 2h</div></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div><div className="font-bold text-gray-200">Review RFQ Responses</div><div className="text-gray-500">RFQ-2025-00124</div></div>
                                        <div className="text-right"><span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">Medium</span><div className="text-gray-500 mt-1">Due today</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer Row (Agents, Spend, Freight) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
                        <div className="col-span-1 lg:col-span-4 bg-[#101922] border border-gray-800 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-white text-sm">AI Agents Status</h2>
                                <a href="#" className="text-xs text-blue-400 hover:underline">View all</a>
                            </div>
                            <div className="space-y-2 text-xs">
                                <AgentRow icon={<Search size={12}/>} name="Procurement Agent" desc="Searching best suppliers" status="Active" color="text-blue-400" bg="bg-blue-500/10" />
                                <AgentRow icon={<ShieldCheck size={12}/>} name="Verification Agent" desc="Verifying supplier documents" status="Active" color="text-green-400" bg="bg-green-500/10" />
                                <AgentRow icon={<Activity size={12}/>} name="Pricing Agent" desc="Analyzing market data" status="Active" color="text-purple-400" bg="bg-purple-500/10" />
                                <AgentRow icon={<MessageSquare size={12}/>} name="Negotiation Agent" desc="Negotiating with suppliers" status="Active" color="text-yellow-400" bg="bg-yellow-500/10" />
                            </div>
                        </div>
                        
                        <div className="col-span-1 lg:col-span-4 bg-[#101922] border border-gray-800 rounded-xl p-4 flex flex-col">
                            <h2 className="font-bold text-white text-sm mb-4">Spend Analytics</h2>
                            <div className="flex flex-1 items-center gap-4">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie data={spendData} innerRadius={25} outerRadius={40} paddingAngle={2} dataKey="value">
                                                {spendData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                            </Pie>
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-[8px] text-gray-400 leading-none">Total Spend</span>
                                        <span className="text-xs font-bold text-white leading-none mt-1">$48.75M</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1.5 text-xs">
                                    {spendData.map(d => (
                                        <div key={d.name} className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div> <span className="text-gray-300">{d.name}</span></div>
                                            <div className="flex items-center gap-3"><span className="text-gray-500 w-6 text-right">{Math.round(d.value/48.75*100)}%</span> <span className="text-white font-medium w-12 text-right">${d.value}M</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 lg:col-span-4 bg-[#101922] border border-gray-800 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-bold text-white text-sm">Freight Market Insight</h2>
                                <a href="#" className="text-xs text-blue-400 hover:underline">View all</a>
                            </div>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-300">Singapore → Tanga</div>
                                    <div className="flex items-center gap-2"><span className="font-medium text-white">$32 /MT</span> <span className="text-red-400 flex items-center gap-0.5"><ChevronUp size={10}/> 4%</span></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-300">Singapore → Mombasa</div>
                                    <div className="flex items-center gap-2"><span className="font-medium text-white">$28 /MT</span> <span className="text-red-400 flex items-center gap-0.5"><ChevronUp size={10}/> 3%</span></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-300">Middle East → Tanga</div>
                                    <div className="flex items-center gap-2"><span className="font-medium text-white">$25 /MT</span> <span className="text-green-400 flex items-center gap-0.5 rotate-180"><ChevronUp size={10}/> 2%</span></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-300">China → Dar es Salaam</div>
                                    <div className="flex items-center gap-2"><span className="font-medium text-white">$45 /MT</span> <span className="text-red-400 flex items-center gap-0.5"><ChevronUp size={10}/> 5%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Status Row */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-800 text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                            <span>Trusted by Global Leaders</span>
                            <div className="flex items-center gap-4 opacity-50 grayscale">
                                <span className="font-bold text-white">INDORAMA</span>
                                <span className="font-bold text-white">PUPUK INDONESIA</span>
                                <span className="font-bold text-white">wilmar</span>
                                <span className="font-bold text-white">PETRONAS</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> All Systems Operational</span>
                            <span>Uptime 99.99%</span>
                        </div>
                    </div>

                
                  </main>\n</>
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
                  )}
            </div>
        </div>
    );
}

function NavItem({icon, label, active=false}: any) {
    return (
        <a href="#" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-[#d8b65c]/10 text-[#d8b65c] font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}>
            {icon}
            {label}
        </a>
    )
}

function KpiCard({title, value, trend, icon, color}: any) {
    const colorMap:any = {
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        green: 'text-green-500 bg-green-500/10 border-green-500/20',
        purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        cyan: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    };
    return (
        <div className="bg-[#101922] border border-gray-800 p-4 rounded-xl flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-400 font-medium">{title}</span>
                <div className={`p-1.5 rounded-lg border ${colorMap[color]}`}>{icon}</div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-[10px] text-green-400 flex items-center gap-1"><ChevronUp size={12}/> {trend}</div>
        </div>
    )
}

function TableRow({id, product, buyer, seller, qty, val, status, color}: any) {
    const bgMap:any = { blue: 'bg-blue-500/20 text-blue-400', green: 'bg-green-500/20 text-green-400', purple: 'bg-purple-500/20 text-purple-400', gray: 'bg-gray-700 text-gray-300', yellow: 'bg-yellow-500/20 text-yellow-400' };
    return (
        <tr className="hover:bg-[#15202b]">
            <td className="p-3 text-blue-400 font-medium">{id}</td>
            <td className="p-3 text-white">{product}</td>
            <td className="p-3">{buyer}</td>
            <td className="p-3">{seller}</td>
            <td className="p-3 text-right text-white">{qty}</td>
            <td className="p-3 text-right text-white">{val}</td>
            <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-medium ${bgMap[color]}`}>{status}</span></td>
        </tr>
    )
}

function OppItem({title, sub, val, status, color}: any) {
    return (
        <div className="flex gap-3 items-center text-xs">
            <div className="w-8 h-8 rounded-lg bg-[#d8b65c]/10 border border-[#d8b65c]/30 flex items-center justify-center text-[#d8b65c]"><Target size={14}/></div>
            <div className="flex-1">
                <div className="font-bold text-white">{title}</div>
                <div className="text-gray-500">{sub}</div>
            </div>
            <div className="text-right">
                <div className="text-gray-300 font-medium">{val}</div>
                <span className={`text-[10px] ${color==='green'?'text-green-400':'text-yellow-400'}`}>{status}</span>
            </div>
        </div>
    )
}

function AgentRow({icon, name, desc, status, color, bg}: any) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${bg} ${color}`}>{icon}</div>
            <div className="flex-1">
                <div className="font-medium text-gray-200">{name}</div>
                <div className="text-gray-500">{desc}</div>
            </div>
            <span className="text-green-400 font-medium px-2 py-0.5 bg-green-500/10 rounded">{status}</span>
        </div>
    )
}
