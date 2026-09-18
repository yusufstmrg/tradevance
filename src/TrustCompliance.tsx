import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Database, Lock, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';
import { api } from '@appdeploy/client';

export default function TrustCompliance() {
    const [data, setData] = useState<any>(null);
    const [risk, setRisk] = useState<any>(null);
    const [dealRisk, setDealRisk] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [syncing, setSyncing] = useState(false);
    const [graph, setGraph] = useState<any>(null);

    const load = async () => {
        setLoading(true);
        setErr('');
        try {
            const [r, g, rs, dr] = await Promise.all([
                api.get('/api/admin/compliance'),
                api.get('/api/admin/sanctions-graph'),
                api.get('/api/admin/risk'),
                api.get('/api/admin/deal-risk')
            ]);
            setData(r.data);
            setGraph(g.data);
            setRisk(rs.data);
            setDealRisk(dr.data);
        } catch {
            setErr('Trust & Compliance is available to authorized operators only.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const sync = async () => {
        setSyncing(true);
        setErr('');
        try {
            await api.post('/api/admin/official-sanctions/structured-sync', {});
            await load();
        } catch {
            setErr('Official sanctions structure sync failed safely. No transaction state was changed.');
        } finally {
            setSyncing(false);
        }
    };

    if (loading) return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] flex items-center justify-center">
            <div className="flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase animate-pulse">
                <RefreshCw size={18} className="animate-spin" /> Building compliance control plane…
            </div>
        </div>
    );

    if (err || !data) return (
        <div className="bg-[#070b10] min-h-screen p-8">
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-6 rounded-xl flex items-start gap-4">
                <AlertTriangle size={24} className="shrink-0" />
                <div>
                    <b className="block text-lg mb-1">Access Restricted</b>
                    <span className="text-sm opacity-80">{err || 'No compliance snapshot available.'}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                        <ShieldCheck size={14} /> TRADEVANCE TRUST & COMPLIANCE
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Counterparty Risk Control Plane</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">Trust, verification, official screening and decision support are separate controls. Risk decisions never substitute for legal clearance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        className="bg-[#101922] hover:bg-[#131c26] border border-[#202b36] hover:border-[#4f5b67] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all"
                        onClick={load}
                    >
                        <RefreshCw size={14} /> Refresh Controls
                    </button>
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-[#202b36] disabled:text-[#75818d] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all"
                        onClick={sync} 
                        disabled={syncing}
                    >
                        <Database size={14} className={syncing ? 'animate-pulse' : ''} /> {syncing ? 'Syncing…' : 'Sync Structured Lists'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <MetricCard label="Average Trust" value={data.trust.avgTrust} sub="evidence-based graph score" />
                <MetricCard label="Risk Allow" value={risk?.allow || 0} sub="decision support allow" />
                <MetricCard label="Risk Review" value={risk?.review || 0} sub="manual review required" />
                <MetricCard label="Risk Block" value={risk?.block || 0} sub="transactionally blocked" />
            </div>

            <section className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden mb-8 shadow-xl">
                <div className="p-6 border-b border-[#202b36] flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Counterparty Risk Engine</h3>
                        <p className="text-xs text-[#75818d]">Explainable decision support from verification, official screening, Trust Graph evidence and freshness.</p>
                    </div>
                    <div className="bg-[#c29631]/10 text-[#c29631] border border-[#c29631]/20 px-3 py-1.5 rounded flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                        <Lock size={12} /> AI CANNOT OVERRIDE
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#202b36] bg-[#0c131b]">
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Company</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Role</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Score</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Band</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Decision</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Reasons</th>
                            </tr>
                        </thead>
                        <tbody>
                            {risk?.results?.length ? risk.results.slice(0, 15).map((x: any) => (
                                <tr key={x.userId} className="border-b border-[#202b36] hover:bg-[#131c26] transition-colors group">
                                    <td className="px-6 py-3"><b className="text-white text-sm block">{x.company}</b></td>
                                    <td className="px-6 py-3"><span className="text-xs text-[#eef2f6]">{x.role}</span></td>
                                    <td className="px-6 py-3"><strong className="text-[#c29631] font-mono">{x.riskScore}</strong></td>
                                    <td className="px-6 py-3"><span className="text-xs text-[#75818d]">{x.riskBand}</span></td>
                                    <td className="px-6 py-3">
                                        <DecisionBadge decision={x.decision} />
                                    </td>
                                    <td className="px-6 py-3"><small className="text-xs text-[#75818d] group-hover:text-white transition-colors">{x.reasons.slice(0, 2).join(' · ')}</small></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[#75818d] text-sm">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <CheckCircle2 size={24} className="opacity-50" />
                                            <span>No Buyer/Seller risk records yet.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden mb-8 shadow-xl">
                <div className="p-6 border-b border-[#202b36] flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Deal Guardian</h3>
                        <p className="text-xs text-[#75818d]">Deal-level risk across real RFQs, quotes and active trades. No synthetic deal records are created.</p>
                    </div>
                    <div className="bg-[#c29631]/10 text-[#c29631] border border-[#c29631]/20 px-3 py-1.5 rounded flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                        <Lock size={12} /> REVIEW/BLOCK HELD
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-[#202b36] bg-[#0c131b]">
                    <MetricCard label="Deals Evaluated" value={dealRisk?.total || 0} sub="real operational records" small />
                    <MetricCard label="Deal Allow" value={dealRisk?.allow || 0} sub="eligible under policy" small />
                    <MetricCard label="Deal Review" value={dealRisk?.review || 0} sub="manual review required" small />
                    <MetricCard label="Deal Block" value={dealRisk?.block || 0} sub="transaction gate blocked" small />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#202b36] bg-[#0c131b]">
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Deal</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Company</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Value</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Risk</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Decision</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Reasons</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dealRisk?.rows?.length ? dealRisk.rows.slice(0, 15).map((x: any) => (
                                <tr key={x.id} className="border-b border-[#202b36] hover:bg-[#131c26] transition-colors group">
                                    <td className="px-6 py-3">
                                        <b className="text-white text-sm block mb-0.5">{x.type}</b>
                                        <small className="text-[10px] text-[#75818d] font-mono">{x.id} · {x.product || '—'}</small>
                                    </td>
                                    <td className="px-6 py-3"><span className="text-xs text-[#eef2f6]">{x.company}</span></td>
                                    <td className="px-6 py-3"><span className="text-xs text-blue-400 font-mono">{x.value || 0}</span></td>
                                    <td className="px-6 py-3"><strong className="text-[#c29631] font-mono">{x.riskScore}</strong></td>
                                    <td className="px-6 py-3">
                                        <DecisionBadge decision={x.decision} />
                                    </td>
                                    <td className="px-6 py-3"><small className="text-xs text-[#75818d] group-hover:text-white transition-colors">{x.reasons.slice(0, 2).join(' · ')}</small></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[#75818d] text-sm">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <CheckCircle2 size={24} className="opacity-50" />
                                            <span>No operational RFQ, quote or trade records are available for Deal Guardian yet.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <section className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-[#202b36]">
                        <h3 className="text-lg font-bold text-white mb-1">Sanctions Entity Graph</h3>
                        <p className="text-xs text-[#75818d]">Structured source records for operator intelligence; clearance still comes from versioned official-source screening.</p>
                    </div>
                    <div className="p-6 bg-[#0c131b]">
                        <div className="mb-2">
                            <b className="text-xl text-white font-mono block mb-1">{graph?.totalRecords?.toLocaleString?.() || 0} structured records</b>
                            <span className="text-xs text-[#c29631] font-bold tracking-widest uppercase">{graph?.aliases || 0} aliases · {graph?.entities || 0} entities · {graph?.people || 0} people</span>
                        </div>
                        <p className="text-sm text-[#75818d] mt-4">{graph?.coverage || 'No structured snapshot has been built yet.'}</p>
                    </div>
                </section>

                <section className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-[#202b36] flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Screening Readiness</h3>
                            <p className="text-xs text-[#75818d]">Current state of the official-source sanctions control.</p>
                        </div>
                        <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                            <ShieldCheck size={12} /> {data.screening.status}
                        </div>
                    </div>
                    <div className="p-6 bg-[#0c131b]">
                        <div className="mb-2">
                            <b className="text-xl text-white block mb-1">{data.screening.provider}</b>
                            <span className="text-xs text-blue-400 font-bold tracking-widest uppercase">{data.screening.mode}</span>
                        </div>
                        <p className="text-sm text-[#75818d] mt-4">{data.screening.rule}</p>
                    </div>
                </section>
            </div>

            <section className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden mb-8 shadow-xl">
                <div className="p-6 border-b border-[#202b36] flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">High-Priority Review Queue</h3>
                        <p className="text-xs text-[#75818d]">These counterparties must not be presented as "cleared".</p>
                    </div>
                    <div className="bg-[#c29631]/10 text-[#c29631] border border-[#c29631]/20 px-3 py-1.5 rounded flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                        <Lock size={12} /> TRANSACTION GATES ACTIVE
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#202b36] bg-[#0c131b]">
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Entity</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Trust</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Evidence</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Freshness</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Screening</th>
                                <th className="px-6 py-3 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Gate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.cases.length ? data.cases.map((x: any) => (
                                <tr key={x.entityId} className="border-b border-[#202b36] hover:bg-[#131c26] transition-colors">
                                    <td className="px-6 py-4">
                                        <b className="text-white text-sm block mb-1">{x.name}</b>
                                        <small className="text-xs text-[#75818d]">{x.reason}</small>
                                    </td>
                                    <td className="px-6 py-4"><strong className="text-[#c29631] font-mono">{x.trustScore}</strong></td>
                                    <td className="px-6 py-4"><span className="text-xs text-white">{x.evidenceDepth}</span></td>
                                    <td className="px-6 py-4"><span className="text-xs text-white">{x.freshnessDays}d</span></td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded">
                                            <XCircle size={12} /> {x.screening}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-[#c29631]/10 text-[#c29631] border border-[#c29631]/20 px-2 py-1 rounded">
                                            <Lock size={12} /> {x.transactionGate}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-[#75818d] text-sm">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <CheckCircle2 size={24} className="opacity-50" />
                                            <span>No high-priority review cases currently derived from the operational graph.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="flex items-start gap-3 bg-[#101922] p-4 rounded-xl border border-[#202b36] text-xs text-[#75818d]">
                <Database size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <p><b>Policy:</b> Risk Engine is decision support only. It is not legal clearance, credit underwriting, UBO/KYB, PEP, adverse-media screening, or jurisdiction-specific legal advice.</p>
            </div>
        </div>
    );
}

function MetricCard({ label, value, sub, small }: { label: string; value: string | number; sub: string; small?: boolean }) {
    return (
        <div className={`bg-[#0c131b] border border-[#202b36] rounded-xl flex flex-col ${small ? 'p-4' : 'p-6'}`}>
            <small className="text-[10px] text-[#75818d] uppercase tracking-widest font-bold mb-2">{label}</small>
            <b className={`${small ? 'text-2xl' : 'text-3xl'} text-white font-mono leading-none mb-1`}>{value}</b>
            <span className="text-[10px] text-[#4f5b67] font-bold">{sub}</span>
        </div>
    );
}

function DecisionBadge({ decision }: { decision: string }) {
    if (decision === 'BLOCK') {
        return <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-red-500/10 text-red-500 border border-red-500/20">{decision}</span>;
    }
    if (decision === 'REVIEW') {
        return <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-[#c29631]/10 text-[#c29631] border border-[#c29631]/20">{decision}</span>;
    }
    return <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/20">{decision}</span>;
}