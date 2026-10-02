import React, { useRef, useEffect } from 'react';
import { Globe, Users, Package, Activity, Network, BrainCircuit, ShieldCheck, ArrowRight, CheckCircle2, Search, ChevronDown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import PublicExplorer from './PublicExplorer';

const DashboardMockup = () => (
    <div className="relative w-full max-w-[600px] mx-auto xl:ml-auto opacity-90 hover:opacity-100 transition-opacity duration-700 hidden lg:block">
        <div className="absolute -inset-1 bg-gradient-to-tr from-[#d8b65c]/30 via-blue-600/20 to-purple-600/20 rounded-2xl blur-2xl opacity-60"></div>
        <div className="relative bg-[#0b1016] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
            <div className="h-12 border-b border-gray-800 bg-[#0d141c] flex items-center px-4 justify-between">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                </div>
                <div className="flex items-center gap-2 bg-[#151e28] px-3 py-1.5 rounded-md border border-gray-800 w-64">
                    <Search size={12} className="text-gray-500"/>
                    <span className="text-[10px] text-gray-500">Search network...</span>
                </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-48 border-r border-gray-800 bg-[#0c131a] p-4 flex flex-col gap-4">
                    <div className="h-8 w-full bg-[#1e2936] rounded-md border border-gray-700/50 flex items-center px-3 gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#d8b65c]/20 border border-[#d8b65c]/50"></div>
                        <div className="h-2 w-16 bg-gray-500 rounded"></div>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="h-3 w-3/4 bg-gray-700/50 rounded"></div>
                        <div className="h-3 w-1/2 bg-gray-800 rounded"></div>
                        <div className="h-3 w-2/3 bg-gray-800 rounded"></div>
                        <div className="h-3 w-3/4 bg-gray-800 rounded"></div>
                    </div>
                    <div className="mt-auto h-24 bg-[#151e28] border border-gray-800 rounded-lg p-3">
                        <div className="h-2 w-12 bg-gray-600 rounded mb-3"></div>
                        <div className="h-10 w-10 rounded-full border-2 border-green-500/50 mx-auto"></div>
                    </div>
                </div>
                <div className="flex-1 p-6 bg-[#0a0f14] flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 w-48 bg-gray-600 rounded"></div>
                        </div>
                        <div className="h-8 w-28 bg-[#d8b65c] rounded-md shadow-[0_0_15px_rgba(216,182,92,0.3)]"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-28 bg-[#151f2b] border border-gray-800 rounded-xl p-4 flex flex-col">
                            <div className="flex justify-between mb-4">
                                <div className="h-3 w-16 bg-gray-600 rounded"></div>
                                <Activity size={14} className="text-blue-400" />
                            </div>
                            <div className="h-8 w-20 bg-gray-200 rounded mb-2 mt-auto"></div>
                            <div className="h-2 w-full bg-blue-500/20 rounded overflow-hidden">
                                <div className="h-full w-[65%] bg-blue-500"></div>
                            </div>
                        </div>
                        <div className="h-28 bg-[#151f2b] border border-gray-800 rounded-xl p-4 flex flex-col">
                            <div className="flex justify-between mb-4">
                                <div className="h-3 w-24 bg-gray-600 rounded"></div>
                                <ShieldCheck size={14} className="text-green-400" />
                            </div>
                            <div className="h-8 w-16 bg-gray-200 rounded mb-2 mt-auto"></div>
                            <div className="h-3 w-20 bg-green-500/20 text-[8px] text-green-400 flex items-center justify-center rounded uppercase">Verified</div>
                        </div>
                    </div>
                    <div className="flex-1 bg-[#121a24] border border-gray-800 rounded-xl relative overflow-hidden flex flex-col p-4">
                         <div className="h-3 w-24 bg-gray-600 rounded mb-4 z-10"></div>
                         <div className="flex-1 relative">
                            <div className="absolute bottom-0 left-0 w-full h-[150%] bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path d="M0,100 L0,50 Q25,20 50,70 T100,10 L100,100 Z" fill="rgba(59,130,246,0.1)" />
                                <path d="M0,50 Q25,20 50,70 T100,10" fill="none" stroke="#3b82f6" strokeWidth="2" />
                            </svg>
                         </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute top-24 right-6 bg-[#1e2936]/90 backdrop-blur-sm border border-gray-700 p-3 rounded-lg shadow-2xl flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><CheckCircle2 size={16}/></div>
                <div>
                    <div className="text-[10px] font-bold text-gray-200">Smart Contract Executed</div>
                    <div className="text-[9px] text-gray-400">Tradevance OS Protocol</div>
                </div>
            </div>
        </div>
    </div>
);

export default function LandingPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const explorerRef = useRef<any>(null);

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    const openExplorer = (tab: string) => {
        if (explorerRef.current) {
            explorerRef.current.openExplorer(tab);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#000000] text-white font-sans overflow-hidden">
            <div className="w-full relative flex flex-col justify-between p-6 md:p-12 bg-gradient-to-br from-[#0c131b] via-[#070b10] to-[#000000] z-10 min-h-screen">
                <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-40"></div>
                    <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full"></div>
                </div>

                <header className="flex justify-between items-center z-10">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                        <div className="w-10 h-10 border border-[#c9a34a] rounded-xl flex items-center justify-center bg-black">
                            <span className="text-[#e2bc5a] font-bold text-xl">T</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-tight tracking-wide">TRADEVANCE</span>
                            <span className="text-[10px] text-[#75818d] tracking-widest uppercase hidden sm:block">AI Global Trade Network</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
                            <button onClick={() => openExplorer('overview')} className="hover:text-white flex items-center gap-1">Solutions <ChevronDown size={14}/></button>
                            <button onClick={() => openExplorer('intelligence')} className="hover:text-white">Intelligence</button>
                            <button onClick={() => openExplorer('resources')} className="hover:text-white">Resources</button>
                            <button onClick={() => openExplorer('overview')} className="hover:text-white flex items-center gap-1">Company <ChevronDown size={14}/></button>
                        </nav>
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/login')} className="text-sm font-bold hover:text-gray-300">Sign In</button>
                            <button onClick={() => navigate('/login')} className="bg-[#d8b65c] hover:bg-[#c9a34a] text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-[#d8b65c]/20 flex items-center gap-2">
                                <Lock size={14} /> Create Account
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex flex-col justify-center mt-12 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        
                        <div className="max-w-2xl w-full">
                            <div className="inline-flex items-center gap-2 text-[#d8b65c] text-xs font-bold tracking-widest uppercase mb-6 bg-[#d8b65c]/10 px-3 py-1.5 rounded-full border border-[#d8b65c]/20">
                                <BrainCircuit size={14} /> AI-NATIVE GLOBAL TRADE PLATFORM
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                                Connect Global Trade.<br/>
                                <span className="text-[#d8b65c]">Create Real Value.</span>
                            </h1>
                            <p className="text-[#a0abb6] text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
                                AI-powered intelligence, trusted networks and end-to-end trade execution &mdash; built to make global trade faster, safer and more profitable.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 border-t border-b border-gray-800 py-6">
                                <div>
                                    <div className="flex items-center gap-2 text-[#d8b65c] font-bold text-xl mb-1"><Globe size={18}/> 190+</div>
                                    <div className="text-sm font-bold text-gray-300">Countries</div>
                                    <div className="text-[10px] text-gray-500">Global coverage</div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-[#d8b65c] font-bold text-xl mb-1"><Users size={18}/> 1M+</div>
                                    <div className="text-sm font-bold text-gray-300">Partners</div>
                                    <div className="text-[10px] text-gray-500">Growing network</div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-[#d8b65c] font-bold text-xl mb-1"><Package size={18}/> 50K+</div>
                                    <div className="text-sm font-bold text-gray-300">Commodities</div>
                                    <div className="text-[10px] text-gray-500">Active & updated</div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-[#d8b65c] font-bold text-xl mb-1"><Activity size={18}/> 24/7</div>
                                    <div className="text-sm font-bold text-gray-300">AI Intelligence</div>
                                    <div className="text-[10px] text-gray-500">Always-on insights</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#101922]/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-md">
                                <div className="flex flex-col gap-3 items-start">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2 border border-blue-500/20"><Network size={20}/></div>
                                    <h3 className="font-bold text-sm text-gray-200">Global Network</h3>
                                    <p className="text-[11px] text-gray-500 leading-relaxed mb-2 text-left">Discover verified buyers and trusted suppliers across the world.</p>
                                    <button onClick={() => openExplorer('buyers')} className="text-blue-400 text-xs font-bold flex items-center gap-1 hover:text-blue-300 mt-auto">Explore network <ArrowRight size={12}/></button>
                                </div>
                                <div className="flex flex-col gap-3 items-start">
                                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2 border border-cyan-500/20"><Activity size={20}/></div>
                                    <h3 className="font-bold text-sm text-gray-200">AI Intelligence</h3>
                                    <p className="text-[11px] text-gray-500 leading-relaxed mb-2 text-left">Real-time market signals, demand insights and risk scoring.</p>
                                    <button onClick={() => openExplorer('intelligence')} className="text-cyan-400 text-xs font-bold flex items-center gap-1 hover:text-cyan-300 mt-auto">View intelligence <ArrowRight size={12}/></button>
                                </div>
                                <div className="flex flex-col gap-3 items-start">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 mb-2 border border-green-500/20"><ShieldCheck size={20}/></div>
                                    <h3 className="font-bold text-sm text-gray-200">Trust & Verification</h3>
                                    <p className="text-[11px] text-gray-500 leading-relaxed mb-2 text-left">Verified entities, compliance checks and secure introductions.</p>
                                    <button onClick={() => openExplorer('trust')} className="text-green-400 text-xs font-bold flex items-center gap-1 hover:text-green-300 mt-auto">Learn more <ArrowRight size={12}/></button>
                                </div>
                                <div className="flex flex-col gap-3 items-start">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-2 border border-orange-500/20"><Package size={20}/></div>
                                    <h3 className="font-bold text-sm text-gray-200">End-to-End Trade</h3>
                                    <p className="text-[11px] text-gray-500 leading-relaxed mb-2 text-left">From RFQ to settlement, manage every step in one secure platform.</p>
                                    <button onClick={() => openExplorer('workflow')} className="text-orange-400 text-xs font-bold flex items-center gap-1 hover:text-orange-300 mt-auto">See how it works <ArrowRight size={12}/></button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE MOCKUP */}
                        <DashboardMockup />
                        
                    </div>
                </div>

                <div className="z-10 mt-auto pt-8 border-t border-gray-800/50">
                    <p className="text-gray-500 text-xs font-medium mb-4">Trusted by forward-thinking companies worldwide</p>
                    <div className="flex flex-wrap items-center gap-6 sm:gap-8 opacity-60 grayscale">
                        <span className="font-extrabold text-lg tracking-tighter">VOPAK</span>
                        <span className="font-bold text-lg">Trafigura</span>
                        <span className="font-serif text-lg tracking-wider">GLENCORE</span>
                        <span className="font-bold text-xl italic flex items-center gap-1"><div className="w-4 h-4 bg-white rounded-full"></div> Vitol</span>
                        <span className="font-bold text-lg font-serif">Cargill</span>
                        <span className="font-bold text-xl text-green-500">bp</span>
                        <span className="font-black text-lg tracking-tight">BUNGE</span>
                        <span className="font-black text-lg">ADM</span>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-[10px] text-gray-500 font-bold">
                        <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[#d8b65c]"/> Enterprise-grade security</span>
                        <span className="hidden sm:inline">&bull;</span>
                        <span>ISO 27001 Compliant</span>
                        <span className="hidden sm:inline">&bull;</span>
                        <span>GDPR Ready</span>
                    </div>
                </div>
            </div>

            <PublicExplorer explorerRef={explorerRef} onSignIn={() => { navigate('/login'); }} />
        </div>
    );
}
