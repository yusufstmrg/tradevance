import React, { useEffect, useState } from 'react';
import { api } from '@appdeploy/client';
import { ArrowRight, CheckCircle2, CircleDollarSign, FileCheck2, GitBranch, Handshake, LockKeyhole, MessageSquareText, ShieldCheck, Ship, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

type Quote = { id: string; tradeId?: string; supplier: string; product: string; quantity: number; currency: string; unit: string; price: number; freight: number; insurance: number; landedCost: number; payment: string; incoterm: string; status: string };
type Trade = { id: string; product: string; buyer: string; supplier: string; qty: number; value: number; status: string; risk: number };

const money = (n: number) => '$' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
const stages = ['RFQ', 'Quotes', 'Negotiation', 'Approval', 'Contract', 'Finance', 'Logistics', 'Settlement'];

export default function ExecutionCenter() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [selected, setSelected] = useState('');
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState<any>(null);
    const [roomBusy, setRoomBusy] = useState(false);
    const [objective, setObjective] = useState('Maximize probability of closing while protecting commercial downside.');
    const [strategy, setStrategy] = useState<any>(null);
    const [approvalReason, setApprovalReason] = useState('');
    const [learning, setLearning] = useState<any>({ outcome: 'won', actualClosePrice: '', reason: '', notes: '' });

    const load = async () => {
        try {
            const r = await api.get('/api/execution');
            const ts = r.data.trades || [];
            setTrades(ts);
            setQuotes(r.data.quotes || []);
            if (!selected && ts[0]?.id) setSelected(ts[0].id);
        } catch {
            setMessage('Execution data could not be loaded.');
        }
    };

    const loadRoom = async (id = selected) => {
        if (!id) return;
        setRoomBusy(true);
        try {
            const r = await api.get('/api/trade-room/' + id);
            setRoom(r.data);
        } catch {
            setRoom(null);
            setMessage('Trade Room is unavailable for this trade.');
        } finally {
            setRoomBusy(false);
        }
    };

    useEffect(() => { load(); }, []);
    useEffect(() => { if (selected) loadRoom(selected); }, [selected]);

    const advance = async () => {
        setBusy(true);
        try {
            const r = await api.post('/api/execution/' + selected + '/advance', {});
            setMessage('Trade advanced to ' + r.data.status + '.');
            await load();
            await loadRoom();
        } catch {
            setMessage('Trade transition failed.');
        } finally {
            setBusy(false);
        }
    };

    const decide = async (id: string, decision: 'shortlist' | 'approve' | 'reject') => {
        try {
            await api.post('/api/quotes/' + id + '/decision', { decision });
            setMessage('Quote decision saved.');
            await load();
            await loadRoom();
        } catch {
            setMessage('Quote decision failed.');
        }
    };

    const create = async () => {
        try {
            await api.post('/api/quotes', { tradeId: selected, supplier: 'Sino Alkali Materials Co.', product: 'Caustic Soda', quantity: 25000, price: 495, freight: 28, insurance: 3, payment: 'Confirmed DLC at sight', incoterm: 'CIF' });
            setMessage('New supplier quote captured and normalized.');
            await load();
            await loadRoom();
        } catch {
            setMessage('Could not capture quote.');
        }
    };

    const generateStrategy = async () => {
        setStrategy(null);
        try {
            const r = await api.post('/api/trade-room/' + selected + '/strategy', { 
                objective,
                trade: trades.find(t => t.id === selected)
            });
            setStrategy(r.data.strategy || r.data);
            setMessage('Negotiation strategy generated. No trade change was executed.');
            await loadRoom();
        } catch {
            setMessage('Strategy generation failed safely. No trade change was executed.');
        }
    };

    const approval = async (decision: 'approve' | 'escalate' | 'reject') => {
        try {
            await api.post('/api/trade-room/' + selected + '/approval', { decision, reason: approvalReason });
            setMessage('Trade Room approval decision recorded.');
            await loadRoom();
        } catch {
            setMessage('Approval was held or rejected by the risk/compliance gate.');
        }
    };

    const learn = async () => {
        try {
            await api.post('/api/trade-room/' + selected + '/learning', { outcome: learning.outcome, actualClosePrice: Number(learning.actualClosePrice || 0), reason: learning.reason, notes: learning.notes });
            setMessage('Post-trade learning captured. It is not automatically used to train models.');
            await loadRoom();
        } catch {
            setMessage('Learning capture failed safely.');
        }
    };

    const trade = trades.find(t => t.id === selected) || trades[0];
    const stageIndex = Math.max(0, stages.findIndex(x => x.toLowerCase() === String(trade?.status || 'Negotiation').toLowerCase()));

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c9a34a] text-xs font-bold tracking-widest uppercase mb-3">
                        <GitBranch size={14} /> TRANSACTION EXECUTION
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Trade Room</h2>
                    <p className="text-[#75818d] text-sm">One controlled workspace for negotiation, approvals, execution readiness and post-trade learning.</p>
                </div>
                <button 
                    className="bg-[#c29631] hover:bg-[#a37c23] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-colors disabled:opacity-50"
                    onClick={create} disabled={!selected}
                >
                    <Sparkles size={16} /> Capture Supplier Quote
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Trade Control */}
                <section className="col-span-1 xl:col-span-2 bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-[#202b36] bg-[#0c131b] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#c29631]/10 text-[#c29631] flex items-center justify-center">
                            <Handshake size={16} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white">Trade Control</h3>
                            <p className="text-xs text-[#75818d]">Select an operational trade to enter the room.</p>
                        </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col gap-6">
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {trades.map(t => (
                                <button 
                                    key={t.id} 
                                    className={`flex-shrink-0 text-left p-3 rounded-lg border transition-all min-w-[240px] ${selected === t.id ? 'bg-[#c29631]/10 border-[#c29631] text-white' : 'bg-[#070b10] border-[#202b36] text-[#75818d] hover:border-[#4f5b67]'}`}
                                    onClick={() => setSelected(t.id)}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <b className="text-sm">{t.id}</b>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${t.risk < 30 ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>Risk {t.risk}</span>
                                    </div>
                                    <span className="block text-xs font-semibold text-white mb-1">{t.product} · {t.qty.toLocaleString()} MT</span>
                                    <small className="text-[10px] uppercase tracking-wider">{t.status}</small>
                                </button>
                            ))}
                        </div>

                        {trade && (
                            <>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-[#070b10] p-4 rounded-lg border border-[#202b36]">
                                        <small className="text-[10px] text-[#75818d] font-bold tracking-wider uppercase block mb-1">VALUE</small>
                                        <b className="text-lg text-white font-mono">{money(trade.value)}</b>
                                    </div>
                                    <div className="bg-[#070b10] p-4 rounded-lg border border-[#202b36]">
                                        <small className="text-[10px] text-[#75818d] font-bold tracking-wider uppercase block mb-1">BUYER</small>
                                        <b className="text-sm text-white truncate block" title={trade.buyer}>{trade.buyer}</b>
                                    </div>
                                    <div className="bg-[#070b10] p-4 rounded-lg border border-[#202b36]">
                                        <small className="text-[10px] text-[#75818d] font-bold tracking-wider uppercase block mb-1">SUPPLIER</small>
                                        <b className="text-sm text-white truncate block" title={trade.supplier}>{trade.supplier}</b>
                                    </div>
                                    <div className="bg-[#070b10] p-4 rounded-lg border border-[#202b36]">
                                        <small className="text-[10px] text-[#75818d] font-bold tracking-wider uppercase block mb-1">RISK</small>
                                        <div className="flex items-center gap-2">
                                            <b className="text-lg text-white font-mono">{trade.risk}/100</b>
                                            {trade.risk > 50 && <AlertTriangle size={14} className="text-orange-500" />}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#070b10] p-5 rounded-lg border border-[#202b36] overflow-x-auto relative">
                                    <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-[#202b36] -translate-y-1/2 z-0"></div>
                                    <div className="flex justify-between relative z-10 min-w-[600px]">
                                        {stages.map((s, i) => (
                                            <div key={s} className="flex flex-col items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${i < stageIndex ? 'bg-green-500 text-black border-2 border-[#070b10]' : i === stageIndex ? 'bg-[#c29631] text-black border-4 border-[#070b10] shadow-[0_0_0_2px_#c29631]' : 'bg-[#101922] border-2 border-[#4f5b67] text-[#4f5b67]'}`}>
                                                    {i < stageIndex ? <CheckCircle2 size={12} /> : i + 1}
                                                </div>
                                                <b className={`text-[10px] uppercase tracking-wider ${i <= stageIndex ? 'text-white' : 'text-[#4f5b67]'}`}>{s}</b>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    className="bg-white hover:bg-gray-200 text-[#070b10] font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                                    disabled={busy || trade.status === 'Settled'} 
                                    onClick={advance}
                                >
                                    {busy ? 'Advancing Workflow...' : 'Advance Controlled Workflow'} <ArrowRight size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </section>

                {/* Post-Trade Readiness (Moved up for better grid fit) */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-[#202b36] bg-[#0c131b] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <FileCheck2 size={16} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white">Execution Readiness</h3>
                            <p className="text-xs text-[#75818d]">Required documents and compliance</p>
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col gap-2">
                        {[
                            ['SPA / Contract', 'Commercial terms aligned', true],
                            ['COA / Quality', 'Specification evidence', true],
                            ['LC / Payment', 'Instrument readiness', false],
                            ['Inspection', 'Independent inspection', false],
                            ['Bill of Lading', 'Shipment document', false],
                            ['Settlement', 'Delivery confirmation', trade?.status === 'Settled']
                        ].map(x => (
                            <div className="flex justify-between items-center p-3 rounded-lg bg-[#070b10] border border-[#202b36]" key={x[0] as string}>
                                <div>
                                    <b className="text-xs text-white block">{x[0] as string}</b>
                                    <span className="text-[10px] text-[#75818d]">{x[1] as string}</span>
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-1 rounded ${x[2] ? 'bg-green-500/10 text-green-500' : 'bg-[#202b36] text-[#75818d]'}`}>
                                    {x[2] ? 'READY' : 'PENDING'}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Quote Desk */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-[#202b36] bg-[#0c131b] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                            <CircleDollarSign size={16} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white">Quote Desk</h3>
                            <p className="text-xs text-[#75818d]">Normalized commercial offers and award decisions.</p>
                        </div>
                    </div>
                    <div className="p-5 flex flex-col gap-4">
                        {quotes.filter(q => !selected || q.tradeId === selected).length === 0 ? (
                            <div className="text-center py-8 text-[#75818d] text-sm">No quotes available for this trade.</div>
                        ) : quotes.filter(q => !selected || q.tradeId === selected).map(q => (
                            <div className="bg-[#070b10] border border-[#202b36] rounded-lg p-4" key={q.id}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <b className="text-sm text-white block">{q.supplier}</b>
                                        <span className="text-xs text-[#75818d]">{q.product} · {q.quantity.toLocaleString()} {q.unit}</span>
                                    </div>
                                    <div className="text-right">
                                        <strong className="text-lg text-white font-mono block">{money(q.landedCost)}</strong>
                                        <small className="text-[10px] text-[#75818d]">/ MT LANDED</small>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="bg-[#101922] p-2 rounded text-[10px]">
                                        <span className="text-[#4f5b67] block">Base Price</span>
                                        <span className="text-white font-mono">{money(q.price)}</span>
                                    </div>
                                    <div className="bg-[#101922] p-2 rounded text-[10px]">
                                        <span className="text-[#4f5b67] block">Freight</span>
                                        <span className="text-white font-mono">{money(q.freight)}</span>
                                    </div>
                                    <div className="bg-[#101922] p-2 rounded text-[10px]">
                                        <span className="text-[#4f5b67] block">Insurance</span>
                                        <span className="text-white font-mono">{money(q.insurance)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex gap-2">
                                        <span className="bg-[#202b36] text-[#eef2f6] px-2 py-1 rounded">{q.incoterm}</span>
                                        <span className="bg-[#202b36] text-[#eef2f6] px-2 py-1 rounded">{q.payment}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${q.status === 'Approved' ? 'text-green-500' : q.status === 'Rejected' ? 'text-red-500' : 'text-[#c29631]'}`}>{q.status}</span>
                                        {q.status !== 'Approved' && q.status !== 'Rejected' && (
                                            <>
                                                <button className="bg-white hover:bg-gray-200 text-[#070b10] px-3 py-1 rounded font-bold" onClick={() => decide(q.id, 'approve')}>Approve</button>
                                                <button className="text-[#75818d] hover:text-white px-2 py-1 rounded" onClick={() => decide(q.id, 'reject')}>Reject</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* AI Negotiation & Approval */}
                <section className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-[#202b36] bg-[#0c131b] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <MessageSquareText size={16} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white">Negotiation Copilot</h3>
                            <p className="text-xs text-[#75818d]">AI prepares strategy; human decides.</p>
                        </div>
                    </div>
                    <div className="p-5 flex flex-col gap-6">
                        <div>
                            <label className="text-[10px] font-bold text-[#75818d] uppercase tracking-wider mb-2 block">Objective</label>
                            <div className="flex gap-2">
                                <input 
                                    className="flex-1 bg-[#070b10] border border-[#202b36] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#c29631]"
                                    value={objective} onChange={e => setObjective(e.target.value)} placeholder="Negotiation objective" 
                                />
                                <button className="bg-[#202b36] hover:bg-[#4f5b67] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors disabled:opacity-50" onClick={generateStrategy} disabled={!selected}>
                                    Generate <Sparkles size={14} className="text-[#c29631]" />
                                </button>
                            </div>
                        </div>

                        {strategy && (
                            <div className="bg-[#0c131b] border border-[#c29631]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(194,150,49,0.05)]">
                                <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold mb-3">
                                    <Sparkles size={14} /> STRUCTURED STRATEGY GENERATED
                                </div>
                                <pre className="text-[10px] text-[#eef2f6] font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                                    {typeof strategy === 'string' ? strategy : JSON.stringify(strategy, null, 2)}
                                </pre>
                            </div>
                        )}

                        <div className="border-t border-[#202b36] pt-6">
                            <label className="text-[10px] font-bold text-[#75818d] uppercase tracking-wider mb-2 block">Manual Approval Gate</label>
                            <div className="flex gap-2">
                                <input 
                                    className="flex-1 bg-[#070b10] border border-[#202b36] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white"
                                    value={approvalReason} onChange={e => setApprovalReason(e.target.value)} placeholder="Approval rationale" 
                                />
                                <button className="bg-[#202b36] hover:bg-[#4f5b67] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors" onClick={() => approval('escalate')}>
                                    <LockKeyhole size={14} /> Escalate
                                </button>
                                <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors" onClick={() => approval('approve')}>
                                    <ShieldCheck size={14} /> Approve
                                </button>
                            </div>
                        </div>

                        {room?.events?.length > 0 && (
                            <div className="border-t border-[#202b36] pt-6">
                                <label className="text-[10px] font-bold text-[#75818d] uppercase tracking-wider mb-3 block">Audit Trail</label>
                                <div className="space-y-3">
                                    {(room.events || []).slice(0, 3).map((e: any) => (
                                        <div className="flex justify-between items-start text-xs bg-[#070b10] p-3 rounded-lg border border-[#202b36]" key={e.id}>
                                            <div>
                                                <b className="text-white block">{e.kind}</b>
                                                <span className="text-[#75818d]">{e.summary}</span>
                                            </div>
                                            <span className="text-[#4f5b67] text-[10px] whitespace-nowrap">{new Date(e.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Notifications */}
            {message && (
                <div className="fixed bottom-6 right-6 bg-[#0c131b] border border-[#c29631] text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50">
                    <CheckCircle2 size={18} className="text-[#c29631]" />
                    <span className="text-sm font-medium">{message}</span>
                </div>
            )}
            {roomBusy && (
                <div className="fixed bottom-6 right-6 bg-blue-900 border border-blue-500 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50">
                    <LockKeyhole size={18} className="animate-pulse" />
                    <span className="text-sm font-medium">Synchronizing Trade Room...</span>
                </div>
            )}
        </div>
    );
}
