import React, { useState } from 'react';
import { AlertTriangle, FileCheck2, Globe2, ShieldCheck } from 'lucide-react';

const docs = [
    ['Terms of Service', 'All users', 'DRAFT — NOT EFFECTIVE', 'Platform role, accounts, verification, transactions, AI, fees, IP, confidentiality, sanctions, suspension, liability and dispute framework.'],
    ['Privacy Policy', 'All users / data subjects', 'DRAFT — NOT EFFECTIVE', 'Controller/processor roles, purposes, rights, vendors, transfers, retention, security and incidents.'],
    ['Cookie & Tracking Policy', 'Public visitors / users', 'DRAFT — NOT EFFECTIVE', 'Cookies, storage, analytics, consent-aware controls and third-party tracking governance.'],
    ['Acceptable Use & Platform Rules', 'All users', 'DRAFT — NOT EFFECTIVE', 'Fraud, impersonation, sanctions evasion, export-control avoidance, falsified documents, scraping and bypass restrictions.'],
    ['Buyer & Seller Participation Agreement', 'Buyers / Sellers', 'DRAFT — NOT EFFECTIVE', 'Diligence, evidence duties, verification, RFQ/quote boundaries and underlying-contract responsibility.'],
    ['Billing, Fees, Refunds & Disputes', 'Paying users / enterprises', 'DRAFT — NOT EFFECTIVE', 'Subscriptions, transaction fees, provider charges, refunds, failed payments, disputes and reconciliation.'],
    ['AI, Data, Trust & Verification Disclaimer', 'All users / enterprises', 'DRAFT — NOT EFFECTIVE', 'AI decision-support boundaries, evidence versus inference, human approval and verification levels.'],
    ['Data Processing Addendum', 'Enterprise customers', 'DRAFT — NOT EFFECTIVE', 'Controller/processor allocation, security, subprocessors, transfers, incidents and deletion/return.'],
    ['Intellectual Property & Content Policy', 'All users / contributors', 'DRAFT — NOT EFFECTIVE', 'Platform IP, user content rights, confidentiality, feedback and infringement reporting.'],
    ['Company Legal Notice', 'Public', 'DRAFT — PUBLICATION CONTROLLED', 'Legal operator, public contact, operating location and distinction between platform claims and third-party/legal determinations.'],
    ['Security & Responsible Disclosure Policy', 'Security researchers / partners', 'DRAFT — NOT EFFECTIVE', 'Vulnerability reporting, researcher conduct, triage and safe handling.']
];

const regions = [
    ['Indonesia', 'UU PDP 27/2022 · PMSE · Bahasa Indonesia contracting requirements'],
    ['EU / EEA', 'GDPR · international transfers · data-subject rights · AI transparency where applicable'],
    ['United Kingdom', 'UK GDPR · international transfers · privacy transparency'],
    ['United States / California', 'State privacy framework including CCPA/CPRA where applicable'],
    ['AI Governance', 'Human oversight, AI transparency and governance controls; EU AI Act considered where applicable']
];

