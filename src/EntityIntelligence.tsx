import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@appdeploy/client';
import { AlertTriangle, CheckCircle2, ExternalLink, Filter, Globe2, Search, ShieldCheck, Sparkles, TrendingUp, X } from 'lucide-react';

type Evidence = { type: string; claim: string; sourceUrl?: string };
type Entity = { id: string; name: string; entityType: 'Buyer' | 'Seller'; country: string; products: string[]; verificationLevel: string; confidence: number; evidence: Evidence[]; officialUrl?: string; tradeEvidence?: string; lastVerified: string; notes: string };

export default function EntityIntelligence() {
    const [entities, setEntities] = useState<Entity[]>([]);
    const [q, setQ] = useState('');
    const [type, setType] = useState('All');
    const [product, setProduct] = useState('All');
    const [selected, setSelected] = useState<Entity | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Website verification state
    const [verifyUrl, setVerifyUrl] = useState('');
    const [verifyResult, setVerifyResult] = useState<any>(null);
    const [verifying, setVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState('');

    const refresh = () => api.get('/api/entities').then(r => setEntities(r.data.entities)).catch(() => setEntities([])).finally(() => setLoading(false));
    
    useEffect(() => {
        refresh();
    }, []);

    const products = useMemo(() => ['All', ...Array.from(new Set(entities.flatMap(e => e.products))).sort()], [entities]);

    const filtered = entities.filter(e => 
        (type === 'All' || e.entityType === type) && 
        (product === 'All' || e.products.includes(product)) && 
        (!q || [e.name, e.country, e.products.join(' ')].join(' ').toLowerCase().includes(q.toLowerCase()))
    ).sort((a, b) => b.confidence - a.confidence);

    const verify = async () => {
        setVerifyError('');
        setVerifyResult(null);
        if (!verifyUrl.trim()) return;
        
        setVerifying(true);
        try {
            const r = await api.post('/api/entities/verify-url', { url: verifyUrl.trim(), companyName: selected?.name });
            setVerifyResult(r.data);
        } catch {
            setVerifyError('Verification failed. Check the URL and try again.');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                    <Globe2 size={14} /> GLOBAL ENTITY INTELLIGENCE
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2 text-white">Evidence-Backed Buyer & Seller Network</h2>
                <p className="text-[#75818d] text-sm max-w-2xl">Public-source discovery with provenance, confidence and trade-evidence layers. This is intelligence, not a legal guarantee.</p>
            </div>

            <div className="bg-[#101922] border border-[#202b36] rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <b className="block text-white mb-1 text-sm">Verification Architecture</b>
                    <span className="text-xs text-[#75818d]">Discovered → Source Verified → Evidence-backed → Document Verified → Trade Verified → Transaction Verified</span>
                </div>
                <div className="bg-[#0c131b] border border-[#202b36] px-4 py-2 rounded-lg text-sm">
                    <b className="text-white font-mono">{entities.length}</b> <span className="text-[#75818d]">entities in current registry</span>
                </div>
            </div>

            <section className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 bg-[#101922] border border-[#202b36] rounded-lg px-4 py-2 flex items-center gap-3 focus-within:border-blue-500 transition-colors">
                    <Search size={16} className="text-[#75818d]" />
                    <input 
                        className="bg-transparent border-none outline-none w-full text-sm text-white placeholder:text-[#4f5b67]"
                        value={q} 
                        onChange={e => setQ(e.target.value)} 
                        placeholder="Search company, country or product..." 
                    />
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#101922] border border-[#202b36] rounded-lg px-4 py-2 flex items-center gap-3">
                        <Filter size={14} className="text-[#75818d]" />
                        <select className="bg-transparent border-none outline-none text-sm text-white focus:ring-0" value={type} onChange={e => setType(e.target.value)}>
                            <option value="All">All Entities</option>
                            <option value="Buyer">Buyers</option>
                            <option value="Seller">Sellers</option>
                        </select>
                    </div>
                    <div className="bg-[#101922] border border-[#202b36] rounded-lg px-4 py-2 flex items-center gap-3">
                        <Filter size={14} className="text-[#75818d]" />
                        <select className="bg-transparent border-none outline-none text-sm text-white focus:ring-0" value={product} onChange={e => setProduct(e.target.value)}>
                            {products.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
            </section>

            {loading ? (
                <div className="text-center text-blue-400 animate-pulse py-12 text-sm font-bold tracking-widest uppercase">
                    Loading evidence-backed entity registry…
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map(e => (
                        <button 
                            key={e.id}
                            className="bg-[#101922] border border-[#202b36] rounded-xl p-5 text-left transition-all hover:bg-[#131c26] hover:border-blue-500/50 group flex flex-col h-full"
                            onClick={() => {
                                setSelected(e);
                                setVerifyResult(null);
                                setVerifyError('');
                                setVerifyUrl(e.officialUrl || '');
                            }}
                        >
                            <div className="flex justify-between items-start mb-4 w-full">
                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 rounded bg-[#0c131b] border border-[#202b36] flex items-center justify-center font-bold text-[#75818d] font-mono">
                                        {e.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <b className="block text-white text-base mb-0.5 group-hover:text-blue-400 transition-colors">{e.name}</b>
                                        <span className="text-xs text-[#75818d]">{e.entityType} · {e.country}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <strong className="block text-lg text-[#c29631] font-mono leading-none mb-1">{e.confidence}</strong>
                                    <small className="text-[9px] font-bold text-[#75818d] tracking-widest uppercase">Conf.</small>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {e.products.map(p => (
                                    <span key={p} className="bg-[#202b36] text-[#eef2f6] text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded">
                                        {p}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-auto pt-4 border-t border-[#202b36] w-full space-y-3">
                                <div className="flex justify-between items-center text-xs text-[#75818d]">
                                    <span className="flex items-center gap-1.5 text-blue-400">
                                        <ShieldCheck size={14} /> {e.verificationLevel}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <TrendingUp size={14} /> {e.lastVerified}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
                                    <span className="text-[#4f5b67]">{e.evidence.length} evidence signals</span>
                                    <span className="text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
                                        Open dossier <ExternalLink size={12} />
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {selected && (
                <div className="fixed inset-0 bg-black/80 z-50 flex justify-end" onClick={() => setSelected(null)}>
                    <aside 
                        className="w-full max-w-lg bg-[#070b10] border-l border-[#202b36] h-full overflow-y-auto p-8 shadow-2xl flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-2 text-[#c29631] text-[10px] font-bold tracking-widest uppercase mb-2">
                                    <ShieldCheck size={14} /> ENTITY DOSSIER
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1">{selected.name}</h3>
                                <p className="text-sm text-[#75818d]">{selected.entityType} · {selected.country}</p>
                            </div>
                            <button className="text-[#75818d] hover:text-white transition-colors" onClick={() => setSelected(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="bg-[#101922] border border-[#c29631]/30 rounded-xl p-4 mb-6 flex justify-between items-center">
                            <span className="text-sm text-[#c29631]">Evidence Confidence</span>
                            <strong className="text-2xl font-mono text-[#c29631]">{selected.confidence}</strong>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div>
                                <b className="block text-xs font-bold text-[#4f5b67] tracking-widest uppercase mb-2">Verification Level</b>
                                <span className="text-sm text-white flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-blue-400" /> {selected.verificationLevel}
                                </span>
                            </div>

                            <div>
                                <b className="block text-xs font-bold text-[#4f5b67] tracking-widest uppercase mb-2">Products / Demand Signals</b>
                                <div className="flex flex-wrap gap-2">
                                    {selected.products.map(p => (
                                        <span key={p} className="bg-[#202b36] text-[#eef2f6] text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <b className="block text-xs font-bold text-[#4f5b67] tracking-widest uppercase mb-3">Evidence Details</b>
                                <div className="space-y-3">
                                    {selected.evidence.map((x, i) => (
                                        <div className="bg-[#101922] border border-[#202b36] rounded-lg p-3 text-sm flex gap-3" key={i}>
                                            <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                                            <div>
                                                <strong className="text-white mr-2">{x.type}</strong>
                                                <span className="text-[#75818d]">{x.claim}</span>
                                                {x.sourceUrl && (
                                                    <a href={x.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline ml-2 flex items-center gap-1 inline-flex text-xs">
                                                        source <ExternalLink size={10} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#101922] border border-[#202b36] p-5 rounded-xl">
                                <b className="block text-xs font-bold text-white tracking-widest uppercase mb-3">Live Website Verification</b>
                                <div className="flex gap-2 mb-4">
                                    <input 
                                        className="flex-1 bg-[#0c131b] border border-[#202b36] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors placeholder:text-[#4f5b67]"
                                        value={verifyUrl} 
                                        onChange={e => setVerifyUrl(e.target.value)} 
                                        placeholder="https://company.com" 
                                    />
                                    <button 
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                                        onClick={verify} 
                                        disabled={verifying}
                                    >
                                        {verifying ? <Sparkles size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                        {verifying ? 'Verifying…' : 'Verify'}
                                    </button>
                                </div>

                                {verifyError && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{verifyError}</div>}
                                
                                {verifyResult && (
                                    <div className="bg-[#0c131b] border border-[#202b36] p-4 rounded-lg space-y-2 text-sm">
                                        <b className="text-white block pb-2 border-b border-[#202b36]">{verifyResult.signals.companyNameHint}</b>
                                        <div className="flex justify-between items-center pt-1">
                                            <span className="text-[#75818d]">Status:</span>
                                            <span className={`font-bold ${verifyResult.signals.status === '200' ? 'text-green-500' : 'text-red-500'}`}>{verifyResult.signals.status}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#75818d]">Supplier Signals:</span>
                                            <span className="text-white">{verifyResult.signals.keywords.supplier ? 'Detected' : 'Not detected'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#75818d]">Buyer Signals:</span>
                                            <span className="text-white">{verifyResult.signals.keywords.buyer ? 'Detected' : 'Not detected'}</span>
                                        </div>
                                        <div className="pt-2 border-t border-[#202b36] mt-2">
                                            <span className="text-xs text-[#75818d] block mb-1">Products detected:</span>
                                            <span className="text-white text-xs">{verifyResult.signals.keywords.products.join(' · ') || 'None'}</span>
                                        </div>
                                        <div className="pt-2 border-t border-[#202b36] mt-2">
                                            <p className="text-xs text-[#75818d] italic">"{verifyResult.excerpt}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <b className="block text-xs font-bold text-[#4f5b67] tracking-widest uppercase mb-2">Assessment Note</b>
                                <p className="text-sm text-[#eef2f6] leading-relaxed bg-[#101922] p-4 rounded-lg border border-[#202b36]">{selected.notes}</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            {selected.officialUrl && (
                                <a 
                                    className="w-full bg-[#202b36] hover:bg-[#4f5b67] text-white py-3 rounded-lg flex justify-center items-center gap-2 text-sm font-bold transition-colors"
                                    href={selected.officialUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                >
                                    Open Official Source <ExternalLink size={16} />
                                </a>
                            )}
                            <div className="flex items-start gap-3 bg-red-500/10 text-red-500/80 p-4 rounded-lg border border-red-500/20 text-xs">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                <p>Tradevance evidence status is an intelligence layer. Final KYC/KYB, sanctions, UBO and transaction verification require licensed/contracted data sources and direct documentary checks.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
