import React, { useState } from 'react';
import { Globe2, Sparkles, ShieldCheck, BriefcaseBusiness, ArrowRight, ChevronRight, Moon, Sun, LockKeyhole, FileCheck2, Users, Building2 } from 'lucide-react';

export default function LandingPage({ loading, returningUser, language, setLanguage, theme, setTheme, onSignIn }: any) {
    const [menu, setMenu] = useState<string | null>(null);

    const openMenu = (name: string) => {
        setMenu(menu === name ? null : name);
    };

    return (
        <div className="flex min-h-screen font-sans bg-[#070b10] text-[#eef2f6]">
            {/* Left Side: Dark Theme Hero */}
            <div className="w-7/12 p-12 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#101922] via-[#070b10] to-[#070b10]">
                {/* Brand & Nav */}
                <div className="flex justify-between items-center z-10 relative">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-[#c9a34a] rounded-xl flex items-center justify-center bg-black">
                            <span className="text-[#e2bc5a] font-bold text-xl">T</span>
                        </div>
                        <div>
                            <strong className="tracking-widest text-lg font-bold block leading-none">TRADEVANCE</strong>
                            <span className="text-[#b79139] text-[10px] tracking-widest uppercase block mt-1">AI Global Trade Network</span>
                        </div>
                    </div>
                    <nav className="flex gap-8 text-sm text-[#75818d]">
                        {['Solutions', 'Intelligence', 'Resources', 'Pricing', 'Company'].map(item => (
                            <button key={item} onClick={() => openMenu(item)} className="hover:text-white flex items-center gap-1">
                                {item} <ChevronRight size={14} className="opacity-50" />
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Hero Content */}
                <div className="flex-1 flex flex-col justify-center max-w-2xl z-10 relative mt-20">
                    <div className="flex items-center gap-2 text-[#c9a34a] text-xs tracking-widest font-semibold mb-6">
                        <Sparkles size={14} /> AI-NATIVE GLOBAL TRADE PLATFORM
                    </div>
                    <h1 className="text-6xl font-extrabold tracking-tight leading-tight mb-8">
                        Connect Global Trade.<br />
                        <span className="text-[#d8b65c]">Create Real Value.</span>
                    </h1>
                    <p className="text-lg text-[#75818d] mb-12 max-w-xl leading-relaxed">
                        AI-powered intelligence, trusted networks and end-to-end trade execution — built to make global trade faster, safer and more profitable.
                    </p>

                    <div className="flex gap-12 mb-16">
                        <div>
                            <div className="flex items-center gap-2 text-[#d8b65c] font-bold text-xl"><Globe2 size={20}/> 190+</div>
                            <span className="text-xs text-[#75818d] block mt-1">Countries</span>
                            <span className="text-[10px] text-[#4f5b67]">Global coverage</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[#d8b65c] font-bold text-xl"><Users size={20}/> 1M+</div>
                            <span className="text-xs text-[#75818d] block mt-1">Trade Partners</span>
                            <span className="text-[10px] text-[#4f5b67]">Growing network</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[#d8b65c] font-bold text-xl"><BriefcaseBusiness size={20}/> 50K+</div>
                            <span className="text-xs text-[#75818d] block mt-1">Commodity Categories</span>
                            <span className="text-[10px] text-[#4f5b67]">Active & updated</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[#d8b65c] font-bold text-xl"><TrendingUp size={20}/> 24/7</div>
                            <span className="text-xs text-[#75818d] block mt-1">AI Trade Intelligence</span>
                            <span className="text-[10px] text-[#4f5b67]">Always-on insights</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6 bg-[#0c131b]/80 backdrop-blur-lg border border-[#202b36] rounded-2xl p-6">
                        <div>
                            <Globe2 size={24} className="text-blue-500 mb-4" />
                            <h3 className="font-semibold text-sm mb-2">Global Network</h3>
                            <p className="text-[10px] text-[#75818d] mb-4">Discover verified buyers and trusted suppliers across the world.</p>
                            <button className="text-blue-500 text-xs flex items-center gap-1 hover:underline">Explore network <ArrowRight size={12} /></button>
                        </div>
                        <div>
                            <Sparkles size={24} className="text-blue-400 mb-4" />
                            <h3 className="font-semibold text-sm mb-2">AI Intelligence</h3>
                            <p className="text-[10px] text-[#75818d] mb-4">Real-time market signals, demand insights and risk scoring.</p>
                            <button className="text-blue-400 text-xs flex items-center gap-1 hover:underline">View intelligence <ArrowRight size={12} /></button>
                        </div>
                        <div>
                            <ShieldCheck size={24} className="text-green-500 mb-4" />
                            <h3 className="font-semibold text-sm mb-2">Trust & Verification</h3>
                            <p className="text-[10px] text-[#75818d] mb-4">Verified entities, compliance checks and secure introductions.</p>
                            <button className="text-blue-500 text-xs flex items-center gap-1 hover:underline">Learn more <ArrowRight size={12} /></button>
                        </div>
                        <div>
                            <BriefcaseBusiness size={24} className="text-orange-500 mb-4" />
                            <h3 className="font-semibold text-sm mb-2">End-to-End Trade</h3>
                            <p className="text-[10px] text-[#75818d] mb-4">From RFQ to settlement, manage every step in one secure platform.</p>
                            <button className="text-blue-500 text-xs flex items-center gap-1 hover:underline">See how it works <ArrowRight size={12} /></button>
                        </div>
                    </div>
                </div>

                {/* Footer Logos */}
                <div className="mt-auto z-10 relative pt-12">
                    <p className="text-xs text-[#4f5b67] mb-6">Trusted by forward-thinking companies worldwide</p>
                    <div className="flex gap-8 opacity-40 grayscale">
                        <span className="font-bold text-xl tracking-tighter">VOPAK</span>
                        <span className="font-bold text-xl tracking-tighter">Trafigura</span>
                        <span className="font-bold text-xl tracking-tighter">GLENCORE</span>
                        <span className="font-bold text-xl tracking-tighter flex items-center gap-1"><div className="w-4 h-4 border-2 border-white rounded-sm"></div> Vitol</span>
                        <span className="font-bold text-xl tracking-tighter italic">Cargill</span>
                        <span className="font-bold text-xl tracking-tighter flex items-center gap-1"><Sparkles size={16}/> bp</span>
                        <span className="font-bold text-xl tracking-tighter">BUNGE</span>
                        <span className="font-bold text-xl tracking-tighter">ADM</span>
                    </div>
                    <div className="flex gap-6 mt-8 text-[10px] text-[#4f5b67]">
                        <span className="flex items-center gap-1 text-[#d8b65c]"><ShieldCheck size={12}/> Enterprise-grade security</span>
                        <span>• ISO 27001 Compliant</span>
                        <span>• GDPR Ready</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Light Theme Auth */}
            <div className="w-5/12 bg-white text-[#18212b] p-8 flex flex-col justify-between overflow-y-auto">
                <div className="flex justify-end gap-3 items-center">
                    <div className="flex items-center gap-2 border border-[#dce3ea] rounded-full px-3 py-1.5 text-xs text-[#667381] font-medium bg-[#f8fafc]">
                        <Globe2 size={14} />
                        <select className="bg-transparent outline-none cursor-pointer" value={language} onChange={e => setLanguage(e.target.value)}>
                            <option value="en">English</option>
                            <option value="id">Bahasa Indonesia</option>
                        </select>
                    </div>
                    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 border border-[#dce3ea] rounded-full text-[#667381] bg-[#f8fafc] hover:bg-[#dce3ea] transition-colors">
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full py-12">
                    <div className="w-16 h-16 border-2 border-[#c9a34a] rounded-2xl flex items-center justify-center bg-white mb-6 shadow-sm">
                        <span className="text-[#c9a34a] font-bold text-3xl">T</span>
                    </div>
                    <p className="text-[#c9a34a] text-xs font-bold tracking-widest uppercase mb-2">Welcome to Tradevance</p>
                    <h2 className="text-3xl font-bold mb-3">Welcome to Tradevance</h2>
                    <p className="text-[#667381] text-sm mb-8 text-center">Sign in to access your secure trade workspace</p>

                    <div className="flex w-full border border-[#dce3ea] rounded-xl overflow-hidden mb-6 bg-[#f8fafc]">
                        <button className="flex-1 py-3 flex flex-col items-center gap-1 border-r border-[#dce3ea] bg-white text-[#b58a2b] relative">
                            <BriefcaseBusiness size={18} />
                            <span className="font-semibold text-sm">Buyer</span>
                            <span className="text-[10px] opacity-70">Source globally</span>
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#b58a2b]"></div>
                        </button>
                        <button className="flex-1 py-3 flex flex-col items-center gap-1 border-r border-[#dce3ea] text-[#667381] hover:bg-white transition-colors">
                            <Building2 size={18} />
                            <span className="font-semibold text-sm text-[#18212b]">Seller</span>
                            <span className="text-[10px]">Reach more buyers</span>
                        </button>
                        <button className="flex-1 py-3 flex flex-col items-center gap-1 text-[#667381] hover:bg-white transition-colors">
                            <ShieldCheck size={18} />
                            <span className="font-semibold text-sm text-[#18212b]">Operator</span>
                            <span className="text-[10px]">Orchestrate trade</span>
                        </button>
                    </div>

                    <div className="w-full space-y-4">
                        <div className="relative">
                            <input type="text" placeholder="Email or Username" className="w-full border border-[#dce3ea] rounded-xl px-12 py-3.5 text-sm outline-none focus:border-[#b58a2b] bg-white transition-colors" />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aab4be]">✉️</span>
                        </div>
                        <div className="relative">
                            <input type="password" placeholder="Password" className="w-full border border-[#dce3ea] rounded-xl px-12 py-3.5 text-sm outline-none focus:border-[#b58a2b] bg-white transition-colors" />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aab4be]">🔒</span>
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aab4be] hover:text-[#667381]">👁️</button>
                        </div>
                    </div>

                    <div className="flex w-full justify-between items-center mt-4 mb-6 text-sm">
                        <label className="flex items-center gap-2 text-[#667381] cursor-pointer">
                            <input type="checkbox" className="rounded border-[#dce3ea] text-[#b58a2b] focus:ring-[#b58a2b]" />
                            Remember me
                        </label>
                        <a href="#" className="text-[#b58a2b] hover:underline font-medium">Forgot password?</a>
                    </div>

                    <button className="w-full bg-[#c29631] hover:bg-[#a37c23] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#c29631]/20" onClick={onSignIn}>
                        <LockKeyhole size={18} /> Sign in securely <ArrowRight size={18} />
                    </button>

                    <div className="flex items-center gap-4 w-full my-6">
                        <div className="flex-1 h-px bg-[#dce3ea]"></div>
                        <span className="text-xs text-[#aab4be] font-medium uppercase">OR</span>
                        <div className="flex-1 h-px bg-[#dce3ea]"></div>
                    </div>

                    <div className="w-full space-y-3">
                        <button className="w-full bg-white border border-[#dce3ea] hover:bg-[#f8fafc] text-[#18212b] font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-colors">
                            <span className="text-lg">G</span> Continue with Google
                        </button>
                        <button className="w-full bg-white border border-[#dce3ea] hover:bg-[#f8fafc] text-[#18212b] font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-colors">
                            <span className="text-lg text-blue-500">M</span> Continue with Microsoft
                        </button>
                    </div>

                    <p className="mt-8 text-sm text-[#667381]">
                        New to Tradevance? <a href="#" className="text-[#b58a2b] font-bold hover:underline">Create your account <ArrowRight size={14} className="inline -mt-0.5" /></a>
                    </p>
                </div>

                <div className="grid grid-cols-4 gap-4 pt-6 border-t border-[#f1f5f9]">
                    <div className="flex flex-col items-center text-center gap-2">
                        <ShieldCheck size={20} className="text-[#b58a2b]" />
                        <span className="text-xs font-bold text-[#18212b]">Enterprise-grade<br/>Security</span>
                        <span className="text-[9px] text-[#667381]">Your data is protected</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <Users size={20} className="text-[#b58a2b]" />
                        <span className="text-xs font-bold text-[#18212b]">Role-based<br/>Access</span>
                        <span className="text-[9px] text-[#667381]">Permissions by role</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <Globe2 size={20} className="text-[#b58a2b]" />
                        <span className="text-xs font-bold text-[#18212b]">Global Network<br/>Visibility</span>
                        <span className="text-[9px] text-[#667381]">Secure introductions</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <FileCheck2 size={20} className="text-[#b58a2b]" />
                        <span className="text-xs font-bold text-[#18212b]">Compliance<br/>Ready</span>
                        <span className="text-[9px] text-[#667381]">Built for global trade</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
