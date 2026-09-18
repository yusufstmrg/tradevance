import React, { useEffect, useState } from 'react';
import { api } from '@appdeploy/client';
import { AlertTriangle, ArrowRight, Bot, CheckCircle2, Clock3, LockKeyhole, Play, ShieldCheck, Sparkles } from 'lucide-react';

type Agent = { id: string; name: string; mission: string; status: string; authority: string; confidence: number; queue: number };

export default function AgentControlCenter({ onNavigate }: { onNavigate: (s: string) => void }) {
    const [a, setA] = useState<Agent[]>([]);
    const [t, setT] = useState<any[]>([]);
    const [sel, setSel] = useState('opportunity');
    const [busy, setBusy] = useState(false);
    const [r, setR] = useState<any>(null);
    const [err, setErr] = useState('');

    const load = async () => {
        try {
            const x = await api.get('/api/agents');
            setA(x.data.agents || []);
            setT(x.data.tasks || []);
        } catch {
            setErr('Agent control plane is temporarily unavailable.');
        }
    };

    useEffect(() => { load() }, []);

    const run = async () => {
        setBusy(true);
        setErr('');
        setR(null);
        try {
            const x = await api.post('/api/agents/run', {
                agentId: sel,
                objective: 'Find the highest-priority trade opportunity and determine the safest next action.',
                maxSteps: 5
            });
            setR(x.data);
            await load();
        } catch {
            setErr('Agent run failed. No commercial action was executed.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                        <Bot size={14} /> GOVERNED AI CONTROL PLANE
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Autonomous Trade Desk</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">Bounded agents do analytical work; policy gates decide what may execute.</p>
                </div>
                <button 
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-[#202b36] disabled:text-[#75818d] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all shrink-0 shadow-lg shadow-blue-500/20 disabled:shadow-none"
                    onClick={run} 
                    disabled={busy}
                >
                    <Play size={16} className={busy ? "animate-pulse" : ""} />
                    {busy ? 'Agent working…' : 'Run selected agent'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#101922] border border-[#202b36] rounded-xl p-5 flex items-start gap-4 shadow-lg">
                    <div className="bg-green-500/10 text-green-400 p-2 rounded-lg shrink-0 mt-0.5">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <b className="text-white text-sm block mb-1">Governance mode</b>
                        <span className="text-[#75818d] text-xs leading-relaxed">Recommend automatically · material actions require human approval</span>
                    </div>
                </div>
                <div className="bg-[#101922] border border-[#202b36] rounded-xl p-5 flex items-start gap-4 shadow-lg">
                    <div className="bg-orange-500/10 text-orange-400 p-2 rounded-lg shrink-0 mt-0.5">
                        <LockKeyhole size={20} />
                    </div>
                    <div>
                        <b className="text-white text-sm block mb-1">Commercial protection</b>
                        <span className="text-[#75818d] text-xs leading-relaxed">No agent can reveal protected contacts or commit funds/contracts autonomously</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {a.map(x => (
                    <button 
                        key={x.id} 
                        className={`text-left rounded-xl p-6 flex items-start gap-5 transition-all group ${sel === x.id ? 'bg-[#101922] border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'bg-[#0c131b] border-2 border-[#202b36] hover:border-[#4f5b67]'}`}
                        onClick={() => setSel(x.id)}
                    >
                        <div className={`p-3 rounded-xl shrink-0 mt-1 transition-colors ${sel === x.id ? 'bg-blue-500/20 text-blue-400' : 'bg-[#101922] text-[#75818d] group-hover:text-white'}`}>
                            <Bot size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-4 mb-2">
                                <b className={`text-lg font-bold truncate transition-colors ${sel === x.id ? 'text-white' : 'text-[#eef2f6]'}`}>{x.name}</b>
                                <label className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase shrink-0 border ${x.status === 'Running' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' : 'bg-[#101922] text-[#75818d] border-[#202b36]'}`}>
                                    {x.status}
                                </label>
                            </div>
                            <p className="text-[#75818d] text-sm leading-relaxed mb-4 line-clamp-2">{x.mission}</p>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono">
                                <span className="flex flex-col gap-1">
                                    <span className="text-[#4f5b67] tracking-widest uppercase text-[10px] font-bold">Confidence</span>
                                    <span className="text-white">{x.confidence}%</span>
                                </span>
                                <span className="flex flex-col gap-1">
                                    <span className="text-[#4f5b67] tracking-widest uppercase text-[10px] font-bold">Authority</span>
                                    <span className="text-white truncate max-w-[120px]">{x.authority}</span>
                                </span>
                                <span className="flex flex-col gap-1 ml-auto">
                                    <span className="text-[#4f5b67] tracking-widest uppercase text-[10px] font-bold">Queue</span>
                                    <span className="text-[#c29631] text-right">{x.queue}</span>
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {err && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-5 rounded-xl flex items-center gap-3 mb-8 shadow-lg">
                    <AlertTriangle size={20} className="shrink-0" /> {err}
                </div>
            )}

            {r && (
                <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-xl p-8 mb-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    
                    <div className="relative z-10 flex items-start gap-4 mb-8 border-b border-[#202b36] pb-6">
                        <div className="bg-blue-500/20 text-blue-400 p-3 rounded-lg border border-blue-500/30 shrink-0 mt-1">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Agent Decision Packet</h3>
                            <p className="text-[#75818d] text-sm">Evidence-backed recommendation with explicit action boundary.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
                        <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 flex flex-col md:col-span-2">
                            <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase mb-2">RECOMMENDATION</small>
                            <b className="text-white text-lg leading-snug">{r.recommendation || r.summary}</b>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 flex flex-col items-center justify-center h-full text-center">
                                <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase mb-1">CONFIDENCE</small>
                                <b className="text-blue-400 text-3xl font-mono">{r.confidence || '—'}%</b>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 mb-8">
                        <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase block mb-3">EVIDENCE</small>
                        <div className="flex flex-col gap-3">
                            {(r.evidence || []).map((x: any, i: number) => (
                                <div key={i} className="flex items-start gap-3 bg-[#0c131b] border border-[#202b36] rounded-lg p-4">
                                    <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-[#eef2f6] text-sm leading-relaxed">{x}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-[#202b36]">
                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase">AUTHORITY</small>
                            <b className="text-white font-mono text-sm">{r.actionBoundary || 'Human approval required'}</b>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            {r.requiresApproval && (
                                <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                                    <AlertTriangle size={14} /> Human approval required before execution
                                </span>
                            )}
                            <button 
                                className="w-full sm:w-auto bg-[#202b36] hover:bg-[#4f5b67] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors"
                                onClick={() => onNavigate('Deal Origination')}
                            >
                                <ArrowRight size={16} /> Open opportunity
                            </button>
                        </div>
                    </div>
                </section>
            )}

            <section className="bg-[#101922] border border-[#202b36] rounded-xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-[#202b36] flex items-start gap-4 bg-[#0c131b]">
                    <div className="bg-[#101922] text-[#c29631] p-2.5 rounded-lg border border-[#202b36] shrink-0">
                        <Clock3 size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Agent Task Queue</h3>
                        <p className="text-[#75818d] text-xs">Every run is traceable; failed runs never silently execute.</p>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#0c131b] text-[#75818d] text-[10px] font-bold tracking-widest uppercase border-b border-[#202b36]">
                            <tr>
                                <th className="px-6 py-4">Task</th>
                                <th className="px-6 py-4">Agent</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Authority</th>
                                <th className="px-6 py-4">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#202b36]">
                            {t.length ? t.map(x => (
                                <tr key={x.id} className="hover:bg-[#131c26] transition-colors">
                                    <td className="px-6 py-4">
                                        <b className="text-white block text-sm truncate max-w-[250px]">{x.objective}</b>
                                        <small className="text-[#4f5b67] font-mono text-xs">{x.taskId || x.id}</small>
                                    </td>
                                    <td className="px-6 py-4 text-[#eef2f6] font-bold">{x.agentName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase border inline-flex items-center gap-1.5 ${
                                            x.status === 'Completed' || x.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                            x.status === 'Failed' || x.status === 'ERROR' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                            {x.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#75818d] text-xs">{x.authority}</td>
                                    <td className="px-6 py-4 text-[#75818d] font-mono text-xs">
                                        {x.createdAt ? new Date(x.createdAt).toLocaleString() : ''}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#75818d]">No agent tasks yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}