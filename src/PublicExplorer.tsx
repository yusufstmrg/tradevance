import React, { useMemo, useState } from 'react';
import { ArrowRight, BarChart3, BriefcaseBusiness, Building2, ChevronRight, FileCheck2, Globe2, LockKeyhole, PackageSearch, Search, Send, ShieldCheck, Sparkles, Users, X } from 'lucide-react';

type Props = { onSignIn: (role: 'buyer' | 'seller') => void };
type Item = { name: string; country: string; details: string; signal: string };
type Tab = { id: string; label: string; icon: any };

const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: Globe2 },
    { id: 'buyers', label: 'Buyers', icon: Users },
    { id: 'sellers', label: 'Sellers', icon: Building2 },
    { id: 'commodities', label: 'Commodities', icon: PackageSearch },
    { id: 'intelligence', label: 'Intelligence', icon: Sparkles },
    { id: 'rfq', label: 'RFQ & Tenders', icon: Send },
    { id: 'trust', label: 'Trust & Verification', icon: ShieldCheck },
    { id: 'workflow', label: 'Trade Workflow', icon: BriefcaseBusiness },
    { id: 'resources', label: 'Resources', icon: FileCheck2 }
];

const buyers: Item[] = [
    { name: 'Global Fertilizer Procurement Network', country: 'Singapore', details: 'Sulphur · Ammonia · Urea', signal: 'Procurement intelligence 94' },
    { name: 'East Africa Energy Trading Group', country: 'Tanzania', details: 'Diesel · Fuel oil · LPG', signal: 'Procurement intelligence 91' },
    { name: 'Gulf Industrial Materials Co.', country: 'United Arab Emirates', details: 'Carbon Black · Caustic Soda · Sulphur', signal: 'Procurement intelligence 89' },
    { name: 'Southeast Asia Food Ingredients', country: 'Indonesia', details: 'Cocoa · Soybean · Palm derivatives', signal: 'Procurement intelligence 87' }
];

const sellers: Item[] = [
    { name: 'Gulf Sulphur Trading', country: 'United Arab Emirates', details: 'Sulphur · Fertilizer inputs · Bulk export · Jebel Ali', signal: 'Supplier signal 96' },
    { name: 'Global Carbon Materials', country: 'China', details: 'Carbon Black · Activated Carbon · Container & bulk supply', signal: 'Supplier signal 93' },
    { name: 'Southeast Asia Renewable Feedstocks', country: 'Indonesia', details: 'UCO · CPO · PKO · Bulk renewable feedstocks', signal: 'Supplier signal 92' },
    { name: 'East Africa Energy Supply', country: 'Tanzania', details: 'Diesel · Gasoil · LPG · Regional distribution', signal: 'Supplier signal 90' }
];

const commodities = ['Sulphur', 'Diesel EN590 10PPM', 'Carbon Black', 'Activated Carbon', 'UCO', 'CPO', 'Cocoa Beans', 'Soybean', 'Caustic Soda', 'Industrial Salt', 'Wood Pellet', 'Palm Kernel Shell'];

