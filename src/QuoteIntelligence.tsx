import React, { useState } from 'react';
import { api } from '@appdeploy/client';
import { ArrowRight, BarChart3, CircleDollarSign, FileCheck2, Sparkles, Target, AlertTriangle } from 'lucide-react';

type Quote = { supplier: string; product: string; currency: string; unit: string; price: number; freight: number; insurance: number; payment: string; incoterm: string; leadTime: string };

export default function QuoteIntelligence({ onNavigate }: { onNavigate?: (section: string) => void }) {
    const [targetPrice, setTargetPrice] = useState('');
    const [product, setProduct] = useState('');
    const [quotes, setQuotes] = useState<Quote[]>([
        { supplier: '', product: '', currency: 'USD', unit: 'MT', price: 0, freight: 0, insurance: 0, payment: '', incoterm: '', leadTime: '' },
        { supplier: '', product: '', currency: 'USD', unit: 'MT', price: 0, freight: 0, insurance: 0, payment: '', incoterm: '', leadTime: '' },
        { supplier: '', product: '', currency: 'USD', unit: 'MT', price: 0, freight: 0, insurance: 0, payment: '', incoterm: '', leadTime: '' }
    ]);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const update = (i: number, k: keyof Quote, v: any) => setQuotes(q => q.map((x, n) => n === i ? { ...x, [k]: k === 'price' || k === 'freight' || k === 'insurance' ? Number(v) : v } : x));

    const analyze = async () => {
        setError('');
        setResult(null);
        if (!product.trim() || !quotes.some(q => q.supplier.trim() && q.price > 0)) {
            setError('Enter a commodity and at least one quote with supplier and base price before analysis.');
            return;
        }
        setLoading(true);
        try {
            const r = await api.post('/api/quotes/analyze', { product, targetPrice: targetPrice ? Number(targetPrice) : 0, quotes });
            setResult(r.data);
        } catch (e: any) {
            setError(e?.response?.data?.error || 'Quote analysis is temporarily unavailable. No commercial record was changed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                        <BarChart3 size={14} /> QUOTE INTELLIGENCE
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Normalize. Compare. Negotiate.</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">Convert supplier quotations into a comparable landed-cost view before you negotiate or award.</p>
                </div>
                <button 
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-[#202b36] disabled:text-[#75818d] text-white px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-bold transition-all"
                    onClick={analyze} 
                    disabled={loading}
                >
                    <Sparkles size={16} className={loading ? 'animate-pulse' : ''} />
                    {loading ? 'Analyzing…' : 'Analyze Quotes'}
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl mb-8 flex items-start gap-3 text-sm">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#101922] border border-[#202b36] p-4 rounded-xl">
                    <label className="block text-[10px] text-[#75818d] font-bold tracking-widest uppercase mb-2">Commodity</label>
                    <input 
                        className="w-full bg-[#0c131b] border border-[#202b36] focus:border-blue-500 rounded-lg px-4 py-2 text-white outline-none transition-colors"
                        value={product} 
                        onChange={e => setProduct(e.target.value)} 
                        placeholder="e.g. Sulphur" 
                    />
                </div>
                <div className="bg-[#101922] border border-[#202b36] p-4 rounded-xl">
                    <label className="block text-[10px] text-[#75818d] font-bold tracking-widest uppercase mb-2">Target landed cost / MT</label>
                    <input 
                        className="w-full bg-[#0c131b] border border-[#202b36] focus:border-blue-500 rounded-lg px-4 py-2 text-white outline-none transition-colors"
                        value={targetPrice} 
                        onChange={e => setTargetPrice(e.target.value)} 
                        placeholder="Optional target price" 
                    />
                </div>
            </div>

            <section className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden mb-8 shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#202b36] bg-[#0c131b]">
                                <th className="px-6 py-4 text-[10px] text-[#75818d] font-bold tracking-widest uppercase w-[20%]">Supplier</th>
                                <th className="px-4 py-4 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Base</th>
                                <th className="px-4 py-4 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Freight</th>
                                <th className="px-4 py-4 text-[10px] text-[#75818d] font-bold tracking-widest uppercase">Insurance</th>
                                <th className="px-4 py-4 text-[10px] text-[#75818d] font-bold tracking-widest uppercase w-[15%]">Payment</th>
                                <th className="px-4 py-4 text-[10px] text-[#75818d] font-bold tracking-widest uppercase w-[15%]">Incoterm</th>
                                <th className="px-4 py-4 text-[10px] text-[#75818d] font-bold tracking-widest uppercase w-[15%]">Lead Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotes.map((q, i) => (
                                <tr key={q.supplier || i} className="border-b border-[#202b36] hover:bg-[#131c26] transition-colors">
                                    <td className="px-4 py-3">
                                        <input 
                                            className="w-full bg-transparent border border-transparent hover:border-[#202b36] focus:border-blue-500 rounded px-2 py-1 text-sm text-white outline-none transition-colors"
                                            value={q.supplier} 
                                            placeholder="Supplier name" 
                                            onChange={e => update(i, 'supplier', e.target.value)} 
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input 
                                            type="number" min="0" 
                                            className="w-full bg-transparent border border-transparent hover:border-[#202b36] focus:border-blue-500 rounded px-2 py-1 text-sm text-blue-400 font-mono outline-none transition-colors"
                                            value={q.price || ''} 
                                            placeholder="0" 
                                            onChange={e => update(i, 'price', e.target.value)} 
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input 
                                            type="number" min="0" 
                                            className="w-full bg-transparent border border-transparent hover:border-[#202b36] focus:border-blue-500 rounded px-2 py-1 text-sm text-white font-mono outline-none transition-colors"
                                            value={q.freight || ''} 
                                            placeholder="0" 
                                            onChange={e => update(i, 'freight', e.target.value)} 
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input 
                                            type="number" min="0" 
                                            className="w-full bg-transparent border border-transparent hover:border-[#202b36] focus:border-blue-500 rounded px-2 py-1 text-sm text-white font-mono outline-none transition-colors"
                                            value={q.insurance || ''} 
                                            placeholder="0" 
                                            onChange={e => update(i, 'insurance', e.target.value)} 
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input 
                                            className="w-full bg-transparent border border-transparent hover:border-[#202b36] focus:border-blue-500 rounded px-2 py-1 text-xs text-white outline-none transition-colors"
                                            value={q.payment} 
                                            placeholder="Payment terms" 
                                            onChange={e => update(i, 'payment', e.target.value)} 
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input 
                                            className="w-full bg-transparent border border-transparent hover:border-[#202b36] focus:border-blue-500 rounded px-2 py-1 text-xs text-white outline-none transition-colors"
                                            value={q.incoterm} 
                                            placeholder="CIF / FOB" 
                                            onChange={e => update(i, 'incoterm', e.target.value)} 
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <input 
                                            className="w-full bg-transparent border border-transparent hover:border-[#202b36] focus:border-blue-500 rounded px-2 py-1 text-xs text-white outline-none transition-colors"
                                            value={q.leadTime} 
                                            placeholder="e.g. 25 days" 
                                            onChange={e => update(i, 'leadTime', e.target.value)} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-xl overflow-hidden shadow-xl">
                        <div className="p-8 border-b border-[#202b36] flex flex-col md:flex-row justify-between md:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold tracking-widest uppercase mb-3">
                                    <Target size={14} /> BEST LANDED COST
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">{result.best.supplier}</h3>
                                <p className="text-[#c29631] font-mono text-xl">{result.best.landedCost.toFixed(2)} {result.best.currency} / {result.best.unit}</p>
                            </div>
                            <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-4 flex items-center gap-3 shrink-0">
                                <CircleDollarSign size={24} className={result.best.deltaPercent === null ? 'text-[#75818d]' : (result.best.deltaPercent > 0 ? 'text-red-500' : 'text-green-500')} />
                                <span className="font-mono text-lg font-bold">
                                    {result.best.deltaPercent === null ? 'No target' : `${result.best.deltaPercent > 0 ? '+' : ''}${result.best.deltaPercent}% vs target`}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#070b10]">
                            {result.normalized.map((r: any) => (
                                <div className={`border rounded-xl p-5 ${r.supplier === result.best.supplier ? 'bg-green-500/5 border-green-500/30' : 'bg-[#101922] border-[#202b36]'}`} key={r.supplier}>
                                    <b className="block text-white mb-2">{r.supplier}</b>
                                    <span className={`block font-mono text-lg mb-4 ${r.supplier === result.best.supplier ? 'text-green-400' : 'text-blue-400'}`}>
                                        Landed {r.landedCost.toFixed(2)} {r.currency}/{r.unit}
                                    </span>
                                    <small className="block text-[#75818d] text-xs mb-3">{r.payment || 'Payment not stated'} · {r.incoterm || 'Incoterm not stated'} · {r.leadTime || 'Lead time not stated'}</small>
                                    {r.flags?.length > 0 && (
                                        <em className="block text-[10px] text-[#c29631] font-bold uppercase tracking-widest not-italic bg-[#c29631]/10 px-2 py-1 rounded w-fit">
                                            {r.flags.join(' · ')}
                                        </em>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-3">
                                <Sparkles size={14} /> COMMERCIAL GUIDANCE
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Next move</h3>
                            <p className="text-[#eef2f6] text-sm leading-relaxed mb-6 max-w-3xl">{result.negotiation}</p>
                            
                            <div className="flex flex-wrap items-center gap-4">
                                <button 
                                    className="bg-[#0c131b] hover:bg-[#131c26] border border-[#202b36] hover:border-[#4f5b67] text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all"
                                    onClick={() => onNavigate?.('RFQ & Tenders')}
                                >
                                    <FileCheck2 size={15} /> Prepare RFQ follow-up
                                </button>
                                <button 
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                                    onClick={() => onNavigate?.('Trade Room')}
                                >
                                    Open Trade Room <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
