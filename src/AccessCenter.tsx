import React, { useEffect, useState } from 'react';
import { api } from '@appdeploy/client';
import { BadgeCheck, LockKeyhole, ShieldCheck, Users, WalletCards, ChevronRight, Fingerprint, Activity, Clock } from 'lucide-react';

export default function AccessCenter() {
    const [d, setD] = useState<any>(null);

    useEffect(() => {
        api.get('/api/access').then(r => setD(r.data)).catch(() => { });
    }, []);

    if (!d) return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32 flex items-center justify-center">
            <div className="text-center text-[#75818d] animate-pulse">
                <LockKeyhole size={32} className="mx-auto mb-4 opacity-50" />
                <p>Authenticating network access controls...</p>
            </div>
        </div>
    );

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                    <LockKeyhole size={14} /> NETWORK ACCESS & REVENUE PROTECTION
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2">Protected Introductions. Auditable Revenue.</h2>
                <p className="text-[#75818d] text-sm max-w-2xl">Counterparty contacts stay protected while every introduction receives a cryptographic referral identity and strict audit trail.</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                <div className="bg-[#101922] border border-[#202b36] p-4 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-[#75818d] mb-4">
                        <ShieldCheck size={16} className="text-[#c29631]" />
                        <span className="text-[10px] uppercase tracking-wider font-bold">Contacts</span>
                    </div>
                    <div>
                        <strong className="block text-lg text-white mb-1">Protected</strong>
                        <span className="text-xs text-[#75818d]">Never exposed in discovery</span>
                    </div>
                </div>
                <div className="bg-[#101922] border border-[#202b36] p-4 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-[#75818d] mb-4">
                        <Clock size={16} className="text-[#c29631]" />
                        <span className="text-[10px] uppercase tracking-wider font-bold">Referral Tail</span>
                    </div>
                    <div>
                        <strong className="block text-lg text-white mb-1">24 Months</strong>
                        <span className="text-xs text-[#75818d]">Origin remains trackable</span>
                    </div>
                </div>
                <div className="bg-[#101922] border border-[#202b36] p-4 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-[#75818d] mb-4">
                        <Users size={16} className="text-[#c29631]" />
                        <span className="text-[10px] uppercase tracking-wider font-bold">Role</span>
                    </div>
                    <div>
                        <strong className="block text-lg text-white mb-1 capitalize">{d.role}</strong>
                        <span className="text-xs text-[#75818d]">Plan {d.plan}</span>
                    </div>
                </div>
                <div className="bg-[#101922] border border-[#202b36] p-4 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-[#75818d] mb-4">
                        <WalletCards size={16} className="text-[#c29631]" />
                        <span className="text-[10px] uppercase tracking-wider font-bold">Revenue</span>
                    </div>
                    <div>
                        <strong className="block text-lg text-white mb-1">Seller-led</strong>
                        <span className="text-xs text-[#75818d]">Buyer free-first</span>
                    </div>
                </div>
                <div className="bg-[#101922] border border-[#202b36] p-4 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-[#75818d] mb-4">
                        <BadgeCheck size={16} className="text-green-500" />
                        <span className="text-[10px] uppercase tracking-wider font-bold">Audit</span>
                    </div>
                    <div>
                        <strong className="block text-lg text-white mb-1">Enabled</strong>
                        <span className="text-xs text-[#75818d]">Intro actions logged</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Plans section */}
                <section className="xl:col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                        <WalletCards size={20} className="text-[#c29631]" />
                        <div>
                            <h3 className="font-bold text-white">Access Plans</h3>
                            <p className="text-xs text-[#75818d]">Value is delivered through qualified demand and workflow, not raw database exports.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {d.pricing.map((p: any) => {
                            const isCurrent = p[2] === d.plan;
                            return (
                                <div key={p[2]} className={`bg-[#101922] border rounded-xl p-6 relative overflow-hidden flex flex-col ${isCurrent ? 'border-[#c29631] shadow-[0_0_20px_rgba(194,150,49,0.1)]' : 'border-[#202b36]'}`}>
                                    {isCurrent && (
                                        <div className="absolute top-0 right-0 bg-[#c29631] text-[#070b10] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                                            Current Plan
                                        </div>
                                    )}
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-white mb-1">{p[0]}</h3>
                                        <p className="text-2xl font-mono text-[#c29631]">{p[1] === 0 ? 'Free' : `$${p[1]}/mo`}</p>
                                    </div>
                                    <ul className="text-xs text-[#eef2f6] space-y-2 mt-auto">
                                        <li className="flex items-start gap-2">
                                            <BadgeCheck size={14} className="text-green-500 shrink-0 mt-0.5" />
                                            <span>
                                                {p[2] === 'seller_free' ? 'Basic profile · limited buyer discovery' : 
                                                 p[2] === 'seller_verified' ? 'Verified profile · qualified buyer access' : 
                                                 p[2] === 'seller_pro' ? 'Buyer intelligence · priority RFQ access' : 
                                                 p[2] === 'buyer_free' ? 'Core sourcing · RFQ · supplier matching' : 
                                                 'Advanced procurement intelligence'}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Audit section */}
                <aside className="space-y-6">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-blue-400" />
                        <div>
                            <h3 className="font-bold text-white">Introduction Ledger</h3>
                            <p className="text-xs text-[#75818d]">Protected commercial relationships.</p>
                        </div>
                    </div>

                    <div className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden">
                        {d.introductions?.length ? (
                            <div className="divide-y divide-[#202b36]">
                                {d.introductions.map((x: any) => (
                                    <div key={x.id} className="p-4 hover:bg-[#16212c] transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <Fingerprint size={14} className="text-[#c29631]" />
                                                <strong className="text-sm font-mono text-white">{x.referralId}</strong>
                                            </div>
                                            <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Audited</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-sm text-white block mb-0.5">{x.targetName}</span>
                                            <span className="text-xs text-[#75818d] uppercase tracking-wider">{x.targetType}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-[10px]">
                                            <span className="bg-[#202b36] text-[#eef2f6] px-2 py-1 rounded border border-[#4f5b67]">{x.product || 'General introduction'}</span>
                                            <span className="bg-[#202b36] text-[#eef2f6] px-2 py-1 rounded border border-[#4f5b67]">{x.status}</span>
                                            <span className="bg-[#202b36] text-blue-400 px-2 py-1 rounded border border-[#4f5b67]">{x.protectionWindowMonths}MO TAIL</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-[#75818d]">
                                <LockKeyhole size={24} className="mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No controlled introductions yet.</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
