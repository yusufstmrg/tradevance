import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@appdeploy/client';
import { Activity, ArrowRight, BrainCircuit, CircleDollarSign, GitBranch, PackageSearch, ShieldCheck, Sparkles, Target, TrendingUp, Users } from 'lucide-react';

export default function TradeMemory() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const r = await api.get('/api/trade-memory');
                setData(r.data);
            } catch {
                setErr('Trade Memory is temporarily unavailable. No trade data was changed.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const graphDensity = useMemo(() => {
        if (!data?.graph?.nodes?.length) return 0;
        return Math.min(100, Math.round((data.graph.edges.length / data.graph.nodes.length) * 18));
    }, [data]);

    if (loading) return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] flex items-center justify-center">
            <div className="text-center text-[#c29631] animate-pulse flex flex-col items-center">
                <BrainCircuit size={40} className="mb-4 opacity-50" />
                <span className="text-sm font-bold tracking-widest uppercase">Building your trade memory…</span>
                <p className="text-xs text-[#75818d] mt-2">Reading only persisted RFQ, quote, trade and post-trade records.</p>
            </div>
        </div>
    );

    if (err) return (
        <div className="bg-[#070b10] min-h-screen p-8">
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-center">
                {err}
            </div>
        </div>
    );

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                        <BrainCircuit size={14} /> TRADE MEMORY GRAPH
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Turn every real trade into better intelligence.</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">Observed patterns from your persisted trade history — not synthetic activity, not hidden data, and not automatic model training.</p>
                </div>
                <div className="bg-[#c29631]/10 text-[#c29631] border border-[#c29631]/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shrink-0">
                    <Sparkles size={14} /> Observed data only
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-2xl p-8 mb-8 flex flex-col md:flex-row gap-8 items-center shadow-xl">
                <div className="md:w-2/3">
                    <small className="text-[#c29631] text-[10px] font-bold tracking-widest uppercase block mb-3">Why This Matters</small>
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{data.recommendation}</h3>
                    <p className="text-[#75818d] text-sm leading-relaxed max-w-xl">Trade Memory connects products, counterparties, approvals and outcomes so the platform can explain what keeps repeating — and where evidence is still too thin.</p>
                </div>
                <div className="md:w-1/3 flex flex-col items-center justify-center p-6 bg-[#070b10] border border-[#202b36] rounded-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#c29631] opacity-5 blur-xl group-hover:opacity-10 transition-opacity"></div>
                    <GitBranch size={48} className="text-[#c29631] mb-4 relative z-10" />
                    <span className="text-sm font-bold text-white font-mono relative z-10">{data.graph.nodes.length} nodes · {data.graph.edges.length} relationships</span>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                <Metric title="Trade Records" value={String(data.memoryHealth.tradeRecords)} sub="persisted transactions" icon={Activity} />
                <Metric title="Learning Samples" value={String(data.memoryHealth.learningSamples)} sub="post-trade outcomes" icon={BrainCircuit} />
                <Metric title="Memory Coverage" value={data.memoryHealth.coveragePercent + '%'} sub="trades with captured outcome" icon={ShieldCheck} />
                <Metric title="Average Deal Value" value={'$' + Number(data.outcomes.avgDealValue || 0).toLocaleString('en-US')} sub="observed trade history" icon={CircleDollarSign} />
                <Metric title="Graph Density" value={graphDensity + '%'} sub="relationship richness" icon={GitBranch} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Observed Patterns */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 flex flex-col">
                    <PanelTitle title="Observed Patterns" subtitle="Signals the memory layer can support today" icon={TrendingUp} />
                    <div className="space-y-3 mt-6 flex-1">
                        {data.patterns.map((x: any) => (
                            <div className="bg-[#0c131b] border border-[#202b36] p-4 rounded-xl flex items-start gap-4 transition-colors hover:border-[#4f5b67]" key={x.kind + x.title}>
                                <div className="mt-1 bg-[#c29631]/10 text-[#c29631] p-1.5 rounded text-[10px]">
                                    <Sparkles size={14} />
                                </div>
                                <div className="flex-1">
                                    <b className="block text-sm text-white mb-0.5">{x.title}</b>
                                    <span className="block text-xs text-[#eef2f6] mb-2">{x.detail}</span>
                                    <small className="block text-[10px] text-[#75818d] font-mono">{x.basis}</small>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded shrink-0 ${
                                    x.confidence === 'High' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                                    x.confidence === 'Medium' ? 'bg-[#c29631]/10 text-[#c29631] border border-[#c29631]/20' : 
                                    'bg-[#202b36] text-[#75818d] border border-[#4f5b67]'
                                }`}>{x.confidence}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Outcome Picture */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 flex flex-col">
                    <PanelTitle title="Outcome Picture" subtitle="What the stored learning records actually say" icon={Target} />
                    <div className="grid grid-cols-2 gap-4 mt-6 mb-6 flex-1">
                        <div className="bg-[#0c131b] border border-[#202b36] p-6 rounded-xl flex flex-col items-center justify-center text-center">
                            <b className="text-4xl text-green-500 font-mono mb-2">{data.outcomes.won}</b>
                            <span className="text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Won</span>
                        </div>
                        <div className="bg-[#0c131b] border border-[#202b36] p-6 rounded-xl flex flex-col items-center justify-center text-center">
                            <b className="text-4xl text-red-500 font-mono mb-2">{data.outcomes.lost}</b>
                            <span className="text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Lost</span>
                        </div>
                        <div className="bg-[#0c131b] border border-[#202b36] p-6 rounded-xl flex flex-col items-center justify-center text-center">
                            <b className="text-4xl text-white font-mono mb-2">{data.outcomes.settled}</b>
                            <span className="text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Settled</span>
                        </div>
                        <div className="bg-[#0c131b] border border-[#202b36] p-6 rounded-xl flex flex-col items-center justify-center text-center">
                            <b className="text-4xl text-[#c29631] font-mono mb-2">{data.outcomes.winRate === null ? '—' : data.outcomes.winRate + '%'}</b>
                            <span className="text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Win Rate</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-[#75818d] bg-[#0c131b] px-4 py-3 rounded-lg border border-[#202b36]">
                        <ShieldCheck size={14} className="text-blue-400 shrink-0 mt-0.5" />
                        <span>Win rate is shown only when operator-recorded learning samples exist.</span>
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Product Patterns */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6">
                    <PanelTitle title="Product Patterns" subtitle="Repeated products in the visible trade history" icon={PackageSearch} />
                    <div className="mt-6 space-y-2">
                        {data.productPatterns.length ? data.productPatterns.map((x: any) => (
                            <div className="flex items-center justify-between bg-[#0c131b] border border-[#202b36] p-3 rounded-lg hover:border-[#4f5b67] transition-colors" key={x.label}>
                                <div className="flex-1 pr-4">
                                    <b className="block text-sm text-white mb-0.5">{x.label}</b>
                                    <span className="block text-[10px] text-[#75818d] uppercase tracking-widest">{x.signal}</span>
                                </div>
                                <div className="text-right">
                                    <strong className="block text-sm text-white font-mono">{x.tradeCount} trades</strong>
                                    <small className="block text-[10px] text-[#c29631] font-mono">${Number(x.totalValue || 0).toLocaleString('en-US')} val</small>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-[#75818d] text-sm py-8 bg-[#0c131b] border border-[#202b36] rounded-lg">No product pattern yet. Real trade history will populate this layer.</div>
                        )}
                    </div>
                </section>

                {/* Counterparty Patterns */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6">
                    <PanelTitle title={data.profileRole === 'seller' ? 'Buyer patterns' : 'Supplier patterns'} subtitle="Role-scoped counterparties only" icon={Users} />
                    <div className="mt-6 space-y-2">
                        {data.counterpartyPatterns.length ? data.counterpartyPatterns.map((x: any) => (
                            <div className="flex items-center justify-between bg-[#0c131b] border border-[#202b36] p-3 rounded-lg hover:border-[#4f5b67] transition-colors" key={x.label}>
                                <div className="flex-1 pr-4">
                                    <b className="block text-sm text-white mb-0.5">{x.label}</b>
                                    <span className="block text-[10px] text-[#75818d] uppercase tracking-widest">{x.signal}</span>
                                </div>
                                <div className="text-right">
                                    <strong className="block text-sm text-white font-mono">{x.tradeCount} trades</strong>
                                    <small className="block text-[10px] text-[#c29631] font-mono">${Number(x.totalValue || 0).toLocaleString('en-US')} val</small>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-[#75818d] text-sm py-8 bg-[#0c131b] border border-[#202b36] rounded-lg">No counterparty pattern yet. This section fills from your own persisted trade history.</div>
                        )}
                    </div>
                </section>
            </div>

            {/* Relationship Map */}
            <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6">
                <PanelTitle title="Relationship Map" subtitle="Products connected to visible counterparties through persisted trade records" icon={GitBranch} />
                <div className="flex flex-wrap gap-3 mt-6 mb-6">
                    {data.graph.nodes.slice(0, 18).map((x: any) => (
                        <div 
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                                x.type === 'product' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 
                                x.type === 'buyer' || x.type === 'supplier' ? 'bg-[#c29631]/10 border-[#c29631]/20 text-[#c29631]' : 
                                'bg-[#202b36] border-[#4f5b67] text-[#eef2f6]'
                            }`} 
                            key={x.id}
                        >
                            <span className="opacity-70">
                                {x.type === 'product' ? <PackageSearch size={16} /> : x.type === 'buyer' || x.type === 'supplier' ? <Users size={16} /> : <GitBranch size={16} />}
                            </span>
                            <div className="flex flex-col">
                                <b className="text-xs font-bold leading-tight">{x.label}</b>
                                <small className="text-[10px] opacity-70 font-mono">{x.count} observed link{x.count === 1 ? '' : 's'}</small>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#75818d] border-t border-[#202b36] pt-4">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span>{data.privacy}</span>
                </div>
            </section>
        </div>
    );
}

function Metric({ title, value, sub, icon: Icon }: any) {
    return (
        <div className="bg-[#101922] border border-[#202b36] p-5 rounded-xl flex flex-col group hover:border-[#c29631]/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <Icon size={16} className="text-[#4f5b67] group-hover:text-[#c29631] transition-colors" />
            </div>
            <div>
                <small className="block text-[10px] text-[#75818d] uppercase tracking-widest font-bold mb-1">{title}</small>
                <strong className="block text-2xl text-white font-mono leading-none mb-2">{value}</strong>
                <span className="block text-[10px] text-[#4f5b67] leading-tight">{sub}</span>
            </div>
        </div>
    );
}

function PanelTitle({ title, subtitle, icon: Icon }: any) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-1 bg-blue-500/10 text-blue-400 p-1.5 rounded-lg border border-blue-500/20">
                <Icon size={16} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white mb-0.5">{title}</h3>
                <p className="text-xs text-[#75818d]">{subtitle}</p>
            </div>
        </div>
    );
}