export default function PublicExplorer({ onSignIn }: Props) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState('overview');
    const [q, setQ] = useState('');
    const [detail, setDetail] = useState<any>(null);

    const filteredBuyers = useMemo(() => buyers.filter(x => !q || [x.name, x.country, x.details].join(' ').toLowerCase().includes(q.toLowerCase())), [q]);
    const filteredSellers = useMemo(() => sellers.filter(x => !q || [x.name, x.country, x.details].join(' ').toLowerCase().includes(q.toLowerCase())), [q]);

    const choose = (role: 'buyer' | 'seller') => {
        try { localStorage.setItem('tradevance-entry-role', role); } catch { }
        onSignIn(role);
    };

    if (!open) return (
        <button 
            type="button" 
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20 px-6 py-3 rounded-full flex items-center gap-2 font-bold text-sm transition-all z-50 hover:-translate-y-1"
            onClick={() => setOpen(true)}
        >
            <Globe2 size={18} /> Explore Tradevance <ArrowRight size={16} />
        </button>
    );

    const SectionHead = ({ kicker, title, desc, action }: any) => (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
                <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase block mb-2">{kicker}</span>
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-[#75818d] text-sm max-w-2xl leading-relaxed">{desc}</p>
            </div>
            {action && (
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all shrink-0"
                    onClick={() => choose('buyer')}
                >
                    {action} <ArrowRight size={14} />
                </button>
            )}
        </div>
    );

    const GateBanner = ({ text, btn }: any) => (
        <div className="bg-[#0c131b] border border-[#202b36] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-8">
            <div className="flex items-start gap-4">
                <div className="bg-[#c29631]/10 text-[#c29631] p-2 rounded-lg mt-1 border border-[#c29631]/20">
                    <LockKeyhole size={20} />
                </div>
                <div>
                    <b className="text-white text-base block mb-1">Protected controls active.</b>
                    <span className="text-[#75818d] text-sm">{text}</span>
                </div>
            </div>
            <button 
                className="bg-white hover:bg-gray-100 text-black px-5 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all shrink-0"
                onClick={() => choose('buyer')}
            >
                {btn} <ArrowRight size={14} />
            </button>
        </div>
    );

    const overview = (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-900/40 to-[#0c131b] border border-blue-500/20 p-8 rounded-2xl flex flex-col justify-center shadow-xl">
                    <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase block mb-3">GLOBAL NETWORK</span>
                    <h3 className="text-3xl font-bold text-white mb-4 leading-tight">Discovery without account friction.</h3>
                    <p className="text-[#eef2f6] text-sm leading-relaxed mb-8 opacity-90">Understand the network, see how qualified counterparties are presented, and explore the trade lifecycle before you decide to create an account.</p>
                    <div className="flex flex-col sm:flex-row gap-4 border-t border-blue-500/20 pt-6">
                        <div className="flex-1">
                            <b className="text-white text-xs block mb-1">Buyer & Seller discovery</b>
                            <small className="text-blue-300 text-[10px] font-mono">Public, read-only</small>
                        </div>
                        <div className="flex-1">
                            <b className="text-white text-xs block mb-1">AI intelligence</b>
                            <small className="text-blue-300 text-[10px] font-mono">Evidence + context</small>
                        </div>
                        <div className="flex-1">
                            <b className="text-white text-xs block mb-1">Transaction gates</b>
                            <small className="text-blue-300 text-[10px] font-mono">Login required</small>
                        </div>
                    </div>
                </div>
                <div className="bg-[#101922] border border-[#202b36] p-8 rounded-2xl flex flex-col justify-center">
                    <span className="text-[#75818d] text-[10px] font-bold tracking-widest uppercase block mb-6">VALUE PATH</span>
                    <div className="space-y-6">
                        {[
                            ['01', 'Discover', 'Find counterparties and commodities.'],
                            ['02', 'Qualify', 'Review trust, fit, evidence and risk.'],
                            ['03', 'Transact', 'Create RFQ, quote and negotiate after sign-in.']
                        ].map(x => (
                            <div className="flex gap-4 group" key={x[0]}>
                                <span className="text-[#4f5b67] text-sm font-mono font-bold mt-0.5 group-hover:text-blue-400 transition-colors">{x[0]}</span>
                                <div>
                                    <b className="text-white text-sm block mb-1 group-hover:text-blue-400 transition-colors">{x[1]}</b>
                                    <small className="text-[#75818d] text-xs">{x[2]}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    ['Buyers', 'Explore public buyer demand and procurement focus.', 'buyers', Users],
                    ['Sellers', 'Explore public supplier capabilities and products.', 'sellers', Building2],
                    ['Commodities', 'Browse the trade universe by product and resource.', 'commodities', PackageSearch]
                ].map(([title, desc, id, Icon]: any) => (
                    <button 
                        key={id} 
                        className="bg-[#101922] border border-[#202b36] hover:border-[#4f5b67] hover:bg-[#131c26] text-left p-6 rounded-xl transition-all group flex flex-col h-full shadow-lg"
                        onClick={() => setTab(id)}
                    >
                        <Icon size={24} className="text-[#4f5b67] group-hover:text-blue-400 transition-colors mb-4" />
                        <b className="text-white text-lg block mb-2">{title}</b>
                        <p className="text-[#75818d] text-sm flex-1">{desc}</p>
                        <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            Explore <ArrowRight size={12} />
                        </span>
                    </button>
                ))}
            </section>
            <GateBanner text="Create RFQ, request introductions, submit quotes, save opportunities and open Trade Rooms after authentication." btn="Sign in as Buyer" />
        </div>
    );

    const buyersView = (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHead kicker="BUYER DIRECTORY" title="Public buyer discovery" desc="Network-visible buyer profiles only. Private contacts and confidential sourcing details remain protected." action="Create buyer account" />
            <div className="space-y-4">
                {filteredBuyers.map(x => (
                    <article key={x.name} className="bg-[#101922] border border-[#202b36] hover:border-[#4f5b67] p-5 rounded-xl flex items-center gap-5 transition-colors cursor-pointer group" onClick={() => setDetail(x)}>
                        <div className="w-12 h-12 bg-blue-900/40 text-blue-400 border border-blue-500/30 rounded-lg flex items-center justify-center font-bold text-xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">{x.name.slice(0, 1)}</div>
                        <div className="flex-1 min-w-0">
                            <b className="text-white text-base block mb-0.5 truncate">{x.name}</b>
                            <span className="text-[#75818d] text-xs block mb-1 truncate">{x.country}</span>
                            <p className="text-[#eef2f6] text-sm truncate">{x.details}</p>
                        </div>
                        <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                            <span className="bg-[#0c131b] border border-[#202b36] text-[#75818d] px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">Network-visible</span>
                            <span className="bg-[#c29631]/10 text-[#c29631] px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border border-[#c29631]/20">{x.signal}</span>
                        </div>
                        <ChevronRight size={20} className="text-[#4f5b67] group-hover:text-blue-400 transition-colors shrink-0" />
                    </article>
                ))}
            </div>
        </div>
    );

    const sellersView = (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHead kicker="SUPPLIER DIRECTORY" title="Public seller discovery" desc="Explore supply capabilities without exposing protected contact data or private commercial records." action="Create seller account" />
            <div className="space-y-4">
                {filteredSellers.map(x => (
                    <article key={x.name} className="bg-[#101922] border border-[#202b36] hover:border-[#4f5b67] p-5 rounded-xl flex items-center gap-5 transition-colors cursor-pointer group" onClick={() => setDetail(x)}>
                        <div className="w-12 h-12 bg-[#c29631]/10 text-[#c29631] border border-[#c29631]/30 rounded-lg flex items-center justify-center font-bold text-xl shrink-0 group-hover:bg-[#c29631] group-hover:text-[#070b10] transition-colors">{x.name.slice(0, 1)}</div>
                        <div className="flex-1 min-w-0">
                            <b className="text-white text-base block mb-0.5 truncate">{x.name}</b>
                            <span className="text-[#75818d] text-xs block mb-1 truncate">{x.country}</span>
                            <p className="text-[#eef2f6] text-sm truncate">{x.details}</p>
                        </div>
                        <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                            <span className="bg-[#0c131b] border border-[#202b36] text-[#75818d] px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">Evidence-led</span>
                            <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border border-blue-500/20">{x.signal}</span>
                        </div>
                        <ChevronRight size={20} className="text-[#4f5b67] group-hover:text-blue-400 transition-colors shrink-0" />
                    </article>
                ))}
            </div>
        </div>
    );

    const commoditiesView = (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHead kicker="COMMODITY UNIVERSE" title="Explore products and resources" desc="Browse the categories Tradevance is designed to support across industrial, energy, mineral, agricultural and renewable-resource trade." action="Start sourcing" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {commodities.filter(c => !q || c.toLowerCase().includes(q.toLowerCase())).map(c => (
                    <button 
                        key={c} 
                        className="bg-[#101922] border border-[#202b36] hover:border-[#c29631]/50 p-5 rounded-xl text-left transition-colors group flex flex-col h-full shadow-lg" 
                        onClick={() => setDetail({ name: c, type: 'Commodity', description: 'Explore public intelligence, counterparties, sourcing context and trade workflows for ' + c + '.' })}
                    >
                        <PackageSearch size={20} className="text-[#4f5b67] group-hover:text-[#c29631] transition-colors mb-3" />
                        <b className="text-white text-sm block mb-4 flex-1">{c}</b>
                        <span className="flex items-center gap-1 text-[10px] text-[#c29631] font-bold uppercase tracking-widest">
                            Explore intelligence <ArrowRight size={10} />
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );

    const intelligence = (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHead kicker="TRADE INTELLIGENCE" title="See how Tradevance thinks about opportunity." desc="Public intelligence explains the methodology; authenticated workspaces unlock role-scoped records and transactional analysis." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    ['Buyer Intelligence', 'Demand signals, geography, industry and qualification context.'],
                    ['Supplier Intelligence', 'Capability, capacity, products, ports, evidence and risk.'],
                    ['Opportunity Engine', 'Demand strength + supply fit + trust + commercial fit + risk.'],
                    ['Quote Intelligence', 'Price, freight, insurance, payment and Incoterms normalization.'],
                    ['What-if Analysis', 'Test commercial scenarios before a decision.'],
                    ['AI Trade Desk', 'Evidence-backed recommendations with approval boundaries.']
                ].map(x => (
                    <div className="bg-[#101922] border border-[#202b36] p-6 rounded-xl shadow-lg" key={x[0]}>
                        <div className="w-10 h-10 bg-[#0c131b] border border-[#202b36] rounded-lg flex items-center justify-center mb-4 text-[#c29631]">
                            <BarChart3 size={18} />
                        </div>
                        <b className="text-white text-base block mb-2">{x[0]}</b>
                        <p className="text-[#75818d] text-sm leading-relaxed">{x[1]}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const rfq = (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHead kicker="RFQ & TENDERS" title="Explore the RFQ operating model." desc="See how structured demand becomes controlled supplier outreach, normalized quotes and a commercial decision." action="Create RFQ" />
            <div className="bg-[#101922] border border-[#202b36] p-8 rounded-2xl shadow-xl relative mb-8">
                <div className="absolute left-10 md:left-[3.25rem] top-12 bottom-12 w-0.5 bg-[#202b36] hidden md:block" />
                <div className="space-y-8 relative z-10">
                    {[
                        ['01', 'Demand', 'Describe quantity, destination, quality, delivery, Incoterms and payment.'],
                        ['02', 'Match', 'Qualify supply using fit, evidence, trust and risk.'],
                        ['03', 'RFQ', 'Launch controlled outreach to eligible counterparties.'],
                        ['04', 'Quotes', 'Collect normalized commercial offers.'],
                        ['05', 'Decision', 'Compare landed economics and approve the next action.']
                    ].map(x => (
                        <div key={x[0]} className="flex flex-col md:flex-row gap-4 md:gap-6 items-start group">
                            <span className="w-8 h-8 md:w-10 md:h-10 shrink-0 bg-[#0c131b] border-2 border-[#202b36] group-hover:border-blue-500 rounded-full flex items-center justify-center text-xs font-mono font-bold text-[#75818d] group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors z-10">
                                {x[0]}
                            </span>
                            <div className="bg-[#0c131b] border border-[#202b36] p-5 rounded-xl flex-1 group-hover:border-[#4f5b67] transition-colors">
                                <b className="text-white text-base block mb-1 group-hover:text-blue-400 transition-colors">{x[1]}</b>
                                <p className="text-[#75818d] text-sm">{x[2]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <GateBanner text="You can explore the model publicly; creating a live RFQ requires Buyer authentication and verification." btn="Sign in to create RFQ" />
        </div>
    );

    const trust = (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHead kicker="TRUST & VERIFICATION" title="Evidence before transaction." desc="Public visitors can understand the trust model before joining the network." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    ['Registry Verified', 'Organization identity and registry evidence.'],
                    ['Sanctions Checked', 'Screening signal, not a legal clearance.'],
                    ['Enhanced Verified', 'Provider-based KYB/UBO verification.'],
                    ['Transaction Verified', 'Verified status plus transaction controls.'],
                    ['Protected Introductions', 'Contact data remains behind governed introductions.'],
                    ['Audit Controls', 'Material actions remain attributable and reviewable.']
                ].map(x => (
                    <div className="bg-[#101922] border border-[#202b36] p-6 rounded-xl shadow-lg" key={x[0]}>
                        <div className="w-10 h-10 bg-[#0c131b] border border-[#202b36] rounded-lg flex items-center justify-center mb-4 text-green-500">
                            <ShieldCheck size={18} />
                        </div>
                        <b className="text-white text-base block mb-2">{x[0]}</b>
                        <p className="text-[#75818d] text-sm leading-relaxed">{x[1]}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const workflow = (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHead kicker="END-TO-END TRADE" title="Explore the full transaction journey." desc="Discovery is public. Commercial actions become governed after identity, verification and role access are established." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                    ['01', 'Discover', 'Buyer and seller network exploration.'],
                    ['02', 'Qualify', 'Identity, fit, evidence, trust and risk.'],
                    ['03', 'Source', 'AI demand intake, matching and RFQ.'],
                    ['04', 'Negotiate', 'Quotes, counter-offers and approval boundaries.'],
                    ['05', 'Execute', 'Contracts, finance, logistics, documents and Trade Room.'],
                    ['06', 'Settle', 'Controlled completion, payment state and audit trail.']
                ].map(x => (
                    <div key={x[0]} className="bg-[#101922] border border-[#202b36] hover:border-[#4f5b67] p-6 rounded-xl shadow-lg transition-colors group">
                        <span className="text-[#4f5b67] text-sm font-mono font-bold block mb-4 group-hover:text-blue-400 transition-colors">{x[0]}</span>
                        <b className="text-white text-lg block mb-2 group-hover:text-blue-400 transition-colors">{x[1]}</b>
                        <p className="text-[#75818d] text-sm leading-relaxed">{x[2]}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center">
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    onClick={() => choose('buyer')}
                >
                    Enter Trade OS <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );

    const resources = (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHead kicker="RESOURCES" title="Understand Tradevance before joining." desc="Public resources answer the questions procurement leaders and suppliers ask before creating an account." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    ['Buyer readiness', 'What information a buyer should prepare before sourcing.'],
                    ['Seller readiness', 'How suppliers become easier to qualify and match.'],
                    ['Verification guide', 'How evidence-backed trust works.'],
                    ['AI governance', 'Where AI assists and where humans approve.'],
                    ['Trade workflow guide', 'From demand to settlement.'],
                    ['Legal & compliance', 'Platform rules, privacy, cookies and security.']
                ].map(x => (
                    <div className="bg-[#101922] border border-[#202b36] p-6 rounded-xl shadow-lg cursor-pointer hover:border-blue-500/50 hover:bg-[#131c26] transition-all group" key={x[0]}>
                        <div className="w-10 h-10 bg-[#0c131b] border border-[#202b36] group-hover:border-blue-500/30 rounded-lg flex items-center justify-center mb-4 text-[#75818d] group-hover:text-blue-400 transition-colors">
                            <FileCheck2 size={18} />
                        </div>
                        <b className="text-white text-base block mb-2 group-hover:text-blue-400 transition-colors">{x[0]}</b>
                        <p className="text-[#75818d] text-sm leading-relaxed">{x[1]}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const content = tab === 'overview' ? overview : tab === 'buyers' ? buyersView : tab === 'sellers' ? sellersView : tab === 'commodities' ? commoditiesView : tab === 'intelligence' ? intelligence : tab === 'rfq' ? rfq : tab === 'trust' ? trust : tab === 'workflow' ? workflow : resources;
    
    return (
        <div className="fixed inset-0 bg-[#070b10] z-50 flex flex-col animate-in fade-in duration-300">
            <header className="bg-[#101922] border-b border-[#202b36] px-6 py-4 flex justify-between items-start shrink-0">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-[10px] font-bold tracking-widest uppercase mb-2">
                        <Sparkles size={12} /> PUBLIC TRADE DISCOVERY
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">Explore the Tradevance network before you sign in.</h2>
                    <p className="text-[#75818d] text-xs max-w-3xl">Browse buyers, sellers, commodities, intelligence and the transaction model. Public discovery is read-only; transaction actions require a Buyer or Seller account.</p>
                </div>
                <button 
                    type="button" 
                    className="p-2 text-[#75818d] hover:text-white hover:bg-[#202b36] rounded-lg transition-colors"
                    onClick={() => setOpen(false)} 
                    aria-label="Close"
                >
                    <X size={20} />
                </button>
            </header>

            <div className="bg-[#0c131b] border-b border-[#202b36] px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                <div className="relative w-full sm:w-96">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4f5b67]" />
                    <input 
                        className="w-full bg-[#101922] border border-[#202b36] focus:border-blue-500 rounded-lg py-2 pl-9 pr-4 text-sm text-white outline-none transition-colors"
                        value={q} 
                        onChange={e => setQ(e.target.value)} 
                        placeholder="Search buyers, sellers, commodities..." 
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                        type="button" 
                        className="flex-1 sm:flex-none bg-[#101922] hover:bg-[#131c26] border border-[#202b36] hover:border-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                        onClick={() => choose('buyer')}
                    >
                        Join as Buyer <ArrowRight size={14} />
                    </button>
                    <button 
                        type="button" 
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                        onClick={() => choose('seller')}
                    >
                        Join as Seller <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            <nav className="bg-[#101922] border-b border-[#202b36] px-6 overflow-x-auto shrink-0 no-scrollbar">
                <div className="flex whitespace-nowrap min-w-max">
                    {tabs.map(t => {
                        const Icon = t.icon;
                        const active = tab === t.id;
                        return (
                            <button 
                                key={t.id} 
                                className={`flex items-center gap-2 px-4 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${
                                    active ? 'text-blue-400 border-blue-400 bg-blue-500/5' : 'text-[#75818d] border-transparent hover:text-white hover:bg-[#131c26]'
                                }`}
                                onClick={() => setTab(t.id)}
                            >
                                <Icon size={16} className={active ? 'text-blue-400' : 'text-[#4f5b67]'} />
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#070b10]">
                <div className="max-w-7xl mx-auto">
                    {content}
                </div>
            </main>

            {detail && (
                <div 
                    className="fixed inset-0 bg-[#070b10]/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setDetail(null)}
                >
                    <div 
                        className="bg-[#101922] border border-[#202b36] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6 relative">
                            <button 
                                className="absolute top-4 right-4 text-[#75818d] hover:text-white hover:bg-[#202b36] p-1.5 rounded-lg transition-colors"
                                onClick={() => setDetail(null)} 
                                aria-label="Close detail"
                            >
                                <X size={18} />
                            </button>
                            <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase block mb-3">{detail.type || 'COUNTERPARTY'}</span>
                            <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{detail.name}</h3>
                            <p className="text-[#eef2f6] text-sm leading-relaxed">{detail.description || detail.details || detail.demand || 'Public network-visible profile information.'}</p>
                        </div>
                        
                        <div className="px-6 py-5 bg-[#0c131b] border-y border-[#202b36] flex items-start gap-4">
                            <div className="bg-[#c29631]/10 text-[#c29631] p-2 rounded-lg mt-0.5 border border-[#c29631]/20 shrink-0">
                                <LockKeyhole size={18} />
                            </div>
                            <div>
                                <b className="text-white text-sm block mb-1">Want to take action?</b>
                                <span className="text-[#75818d] text-xs leading-relaxed block">Create an account to save, contact, create RFQs, request introductions or move into Trade OS.</span>
                            </div>
                        </div>
                        
                        <div className="p-6 flex flex-col sm:flex-row gap-3 bg-[#101922]">
                            <button 
                                className="flex-1 bg-[#0c131b] hover:bg-[#131c26] border border-[#202b36] hover:border-blue-500 text-white py-3 rounded-lg text-sm font-bold transition-colors"
                                onClick={() => choose('buyer')}
                            >
                                Continue as Buyer
                            </button>
                            <button 
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/20"
                                onClick={() => choose('seller')}
                            >
                                Continue as Seller
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

