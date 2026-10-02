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
        <div className="flex min-h-screen bg-[#000000] text-white font-sans md:overflow-hidden overflow-y-auto">
            
            {/* LEFT SIDE (Dark) */}
            <div className="w-[60%] relative flex flex-col justify-between p-12 bg-gradient-to-br from-[#0c131b] via-[#070b10] to-[#000000] z-10 hidden md:flex">
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
                            <span className="text-[10px] text-[#75818d] tracking-widest uppercase">AI Global Trade Network</span>
                        </div>
                    </div>
                    <nav className="flex gap-8 text-sm font-medium text-gray-300">
                        <a href="#" className="hover:text-white flex items-center gap-1">Solutions <ChevronDown size={14}/></a>
                        <a href="#" className="hover:text-white">Intelligence</a>
                        <a href="#" className="hover:text-white flex items-center gap-1">Resources <ChevronDown size={14}/></a>
                        <a href="#" className="hover:text-white">Pricing</a>
                        <a href="#" className="hover:text-white flex items-center gap-1">Company <ChevronDown size={14}/></a>
                    </nav>
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

            {/* RIGHT SIDE (Light/White) */}
            <div className="w-full md:w-[40%] min-h-screen md:min-h-0 bg-[#fcfcfd] text-gray-900 flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 relative">
                
                <div className="absolute top-8 right-8 hidden md:flex items-center gap-3">
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 shadow-sm">
                        <Globe size={16}/> English <ChevronDown size={14}/>
                    </button>
                    <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                        <button className="p-1.5 rounded-full bg-gray-100 text-gray-800"><Sun size={14}/></button>
                        <button className="p-1.5 rounded-full text-gray-400 hover:text-gray-800"><Moon size={14}/></button>
                    </div>
                </div>

                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 mx-auto border-2 border-[#d8b65c] rounded-2xl flex items-center justify-center bg-white shadow-sm mb-6">
                            <span className="text-[#d8b65c] font-bold text-2xl">T</span>
                        </div>
                        <div className="text-[#d8b65c] text-[10px] font-bold tracking-widest uppercase mb-3">WELCOME TO TRADEVANCE</div>
                        <h2 className="text-3xl font-extrabold mb-2 text-gray-900">{isSignUp ? 'Create an account' : 'Welcome to Tradevance'}</h2>
                        <p className="text-gray-500 text-sm">
                            {isSignUp ? 'Sign up to access your secure trade workspace' : 'Sign in to access your secure trade workspace'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-8 bg-gray-50 p-1 rounded-xl border border-gray-100">
                        {['Buyer', 'Seller', 'Operator'].map(r => (
                            <button 
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex flex-col items-center justify-center py-3 rounded-lg border transition-all ${role === r ? 'bg-white border-[#d8b65c] shadow-sm text-gray-900 relative' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-white/50'}`}
                            >
                                {role === r && <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#d8b65c] rounded-full"></div>}
                                {r === 'Buyer' ? <Package size={16} className={role===r ? 'text-[#d8b65c] mb-1' : 'mb-1'}/> : r === 'Seller' ? <StoreIcon size={16} className={role===r ? 'text-[#d8b65c] mb-1' : 'mb-1'}/> : <ShieldCheck size={16} className={role===r ? 'text-[#d8b65c] mb-1' : 'mb-1'}/>}
                                <span className="font-bold text-sm">{r}</span>
                                <span className={`text-[9px] hidden sm:block ${role === r ? 'text-[#d8b65c]' : 'text-gray-400'}`}>
                                    {r === 'Buyer' ? 'Source globally' : r === 'Seller' ? 'Reach more buyers' : 'Orchestrate trade'}
                                </span>
                            </button>
                        ))}
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}

                    <form className="flex flex-col gap-4 mb-8" onSubmit={handleAuth}>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="Email address" 
                                className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#d8b65c]/50 focus:border-[#d8b65c] transition-all" 
                            />
                        </div>
                        <div className="relative">
                            <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                placeholder="Password" 
                                className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-11 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#d8b65c]/50 focus:border-[#d8b65c] transition-all" 
                            />
                        </div>
                        
                        {!isSignUp && (
                            <div className="flex justify-between items-center text-xs font-medium my-1">
                                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-300 text-[#d8b65c] focus:ring-[#d8b65c]" />
                                    Remember me
                                </label>
                                <a href="#" className="text-[#d8b65c] hover:underline">Forgot password?</a>
                            </div>
                        )}
                        
                        <button disabled={loading} type="submit" className="w-full bg-[#bd9a3b] hover:bg-[#a68631] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-[#bd9a3b]/20 flex justify-center items-center gap-2">
                            <Lock size={16} /> {isSignUp ? 'Create account' : 'Sign in securely'} <ArrowRight size={16} />
                        </button>
                    </form>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">OR</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="flex flex-col gap-3 mb-8">
                        <button onClick={handleGoogleAuth} disabled={loading} type="button" className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-3 text-sm disabled:opacity-50">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> Continue with Google
                        </button>
                    </div>

                    <div className="text-center text-sm font-medium text-gray-600">
                        {isSignUp ? 'Already have an account? ' : 'New to Tradevance? '}
                        <button onClick={() => setIsSignUp(!isSignUp)} className="text-[#d8b65c] font-bold hover:underline">
                            {isSignUp ? 'Sign in instead' : 'Create your account'} <ArrowRight size={12} className="inline"/>
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-8 left-12 right-12 hidden md:block">
                    <div className="grid grid-cols-4 gap-4 text-center border-t border-gray-200 pt-8">
                        <div className="flex flex-col items-center gap-2">
                            <ShieldCheck size={20} className="text-[#d8b65c]"/>
                            <span className="font-bold text-xs text-gray-800">Enterprise-grade<br/>Security</span>
                            <span className="text-[9px] text-gray-400">Your data is protected</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Users size={20} className="text-[#d8b65c]"/>
                            <span className="font-bold text-xs text-gray-800">Role-based<br/>Access</span>
                            <span className="text-[9px] text-gray-400">Permissions by role</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Globe size={20} className="text-[#d8b65c]"/>
                            <span className="font-bold text-xs text-gray-800">Global Network<br/>Visibility</span>
                            <span className="text-[9px] text-gray-400">Secure introductions</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <CheckCircle2 size={20} className="text-[#d8b65c]"/>
                            <span className="font-bold text-xs text-gray-800">Compliance<br/>Ready</span>
                            <span className="text-[9px] text-gray-400">Built for global trade</span>
                        </div>
                    </div>
                </div>

                <PublicExplorer onSignIn={(r) => { setRole(r==='buyer'?'Buyer':'Seller'); setIsSignUp(true); }} />
            </div>
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
