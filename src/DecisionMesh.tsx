import React, { useEffect, useState } from 'react';
import { api } from '@appdeploy/client';
import { ArrowRight, BrainCircuit, CheckCircle2, CircleAlert, DatabaseZap, Gauge, ShieldCheck, Sparkles, Target, UserRoundCheck, AlertTriangle } from 'lucide-react';

export default function DecisionMesh({ onNavigate, role }: { onNavigate: (x: string) => void; role: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const r = await api.get('/api/decision-mesh');
                setData(r.data);
            } catch {
                setError('Decision Mesh is temporarily unavailable. No trade or profile data was changed.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3 animate-pulse">
                <BrainCircuit size={14} /> DECISION MESH
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2 animate-pulse text-[#4f5b67]">Connecting live intelligence…</h2>
            <p className="text-[#75818d] text-sm max-w-2xl animate-pulse">Trust, risk, memory and opportunity are being assembled into one action queue.</p>
        </div>
    );

    if (error) return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-6 rounded-xl flex items-start gap-4 shadow-lg">
                <AlertTriangle size={24} className="shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-lg font-bold mb-1">Service Unavailable</h3>
                    <p className="text-sm opacity-90">{error}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                        <BrainCircuit size={14} /> GLOBAL AI DECISION MESH
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">One answer. One next action.</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">Tradevance combines the intelligence already available to you and tells you what matters now, why it matters and what to do next.</p>
                </div>
                <div className="bg-[#101922] border border-[#202b36] text-[#c29631] px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold shrink-0 shadow-lg">
                    <Sparkles size={14} /> {data.role} · Governed AI
                </div>
            </div>

            <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-xl p-8 mb-8 shadow-xl flex flex-col md:flex-row justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="flex-1 max-w-2xl relative z-10">
                    <small className="text-[#4f5b67] text-[10px] font-bold tracking-widest uppercase block mb-3">DECISION CONTEXT</small>
                    <h3 className="text-2xl font-bold text-white mb-3">
                        {data.summary.urgent ? `You have ${data.summary.urgent} urgent decision${data.summary.urgent > 1 ? 's' : ''}.` : 'No critical blockers are currently detected.'}
                    </h3>
                    <p className="text-[#eef2f6] text-sm leading-relaxed opacity-90">
                        {data.summary.review ? `${data.summary.review} item${data.summary.review > 1 ? 's' : ''} need deeper review. ` : ''}
                        {data.summary.recommended ? `${data.summary.recommended} item${data.summary.recommended > 1 ? 's' : ''} have a clear next step.` : 'The system will remain conservative until more evidence appears.'}
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 relative z-10">
                    <K label="Live signals" value={data.summary.signals} />
                    <K label="Needs review" value={data.summary.review} color="text-orange-400" />
                    <K label="Learning samples" value={data.summary.memorySamples} color="text-blue-400" />
                </div>
            </section>

            <div className="flex flex-col lg:flex-row gap-8">
                <section className="flex-1 space-y-6">
                    <div className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-3 text-blue-400 shrink-0">
                                <Target size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">What needs your attention</h3>
                                <p className="text-[#75818d] text-sm">Prioritized from live platform signals.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {data.cards.map((c: any) => (
                                <div 
                                    className={`bg-[#0c131b] border ${c.priority === 'CRITICAL' ? 'border-red-500/30' : c.priority === 'HIGH' ? 'border-orange-500/30' : 'border-[#202b36]'} rounded-xl p-6 transition-all hover:border-[#4f5b67] group`}
                                    key={c.type + '-' + c.id}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 shrink-0 ${c.decision === 'BLOCK' ? 'text-red-500' : c.decision === 'REVIEW' ? 'text-orange-400' : 'text-green-500'}`}>
                                                {c.decision === 'BLOCK' ? <CircleAlert size={20} /> : c.decision === 'REVIEW' ? <ShieldCheck size={20} /> : <CheckCircle2 size={20} />}
                                            </div>
                                            <div>
                                                <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase block mb-1">{c.type}</small>
                                                <b className="text-white text-base block mb-1">{c.title}</b>
                                                <span className="text-[#eef2f6] text-sm block">{c.subtitle}</span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase shrink-0 w-fit ${c.decision === 'BLOCK' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : c.decision === 'REVIEW' ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
                                            {c.decision}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2 mb-6 max-w-sm">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Confidence</span>
                                            <b className="text-sm font-mono text-white">{c.confidence}%</b>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#101922] rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, Math.max(0, c.confidence))}%` }} />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {c.why.map((r: string) => (
                                            <span key={r} className="bg-[#101922] border border-[#202b36] text-[#75818d] px-3 py-1.5 rounded-lg text-xs">
                                                {r}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#202b36]">
                                        <div className="flex items-center gap-2 text-xs text-[#75818d]">
                                            <DatabaseZap size={14} className="text-blue-400" />
                                            <span>{c.dataQuality} evidence · {c.evidence[0]}</span>
                                        </div>
                                        <button 
                                            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-xs font-bold transition-colors group/btn shrink-0"
                                            onClick={() => onNavigate(c.destination)}
                                        >
                                            {c.nextAction} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <aside className="lg:w-80 space-y-6 shrink-0">
                    <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-2.5 text-[#4f5b67] shrink-0">
                                <Gauge size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">How Tradevance decides</h3>
                                <p className="text-[#75818d] text-xs">Signals, not black-box commands.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {data.principles.map((x: string) => (
                                <div className="flex gap-3 text-sm text-[#eef2f6]" key={x}>
                                    <CheckCircle2 size={16} className="text-[#4f5b67] shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">{x}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6 shadow-xl">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 text-blue-400 shrink-0">
                                <UserRoundCheck size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">Memory coverage</h3>
                                <p className="text-[#75818d] text-xs">How much observed history is available to this view.</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-baseline gap-2">
                                <b className="text-3xl font-mono font-bold text-white">{data.memory.coveragePercent}%</b>
                                <span className="text-[#75818d] text-xs font-bold tracking-widest uppercase">coverage</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#0c131b] rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, data.memory.coveragePercent)}%` }} />
                            </div>
                        </div>
                        
                        <div className="text-[10px] text-[#75818d] uppercase tracking-widest font-bold leading-relaxed border-t border-[#202b36] pt-4">
                            {data.memory.tradeRecords} trade records<br/>
                            {data.memory.quoteRecords} quotes<br/>
                            {data.memory.learningSamples} learning samples
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

function K({ label, value, color = "text-white" }: { label: string; value: number; color?: string }) {
    return (
        <div className="bg-[#0c131b] border border-[#202b36] rounded-xl px-5 py-4 min-w-[120px]">
            <b className={`block text-2xl font-mono font-bold mb-1 ${color}`}>{value}</b>
            <span className="block text-[#75818d] text-xs tracking-widest uppercase">{label}</span>
        </div>
    );
}
