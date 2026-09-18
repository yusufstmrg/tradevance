import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@appdeploy/client';
import { Activity, ArrowRight, BarChart3, BriefcaseBusiness, CircleDollarSign, Database, Eye, FileCheck2, Globe2, RefreshCw, ShieldCheck, Sparkles, Target, TrendingUp, Users, X } from 'lucide-react';
import GlobalDataConnectivity from './GlobalDataConnectivity';
import TrustCompliance from './TrustCompliance';

export default function AdminIntelligence() {
    const [data, setData] = useState<any>(null);
    const [tab, setTab] = useState('Overview');
    const [selected, setSelected] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [q, setQ] = useState('');
    const [answer, setAnswer] = useState('');
    const [thinking, setThinking] = useState(false);
    const [negId, setNegId] = useState('');
    const [negType, setNegType] = useState('quote');
    const [negBusy, setNegBusy] = useState(false);
    const [negResult, setNegResult] = useState<any>(null);

    const load = async () => {
        setLoading(true);
        setErr('');
        try {
            const r = await api.get('/api/admin/intelligence');
            setData(r.data);
        } catch {
            setErr('Admin intelligence is temporarily unavailable.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load() }, []);

    const ask = async (question = q) => {
        const text = question.trim();
        if (!text || thinking || !data) return;
        setThinking(true);
        setAnswer('');
        try {
            const r = await api.post('/api/admin/growth-advisor', { question: text, snapshot: data });
            setAnswer(r.data.answer || 'No recommendation returned.');
        } catch {
            setAnswer('Growth Copilot is temporarily unavailable. Retry without executing any platform action.');
        } finally {
            setThinking(false);
        }
    };

    const tabs = ['Overview', 'CRM Intelligence', 'Traffic', 'Users', 'Captured Data', 'Advisory Operations', 'Growth Copilot', 'Execution Intelligence', 'Data Connectivity', 'Trust & Compliance', 'Release Audit'];
    const pages = useMemo(() => data?.traffic?.topPages || [], [data]);
    
    const [executionData, setExecutionData] = useState<any>(null);
    const [executionLoading, setExecutionLoading] = useState(false);

    const loadExecution = async () => {
        setExecutionLoading(true);
        try {
            const r = await api.get('/api/admin/execution-intelligence');
            setExecutionData(r.data);
        } catch {
            setExecutionData(null);
        } finally {
            setExecutionLoading(false);
        }
    };

    const generateNegotiation = async () => {
        const id = negId.trim();
        if (!id || negBusy) return;
        setNegBusy(true);
        setNegResult(null);
        try {
            const r = await api.post('/api/admin/negotiation-strategy', { dealId: id, dealType: negType });
            setNegResult(r.data);
        } catch {
            setNegResult({ error: 'Negotiation Intelligence is temporarily unavailable. No trade or quote was changed.' });
        } finally {
            setNegBusy(false);
        }
    };

    useEffect(() => {
        if (tab === 'Execution Intelligence') loadExecution();
    }, [tab]);

    if (loading) return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 flex justify-center items-center">
            <div className="flex items-center gap-3 text-[#75818d] text-sm animate-pulse">
                <RefreshCw size={16} className="animate-spin" /> Preparing Tradevance intelligence…
            </div>
        </div>
    );

    if (err) return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8">
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-6 rounded-xl flex items-start gap-4 shadow-lg max-w-2xl mx-auto mt-12">
                <ShieldCheck size={24} className="shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-lg font-bold mb-1">Access Denied</h3>
                    <p className="text-sm opacity-90">{err}</p>
                </div>
            </div>
        </div>
    );

    const Kpi = ({ label, value, sub, icon: Icon }: any) => (
        <div className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-lg flex flex-col hover:border-[#4f5b67] transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors" />
            <div className="bg-[#0c131b] border border-[#202b36] rounded-lg w-10 h-10 flex items-center justify-center text-blue-400 mb-4 shrink-0 group-hover:scale-110 transition-transform">
                <Icon size={18} />
            </div>
            <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase block mb-1">{label}</small>
            <strong className="text-white text-3xl font-mono font-bold block mb-2">{value}</strong>
            <span className="text-[#4f5b67] text-xs block truncate mt-auto">{sub}</span>
        </div>
    );

    const List = ({ rows, cols }: any) => (
        <div className="w-full overflow-x-auto rounded-lg border border-[#202b36] bg-[#0c131b]">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#101922] text-[#75818d] text-[10px] font-bold tracking-widest uppercase border-b border-[#202b36]">
                    <tr>
                        {cols.map((c: string) => <th key={c} className="px-4 py-3">{c}</th>)}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#202b36]">
                    {rows.length ? rows.map((r: any, i: number) => (
                        <tr key={r.id || i} onClick={() => setSelected(r)} className="hover:bg-[#131c26] cursor-pointer transition-colors text-[#eef2f6]">
                            {cols.map((c: string) => <td key={c} className="px-4 py-3">{String(r[c] ?? '—')}</td>)}
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={cols.length} className="px-4 py-8 text-center text-[#75818d]">No captured records yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const auditRows = [
        { area: 'Public landing / learning layer', status: 'PASS', note: 'Public menus expose detailed Solutions, Intelligence, Resources, Pricing and Company information.' },
        { area: 'Authentication / onboarding', status: 'PASS', note: 'Anonymous users stay on public landing; authenticated users are routed by role.' },
        { area: 'Buyer/Seller verification gate', status: 'PASS', note: 'Transactional backend actions require verified Buyer/Seller status; Operator is exempt.' },
        { area: 'Buyer/Seller data isolation', status: 'PASS', note: 'Backend visibility is role-scoped for entities and network intelligence.' },
        { area: 'Profile & organization data', status: 'PASS', note: 'Editable organization profile, verification submission and avatar storage are implemented.' },
        { area: 'CRM / Traffic / Data capture', status: 'PASS', note: 'First-party event capture and operator intelligence aggregation are implemented.' },
        { area: 'AI agent governance', status: 'PASS', note: 'Material actions retain human approval boundaries and audit traces.' },
        { area: 'Automated E2E harness', status: 'BLOCKED', note: 'AppDeploy currently reports no E2E jobs for this project; manual/QA snapshot validation is available.' },
        { area: 'Licensed KYB / UBO / sanctions feeds', status: 'INTEGRATION', note: 'Architecture boundary exists; licensed providers are still required for production verification.' },
        { area: 'Live billing / payment rails', status: 'INTEGRATION', note: 'Commercial pricing model exists; live payment processor is not yet connected.' },
        { area: 'Real trade-data feeds', status: 'INTEGRATION', note: 'Curated evidence-backed registry exists; live licensed trade/shipment feeds remain integration work.' }
    ];

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                        <Database size={14} /> TRADEVANCE ADMIN INTELLIGENCE
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Global Revenue & Customer Command Center</h1>
                    <p className="text-[#75818d] text-sm max-w-2xl">One operating view across acquisition, CRM, trust, activity, trade execution, revenue and every captured signal.</p>
                </div>
                <button 
                    className="bg-[#101922] hover:bg-[#131c26] border border-[#202b36] hover:border-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all shrink-0"
                    onClick={load}
                >
                    <RefreshCw size={14} /> Refresh intelligence
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-8 border-b border-[#202b36] pb-4">
                {tabs.map(x => (
                    <button 
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === x ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-[#101922] text-[#75818d] hover:bg-[#131c26] hover:text-white border border-[#202b36]'}`}
                        key={x} 
                        onClick={() => setTab(x)}
                    >
                        {x}
                    </button>
                ))}
            </div>

            {tab === 'Overview' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                        <Kpi label="Registered Users" value={data.users.total} sub={`${data.users.buyers} buyers · ${data.users.sellers} sellers`} icon={Users} />
                        <Kpi label="Verified Accounts" value={data.users.verified} sub={`${data.users.verificationRate}% verification rate`} icon={ShieldCheck} />
                        <Kpi label="Unique Visitors" value={data.traffic.uniqueVisitors} sub={`${data.traffic.sessions} sessions`} icon={Eye} />
                        <Kpi label="Open RFQs" value={data.funnel.openRfqs} sub={`${data.funnel.totalRfqs} total RFQs`} icon={Target} />
                        <Kpi label="Trade Value" value={data.revenue.tradeValue} sub={`${data.revenue.activeTrades} active trades`} icon={CircleDollarSign} />
                        <Kpi label="Revenue Signals" value={data.revenue.revenueSignals} sub="subscriptions + fees + managed trade" icon={TrendingUp} />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl flex flex-col">
                            <Head icon={Users} title="CRM Intelligence" sub="Customer 360, lead pipeline and engagement health" />
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-4 flex flex-col">
                                    <b className="text-white text-2xl font-mono mb-1">{data.crm.totalAccounts}</b>
                                    <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase">Total accounts</small>
                                </div>
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex flex-col">
                                    <b className="text-orange-400 text-2xl font-mono mb-1">{data.crm.hotLeads}</b>
                                    <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase">Hot leads</small>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex flex-col">
                                    <b className="text-red-400 text-2xl font-mono mb-1">{data.crm.atRisk}</b>
                                    <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase">At risk</small>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex flex-col">
                                    <b className="text-blue-400 text-2xl font-mono mb-1">{data.crm.advisoryOpen}</b>
                                    <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase">Advisory open</small>
                                </div>
                            </div>
                            <button className="mt-auto text-blue-400 hover:text-blue-300 flex items-center justify-between gap-2 text-xs font-bold transition-colors group border border-[#202b36] hover:border-blue-500/30 bg-[#0c131b] px-4 py-3 rounded-lg" onClick={() => setTab('CRM Intelligence')}>
                                Open Customer 360 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </section>
                        
                        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl flex flex-col">
                            <Head icon={Globe2} title="Website & Acquisition" sub="Traffic, sources, conversion and user journeys" />
                            <div className="flex flex-col gap-3 mb-6">
                                {pages.slice(0, 5).map((x: any) => (
                                    <div key={x.page} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-[#eef2f6] truncate pr-4">{x.page}</span>
                                            <b className="text-white font-mono">{x.views}</b>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#0c131b] rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500/80 rounded-full" style={{ width: `${Math.min(100, Math.round(x.views / Math.max(1, pages[0]?.views || 1) * 100))}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-auto text-blue-400 hover:text-blue-300 flex items-center justify-between gap-2 text-xs font-bold transition-colors group border border-[#202b36] hover:border-blue-500/30 bg-[#0c131b] px-4 py-3 rounded-lg" onClick={() => setTab('Traffic')}>
                                Open traffic intelligence <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </section>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                            <Head icon={FileCheck2} title="Verification Command" sub="Identity, evidence and transaction access gates" />
                            <List rows={data.verification.queue} cols={['company', 'role', 'status', 'submitted']} />
                        </section>
                        
                        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                            <Head icon={BriefcaseBusiness} title="Recent Trade Activity" sub="RFQ → quote → trade execution signals" />
                            <List rows={data.recent.trades} cols={['id', 'product', 'status', 'value']} />
                        </section>
                    </div>
                </>
            )}

            {tab === 'CRM Intelligence' && (
                <>
                    <div className="flex flex-wrap gap-4 mb-6 text-sm font-bold text-[#75818d]">
                        <span className="text-white bg-[#202b36] px-3 py-1 rounded">Customer 360°</span>
                        <span className="px-3 py-1">Lead Management</span>
                        <span className="px-3 py-1">Advisory Operations</span>
                        <span className="px-3 py-1">Lifecycle & value</span>
                    </div>
                    <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl mb-6">
                        <Head icon={Users} title="Customer 360°" sub="Each organization becomes a longitudinal commercial record." />
                        <List rows={data.crm.customer360} cols={['company', 'role', 'verification', 'plan', 'rfqs', 'introductions', 'trades', 'lifetimeValue', 'lastSeen']} />
                    </section>
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                            <Head icon={Target} title="Lead Management" sub="Lead score combines identity, engagement, demand and transaction signals." />
                            <List rows={data.crm.leads} cols={['company', 'role', 'stage', 'score', 'source', 'nextAction']} />
                        </div>
                        <div className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                            <Head icon={Activity} title="Advisory Operations" sub="Tasks for sales/advisory teams to turn intelligence into action." />
                            <List rows={data.crm.advisory} cols={['company', 'priority', 'reason', 'owner', 'nextAction']} />
                        </div>
                    </section>
                </>
            )}

            {tab === 'Traffic' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                        <Kpi label="Page Views" value={data.traffic.pageViews} sub="all tracked page views" icon={Eye} />
                        <Kpi label="Unique Visitors" value={data.traffic.uniqueVisitors} sub="visitor IDs" icon={Users} />
                        <Kpi label="Sessions" value={data.traffic.sessions} sub="session starts" icon={Activity} />
                        <Kpi label="Login Events" value={data.traffic.logins} sub="successful auth signals" icon={ShieldCheck} />
                        <Kpi label="CTA Clicks" value={data.traffic.ctaClicks} sub="Try Free + key CTAs" icon={Target} />
                        <Kpi label="Conversion" value={`${data.traffic.conversionRate}%`} sub="login / unique visitors" icon={TrendingUp} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                            <Head icon={BarChart3} title="Pages & Journeys" sub="Where visitors spend attention" />
                            <List rows={data.traffic.topPages} cols={['page', 'views', 'uniqueVisitors']} />
                        </section>
                        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                            <Head icon={TrendingUp} title="Acquisition Sources" sub="Referrer and campaign intelligence" />
                            <List rows={data.traffic.sources} cols={['source', 'visits', 'qualified']} />
                        </section>
                    </div>
                    <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                        <Head icon={Activity} title="Recent Events" sub="Every captured public and authenticated interaction is stored as an event." />
                        <List rows={data.traffic.recentEvents} cols={['event', 'page', 'visitorId', 'userId', 'createdAt']} />
                    </section>
                </>
            )}

            {tab === 'Users' && (
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                    <Head icon={Users} title="User Database" sub="Registered accounts, roles, plans, verification and activity." />
                    <List rows={data.users.rows} cols={['name', 'email', 'company', 'role', 'verification', 'plan', 'createdAt', 'lastSeen']} />
                </section>
            )}

            {tab === 'Captured Data' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                        <Kpi label="Analytics Events" value={data.captured.analyticsEvents} sub="traffic + interaction events" icon={Activity} />
                        <Kpi label="Profiles" value={data.captured.profiles} sub="organization records" icon={Users} />
                        <Kpi label="RFQs" value={data.captured.rfqs} sub="demand records" icon={Target} />
                        <Kpi label="Introductions" value={data.captured.introductions} sub="controlled referrals" icon={ShieldCheck} />
                        <Kpi label="Quotes" value={data.captured.quotes} sub="commercial submissions" icon={CircleDollarSign} />
                        <Kpi label="Audit Records" value={data.captured.audit} sub="governance events" icon={FileCheck2} />
                    </div>
                    <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                        <Head icon={Database} title="Data Inventory" sub="Tables currently feeding Tradevance intelligence." />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.captured.inventory.map((x: any) => (
                                <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-5 flex flex-col gap-1" key={x.table}>
                                    <b className="text-white font-mono text-sm">{x.table}</b>
                                    <span className="text-[#c29631] text-xs font-bold">{x.records.toLocaleString()} records</span>
                                    <small className="text-[#75818d] mt-2 block">{x.use}</small>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}

            {tab === 'Advisory Operations' && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                            <Head icon={ShieldCheck} title="Verification Queue" sub="Profiles requiring review before transaction access." />
                            <List rows={data.verification.queue} cols={['company', 'role', 'status', 'submitted']} />
                        </section>
                        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                            <Head icon={Activity} title="AI Operations" sub="Governed agent activity and decision packets." />
                            <List rows={data.advisory.agents} cols={['agent', 'status', 'authority', 'runs']} />
                        </section>
                    </div>
                    <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                        <Head icon={BriefcaseBusiness} title="Commercial Exceptions" sub="Active deals needing human attention." />
                        <List rows={data.advisory.exceptions} cols={['id', 'type', 'priority', 'action']} />
                    </section>
                </>
            )}

            {tab === 'Growth Copilot' && (
                <>
                    <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-xl p-8 shadow-xl mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                        <div className="relative z-10">
                            <Head icon={Sparkles} title="AI Growth & Revenue Copilot" sub="Ask the operator AI about acquisition, customers, verification, RFQs, revenue and the biggest next actions." />
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {['Where is the biggest conversion leak right now?', 'Which customer segments are most valuable to prioritize?', 'What should Tradevance do next to increase qualified RFQs?', 'Which operational risks could reduce revenue?'].map(x => (
                                    <button 
                                        className="bg-[#0c131b] hover:bg-[#131c26] border border-[#202b36] hover:border-blue-500/50 text-[#75818d] hover:text-white px-4 py-2 rounded-full text-xs transition-all"
                                        key={x} 
                                        onClick={() => { setQ(x); ask(x); }}
                                    >
                                        {x}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input 
                                    className="flex-1 bg-[#0c131b] border border-[#202b36] focus:border-blue-500 text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                                    value={q} 
                                    onChange={e => setQ(e.target.value)} 
                                    onKeyDown={e => { if (e.key === 'Enter') ask(); }} 
                                    placeholder="Ask a strategic question about Tradevance…" 
                                />
                                <button 
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-[#202b36] disabled:text-[#75818d] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all shrink-0 shadow-lg shadow-blue-500/20 disabled:shadow-none"
                                    onClick={() => ask()} 
                                    disabled={thinking || !q.trim()}
                                >
                                    {thinking ? 'Analyzing…' : 'Ask Growth Copilot'} <ArrowRight size={16} />
                                </button>
                            </div>
                            
                            {answer && (
                                <div className="mt-8 bg-blue-900/10 border border-blue-500/20 rounded-xl p-6">
                                    <div className="flex items-center gap-2 text-blue-400 font-bold mb-4">
                                        <Sparkles size={16} /> Tradevance assessment
                                    </div>
                                    <pre className="text-[#eef2f6] text-sm whitespace-pre-wrap font-sans leading-relaxed">{answer}</pre>
                                </div>
                            )}
                        </div>
                    </section>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                            <Head icon={TrendingUp} title="Revenue lens" sub="Observed platform economics, not forecasted revenue." />
                            <div className="flex flex-col gap-3">
                                <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-4 flex justify-between items-center">
                                    <b className="text-white text-sm">Current trade value</b>
                                    <span className="text-blue-400 font-mono font-bold">{String(data.revenue.tradeValue)}</span>
                                </div>
                                <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-4 flex justify-between items-center">
                                    <b className="text-white text-sm">Active trades</b>
                                    <span className="text-[#eef2f6] font-mono">{data.revenue.activeTrades}</span>
                                </div>
                                <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-4 flex justify-between items-center">
                                    <b className="text-white text-sm">Revenue signals</b>
                                    <span className="text-[#eef2f6] font-mono">{data.revenue.revenueSignals}</span>
                                </div>
                            </div>
                        </section>
                        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                            <Head icon={Target} title="Funnel lens" sub="Where users are moving toward commercial value." />
                            <div className="flex flex-col gap-3">
                                <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-4 flex justify-between items-center">
                                    <b className="text-white text-sm">Unique visitors</b>
                                    <span className="text-[#eef2f6] font-mono">{data.traffic.uniqueVisitors}</span>
                                </div>
                                <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-4 flex justify-between items-center">
                                    <b className="text-white text-sm">Open RFQs</b>
                                    <span className="text-[#eef2f6] font-mono">{data.funnel.openRfqs}</span>
                                </div>
                                <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-4 flex justify-between items-center">
                                    <b className="text-white text-sm">Verified accounts</b>
                                    <span className="text-[#eef2f6] font-mono">{data.users.verified}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </>
            )}

            {tab === 'Execution Intelligence' && (
                <section className="bg-[#070b10] flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-xl p-8 shadow-xl">
                        <Head icon={CircleDollarSign} title="Execution Intelligence & Revenue Opportunity" sub="Risk-adjusted economics, approval readiness and monetization opportunities derived only from persisted operational data." />
                        
                        {executionLoading ? (
                            <div className="flex items-center justify-center py-12 text-[#75818d] text-sm gap-2 animate-pulse">
                                <RefreshCw size={16} className="animate-spin" /> Calculating live execution intelligence…
                            </div>
                        ) : executionData ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                                    <Kpi label="Risk-adjusted Deal Value" value={executionData.dealEconomics.riskAdjustedValue} sub="planning value after risk" icon={Target} />
                                    <Kpi label="Margin Ready" value={executionData.dealEconomics.marginReady} sub={`${executionData.dealEconomics.marginMissingCostBasis} missing cost basis`} icon={TrendingUp} />
                                    <Kpi label="Illustrative Fee Opp" value={executionData.revenueOpportunity.illustrativeTransactionFeeOpportunity} sub={`assumption ${executionData.revenueOpportunity.illustrativeTransactionFeeRate * 100}%`} icon={CircleDollarSign} />
                                    <Kpi label="Subscription Upside / Mo" value={executionData.revenueOpportunity.subscriptionUpgradeMonthly} sub="premium-plan opportunity" icon={Users} />
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                                    <section className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5">
                                        <Head icon={BriefcaseBusiness} title="Deal Action Queue" sub="What needs to happen before a deal can progress." />
                                        <List rows={executionData.rows.slice(0, 20)} cols={['id', 'type', 'company', 'value', 'riskScore', 'decision', 'action', 'approval']} />
                                    </section>
                                    <section className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5">
                                        <Head icon={TrendingUp} title="Subscription Opportunity" sub="Free-plan accounts with a defined premium upgrade path." />
                                        <List rows={executionData.revenueOpportunity.subscriptionUpgradeRows} cols={['company', 'role', 'currentPlan', 'recommendedPlan', 'monthlyUpside', 'action']} />
                                    </section>
                                </div>
                                
                                <section className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 mt-6">
                                    <Head icon={FileCheck2} title="Economics Readiness" sub="Gross margin is shown only when a real acquisition-cost basis exists." />
                                    <List rows={executionData.rows.slice(0, 20).map((x: any) => ({ id: x.id, type: x.type, company: x.company, value: x.value, marginReadiness: x.marginReadiness, margin: x.margin === null ? '—' : x.margin, marginPct: x.marginPct === null ? '—' : x.marginPct + '%' }))} cols={['id', 'type', 'company', 'value', 'marginReadiness', 'margin', 'marginPct']} />
                                </section>
                                
                                <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <b className="text-white text-sm">Actual Trade Value</b>
                                        <span className="text-[#c29631] font-mono text-lg">{executionData.actual.tradeValue}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <b className="text-white text-sm">Paid-plan Signals</b>
                                        <span className="text-[#eef2f6] font-mono text-lg">{executionData.actual.paidPlanSignals}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <b className="text-white text-sm">Revenue recognition</b>
                                        <span className="text-[#75818d] text-xs">Not asserted — payment processor not connected</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <b className="text-white text-sm">Fee opportunity basis</b>
                                        <span className="text-[#75818d] text-xs">{executionData.revenueOpportunity.note}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm mt-6">Execution Intelligence is temporarily unavailable.</div>
                        )}
                    </div>
                    
                    <section className="bg-[#101922] border border-blue-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                        <div className="relative z-10">
                            <Head icon={Sparkles} title="AI Trade Execution & Negotiation Intelligence" sub="Generate a structured negotiation strategy for a persisted Quote or Trade. AI cannot execute, send, approve or commit anything." />
                            
                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <select 
                                    className="bg-[#0c131b] border border-[#202b36] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
                                    value={negType} 
                                    onChange={e => setNegType(e.target.value)}
                                >
                                    <option value="quote">Quote</option>
                                    <option value="trade">Trade</option>
                                </select>
                                <input 
                                    className="flex-1 bg-[#0c131b] border border-[#202b36] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 font-mono"
                                    value={negId} 
                                    onChange={e => setNegId(e.target.value)} 
                                    placeholder="Enter persisted deal ID…"
                                />
                                <button 
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-[#202b36] disabled:text-[#75818d] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all shrink-0 shadow-lg shadow-blue-500/20 disabled:shadow-none"
                                    onClick={generateNegotiation} 
                                    disabled={negBusy || !negId.trim()}
                                >
                                    {negBusy ? 'Generating…' : 'Generate Strategy'} <Sparkles size={16} />
                                </button>
                            </div>
                            
                            {negResult && (
                                <div className={`mt-6 rounded-xl p-6 border ${negResult.error ? 'bg-red-500/10 border-red-500/20' : 'bg-[#0c131b] border-blue-500/30'}`}>
                                    <div className={`flex items-center gap-2 font-bold mb-4 ${negResult.error ? 'text-red-400' : 'text-blue-400'}`}>
                                        <ShieldCheck size={16} /> {negResult.error ? 'Strategy unavailable' : 'Structured negotiation strategy'}
                                    </div>
                                    <pre className="text-[#eef2f6] text-xs whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto p-4 bg-[#070b10] rounded-lg border border-[#202b36]">
                                        {JSON.stringify(negResult.error ? { error: negResult.error } : negResult.strategy || negResult, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </section>
                </section>
            )}

            {tab === 'Data Connectivity' && <GlobalDataConnectivity />}
            {tab === 'Trust & Compliance' && <TrustCompliance />}

            {tab === 'Release Audit' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                        <Head icon={ShieldCheck} title="Release readiness audit" sub="Current evidence from deployed QA plus explicit production integration gaps." />
                        <div className="flex flex-col gap-3 mt-6">
                            {auditRows.map(x => (
                                <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" key={x.area}>
                                    <div>
                                        <b className="text-white text-sm block mb-1">{x.area}</b>
                                        <span className="text-[#75818d] text-xs">{x.note}</span>
                                    </div>
                                    <label className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase shrink-0 border ${
                                        x.status === 'PASS' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                        x.status === 'BLOCKED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                        'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                    }`}>
                                        {x.status}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                        <Head icon={Database} title="What still blocks global production scale" sub="These are infrastructure/integration gaps, not hidden UI tasks." />
                        <div className="flex flex-col gap-4 mt-6">
                            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-5 flex flex-col gap-1">
                                <b className="text-red-400 text-sm">Automated E2E</b>
                                <span className="text-[#eef2f6] text-xs">Not available in current AppDeploy environment.</span>
                            </div>
                            <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-5 flex flex-col gap-1">
                                <b className="text-orange-400 text-sm">Licensed KYB / UBO / sanctions</b>
                                <span className="text-[#eef2f6] text-xs">Provider integration required.</span>
                            </div>
                            <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-5 flex flex-col gap-1">
                                <b className="text-orange-400 text-sm">Live trade/shipment feeds</b>
                                <span className="text-[#eef2f6] text-xs">Licensed source integration required.</span>
                            </div>
                            <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-5 flex flex-col gap-1">
                                <b className="text-orange-400 text-sm">Billing / payment rails</b>
                                <span className="text-[#eef2f6] text-xs">Production processor integration required.</span>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {selected && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSelected(null)}>
                    <aside className="w-full max-w-lg bg-[#101922] border-l border-[#202b36] h-full shadow-2xl flex flex-col animate-in slide-in-from-right" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-[#202b36] flex justify-between items-start">
                            <div>
                                <div className="text-[#c29631] text-[10px] font-bold tracking-widest uppercase mb-1">RECORD DETAIL</div>
                                <h3 className="text-xl font-bold text-white truncate pr-4">{selected.company || selected.name || selected.id || selected.event}</h3>
                            </div>
                            <button className="text-[#75818d] hover:text-white bg-[#0c131b] hover:bg-[#202b36] rounded-lg p-2 transition-colors shrink-0" onClick={() => setSelected(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto">
                            <pre className="text-[#eef2f6] text-xs font-mono bg-[#0c131b] border border-[#202b36] rounded-xl p-5 whitespace-pre-wrap break-words">
                                {JSON.stringify(selected, null, 2)}
                            </pre>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}

function Head({ icon: Icon, title, sub }: any) {
    return (
        <div className="flex items-start gap-4 mb-6 pb-4 border-b border-[#202b36]">
            <div className="bg-[#0c131b] text-blue-400 p-2.5 rounded-lg border border-[#202b36] shrink-0">
                <Icon size={18} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                <p className="text-[#75818d] text-xs leading-relaxed max-w-lg">{sub}</p>
            </div>
        </div>
    );
}