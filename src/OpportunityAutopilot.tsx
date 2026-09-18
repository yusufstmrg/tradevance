import React, { useEffect, useState } from 'react';
import { api } from '@appdeploy/client';
import { ArrowRight, Bell, BrainCircuit, CheckCircle2, CircleAlert, Gauge, ShieldCheck, Sparkles, Target, AlertTriangle } from 'lucide-react';

export default function OpportunityAutopilot({ onNavigate }: { onNavigate: (s: string) => void }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const r = await api.get('/api/opportunity-autopilot');
                setData(r.data);
            } catch {
                setErr('Daily Trade Command is temporarily unavailable. No trade or profile data was changed.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3 animate-pulse">
                <BrainCircuit size={14} /> DAILY TRADE COMMAND
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2 animate-pulse text-[#4f5b67]">Preparing your priorities…</h2>
            <p className="text-[#75818d] text-sm max-w-2xl animate-pulse">Tradevance is combining live risk, opportunity, memory and decision signals.</p>
        </div>
    );

    if (err) return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-6 rounded-xl flex items-start gap-4 shadow-lg">
                <AlertTriangle size={24} className="shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-lg font-bold mb-1">Service Unavailable</h3>
                    <p className="text-sm opacity-90">{err}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                        <Sparkles size={14} /> GOVERNED OPPORTUNITY AUTOPILOT
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">{data.headline}</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">{data.subhead}</p>
                </div>
                <div className="bg-[#101922] border border-[#202b36] text-[#75818d] px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold shrink-0">
                    <Bell size={14} className="text-blue-400" />
                    {data.role} · Governed
                </div>
            </div>

            <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-xl p-8 mb-8 shadow-xl flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1 max-w-2xl">
                    <small className="text-blue-400 text-[10px] font-bold tracking-widest uppercase block mb-3">TODAY'S TRADE COMMAND</small>
                    <h3 className="text-2xl font-bold text-white mb-3">
                        {data.cards.length ? 'Focus on the decisions with the highest consequence first.' : 'Your command queue is clear.'}
                    </h3>
                    <p className="text-[#eef2f6] text-sm leading-relaxed opacity-90">
                        {data.cards.length ? 'Each card explains why it matters, how strong the evidence is, and where to go next.' : 'As real RFQs, quotes, trades and outcomes accumulate, this command view becomes more useful.'}
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 md:justify-end">
                    <K label="Signals" value={data.stats.signals} />
                    <K label="Critical" value={data.stats.critical} color="text-red-400" />
                    <K label="High" value={data.stats.high} color="text-orange-400" />
                    <K label="Memory" value={data.stats.memorySamples} color="text-blue-400" />
                </div>
            </section>

            <section className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    {data.cards.length ? data.cards.map((x: any) => (
                        <article 
                            className={`bg-[#101922] border ${x.priority === 'CRITICAL' ? 'border-red-500/30' : x.priority === 'HIGH' ? 'border-orange-500/30' : 'border-[#202b36]'} rounded-xl p-6 relative overflow-hidden group transition-all hover:shadow-lg`} 
                            key={x.id}
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full ${x.priority === 'CRITICAL' ? 'bg-red-500/10' : x.priority === 'HIGH' ? 'bg-orange-500/10' : 'bg-blue-500/5'}`} />
                            
                            <div className="flex items-start gap-4 relative z-10">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${x.decision === 'BLOCK' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                                    {x.decision === 'BLOCK' ? <CircleAlert size={20} /> : <CheckCircle2 size={20} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="bg-[#0c131b] border border-[#202b36] text-[#75818d] px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">{x.kind}</span>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${x.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' : x.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-[#202b36] text-white border-[#4f5b67]'}`}>
                                            {x.priority}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${x.decision === 'BLOCK' ? 'bg-red-500/10 text-red-400 border-red-500/20' : x.decision === 'APPROVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-[#c29631]/10 text-[#c29631] border-[#c29631]/20'}`}>
                                            {x.decision}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{x.title}</h3>
                                    <p className="text-[#eef2f6] text-sm leading-relaxed mb-4">{x.summary}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 mb-6 text-[11px] font-mono text-[#75818d]">
                                        <span className="flex items-center gap-1.5"><Gauge size={14} className="text-blue-400" />{x.confidence}% confidence</span>
                                        <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500" />{x.dataQuality}</span>
                                    </div>

                                    <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-4 mb-4">
                                        <b className="block text-white text-xs mb-1">Why it matters</b>
                                        <span className="block text-[#75818d] text-sm">{x.why}</span>
                                    </div>

                                    {x.evidence && x.evidence.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {x.evidence.slice(0, 3).map((e: string) => (
                                                <span key={e} className="bg-blue-900/20 border border-blue-500/30 text-blue-300 px-2 py-1 rounded text-xs">
                                                    {e}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#202b36]">
                                        <b className="text-white text-sm">{x.action}</b>
                                        <button 
                                            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-xs font-bold transition-colors group/btn"
                                            onClick={() => onNavigate(x.destination)}
                                        >
                                            Open {x.destination} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    )) : (
                        <div className="bg-[#101922] border border-[#202b36] border-dashed rounded-xl p-12 text-center text-[#75818d]">
                            No priority signals yet. As real RFQs, quotes, trades and outcomes accumulate, this command view becomes more useful.
                        </div>
                    )}
                </div>

                <aside className="lg:w-80 space-y-6 shrink-0">
                    <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-lg">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-2.5 text-[#c29631] shrink-0">
                                <Target size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">How Autopilot works</h3>
                                <p className="text-[#75818d] text-xs">Simple for users, rigorous underneath.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {data.principles.map((p: string, i: number) => (
                                <div className="flex gap-3 group" key={p}>
                                    <span className="text-[#4f5b67] text-[10px] font-mono font-bold mt-1 group-hover:text-blue-400 transition-colors">0{i + 1}</span>
                                    <p className="text-[#eef2f6] text-xs leading-relaxed">{p}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <small className="text-blue-400 text-[10px] font-bold tracking-widest uppercase block mb-4">TRADE MEMORY</small>
                            <div className="flex flex-col gap-1 mb-4">
                                <div className="flex items-center gap-2 text-white">
                                    <BrainCircuit size={20} className="text-blue-400" />
                                    <b className="text-2xl font-bold">{data.memory.learningSamples}</b>
                                </div>
                                <span className="text-[#75818d] text-xs font-mono pl-7">learning samples</span>
                            </div>
                            <p className="text-[#eef2f6] text-xs leading-relaxed mb-6">Past outcomes inform prioritization, but they never retrain or change the AI automatically.</p>
                            <button 
                                className="w-full bg-[#0c131b] hover:bg-[#131c26] border border-[#202b36] hover:border-blue-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all"
                                onClick={() => onNavigate('Trade Memory')}
                            >
                                Open Trade Memory <ArrowRight size={14} />
                            </button>
                        </div>
                    </section>
                </aside>
            </section>
        </div>
    );
}

function K({ label, value, color = "text-white" }: { label: string; value: number; color?: string }) {
    return (
        <div className="bg-[#0c131b] border border-[#202b36] rounded-xl px-5 py-4 min-w-[100px]">
            <b className={`block text-2xl font-mono font-bold mb-1 ${color}`}>{value}</b>
            <span className="block text-[#75818d] text-xs tracking-widest uppercase">{label}</span>
        </div>
    );
}