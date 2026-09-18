import React, { useState } from 'react';
import { api } from '@appdeploy/client';
import { Globe2, ShieldCheck, Target, Users, MapPin, Briefcase, Activity, CheckCircle, BarChart3, LockKeyhole } from 'lucide-react';

type Buyer = { id: string; name: string; country: string; industry: string; activeDemands: number; credit: string };
type Supplier = { id: string; name: string; country: string; products: string[]; score: number; status: string; capacity: string; port: string; verified: string; risk: string };

export default function NetworkView({ mode, data }: { mode: 'buyers' | 'suppliers'; data: { buyers: Buyer[]; suppliers: Supplier[] } }) {
    const [m, setM] = useState<string | null>(null);
    const [msg, setMsg] = useState('');

    const request = async (t: 'buyer' | 'seller', x: any, product = '') => {
        setM(x.id);
        setMsg('');
        try {
            const r = await api.post('/api/introductions', { targetType: t, targetEntityId: x.id, targetName: x.name, product });
            setMsg('Referral ' + r.data.referralId + ' created. Contact details remain protected.');
        } catch {
            setMsg('Introduction request failed or access is not permitted.');
        } finally {
            setM(null);
            setTimeout(() => setMsg(''), 5000); // clear after 5s
        }
    };

    if (mode === 'buyers') {
        return (
            <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-[#c9a34a] text-xs font-bold tracking-widest uppercase mb-3">
                        <Users size={14} /> BUYER NETWORK
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Qualified Buyer Intelligence</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">Seller-side discovery exposes buyer intelligence only. Private contact details remain protected and are brokered exclusively through Tradevance introductions.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data.buyers.map(b => (
                        <div className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden hover:border-[#4f5b67] transition-all flex flex-col group" key={b.id}>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-[#202b36] text-[#eef2f6] flex items-center justify-center text-xl font-bold border border-[#4f5b67] group-hover:border-[#c29631] transition-colors">
                                        {b.name.charAt(0)}
                                    </div>
                                    <div className="bg-[#0c131b] border border-[#202b36] px-2 py-1 rounded text-[10px] text-[#75818d] font-mono">
                                        {b.id}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 truncate" title={b.name}>{b.name}</h3>
                                <div className="flex items-center gap-4 text-xs text-[#75818d] mb-6">
                                    <span className="flex items-center gap-1"><MapPin size={12}/> {b.country}</span>
                                    <span className="flex items-center gap-1"><Briefcase size={12}/> {b.industry}</span>
                                </div>
                                
                                <div className="space-y-3 mt-auto">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-[#4f5b67] flex items-center gap-1"><Activity size={14}/> Demand Signal</span>
                                        <b className={b.activeDemands > 0 ? 'text-green-500' : 'text-[#75818d]'}>{b.activeDemands > 0 ? 'Active' : 'Monitor'}</b>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pb-4 border-b border-[#202b36]">
                                        <span className="text-[#4f5b67] flex items-center gap-1"><BarChart3 size={14}/> Credit Rating</span>
                                        <b className="text-white">{b.credit}</b>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-[#c29631] font-bold">
                                        <LockKeyhole size={12}/> CONTACT PROTECTED
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-[#0c131b] border-t border-[#202b36]">
                                <button 
                                    className="w-full bg-[#202b36] hover:bg-[#c29631] hover:text-black text-white py-2 rounded flex justify-center items-center gap-2 text-xs font-bold transition-colors disabled:opacity-50" 
                                    disabled={m === b.id} 
                                    onClick={() => request('buyer', b)}
                                >
                                    <Target size={14} /> {m === b.id ? 'Requesting…' : 'Request Introduction'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {msg && (
                    <div className="fixed bottom-6 right-6 bg-[#0c131b] border border-[#c29631] text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50">
                        <CheckCircle size={18} className="text-[#c29631]" />
                        <span className="text-sm font-medium">{msg}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-3">
                    <Globe2 size={14} /> SUPPLIER NETWORK
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2">Qualified Global Supply</h2>
                <p className="text-[#75818d] text-sm max-w-2xl">Buyer-side discovery exposes supplier capability, trust, and risk metrics without leaking private contact information.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.suppliers.map(s => (
                    <div className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden hover:border-[#4f5b67] transition-all flex flex-col group" key={s.id}>
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl font-bold border border-blue-500/30">
                                        {s.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <b className="text-lg text-white block mb-1">{s.name}</b>
                                        <span className="text-xs text-[#75818d] flex items-center gap-1"><MapPin size={12}/> {s.country} · {s.port}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <strong className="text-2xl text-white font-mono block">{s.score}</strong>
                                    <small className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Trust Score</small>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {s.products.map(p => (
                                    <span key={p} className="bg-[#202b36] text-[#eef2f6] text-[10px] px-2 py-1 rounded border border-[#4f5b67]">{p}</span>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-y border-[#202b36] py-4 mb-4">
                                <div>
                                    <span className="text-[10px] text-[#4f5b67] uppercase block mb-1">Status</span>
                                    <b className="text-xs text-green-500 flex items-center gap-1"><ShieldCheck size={12}/> {s.verified}</b>
                                </div>
                                <div>
                                    <span className="text-[10px] text-[#4f5b67] uppercase block mb-1">Capacity</span>
                                    <b className="text-xs text-white truncate block">{s.capacity}</b>
                                </div>
                                <div>
                                    <span className="text-[10px] text-[#4f5b67] uppercase block mb-1">Risk Profile</span>
                                    <b className="text-xs text-white">{s.risk}</b>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-[#75818d] font-bold">
                                <LockKeyhole size={12}/> IDENTITY PROTECTED · 24-MONTH REFERRAL TAIL
                            </div>
                        </div>
                        <div className="p-4 bg-[#0c131b] border-t border-[#202b36]">
                            <button 
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded flex justify-center items-center gap-2 text-sm font-bold transition-colors disabled:opacity-50" 
                                disabled={m === s.id} 
                                onClick={() => request('seller', s, s.products[0])}
                            >
                                <Target size={16} /> {m === s.id ? 'Requesting…' : 'Request Controlled Introduction'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {msg && (
                <div className="fixed bottom-6 right-6 bg-[#0c131b] border border-blue-500 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50">
                    <CheckCircle size={18} className="text-blue-400" />
                    <span className="text-sm font-medium">{msg}</span>
                </div>
            )}
        </div>
    );
}
