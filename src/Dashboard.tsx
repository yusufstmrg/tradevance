import React from 'react';
import { useAuth } from './AuthContext';
import { 
    LogOut, Menu, X, Network, Search, Globe, Bell, ChevronDown, LayoutDashboard, Briefcase, 
    Users, Package, FileText, Activity, LineChart, Target, Bot, 
    Building2, ShieldCheck, MoreVertical 
} from 'lucide-react';
import VerificationCenter from './components/VerificationCenter';
import RFQManager from './components/RFQManager';
import TradeRoom from './components/TradeRoom';

export default function Dashboard() {
    const { userData, logout } = useAuth();
    const [activeView, setActiveView] = React.useState('Command Center');
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
        <div className="flex min-h-screen bg-[#070b10] text-[#eef2f6] font-sans">
            
            {/* SIDEBAR (Mobile Drawer & Desktop Fixed) */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#101922] border-r border-gray-800 flex flex-col transform transition-transform duration-300 md:translate-x-0 md:relative ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex items-center gap-2 border-b border-gray-800 h-16 flex-shrink-0">
                    <div className="w-8 h-8 border border-[#c9a34a] rounded flex items-center justify-center bg-black">
                        <span className="text-[#e2bc5a] font-bold">T</span>
                    </div>
                    <div className="flex flex-col flex-1">
                        <span className="font-bold text-sm tracking-wide text-white">TRADEVANCE</span>
                        <span className="text-[8px] text-[#75818d] tracking-widest uppercase">AI Global Trade Network</span>
                    </div>
                    <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white"><X size={20}/></button>
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
                            <NavItem icon={<ShieldCheck size={16}/>} label="Verification" active={activeView === "Verification"} onClick={() => { setActiveView("Verification"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Users size={16}/>} label="Buyers" active={activeView === "Buyers"} onClick={() => { setActiveView("Buyers"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Building2 size={16}/>} label="Suppliers" active={activeView === "Suppliers"} onClick={() => { setActiveView("Suppliers"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Package size={16}/>} label="Products" active={activeView === "Products"} onClick={() => { setActiveView("Products"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Briefcase size={16}/>} label="Trade Network" active={activeView === "Trade Network"} onClick={() => { setActiveView("Trade Network"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<FileText size={16}/>} label="Opportunities" active={activeView === "Opportunities"} onClick={() => { setActiveView("Opportunities"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<FileText size={16}/>} label="Contracts" active={activeView === "Contracts"} onClick={() => { setActiveView("Contracts"); setMobileMenuOpen(false); }} />
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-3">Intelligence</div>
                        <div className="space-y-0.5">
                            <NavItem icon={<Bot size={16}/>} label="AI Trade Copilot" active={activeView === "AI Trade Copilot"} onClick={() => { setActiveView("AI Trade Copilot"); setMobileMenuOpen(false); }} />
                            <NavItem icon={<Activity size={16}/>} label="Market Intelligence" active={activeView === "Market Intelligence"} onClick={() => { setActiveView("Market Intelligence"); setMobileMenuOpen(false); }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* OVERLAY FOR MOBILE SIDEBAR */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 md:hidden" 
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-h-screen w-full relative">
                
                {/* TOP BAR - FIXED */}
                <header className="sticky top-0 z-30 h-16 border-b border-gray-800 bg-[#0c131b] flex items-center justify-between px-4 md:px-6 w-full shadow-md">
                    <div className="flex items-center">
                        <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-400 hover:text-white mr-4 p-1">
                            <MoreVertical size={24}/> {/* Three dots icon as requested */}
                        </button>
                        <div className="hidden md:flex items-center bg-[#15202b] border border-gray-700 rounded-lg overflow-hidden w-96">
                            <div className="flex-1 flex items-center px-3 py-2">
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
                            </button>
                        </div>
                        <div className="flex items-center gap-3 md:border-l border-gray-800 md:pl-6">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-white leading-none mb-1">{userData?.name || 'User'}</div>
                                <div className="text-[11px] text-gray-400 leading-none">{userData?.company || 'Company'}</div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white uppercase">{userData?.name?.slice(0, 2) || 'U'}</div>
                            <button onClick={logout} className="ml-2 text-gray-400 hover:text-red-400"><LogOut size={18}/></button>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE DASHBOARD CONTENT */}
                {activeView === "Command Center" ? (
                    <main className="flex-1 p-4 md:p-6 bg-[#070b10]">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-2">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {userData?.name?.split(' ')[0] || 'User'}!</h1>
                                <p className="text-sm text-gray-400">Here's what's happening in your global trade network today.</p>
                            </div>
                            <div className="text-left md:text-right">
                                <div className="text-sm text-white font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            </div>
                        </div>

                        {/* KPIs */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                            <KpiCard title="Active Trades" value="0" trend="No data yet" icon={<Briefcase size={20}/>} color="blue" />
                            <KpiCard title="Trade Value (USD)" value="$0.00" trend="No data yet" icon={<Activity size={20}/>} color="green" />
                            <KpiCard title="Open RFQs" value="0" trend="No data yet" icon={<FileText size={20}/>} color="purple" />
                            <KpiCard title="Opportunities" value="0" trend="No data yet" icon={<Target size={20}/>} color="orange" />
                            <KpiCard title="Savings Identified" value="$0.00" trend="No data yet" icon={<LineChart size={20}/>} color="cyan" />
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
                            
                            {/* Market Overview */}
                            <div className="col-span-1 lg:col-span-8 bg-[#101922] border border-gray-800 rounded-xl p-4 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-white flex items-center gap-2"><LineChart size={16} className="text-[#d8b65c]"/> Market Overview</h3>
                                </div>
                                <div className="flex-1 flex items-center justify-center min-h-[200px] border border-dashed border-gray-800 rounded-lg">
                                    <span className="text-gray-500 text-sm">No market data available yet. Please complete your profile to unlock insights.</span>
                                </div>
                            </div>

                            {/* AI Copilot */}
                            <div className="col-span-1 lg:col-span-4 bg-[#101922] border border-[#c9a34a]/30 rounded-xl flex flex-col overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d8b65c] to-yellow-600"></div>
                                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#15202b]/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#d8b65c]"><Bot size={16}/></span>
                                        <span className="font-bold text-white text-sm">AI Copilot</span>
                                    </div>
                                    <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Online</span>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="bg-[#1a2634] rounded-lg p-3 mb-4">
                                        <p className="text-sm text-gray-300">"Welcome to Tradevance. I am your AI Trade Copilot. Your workspace is currently empty. Would you like me to help you set up your first trade profile?"</p>
                                    </div>
                                    <div className="mt-auto space-y-2">
                                        <button onClick={() => setActiveView('AI Trade Copilot')} className="w-full text-left p-2.5 rounded-lg border border-gray-700 hover:border-[#d8b65c] hover:bg-[#d8b65c]/5 text-xs text-gray-400 transition-colors">Start setup guide...</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Tables */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            <div className="col-span-1 lg:col-span-12 bg-[#101922] border border-gray-800 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-white text-sm flex items-center gap-2">Active Trades</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase bg-[#0c131b] border-y border-gray-800">
                                            <tr>
                                                <th className="p-3 font-medium">Trade ID</th>
                                                <th className="p-3 font-medium">Product</th>
                                                <th className="p-3 font-medium">Counterparty</th>
                                                <th className="p-3 font-medium text-right">Quantity</th>
                                                <th className="p-3 font-medium text-right">Value (USD)</th>
                                                <th className="p-3 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <p>No active trades. You need to create an RFQ first.</p>
                                                        <button onClick={() => setActiveView('Opportunities')} className="bg-[#d8b65c] hover:bg-[#c9a34a] text-black font-bold px-4 py-2 rounded-lg text-xs transition-colors">
                                                            Go to Opportunities (RFQ)
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                ) : activeView === "Trade Network" ? (
                    <main className="flex-1 p-6 bg-[#070b10]">
                        <h1 className="text-2xl font-bold mb-6">Trade Network</h1>
                        <div className="bg-[#101922] rounded-xl border border-gray-800 p-8 text-center text-gray-400">
                            <Network size={48} className="mx-auto mb-4 opacity-50 text-[#d8b65c]" />
                            <h2 className="text-lg font-bold text-white mb-2">Network Directory</h2>
                            <p className="text-sm mb-6">Connect with verified buyers and suppliers. Your private network is currently empty.</p>
                            <button onClick={() => setActiveView('Opportunities')} className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                                Source Public Network via RFQ
                            </button>
                        </div>
                    </main>
                ) : activeView === "Verification" ? (
                    <VerificationCenter />
                ) : activeView === "Opportunities" ? (
                    <RFQManager />
                ) : activeView === "Contracts" ? (
                    <TradeRoom />
                ) : activeView === "AI Trade Copilot" ? (
                    <main className="flex-1 p-6 bg-[#070b10]">
                        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Bot className="text-[#d8b65c]" /> AI Trade Copilot</h1>
                        <div className="bg-[#101922] rounded-xl border border-gray-800 p-8 text-center text-gray-400">
                            <Bot size={48} className="mx-auto mb-4 opacity-50 text-[#d8b65c]" />
                            <h2 className="text-lg font-bold text-white mb-2">Intelligence Agent Online</h2>
                            <p className="text-sm mb-6">I am ready to analyze market trends, review counterparty risk, or draft smart contracts.</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setActiveView('Opportunities')} className="bg-[#d8b65c] hover:bg-[#c9a34a] text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors">Help me draft an RFQ</button>
                                <button onClick={() => setActiveView('Verification')} className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 font-bold px-4 py-2 rounded-lg text-sm transition-colors">Review my Verification</button>
                            </div>
                        </div>
                    </main>
                ) : (
                    <main className="flex-1 p-6 bg-[#070b10] flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <ShieldCheck size={48} className="mx-auto mb-4 opacity-30" />
                            <h2 className="text-xl font-bold text-gray-400 mb-2">{activeView}</h2>
                            <p>This module is initialized and ready for data.</p>
                        </div>
                    </main>
                )}
            </div>
        </div>
    );
}

function NavItem({icon, label, active=false, onClick}: any) {
    return (
        <a href="#" onClick={(e) => { e.preventDefault(); if(onClick) onClick(); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-[#d8b65c]/10 text-[#d8b65c] font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}>
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
            <div className="text-[10px] text-gray-500 flex items-center gap-1">{trend}</div>
        </div>
    )
}
