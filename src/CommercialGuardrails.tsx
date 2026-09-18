import React, { useMemo, useState } from 'react';
import { AlertTriangle, Calculator, CircleDollarSign, ShieldCheck, Target } from 'lucide-react';

export default function CommercialGuardrails() {
    const [base, setBase] = useState('1200');
    const [freight, setFreight] = useState('85');
    const [insurance, setInsurance] = useState('8');
    const [finance, setFinance] = useState('12');
    const [risk, setRisk] = useState('18');
    const [margin, setMargin] = useState('8');
    const [concession, setConcession] = useState('2');

    const calc = useMemo(() => {
        const n = (v: string) => Math.max(0, Number(v) || 0);
        const landed = n(base) + n(freight) + n(insurance) + n(finance);
        const adjusted = landed * (1 + n(risk) / 100);
        return {
            landed,
            adjusted,
            target: adjusted * (1 + n(margin) / 100),
            floor: adjusted,
            walkaway: adjusted * (1 + n(concession) / 100)
        };
    }, [base, freight, insurance, finance, risk, margin, concession]);

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                        <Calculator size={14} /> COMMERCIAL GUARDRAIL ENGINE
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Know the economics before you negotiate.</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">Deterministic planning boundaries. No live market price is implied.</p>
                </div>
                <div className="bg-[#101922] border border-[#202b36] text-[#c29631] px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold shrink-0">
                    <ShieldCheck size={14} /> Material commitments require human approval
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-xl p-8 shadow-xl flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-[#202b36] pb-4">
                        <Target size={20} className="text-[#c29631]" /> Economic assumptions
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 flex-1">
                        {[
                            ['Base supplier price', base, setBase, '$'],
                            ['Freight', freight, setFreight, '$'],
                            ['Insurance', insurance, setInsurance, '$'],
                            ['Finance cost', finance, setFinance, '$'],
                            ['Risk adjustment %', risk, setRisk, '%'],
                            ['Target margin %', margin, setMargin, '%'],
                            ['Max concession %', concession, setConcession, '%']
                        ].map(([label, value, setter, unit]) => (
                            <label key={String(label)} className="flex flex-col gap-1.5">
                                <span className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase ml-1">{String(label)}</span>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        min="0" 
                                        step="0.01" 
                                        value={String(value)} 
                                        onChange={e => (setter as any)(e.target.value)}
                                        className="w-full bg-[#0c131b] border border-[#202b36] focus:border-blue-500 rounded-lg px-4 py-2.5 text-white font-mono text-sm outline-none transition-colors"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4f5b67] font-mono text-xs">{unit}</span>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex items-start gap-3 mt-auto">
                        <AlertTriangle size={16} className="text-orange-400 shrink-0 mt-0.5" />
                        <span className="text-orange-200/80 text-xs leading-relaxed">Planning assumptions only; not live market prices or legal/compliance determinations.</span>
                    </div>
                </section>

                <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-xl p-8 shadow-xl flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 border-b border-[#202b36] pb-4">
                        <CircleDollarSign size={20} className="text-[#c29631]" /> Decision boundaries
                    </h3>
                    
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 flex justify-between items-center">
                            <small className="text-[#75818d] text-xs font-bold tracking-widest uppercase">Landed</small>
                            <strong className="text-white text-xl font-mono">${calc.landed.toFixed(2)}</strong>
                        </div>
                        
                        <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 flex justify-between items-center">
                            <small className="text-[#75818d] text-xs font-bold tracking-widest uppercase">Risk-adjusted</small>
                            <strong className="text-white text-xl font-mono">${calc.adjusted.toFixed(2)}</strong>
                        </div>
                        
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 flex justify-between items-center shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                            <small className="text-blue-400 text-sm font-bold tracking-widest uppercase">Target</small>
                            <strong className="text-white text-3xl font-mono">${calc.target.toFixed(2)}</strong>
                        </div>
                        
                        <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 flex justify-between items-center">
                            <small className="text-[#75818d] text-xs font-bold tracking-widest uppercase">Floor</small>
                            <strong className="text-white text-xl font-mono">${calc.floor.toFixed(2)}</strong>
                        </div>
                        
                        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5 flex justify-between items-center">
                            <small className="text-red-400 text-xs font-bold tracking-widest uppercase">Walk-away</small>
                            <strong className="text-red-400 text-xl font-mono">${calc.walkaway.toFixed(2)}</strong>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
