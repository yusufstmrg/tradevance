import React, { useState, useEffect } from 'react';
import { Globe, Users, Package, Activity, Network, BrainCircuit, ShieldCheck, ArrowRight, CheckCircle2, Lock, Eye, Mail, Moon, Sun, ChevronDown, LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import PublicExplorer from './PublicExplorer';

export default function LandingPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [role, setRole] = useState('Buyer');
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignUp) {
                const userCred = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, 'users', userCred.user.uid), {
                    email,
                    role,
                    name: email.split('@')[0],
                    company: 'New Company',
                    createdAt: new Date().toISOString()
                });
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate('/dashboard');
        } catch (err: any) {
            if (err.code === 'auth/invalid-credential') { setError('Email atau password salah.'); } else if (err.code === 'auth/email-already-in-use') { setError('Email ini sudah terdaftar.'); } else { setError('Autentikasi gagal. Silakan coba lagi.'); }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setError('');
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const userCred = await signInWithPopup(auth, provider);
            
            // Check if user exists, if not create default profile
            const docRef = doc(db, 'users', userCred.user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    email: userCred.user.email,
                    role,
                    name: userCred.user.displayName || userCred.user.email?.split('@')[0] || 'User',
                    company: 'Google Account',
                    createdAt: new Date().toISOString()
                });
            }
            navigate('/dashboard');
        } catch (err: any) {
            if (err.code === 'auth/popup-closed-by-user') { setError('Proses login Google dibatalkan.'); } else { setError(err.message || 'Login dengan Google gagal.'); }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#000000] text-white font-sans overflow-hidden">
            
            <div className="w-full relative flex flex-col justify-between p-6 md:p-12 bg-gradient-to-br from-[#0c131b] via-[#070b10] to-[#000000] z-10">
                <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-40"></div>
                    <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-yellow-500/10 blur-[100px] rounded-full"></div>
                </div>

                <header className="flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
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
                            <a href="#" className="hover:text-white flex items-center gap-1">Solutions <ChevronDown size={14}/></a>
                            <a href="#" className="hover:text-white">Intelligence</a>
                            <a href="#" className="hover:text-white flex items-center gap-1">Resources <ChevronDown size={14}/></a>
                            <a href="#" className="hover:text-white">Pricing</a>
                            <a href="#" className="hover:text-white flex items-center gap-1">Company <ChevronDown size={14}/></a>
                        </nav>
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/login')} className="text-sm font-bold text-white hover:text-gray-300 transition-colors">Sign In</button>
                            <button onClick={() => navigate('/login')} className="bg-[#d8b65c] text-[#070b10] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#e0c274] transition-colors">Create Account</button>
                        </div>
                    </div>
                </header>

                <div className="z-10 mt-12 max-w-2xl">
                    <div className="inline-flex items-center gap-2 text-[#d8b65c] text-xs font-bold tracking-widest uppercase mb-6 bg-[#d8b65c]/10 px-3 py-1.5 rounded-full border border-[#d8b65c]/20">
                        <BrainCircuit size={14} /> AI-NATIVE GLOBAL TRADE PLATFORM
                    </div>
                    <h1 className="text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                        Connect Global Trade.<br/>
                        <span className="text-[#d8b65c]">Create Real Value.</span>
                    </h1>
                    <p className="text-[#a0abb6] text-lg mb-12 max-w-xl leading-relaxed">
                        AI-powered intelligence, trusted networks and end-to-end trade execution — built to make global trade faster, safer and more profitable.
                    </p>

                    <div className="grid grid-cols-4 gap-6 mb-12 border-t border-b border-gray-800 py-6">
                        <div>
                            <div className="flex items-center gap-2 text-[#d8b65c] font-bold text-xl mb-1"><Globe size={18}/> 190+</div>
                            <div className="text-sm font-bold text-gray-300">Countries</div>
                            <div className="text-[10px] text-gray-500">Global coverage</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[#d8b65c] font-bold text-xl mb-1"><Users size={18}/> 1M+</div>
                            <div className="text-sm font-bold text-gray-300">Trade Partners</div>
                            <div className="text-[10px] text-gray-500">Growing network</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[#d8b65c] font-bold text-xl mb-1"><Package size={18}/> 50K+</div>
                            <div className="text-sm font-bold text-gray-300">Commodity Categories</div>
                            <div className="text-[10px] text-gray-500">Active & updated</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-[#d8b65c] font-bold text-xl mb-1"><Activity size={18}/> 24/7</div>
                            <div className="text-sm font-bold text-gray-300">AI Trade Intelligence</div>
                            <div className="text-[10px] text-gray-500">Always-on insights</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 bg-[#101922]/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-md">
                        <div className="flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2 border border-blue-500/20"><Network size={20}/></div>
                            <h3 className="font-bold text-sm text-gray-200">Global Network</h3>
                            <p className="text-[11px] text-gray-500 leading-relaxed mb-2">Discover verified buyers and trusted suppliers across the world.</p>
                            <a href="#" className="text-blue-400 text-xs font-bold flex items-center gap-1 hover:text-blue-300 mt-auto">Explore network <ArrowRight size={12}/></a>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2 border border-cyan-500/20"><Activity size={20}/></div>
                            <h3 className="font-bold text-sm text-gray-200">AI Intelligence</h3>
                            <p className="text-[11px] text-gray-500 leading-relaxed mb-2">Real-time market signals, demand insights and risk scoring.</p>
                            <a href="#" className="text-cyan-400 text-xs font-bold flex items-center gap-1 hover:text-cyan-300 mt-auto">View intelligence <ArrowRight size={12}/></a>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 mb-2 border border-green-500/20"><ShieldCheck size={20}/></div>
                            <h3 className="font-bold text-sm text-gray-200">Trust & Verification</h3>
                            <p className="text-[11px] text-gray-500 leading-relaxed mb-2">Verified entities, compliance checks and secure introductions.</p>
                            <a href="#" className="text-green-400 text-xs font-bold flex items-center gap-1 hover:text-green-300 mt-auto">Learn more <ArrowRight size={12}/></a>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-2 border border-orange-500/20"><Package size={20}/></div>
                            <h3 className="font-bold text-sm text-gray-200">End-to-End Trade</h3>
                            <p className="text-[11px] text-gray-500 leading-relaxed mb-2">From RFQ to settlement, manage every step in one secure platform.</p>
                            <a href="#" className="text-orange-400 text-xs font-bold flex items-center gap-1 hover:text-orange-300 mt-auto">See how it works <ArrowRight size={12}/></a>
                        </div>
                    </div>
                </div>

                <div className="z-10 mt-12">
                    <p className="text-gray-500 text-xs font-medium mb-4">Trusted by forward-thinking companies worldwide</p>
                    <div className="flex items-center gap-8 opacity-60 grayscale">
                        <span className="font-extrabold text-lg tracking-tighter">VOPAK</span>
                        <span className="font-bold text-lg">Trafigura</span>
                        <span className="font-serif text-lg tracking-wider">GLENCORE</span>
                        <span className="font-bold text-xl italic flex items-center gap-1"><div className="w-4 h-4 bg-white rounded-full"></div> Vitol</span>
                        <span className="font-bold text-lg font-serif">Cargill</span>
                        <span className="font-bold text-xl text-green-500">bp</span>
                        <span className="font-black text-lg tracking-tight">BUNGE</span>
                        <span className="font-black text-lg">ADM</span>
                    </div>
                    <div className="mt-6 flex items-center gap-4 text-[10px] text-gray-500 font-bold">
                        <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[#d8b65c]"/> Enterprise-grade security</span>
                        <span>•</span>
                        <span>ISO 27001 Compliant</span>
                        <span>•</span>
                        <span>GDPR Ready</span>
                    </div>
                </div>
            </div>

            <PublicExplorer onSignIn={(r) => { navigate('/login'); }} />
        </div>
    );
}

function StoreIcon({size, className}: {size:number, className?:string}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
        </svg>
    )
}
