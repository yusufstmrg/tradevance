import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@appdeploy/client';
import { ArrowRight, Bot, Globe2, PackageSearch, Sparkles, Target, TrendingUp } from 'lucide-react';

type Opportunity = { id: string; product: string; buyer: string; supplier: string; origin: string; destination: string; quantity: number; estimatedValue: number; opportunityScore: number; commercialFit: number; trust: number; supplyFit: number; demandStrength: number; risk: number; reasons: string[] };
type RadarItem = { id: string; name: string; product: string; country: string; signal: string; strength: number; lastSignal: string };

export default function IntelligenceCenter() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [demandRadar, setDemandRadar] = useState<RadarItem[]>([]);
    const [supplyRadar, setSupplyRadar] = useState<RadarItem[]>([]);
    const [selected, setSelected] = useState<Opportunity | null>(null);
    const [loading, setLoading] = useState(true);
    const [scenario, setScenario] = useState({ freight: 0, price: 0, risk: 0 });
    const [scenarioResult, setScenarioResult] = useState<any>(null);

    useEffect(() => {
        api.get('/api/intelligence').then(r => {
            setOpportunities(r.data.opportunities || []);
            setDemandRadar(r.data.demandRadar || []);
            setSupplyRadar(r.data.supplyRadar || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const avgScore = useMemo(() => Math.round(opportunities.reduce((a, o) => a + o.opportunityScore, 0) / Math.max(1, opportunities.length)), [opportunities]);

    const simulate = async () => {
        if (!selected) return;
        const r = await api.post('/api/intelligence/what-if', { opportunityId: selected.id, freightDelta: Number(scenario.freight), priceDelta: Number(scenario.price), riskDelta: Number(scenario.risk) });
        setScenarioResult(r.data);
    };

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                        <Sparkles size={14} /> TRADEVANCE INTELLIGENCE ENGINE
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Find the next trade before the market does.</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">Demand, supply, trust and commercial signals converge into explainable opportunity scores.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#101922] border border-[#202b36] rounded-xl px-4 py-3 flex flex-col items-center min-w-[100px]">
                        <b className="text-xl font-mono text-white mb-1">{opportunities.length}</b>
                        <span className="text-[10px] text-[#75818d] font-bold tracking-widest uppercase text-center leading-tight">active<br/>opportunities</span>
                    </div>
                    <div className="bg-[#101922] border border-[#202b36] rounded-xl px-4 py-3 flex flex-col items-center min-w-[100px]">
                        <b className="text-xl font-mono text-blue-400 mb-1">{avgScore}</b>
                        <span className="text-[10px] text-[#75818d] font-bold tracking-widest uppercase text-center leading-tight">avg<br/>score</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl flex flex-col">
                    <PanelTitle title="Demand Radar" subtitle="Signals that a buyer may need supply" icon={Target} />
                    <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 no-scrollbar">
                        {loading ? <Empty text="Loading demand signals…" /> : (
                            <div className="space-y-3">
                                {demandRadar.map(r => (
                                    <div className="bg-[#0c131b] border border-[#202b36] hover:border-[#4f5b67] rounded-xl p-4 flex items-center gap-4 transition-colors group" key={r.id}>
                                        <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 p-2.5 rounded-lg shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <TrendingUp size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <b className="text-white text-sm block truncate mb-1">{r.name}</b>
                                            <span className="text-[#75818d] text-xs block truncate mb-2">{r.product} · {r.country}</span>
                                            <small className="bg-blue-900/20 text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border border-blue-500/30">
                                                {r.signal}
                                            </small>
                                        </div>
                                        <strong className="text-2xl font-mono text-white shrink-0 group-hover:text-blue-400 transition-colors">{r.strength}</strong>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl flex flex-col">
                    <PanelTitle title="Supply Radar" subtitle="Signals that supply or allocation may be available" icon={PackageSearch} />
                    <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 no-scrollbar">
                        {loading ? <Empty text="Loading supply signals…" /> : (
                            <div className="space-y-3">
                                {supplyRadar.map(r => (
                                    <div className="bg-[#0c131b] border border-[#202b36] hover:border-[#4f5b67] rounded-xl p-4 flex items-center gap-4 transition-colors group" key={r.id}>
                                        <div className="bg-green-500/10 text-green-500 border border-green-500/20 p-2.5 rounded-lg shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                            <PackageSearch size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <b className="text-white text-sm block truncate mb-1">{r.name}</b>
                                            <span className="text-[#75818d] text-xs block truncate mb-2">{r.product} · {r.country}</span>
                                            <small className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border border-green-500/20">
                                                {r.signal}
                                            </small>
                                        </div>
                                        <strong className="text-2xl font-mono text-white shrink-0 group-hover:text-green-400 transition-colors">{r.strength}</strong>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <section className="bg-[#101922] border border-[#202b36] rounded-xl p-8 mb-8 shadow-xl">
                <PanelTitle title="Opportunity Radar" subtitle="AI-ranked buyer × supplier opportunities" icon={Sparkles} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {opportunities.map(o => (
                        <button 
                            className={`bg-[#0c131b] border rounded-xl p-5 text-left transition-all group flex flex-col h-full hover:-translate-y-1 hover:shadow-lg ${selected?.id === o.id ? 'border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'border-[#202b36] hover:border-[#4f5b67]'}`} 
                            key={o.id} 
                            onClick={() => { setSelected(o); setScenarioResult(null); }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="min-w-0 flex-1 pr-3">
                                    <b className="text-white text-base block mb-1 truncate group-hover:text-blue-400 transition-colors">{o.product}</b>
                                    <span className="text-[#75818d] text-xs block truncate">{o.buyer} ↔ {o.supplier}</span>
                                </div>
                                <strong className={`text-2xl font-mono shrink-0 ${o.opportunityScore >= 90 ? 'text-green-400' : o.opportunityScore >= 80 ? 'text-blue-400' : 'text-white'}`}>
                                    {o.opportunityScore}
                                </strong>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-[#eef2f6] mb-6">
                                <Globe2 size={14} className="text-[#75818d]" />
                                <span className="truncate">{o.origin} → {o.destination} · {o.quantity.toLocaleString()} MT</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
                                <MiniBar label="Demand" value={o.demandStrength} />
                                <MiniBar label="Supply" value={o.supplyFit} />
                                <MiniBar label="Trust" value={o.trust} />
                                <MiniBar label="Commercial" value={o.commercialFit} />
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                                {o.reasons.slice(0, 3).map(r => (
                                    <span key={r} className="bg-[#202b36] text-[#75818d] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest leading-none">
                                        {r}
                                    </span>
                                ))}
                            </div>
                            
                            <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase border-t border-[#202b36] pt-4 w-full">
                                <span className={o.risk > 50 ? 'text-orange-400' : 'text-[#75818d]'}>Risk {o.risk}/100</span>
                                <span className="text-blue-400 flex items-center gap-1 group-hover:text-blue-300">
                                    Est. ${Math.round(o.estimatedValue / 1000).toLocaleString()}k <ArrowRight size={12} />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {selected && (
                <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-blue-500/30 rounded-xl p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-[#202b36] pb-6">
                        <div>
                            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-3">
                                <Bot size={14} /> WHAT-IF SIMULATOR
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{selected.product} · {selected.buyer}</h3>
                            <p className="text-[#75818d] text-sm">Test commercial and risk changes before you send an RFQ or approve a trade.</p>
                        </div>
                        <button 
                            className="bg-[#0c131b] hover:bg-[#131c26] border border-[#202b36] hover:border-[#4f5b67] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0" 
                            onClick={() => setSelected(null)}
                        >
                            Close Simulator
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <label className="block">
                                <span className="block text-[10px] text-[#75818d] font-bold tracking-widest uppercase mb-2">Freight delta / MT</span>
                                <input 
                                    type="number" 
                                    className="w-full bg-[#0c131b] border border-[#202b36] focus:border-blue-500 rounded-lg px-4 py-3 text-white outline-none transition-colors font-mono"
                                    value={scenario.freight} 
                                    onChange={e => setScenario({ ...scenario, freight: Number(e.target.value) })} 
                                />
                            </label>
                            
                            <label className="block">
                                <span className="block text-[10px] text-[#75818d] font-bold tracking-widest uppercase mb-2">Price delta / MT</span>
                                <input 
                                    type="number" 
                                    className="w-full bg-[#0c131b] border border-[#202b36] focus:border-blue-500 rounded-lg px-4 py-3 text-white outline-none transition-colors font-mono"
                                    value={scenario.price} 
                                    onChange={e => setScenario({ ...scenario, price: Number(e.target.value) })} 
                                />
                            </label>
                            
                            <label className="block">
                                <span className="block text-[10px] text-[#75818d] font-bold tracking-widest uppercase mb-2">Risk delta</span>
                                <div className="flex items-center gap-4 bg-[#0c131b] border border-[#202b36] rounded-lg px-4 py-3">
                                    <input 
                                        type="range" min="-20" max="20" 
                                        className="flex-1 accent-blue-500"
                                        value={scenario.risk} 
                                        onChange={e => setScenario({ ...scenario, risk: Number(e.target.value) })} 
                                    />
                                    <span className="font-mono text-white min-w-[3ch] text-right">{scenario.risk}</span>
                                </div>
                            </label>
                            
                            <button 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-lg shadow-blue-500/20 mt-4" 
                                onClick={simulate}
                            >
                                <Sparkles size={16} /> Run Scenario
                            </button>
                        </div>
                        
                        <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-8 flex flex-col justify-center">
                            {scenarioResult ? (
                                <div className="animate-in fade-in duration-300">
                                    <div className="flex items-end gap-4 mb-8 border-b border-[#202b36] pb-6">
                                        <strong className="text-6xl font-mono font-bold text-white">{scenarioResult.opportunityScore}</strong>
                                        <span className="text-[#75818d] text-xs font-bold tracking-widest uppercase mb-2">new<br/>opportunity score</span>
                                    </div>
                                    <div className="space-y-4 mb-8">
                                        {scenarioResult.changes.map((x: any) => (
                                            <div className="flex justify-between items-center" key={x.label}>
                                                <span className="text-[#75818d] text-sm">{x.label}</span>
                                                <b className="text-white font-mono">{x.value}</b>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-5">
                                        <p className="text-[#eef2f6] text-sm leading-relaxed">{scenarioResult.recommendation}</p>
                                    </div>
                                </div>
                            ) : (
                                <Empty text="Set scenario variables and run the simulator to see projected impacts." />
                            )}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

function MiniBar({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-end">
                <span className="text-[10px] text-[#75818d] uppercase tracking-widest font-bold">{label}</span>
                <b className="text-xs font-mono text-white">{value}</b>
            </div>
            <div className="h-1.5 w-full bg-[#0c131b] rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${Math.max(0, Math.min(100, value))}%` }} 
                />
            </div>
        </div>
    );
}

function PanelTitle({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: any }) {
    return (
        <div className="flex items-start gap-4 mb-6">
            <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-3 text-[#4f5b67] shrink-0">
                <Icon size={20} />
            </div>
            <div>
                <h3 className="text-white font-bold mb-1">{title}</h3>
                <p className="text-[#75818d] text-xs leading-relaxed">{subtitle}</p>
            </div>
        </div>
    );
}

function Empty({ text }: { text: string }) {
    return (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[#202b36] rounded-xl p-8 text-center text-[#75818d] text-sm min-h-[200px]">
            {text}
        </div>
    );
}
