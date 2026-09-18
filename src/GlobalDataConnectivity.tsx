import React, { useEffect, useState } from 'react';
import { api } from '@appdeploy/client';
import { AlertTriangle, CheckCircle2, Database, ExternalLink, Globe2, LoaderCircle, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';

type Source = { id: string; name: string; category: string; purpose: string; access: string; status: string; url: string; next: string };
type Snapshot = { pipeline: { rawEvidence: number; normalizedEvidence: number; resolvedEntities: number; operationalDemands: number; opportunities: number; ingestionRuns: number }; sources: Source[]; lastRuns: any[]; resolution: any };

const tone = (s: string) => s.toLowerCase().replace('_', '-');

function StatusIcon({ status }: { status: string }) {
    if (status === 'HEALTHY' || status === 'ACTIVE') return <CheckCircle2 size={16} />;
    if (status === 'BLOCKED' || status === 'AUTH_REQUIRED' || status === 'LICENSE_REQUIRED') return <ShieldCheck size={16} />;
    if (status === 'ERROR' || status === 'UNHEALTHY') return <XCircle size={16} />;
    return <AlertTriangle size={16} />;
}

export default function GlobalDataConnectivity() {
    const [data, setData] = useState<Snapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState('');
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const r = await api.get('/api/admin/ingestion');
            setData(r.data);
        } catch {
            setError('Global Intelligence Ingestion is available to authorized operators only.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load() }, []);

    const run = async (id: string) => {
        setRunning(id);
        try {
            await api.post('/api/admin/ingestion/run/' + id, {});
            await load();
        } catch {
            setError('Health check failed safely. No source data was written.');
        } finally {
            setRunning('');
        }
    };

    if (loading) return (
        <section className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32 flex items-center justify-center">
            <div className="flex items-center gap-3 text-[#75818d] text-sm animate-pulse">
                <LoaderCircle size={20} className="animate-spin" /> Building ingestion control plane…
            </div>
        </section>
    );

    if (!data) return (
        <section className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-6 rounded-xl flex items-start gap-4 shadow-lg max-w-2xl mx-auto mt-12">
                <AlertTriangle size={24} className="shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-lg font-bold mb-1">Access Denied</h3>
                    <p className="text-sm opacity-90">{error || 'No ingestion snapshot available.'}</p>
                </div>
            </div>
        </section>
    );

    return (
        <section className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                        <Globe2 size={14} /> GLOBAL INTELLIGENCE INGESTION
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Production data-source control plane</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">Source health and data sync are separate states. A reachable public page never becomes a live trade-data connector automatically.</p>
                </div>
                <button 
                    className="bg-[#101922] hover:bg-[#131c26] border border-[#202b36] hover:border-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all shrink-0"
                    onClick={load}
                >
                    <RefreshCw size={14} /> Refresh pipeline
                </button>
            </div>

            <div className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl flex flex-wrap gap-4 mb-8">
                {[
                    ['Raw source', data.pipeline.rawEvidence],
                    ['Evidence', data.pipeline.normalizedEvidence],
                    ['Entities', data.pipeline.resolvedEntities],
                    ['Demands', data.pipeline.operationalDemands],
                    ['Opportunities', data.pipeline.opportunities],
                    ['Duplicate groups', data.resolution.duplicateGroups],
                    ['Review pairs', data.resolution.candidatePairs.length]
                ].map(([label, value]) => (
                    <div className="bg-[#0c131b] border border-[#202b36] rounded-xl px-5 py-4 flex-1 min-w-[140px]" key={String(label)}>
                        <b className="block text-2xl font-mono font-bold text-white mb-1">{Number(value).toLocaleString()}</b>
                        <span className="block text-[#75818d] text-[10px] font-bold tracking-widest uppercase">{label}</span>
                    </div>
                ))}
            </div>

            <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-xl p-8 mb-8 shadow-xl flex flex-col lg:flex-row gap-8 relative overflow-hidden">
                <div className="flex-1 max-w-xl relative z-10">
                    <small className="text-[#4f5b67] text-[10px] font-bold tracking-widest uppercase block mb-3">ENTITY RESOLUTION</small>
                    <h3 className="text-3xl font-mono font-bold text-white mb-3">
                        {data.resolution.canonicalEntities.toLocaleString()} canonical entities
                    </h3>
                    <p className="text-[#eef2f6] text-sm leading-relaxed mb-6">
                        {data.resolution.duplicateGroups} duplicate groups · {data.resolution.candidatePairs.length} candidate pairs · {data.resolution.unresolvedConflicts} unresolved conflicts
                    </p>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex items-start gap-3">
                        <ShieldCheck size={18} className="text-orange-400 shrink-0 mt-0.5" />
                        <span className="text-[#eef2f6] text-sm leading-relaxed">Ambiguous entities are never auto-merged. Operator review is required before identity consolidation.</span>
                    </div>
                </div>
                
                <div className="flex-1 bg-[#101922] border border-[#202b36] rounded-xl p-5 overflow-y-auto max-h-[250px] relative z-10 no-scrollbar">
                    <div className="space-y-3">
                        {data.resolution.candidatePairs.slice(0, 5).map((x: any) => (
                            <div className="bg-[#0c131b] border border-[#202b36] p-4 rounded-lg flex flex-col gap-2" key={x.leftId + x.rightId}>
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-sm font-bold truncate pr-4">{x.left} <span className="text-[#4f5b67] mx-1">↔</span> {x.right}</span>
                                    <b className="text-blue-400 font-mono text-sm shrink-0">{x.score}%</b>
                                </div>
                                <small className="text-[#75818d] text-xs block">{x.reason}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data.sources.map(s => {
                    const latest = data.lastRuns.find(r => r.sourceId === s.id);
                    const busy = running === s.id;
                    const statusVal = latest?.status || s.status;
                    
                    const isHealthy = statusVal === 'HEALTHY' || statusVal === 'ACTIVE';
                    const isBlocked = statusVal === 'BLOCKED' || statusVal === 'AUTH_REQUIRED' || statusVal === 'LICENSE_REQUIRED';
                    
                    return (
                        <article className="bg-[#101922] border border-[#202b36] rounded-xl p-6 flex flex-col h-full hover:border-[#4f5b67] transition-all group" key={s.id}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="min-w-0 pr-3">
                                    <h3 className="text-white font-bold text-base mb-1 truncate group-hover:text-blue-400 transition-colors">{s.name}</h3>
                                    <span className="text-[#75818d] text-xs block">{s.category}</span>
                                </div>
                                <label className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase shrink-0 border ${
                                    isHealthy ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                    isBlocked ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                    <StatusIcon status={statusVal} />
                                    {statusVal}
                                </label>
                            </div>
                            
                            <p className="text-[#eef2f6] text-sm leading-relaxed mb-6">{s.purpose}</p>
                            
                            <div className="flex flex-col gap-3 mb-6 mt-auto">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-[#75818d]">Access</span>
                                    <b className="text-white text-right">{s.access}</b>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-[#75818d]">Sync state</span>
                                    <b className={latest?.syncStatus ? 'text-white' : 'text-[#4f5b67]'}>{latest?.syncStatus || 'NOT_CONNECTED'}</b>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-[#75818d]">Next action</span>
                                    <b className="text-[#c29631] text-right truncate pl-4">{s.next}</b>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#202b36]">
                                <a 
                                    href={s.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex-1 bg-[#0c131b] hover:bg-[#131c26] border border-[#202b36] hover:border-[#4f5b67] text-[#75818d] hover:text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                                >
                                    Source docs <ExternalLink size={14} />
                                </a>
                                <button 
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-[#202b36] disabled:text-[#75818d] text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none"
                                    onClick={() => run(s.id)} 
                                    disabled={busy || s.status === 'AUTH_REQUIRED' || s.status === 'LICENSE_REQUIRED'}
                                >
                                    {busy ? <LoaderCircle size={14} className="animate-spin" /> : <RefreshCw size={14} />} 
                                    {busy ? 'Checking…' : 'Run check'}
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="bg-[#0c131b] rounded-full p-3 shrink-0">
                    <AlertTriangle size={20} className="text-red-400" />
                </div>
                <span className="text-[#eef2f6] text-sm leading-relaxed">
                    <b className="text-white mr-1">Production rule:</b> 
                    source health is not data synchronization. Only authenticated, licensed connectors with successful sync checkpoints may write normalized trade evidence.
                    {error && <strong className="text-red-400 ml-1 block mt-1">{error}</strong>}
                </span>
            </div>
        </section>
    );
}
