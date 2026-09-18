import React, { useEffect, useState } from 'react';
import { api } from '@appdeploy/client';
import { Activity, AlertTriangle, BarChart3, Database, Globe2, Layers3, RefreshCw, ShieldCheck, Sparkles, TrendingUp, GitBranch } from 'lucide-react';

type Graph = { nodesCount: number; edgesCount: number; avgTrust: number; scoreBuckets: { low: number; medium: number; high: number }; staleNodes: number; avgEvidenceDepth: number; relationCounts: Record<string, number>; reviewQueue: any[] };
type Fabric = { registryCount: number; buyers: number; sellers: number; avgConfidence: number; evidenceBacked: number; tradeVerified: number; sourceVerified: number; freshnessDays: number; verification: Record<string, number>; productCounts: Record<string, number>; countryCounts: Record<string, number>; sourceCoverage: { source: string; coverage: number; status: string }[]; gaps: { label: string; priority: string; action: string }[]; trustGraph: Graph };

const pct = (n: number) => Math.max(0, Math.min(100, n));

function Bars({ data }: { data: Record<string, number> }) {
    const rows = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const max = Math.max(1, ...rows.map(x => x[1]));
    
    return (
        <div className="space-y-3">
            {rows.map(([k, v]) => (
                <div className="flex items-center gap-3" key={k}>
                    <span className="w-1/3 text-xs text-[#75818d] truncate" title={k}>{k}</span>
                    <div className="flex-1 h-1.5 bg-[#202b36] rounded-full overflow-hidden flex items-center">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct(v / max * 100)}%` }} />
                    </div>
                    <b className="w-12 text-right text-xs text-white font-mono">{v}</b>
                </div>
            ))}
        </div>
    );
}

export default function DataFabric() {
    const [data, setData] = useState<Fabric | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const r = await api.get('/api/data-fabric');
            setData(r.data);
        } catch {
            setError('Data Fabric is available to authorized operators only.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    if (loading) return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] flex items-center justify-center">
            <div className="text-center text-blue-400 animate-pulse flex flex-col items-center">
                <Sparkles size={40} className="mb-4 opacity-50" />
                <span className="text-sm font-bold tracking-widest uppercase">Building the intelligence graph…</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="bg-[#070b10] min-h-screen p-8">
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-6 rounded-xl flex items-start gap-4">
                <AlertTriangle size={24} className="shrink-0" />
                <div>
                    <b className="block text-lg mb-1">Operator Intelligence Boundary</b>
                    <span className="text-sm opacity-80">{error}</span>
                </div>
            </div>
        </div>
    );

    if (!data) return null;
    const g = data.trustGraph;

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-3">
                        <Database size={14} /> TRADEVANCE DATA FABRIC
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Global Trade Intelligence Graph</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">Measure entity coverage, trust quality, evidence depth, freshness and relationship signals before they become commercial risk.</p>
                </div>
                <button className="bg-[#202b36] hover:bg-[#4f5b67] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors" onClick={load}>
                    <RefreshCw size={14} /> Refresh Graph
                </button>
            </div>

            {/* Hero Section */}
            <div className="bg-[#101922] border border-[#202b36] rounded-2xl p-8 mb-8 flex flex-col xl:flex-row gap-8">
                <div className="xl:w-1/3 flex flex-col justify-center">
                    <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase mb-2">Network Intelligence</span>
                    <strong className="text-5xl font-mono text-white mb-2 leading-none">{data.registryCount.toLocaleString()}</strong>
                    <p className="text-[#75818d] text-sm">evidence-backed entities currently in the operational registry</p>
                </div>
                <div className="xl:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Metric label="Buyers" value={data.buyers} />
                    <Metric label="Sellers" value={data.sellers} />
                    <Metric label="Avg Trust" value={g.avgTrust + '%'} />
                    <Metric label="Relationships" value={g.edgesCount} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {/* Trust Graph Health */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 xl:col-span-2">
                    <Title icon={GitBranch} title="Trust Graph Health" sub="Deterministic trust score from identity, evidence, verification, freshness and operational relationships" />
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                        <div className="bg-[#0c131b] border border-[#202b36] p-3 rounded-lg"><small className="text-[10px] text-[#75818d] uppercase block mb-1">Low risk</small><b className="text-lg text-green-500 font-mono">{g.scoreBuckets.low}</b></div>
                        <div className="bg-[#0c131b] border border-[#202b36] p-3 rounded-lg"><small className="text-[10px] text-[#75818d] uppercase block mb-1">Medium risk</small><b className="text-lg text-[#c29631] font-mono">{g.scoreBuckets.medium}</b></div>
                        <div className="bg-[#0c131b] border border-[#202b36] p-3 rounded-lg"><small className="text-[10px] text-[#75818d] uppercase block mb-1">High risk</small><b className="text-lg text-red-500 font-mono">{g.scoreBuckets.high}</b></div>
                        <div className="bg-[#0c131b] border border-[#202b36] p-3 rounded-lg"><small className="text-[10px] text-[#75818d] uppercase block mb-1">Stale &gt;90d</small><b className="text-lg text-white font-mono">{g.staleNodes}</b></div>
                        <div className="bg-[#0c131b] border border-[#202b36] p-3 rounded-lg"><small className="text-[10px] text-[#75818d] uppercase block mb-1">Avg evidence</small><b className="text-lg text-white font-mono">{g.avgEvidenceDepth}</b></div>
                        <div className="bg-[#0c131b] border border-[#202b36] p-3 rounded-lg"><small className="text-[10px] text-[#75818d] uppercase block mb-1">Graph edges</small><b className="text-lg text-white font-mono">{g.edgesCount}</b></div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#75818d] bg-[#0c131b] px-4 py-3 rounded-lg border border-[#202b36]">
                        <ShieldCheck size={16} className="text-blue-400" />
                        <span>{g.reviewQueue.length} entities currently require trust review based on risk, evidence depth or freshness.</span>
                    </div>
                </section>

                {/* Verification Ladder */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6">
                    <Title icon={ShieldCheck} title="Verification Ladder" sub="How much of the graph has defensible evidence" />
                    <div className="space-y-4 mb-6">
                        {Object.entries(data.verification).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                            <div key={k}>
                                <div className="flex justify-between items-end mb-1 text-xs">
                                    <span className="text-white">{k}</span>
                                    <b className="font-mono text-[#75818d]">{v}</b>
                                </div>
                                <div className="h-1.5 bg-[#202b36] rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct(v / Math.max(1, data.registryCount) * 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-start gap-2 text-[10px] text-[#75818d] bg-[#0c131b] px-4 py-3 rounded-lg border border-[#202b36]">
                        <ShieldCheck size={14} className="text-blue-400 shrink-0 mt-0.5" />
                        <p>{data.evidenceBacked} entities have at least two evidence signals. {data.freshnessDays === 0 ? 'All current curated registry records are current for today.' : data.freshnessDays + ' records need freshness review.'}</p>
                    </div>
                </section>

                {/* Trust Review Queue */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 lg:col-span-2">
                    <Title icon={AlertTriangle} title="Trust Review Queue" sub="Entities needing stronger evidence or fresher verification" />
                    <div className="space-y-2">
                        {g.reviewQueue.slice(0, 10).map((x: any) => (
                            <div key={x.id} className="bg-[#0c131b] border border-[#202b36] p-3 rounded-lg flex items-center justify-between group hover:border-[#4f5b67] transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${x.riskBand === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-[#c29631]/10 text-[#c29631]'}`}>{x.riskBand}</span>
                                    <div>
                                        <b className="text-sm text-white block">{x.name}</b>
                                        <span className="text-xs text-[#75818d]">Trust {x.trustScore} · Evidence {x.evidenceDepth} · Freshness {x.freshnessDays}d · {x.reasons.join(' · ')}</span>
                                    </div>
                                </div>
                                <TrendingUp size={16} className="text-[#4f5b67] group-hover:text-white transition-colors" />
                            </div>
                        ))}
                        {!g.reviewQueue.length && <div className="text-center text-[#75818d] py-4 text-sm">No trust review items currently meet the review thresholds.</div>}
                    </div>
                </section>

                {/* Source Coverage */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6">
                    <Title icon={Globe2} title="Source Coverage" sub="Evidence channels and integration readiness" />
                    <div className="space-y-4">
                        {data.sourceCoverage.map(x => (
                            <div key={x.source}>
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2 text-xs">
                                        <b className="text-white">{x.source}</b>
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest ${x.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-[#202b36] text-[#75818d]'}`}>{x.status}</span>
                                    </div>
                                    <strong className="text-xs text-blue-400 font-mono">{x.coverage}%</strong>
                                </div>
                                <div className="h-1 bg-[#202b36] rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${x.coverage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Product Concentration */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6">
                    <Title icon={BarChart3} title="Product Concentration" sub="Where the current commercial graph is deepest" />
                    <Bars data={data.productCounts} />
                </section>

                {/* Geographic Coverage */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6">
                    <Title icon={Globe2} title="Geographic Coverage" sub="Entity footprint by operating country / region" />
                    <Bars data={data.countryCounts} />
                </section>
                
                {/* Data Moat Architecture */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 xl:col-span-3">
                    <Title icon={Layers3} title="Data Moat Architecture" sub="How raw signals become protected commercial intelligence" />
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mt-6">
                        {['Official sources', 'Trade statistics', 'Licensed feeds', 'Entity resolution', 'Evidence scoring', 'Trust graph', 'AI opportunity engine'].map((x, i) => (
                            <React.Fragment key={x}>
                                <div className="flex-1 flex flex-col items-center text-center p-3 bg-[#0c131b] border border-[#202b36] rounded-lg">
                                    <span className="text-[10px] text-blue-400 font-bold font-mono mb-1">{String(i + 1).padStart(2, '0')}</span>
                                    <b className="text-xs text-[#eef2f6]">{x}</b>
                                </div>
                                {i < 6 && <TrendingUp size={16} className="text-[#4f5b67] hidden md:block shrink-0" />}
                            </React.Fragment>
                        ))}
                    </div>
                </section>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#75818d] border-t border-[#202b36] pt-6 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2"><Activity size={14} className="text-green-500" /> Graph health: Operational</span>
                <span>Trust scores are deterministic decision support; they are not legal, sanctions or KYB determinations.</span>
            </div>
        </div>
    );
}

function Metric({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="bg-[#0c131b] border border-[#202b36] p-4 rounded-xl flex flex-col">
            <small className="text-[10px] text-[#75818d] uppercase tracking-widest font-bold mb-1">{label}</small>
            <b className="text-2xl text-white font-mono leading-none">{value}</b>
        </div>
    );
}

function Title({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) {
    return (
        <div className="flex items-start gap-3 mb-6">
            <div className="mt-1 bg-blue-500/10 text-blue-400 p-1.5 rounded-lg border border-blue-500/20">
                <Icon size={16} />
            </div>
            <section>
                <b className="block text-white mb-0.5">{title}</b>
                <span className="block text-xs text-[#75818d]">{sub}</span>
            </section>
        </div>
    );
}
