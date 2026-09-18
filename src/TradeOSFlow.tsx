import React from 'react';
import { BadgeCheck, BrainCircuit, CheckCircle2, CircleDollarSign, FileCheck2, Globe2, Layers3, PackageSearch, Route, ShieldCheck, Sparkles, Target } from 'lucide-react';

const steps = [
    ['Discover', 'Find demand and supply', Globe2],
    ['Verify', 'Identity, evidence and trust', BadgeCheck],
    ['Match', 'Fit, risk and commercial signal', Target],
    ['Deal', 'RFQ, quote and negotiation', Sparkles],
    ['Finance', 'Payment and funding readiness', CircleDollarSign],
    ['Ship', 'Logistics and execution', Route],
    ['Settle', 'Documents and delivery', FileCheck2],
    ['Learn', 'Outcomes improve the network', BrainCircuit]
] as const;

export default function TradeOSFlow() {
    return (
        <section className="bg-[#101922] border border-[#202b36] rounded-2xl p-8 my-8 shadow-xl" aria-label="Tradevance end-to-end Trade OS workflow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-3">
                        <Layers3 size={14} /> TRADEVANCE TRADE OS
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">One operating path from opportunity to outcome.</h3>
                    <p className="text-[#75818d] text-sm">AI finds the opportunity. Verification builds trust. Human-approved controls keep the transaction safe.</p>
                </div>
                <div className="bg-[#0c131b] border border-[#202b36] text-[#c29631] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shrink-0">
                    <ShieldCheck size={16} /> Governed end-to-end
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 relative mb-12">
                {/* Connector line for desktop */}
                <div className="hidden lg:block absolute top-6 left-6 right-6 h-0.5 bg-[#202b36] z-0" aria-hidden="true" />
                
                {steps.map(([label, sub, Icon], i) => (
                    <div className="relative z-10 flex lg:flex-col items-center gap-4 lg:gap-3 lg:w-32 group" key={label}>
                        {/* Mobile connector line */}
                        {i < steps.length - 1 && (
                            <div className="lg:hidden absolute left-6 top-14 bottom-[-1rem] w-0.5 bg-[#202b36] z-[-1]" aria-hidden="true" />
                        )}
                        
                        <div className="w-12 h-12 rounded-xl bg-[#0c131b] border-2 border-[#202b36] flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-colors relative shrink-0">
                            <span className="absolute -top-2 -right-2 text-[9px] font-mono font-bold bg-[#101922] text-[#75818d] px-1 py-0.5 rounded border border-[#202b36]">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <Icon size={20} className="text-[#75818d] group-hover:text-blue-400 transition-colors" />
                            
                            {i < steps.length - 1 && (
                                <CheckCircle2 size={14} className="hidden lg:block absolute -right-6 lg:right-[-2rem] top-1/2 -translate-y-1/2 text-[#202b36] bg-[#101922] z-20" />
                            )}
                        </div>
                        
                        <div className="lg:text-center">
                            <b className="block text-sm text-white mb-1 group-hover:text-blue-400 transition-colors">{label}</b>
                            <small className="block text-[10px] text-[#75818d] leading-tight max-w-[120px]">{sub}</small>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap md:flex-nowrap justify-between gap-4 pt-6 border-t border-[#202b36]">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#75818d] uppercase tracking-widest w-1/2 md:w-auto">
                    <PackageSearch size={14} className="text-blue-400" /> Buyer + Seller network
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#75818d] uppercase tracking-widest w-1/2 md:w-auto">
                    <BadgeCheck size={14} className="text-[#c29631]" /> Evidence-backed identity
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#75818d] uppercase tracking-widest w-1/2 md:w-auto">
                    <BrainCircuit size={14} className="text-purple-400" /> AI decision support
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#75818d] uppercase tracking-widest w-1/2 md:w-auto">
                    <ShieldCheck size={14} className="text-green-500" /> Human approval required
                </div>
            </div>
        </section>
    );
}