export default function LegalCenter() {
    const [sel, setSel] = useState(0);
    const d = docs[sel];

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32" data-no-translate>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                        <FileCheck2 size={14} /> TRADEVANCE LEGAL & COMPLIANCE
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Global Legal Center</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">Controlled master policies, regional coverage and publication governance for the Tradevance platform.</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 text-orange-400 p-4 rounded-xl flex items-start gap-3 max-w-sm shrink-0">
                    <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                    <div>
                        <b className="block text-sm mb-1">Publication controlled</b>
                        <span className="text-xs opacity-90 leading-relaxed block">Draft documents are not legally effective until approved, dated, localized where required and published.</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6 shadow-xl">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-3 text-[#4f5b67] shrink-0">
                            <FileCheck2 size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-1">Policy library</h3>
                            <p className="text-[#75818d] text-sm">Working framework from Tradevance Legal & Compliance Pack v1.0.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                        {docs.map((x, i) => (
                            <button 
                                type="button" 
                                key={x[0]} 
                                className={`w-full text-left p-5 rounded-xl border transition-all flex flex-col group ${
                                    sel === i 
                                        ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                                        : 'bg-[#0c131b] border-[#202b36] hover:border-[#4f5b67]'
                                }`}
                                onClick={() => setSel(i)}
                            >
                                <div className="flex justify-between items-start w-full mb-2">
                                    <div className="flex items-center gap-3">
                                        <FileCheck2 size={18} className={sel === i ? 'text-blue-400' : 'text-[#4f5b67] group-hover:text-blue-400 transition-colors'} />
                                        <h3 className={`font-bold ${sel === i ? 'text-blue-400' : 'text-white'}`}>{x[0]}</h3>
                                    </div>
                                    <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                                        {x[2]}
                                    </span>
                                </div>
                                <p className="text-[#eef2f6] text-sm leading-relaxed mb-3">{x[3]}</p>
                                <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase">Applies to: {x[1]}</small>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-xl p-8 shadow-xl sticky top-8 h-fit">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-orange-400 shrink-0">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{d[0]}</h3>
                            <p className="text-[#75818d] text-sm">Applies to: {d[1]}</p>
                        </div>
                    </div>
                    
                    <span className="inline-block bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase mb-8">
                        {d[2]}
                    </span>
                    
                    <div className="space-y-4 mb-8">
                        <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <b className="text-white text-sm block mb-1">Authoritative language</b>
                                <span className="text-[#75818d] text-sm block">English master. Machine translation is not the authoritative legal version.</span>
                            </div>
                            <label className="bg-[#202b36] text-white px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase shrink-0 w-fit">CONTROLLED</label>
                        </div>
                        <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <b className="text-white text-sm block mb-1">Publication gate</b>
                                <span className="text-[#75818d] text-sm block">Approval + effective date + final jurisdictional wording + required localization.</span>
                            </div>
                            <label className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase shrink-0 w-fit">BLOCKED</label>
                        </div>
                        <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <b className="text-white text-sm block mb-1">Platform boundary</b>
                                <span className="text-[#75818d] text-sm block">Legal status does not override verification, risk or human-approval controls.</span>
                            </div>
                            <label className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase shrink-0 w-fit">ACTIVE</label>
                        </div>
                    </div>
                    
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-5 flex items-start gap-4">
                        <AlertTriangle size={20} className="text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-[#eef2f6] text-sm leading-relaxed">{d[3]}</span>
                    </div>
                </section>
            </div>

            <section className="bg-[#101922] border border-[#202b36] rounded-xl p-8 mb-8 shadow-xl">
                <div className="flex items-start gap-4 mb-8">
                    <div className="bg-[#0c131b] border border-[#202b36] rounded-lg p-3 text-[#4f5b67] shrink-0">
                        <Globe2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Regional & global coverage</h3>
                        <p className="text-[#75818d] text-sm max-w-2xl">Applicability depends on facts, user location, data flows, transaction structure and legal thresholds.</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regions.map(r => (
                        <div className="bg-[#0c131b] border border-[#202b36] p-5 rounded-xl group hover:border-[#4f5b67] transition-colors" key={r[0]}>
                            <Globe2 size={20} className="text-[#4f5b67] mb-3 group-hover:text-[#c29631] transition-colors" />
                            <h3 className="text-white font-bold mb-2">{r[0]}</h3>
                            <p className="text-[#eef2f6] text-sm leading-relaxed mb-4">{r[1]}</p>
                            <small className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase block border-t border-[#202b36] pt-3">FRAMEWORK / APPLICABILITY REVIEW</small>
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[#75818d] text-xs pt-8 border-t border-[#202b36]">
                <span>Legal operator: PT TRADEVANCE GLOBAL RESOURCES · info@tradevance.id</span>
                <span className="font-bold">Draft legal framework — not a legal opinion.</span>
            </div>
        </div>
    );
}
