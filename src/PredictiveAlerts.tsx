import React, { useEffect, useState } from 'react';
import { api } from '@appdeploy/client';
import { AlertTriangle, ArrowRight, BrainCircuit, CheckCircle2, Clock3, Gauge, ShieldAlert, Sparkles } from 'lucide-react';

export default function PredictiveAlerts({ onNavigate }: { onNavigate: (s: string) => void }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const r = await api.get('/api/predictive-alerts');
                setData(r.data);
            } catch {
                setError('Predictive alerts are temporarily unavailable. No trade or profile data was changed.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3 animate-pulse">
                <BrainCircuit size={14} /> PREDICTIVE INTELLIGENCE
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2 animate-pulse text-[#4f5b67]">Looking ahead…</h2>
            <p className="text-[#75818d] text-sm max-w-2xl animate-pulse">Tradevance is checking your live signals and evidence.</p>
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
                        <BrainCircuit size={14} /> PREDICTIVE OPPORTUNITY & ALERTS
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">See the next risk. Catch the next opportunity.</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">Evidence-backed alerts from real Tradevance activity — never synthetic forecasts.</p>
                </div>
                <div className="bg-[#101922] border border-[#202b36] text-[#c29631] px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold shrink-0">
                    <Sparkles size={14} /> Governed intelligence
                </div>
            </div>

            <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-xl p-8 mb-8 shadow-xl flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1 max-w-2xl">
                    <small className="text-[#4f5b67] text-[10px] font-bold tracking-widest uppercase block mb-3">WHAT MATTERS NOW</small>
                    <h3 className="text-2xl font-bold text-white mb-3">
                        {data.summary.total ? `${data.summary.total} signals need your attention.` : 'No priority alerts right now.'}
                    </h3>
                    <p className="text-[#eef2f6] text-sm leading-relaxed opacity-90">
                        {data.summary.critical ? `${data.summary.critical} critical signal${data.summary.critical > 1 ? 's' : ''} should be handled first. ` : ''}
                        {data.summary.high ? `${data.summary.high} high-priority signal${data.summary.high > 1 ? 's' : ''} follow.` : 'Your queue is currently calm.'}
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 md:justify-end">
                    <K label="Critical" value={data.summary.critical} color="text-red-400" />
                    <K label="High" value={data.summary.high} color="text-orange-400" />
                    <K label="Medium" value={data.summary.medium} color="text-blue-400" />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {data.alerts.length ? data.alerts.map((x: any) => (
                    <article 
                        className={`bg-[#101922] border ${x.severity === 'Critical' ? 'border-red-500/30' : x.severity === 'High' ? 'border-orange-500/30' : 'border-blue-500/30'} rounded-xl p-6 relative overflow-hidden group transition-all hover:shadow-lg`}
                        key={x.id}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full ${x.severity === 'Critical' ? 'bg-red-500/10' : x.severity === 'High' ? 'bg-orange-500/10' : 'bg-blue-500/10'}`} />
                        
                        <div className="flex items-start gap-4 relative z-10">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 ${x.decision === 'BLOCK' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : x.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                                {x.decision === 'BLOCK' ? <ShieldAlert size={20} /> : x.severity === 'Critical' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="bg-[#0c131b] border border-[#202b36] text-[#75818d] px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase truncate max-w-[200px]">
                                        {x.type.replaceAll('_', ' ')}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${x.decision === 'BLOCK' ? 'bg-red-500/10 text-red-400 border-red-500/20' : x.decision === 'REVIEW' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                        {x.decision}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white mb-2">{x.title}</h3>
                                <p className="text-[#eef2f6] text-sm leading-relaxed mb-4">{x.summary}</p>
                                
                                <div className="flex flex-wrap items-center gap-4 mb-6 text-[11px] font-mono text-[#75818d]">
                                    <span className="flex items-center gap-1.5">
                                        <Gauge size={14} className="text-blue-400" />
                                        {x.confidence}% confidence
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock3 size={14} className="text-green-500" />
                                        {x.dataQuality}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2 mb-6">
                                    {x.evidence.map((e: string) => (
                                        <span key={e} className="bg-[#0c131b] border border-[#202b36] text-[#75818d] px-3 py-2 rounded-lg text-xs flex items-start gap-2">
                                            <span className="text-[#4f5b67] shrink-0 mt-0.5">•</span> {e}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#202b36]">
                                    <b className="text-white text-sm">{x.action}</b>
                                    <button 
                                        className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-xs font-bold transition-colors group/btn shrink-0"
                                        onClick={() => onNavigate(x.destination)}
                                    >
                                        Open {x.destination} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                )) : (
                    <div className="col-span-full bg-[#101922] border border-[#202b36] border-dashed rounded-xl p-12 text-center text-[#75818d]">
                        No priority alerts are available yet. As real RFQs, quotes, trades and outcomes accumulate, Tradevance will surface more useful signals.
                    </div>
                )}
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-4xl mx-auto">
                <div className="bg-[#0c131b] rounded-full p-3 shrink-0">
                    <ShieldAlert size={20} className="text-orange-400" />
                </div>
                <span className="text-[#eef2f6] text-sm leading-relaxed">
                    Alerts recommend or route work. They never execute transactions and do not override verification, sanctions, risk or human-approval controls.
                </span>
            </div>
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
