import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, Mail, LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

export default function AuthPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [role, setRole] = useState('Buyer');
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            if (err.code === 'auth/invalid-credential') { setError('Email atau password salah.'); } 
            else if (err.code === 'auth/email-already-in-use') { setError('Email ini sudah terdaftar.'); } 
            else { setError('Autentikasi gagal. Silakan coba lagi.'); }
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
            if (err.code === 'auth/popup-closed-by-user') { setError('Proses login Google dibatalkan.'); } 
            else { setError(err.message || 'Login dengan Google gagal.'); }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white text-gray-900 font-sans items-center justify-center p-6">
            <div className="w-full max-w-md bg-white">
                <div className="text-center mb-8">
                    <button onClick={() => navigate('/')} className="w-14 h-14 mx-auto border-2 border-[#d8b65c] rounded-2xl flex items-center justify-center bg-white shadow-sm mb-6 hover:bg-gray-50 transition-colors">
                        <span className="text-[#d8b65c] font-bold text-2xl">T</span>
                    </button>
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
                            className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${role === r ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                            <div className="flex flex-col items-center gap-0.5">
                                <span>{r}</span>
                            </div>
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
        </div>
    );
}
