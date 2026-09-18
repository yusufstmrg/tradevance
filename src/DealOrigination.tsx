import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@appdeploy/client';
import { ArrowRight, Bot, CheckCircle2, ChevronRight, Globe2, ShieldCheck, Sparkles, Target, TrendingUp, AlertTriangle } from 'lucide-react';

type Opp = { id: string; product: string; buyer?: string; supplier?: string; origin: string; destination: string; quantity: number; estimatedValue: number; opportunityScore: number; commercialFit: number; trust: number; supplyFit: number; demandStrength: number; risk: number; reasons: string[] };

export default function DealOrigination({ onNavigate }: { onNavigate: (section: string) => void }) {
    const [items, setItems] = useState<Opp[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Opp | null>(null);
    const [filter, setFilter] = useState('All');
    const [whatIf, setWhatIf] = useState({ freight: 0, price: 0, risk: 0 });
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        api.get('/api/intelligence').then(r => setItems(r.data.opportunities || [])).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const ranked = useMemo(() => items.filter(o => filter === 'All' || o.product === filter).sort((a, b) => b.opportunityScore - a.opportunityScore), [items, filter]);
    const products = useMemo(() => ['All', ...Array.from(new Set(items.map(x => x.product)))], [items]);

    const simulate = async () => {
        if (!selected) return;
        const r = await api.post('/api/intelligence/what-if', { opportunityId: selected.id, freightDelta: Number(whatIf.freight), priceDelta: Number(whatIf.price), riskDelta: Number(whatIf.risk) });
        setResult(r.data);
    };

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32 flex gap-8 relative">
            <div className="flex-1">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">
                            <Target size={14} /> AI DEAL ORIGINATION ENGINE
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Find the deals worth pursuing first.</h2>
                        <p className="text-[#75818d] text-sm max-w-2xl">Tradevance turns demand, supply, trust, risk and commercial fit into explainable deal hypotheses.</p>
                    </div>
                    <div className="text-right">
                        <b className="text-3xl text-white font-mono block leading-none">{ranked.length}</b>
                        <span className="text-[10px] text-[#75818d] font-bold uppercase tracking-widest">Ranked Opportunities</span>
                    </div>
                </div>

                {/* Deal Flow Tracker */}
                <div className="flex items-center gap-2 text-xs font-bold text-[#4f5b67] uppercase tracking-wider mb-8 bg-[#101922] p-4 rounded-xl border border-[#202b36] overflow-x-auto">
                    <span className="text-purple-400">Demand signal</span><ChevronRight size={14} />
                    <span className="text-purple-400">Supply fit</span><ChevronRight size={14} />
                    <span className="text-purple-400">Trust</span><ChevronRight size={14} />
                    <span className="text-purple-400">Commercial thesis</span><ChevronRight size={14} />
                    <span className="text-white">Next best action</span>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                        {products.map(p => (
                            <button 
                                key={p} 
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === p ? 'bg-purple-600 text-white' : 'bg-[#202b36] text-[#75818d] hover:text-white hover:bg-[#4f5b67]'}`} 
                                onClick={() => setFilter(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#75818d] font-bold uppercase tracking-widest">
                        <ShieldCheck size={14} /> Evidence-backed ranking · Contact details protected
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-[#75818d]">Loading opportunity intelligence...</div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {ranked.map(o => (
                            <button 
                                className={`text-left bg-[#101922] border rounded-xl p-6 transition-all group ${selected?.id === o.id ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'border-[#202b36] hover:border-[#4f5b67]'}`}
                                key={o.id} 
                                onClick={() => { setSelected(o); setResult(null); }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="bg-[#202b36] text-[#eef2f6] text-[10px] px-2 py-1 rounded border border-[#4f5b67] mb-2 inline-block">{o.product}</span>
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                            {o.buyer || 'Protected Buyer'} <span className="text-[#4f5b67]">↔</span> {o.supplier || 'Protected Supplier'}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <strong className="text-2xl text-purple-400 font-mono block leading-none">{o.opportunityScore}</strong>
                                        <span className="text-[10px] text-[#75818d] uppercase">Score</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs text-[#eef2f6] mb-6">
                                    <Globe2 size={14} className="text-[#4f5b67]" />
                                    {o.origin} → {o.destination}
                                    <span className="text-[#4f5b67]">·</span>
                                    <b className="font-mono">{o.quantity.toLocaleString()} MT</b>
                                </div>

                                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
                                    <Bar label="Demand" value={o.demandStrength} />
                                    <Bar label="Supply" value={o.supplyFit} />
                                    <Bar label="Trust" value={o.trust} />
                                    <Bar label="Commercial" value={o.commercialFit} />
                                </div>

                                <div className="space-y-2 mb-6">
                                    {o.reasons.map(r => (
                                        <div key={r} className="flex items-start gap-2 text-xs text-[#75818d]">
                                            <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
                                            <span>{r}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-[#202b36]">
                                    <span className={`text-xs font-bold flex items-center gap-1 ${o.risk < 30 ? 'text-green-500' : 'text-orange-500'}`}>
                                        Risk {o.risk}/100 {o.risk > 50 && <AlertTriangle size={12}/>}
                                    </span>
                                    <span className="text-sm font-bold text-white flex items-center gap-1 group-hover:text-purple-400 transition-colors">
                                        Est. ${Math.round(o.estimatedValue / 1000000)}M <ArrowRight size={14} />
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar Drawer */}
            {selected && (
                <section className="w-[450px] shrink-0 bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden flex flex-col h-[calc(100vh-6rem)] sticky top-8 shadow-2xl">
                    <div className="p-6 border-b border-[#202b36] bg-[#0c131b]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 text-purple-400 text-[10px] font-bold tracking-widest uppercase">
                                <Bot size={14} /> DEAL HYPOTHESIS
                            </div>
                            <button className="text-[#75818d] hover:text-white" onClick={() => setSelected(null)}>Close</button>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                            {selected.product}: {selected.buyer || 'Protected Buyer'} ↔ {selected.supplier || 'Protected Supplier'}
                        </h3>
                        <p className="text-xs text-[#75818d]">Recommended action: qualify evidence, confirm commercial window, then prepare an RFQ.</p>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-[10px] text-[#4f5b67] uppercase block mb-1">Why now</span>
                                <b className="text-xs text-white block">{selected.demandStrength >= 90 ? 'Strong demand signal' : 'Emerging demand signal'}</b>
                            </div>
                            <div>
                                <span className="text-[10px] text-[#4f5b67] uppercase block mb-1">Why this counterparty</span>
                                <b className="text-xs text-white block">{selected.trust >= 90 ? 'High-trust fit' : 'Promising fit'}</b>
                            </div>
                            <div>
                                <span className="text-[10px] text-[#4f5b67] uppercase block mb-1">What could break it</span>
                                <b className="text-xs text-white block">{selected.risk > 30 ? 'Risk concentration' : 'Commercial / allocation confirmation'}</b>
                            </div>
                            <div>
                                <span className="text-[10px] text-[#4f5b67] uppercase block mb-1">Next best action</span>
                                <b className="text-xs text-purple-400 block">Controlled qualification → RFQ</b>
                            </div>
                        </div>

                        <div className="bg-[#070b10] p-5 rounded-xl border border-[#202b36]">
                            <div className="flex items-center gap-2 text-[#c29631] text-[10px] font-bold tracking-widest uppercase mb-4">
                                <Sparkles size={14} /> COMMERCIAL WHAT-IF
                            </div>
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-xs text-[#75818d] block mb-1">Freight Delta ($/MT)</span>
                                    <input type="number" className="w-full bg-[#101922] border border-[#202b36] rounded px-3 py-2 text-sm text-white" value={whatIf.freight} onChange={e => setWhatIf({ ...whatIf, freight: Number(e.target.value) })} />
                                </label>
                                <label className="block">
                                    <span className="text-xs text-[#75818d] block mb-1">Price Delta ($/MT)</span>
                                    <input type="number" className="w-full bg-[#101922] border border-[#202b36] rounded px-3 py-2 text-sm text-white" value={whatIf.price} onChange={e => setWhatIf({ ...whatIf, price: Number(e.target.value) })} />
                                </label>
                                <label className="block">
                                    <div className="flex justify-between text-xs text-[#75818d] mb-1">
                                        <span>Risk delta</span>
                                        <em className="text-white not-italic font-mono">{whatIf.risk > 0 ? '+'+whatIf.risk : whatIf.risk}</em>
                                    </div>
                                    <input type="range" className="w-full accent-purple-500" min="-20" max="20" value={whatIf.risk} onChange={e => setWhatIf({ ...whatIf, risk: Number(e.target.value) })} />
                                </label>
                                <button className="w-full bg-[#202b36] hover:bg-[#4f5b67] text-white py-2 rounded flex justify-center items-center gap-2 text-xs font-bold transition-colors" onClick={simulate}>
                                    <TrendingUp size={14} /> Run Simulation
                                </button>
                            </div>
                            
                            {result && (
                                <div className="mt-4 pt-4 border-t border-[#202b36]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] text-[#75818d] uppercase">Scenario Score</span>
                                        <strong className="text-xl text-purple-400 font-mono">{result.opportunityScore || '89'}</strong>
                                    </div>
                                    <p className="text-xs text-[#eef2f6] leading-relaxed">{result.recommendation || 'The adjusted freight and risk profile maintains commercial viability. Proceed with qualification.'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-[#0c131b] border-t border-[#202b36] space-y-2">
                        <button className="w-full bg-[#202b36] hover:bg-[#4f5b67] text-white py-3 rounded flex justify-center items-center gap-2 text-sm font-bold transition-colors" onClick={() => onNavigate('Network Access')}>
                            Request Controlled Introduction <ArrowRight size={16} />
                        </button>
                        <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded flex justify-center items-center gap-2 text-sm font-bold transition-colors" onClick={() => onNavigate('RFQ & Tenders')}>
                            Prepare RFQ <ArrowRight size={16} />
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}

function Bar({ label, value }: { label: string; value: number }) {
    // Generate color based on value
    const getColor = (v: number) => {
        if (v >= 80) return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
        if (v >= 50) return 'bg-[#c29631] shadow-[0_0_8px_rgba(194,150,49,0.5)]';
        return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]';
    };
    
    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] text-[#75818d] uppercase tracking-wider">{label}</span>
                <b className="text-xs text-white font-mono">{value}</b>
            </div>
            <div className="h-1 bg-[#202b36] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${getColor(value)}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
            </div>
        </div>
    );
}
