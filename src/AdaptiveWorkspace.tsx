import React, { useEffect, useState } from 'react'; 
import { api } from '@appdeploy/client'; 
import { ArrowRight, BrainCircuit, CheckCircle2, CircleAlert, Gauge, ShieldCheck, Sparkles, Target, TrendingUp, ChevronRight } from 'lucide-react'; 

type Props = { role: string; onNavigate: (section: string) => void }; 

export default function AdaptiveWorkspace({ role, onNavigate }: Props) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const r = await api.get('/api/adaptive-workspace');
                setData(r.data);
            } catch {
                setError('Your adaptive workspace is temporarily unavailable. No trade or profile data was changed.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] flex items-center justify-center">
            <div className="text-center text-[#c29631] animate-pulse flex flex-col items-center">
                <BrainCircuit size={40} className="mb-4 opacity-50" />
                <span className="text-sm font-bold tracking-widest uppercase">Preparing intelligent workspace…</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="bg-[#070b10] min-h-screen p-8">
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-center">
                {error}
            </div>
        </div>
    );

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#c29631] text-xs font-bold tracking-widest uppercase mb-3">
                        <BrainCircuit size={14} /> ADAPTIVE TRADE WORKSPACE
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">{data.greeting}</h2>
                    <p className="text-[#75818d] text-sm max-w-2xl">{data.company} · Your workspace is prioritized around what matters now, with complexity kept behind the scenes.</p>
                </div>
                <div className="bg-[#c29631]/10 text-[#c29631] border border-[#c29631]/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                    <Sparkles size={14} /> <span className="capitalize">{role}</span> · Context-Aware
                </div>
            </div>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#101922] to-[#0c131b] border border-[#202b36] rounded-2xl overflow-hidden mb-8 flex flex-col md:flex-row shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <div className="p-8 md:w-2/3 border-b md:border-b-0 md:border-r border-[#202b36] flex flex-col justify-center">
                    <span className="text-[#c29631] text-[10px] font-bold tracking-widest uppercase mb-4">Your Next Best Action</span>
                    <h3 className="text-3xl font-bold text-white mb-2 leading-tight">{data.primary.title}</h3>
                    <p className="text-[#75818d] mb-8 max-w-lg">{data.primary.subtitle}</p>
                    <button 
                        className="bg-[#c29631] hover:bg-[#a37c23] text-[#070b10] px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-colors w-max"
                        onClick={() => onNavigate(data.primary.action)}
                    >
                        {data.primary.label} <ArrowRight size={16} />
                    </button>
                </div>
                <div className="p-8 md:w-1/3 flex flex-col items-center justify-center bg-[#070b10]/50 relative">
                    <div className="w-32 h-32 rounded-full border-4 border-[#202b36] border-t-[#c29631] border-r-[#c29631] flex flex-col items-center justify-center relative mb-6 shadow-[0_0_20px_rgba(194,150,49,0.2)]">
                        <Gauge size={24} className="text-[#c29631] mb-1" />
                        <span className="text-3xl font-mono font-bold text-white leading-none">{data.stats.signals}</span>
                        <span className="text-[10px] text-[#75818d] uppercase font-bold tracking-widest mt-1">Live Signals</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#75818d] bg-[#101922] px-3 py-2 rounded-lg border border-[#202b36]">
                        <ShieldCheck size={14} className="text-[#c29631]" />
                        <span>Governed by verification & privacy policies.</span>
                    </div>
                </div>
            </section>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Metric title="Active Trades" value={data.stats.activeTrades} icon={Target} />
                <Metric title="My Demands" value={data.stats.demands} icon={TrendingUp} />
                <Metric title="My Quotes" value={data.stats.quotes} icon={Sparkles} />
                <Metric title="Learning Samples" value={data.stats.learningSamples} icon={BrainCircuit} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Signals */}
                <section className="xl:col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                        <Target size={20} className="text-[#c29631]" />
                        <div>
                            <h3 className="font-bold text-white">What deserves your attention</h3>
                            <p className="text-xs text-[#75818d]">Prioritized from live Tradevance signals — not synthetic activity.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {data.contextCards.length ? data.contextCards.map((x: any) => (
                            <article 
                                key={x.id} 
                                className={`bg-[#101922] border rounded-xl p-6 transition-all hover:bg-[#131c26] ${
                                    x.priority === 'CRITICAL' ? 'border-red-500/30' : 
                                    x.priority === 'HIGH' ? 'border-[#c29631]/30' : 
                                    'border-[#202b36]'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className={`mt-1 ${
                                            x.decision === 'BLOCK' ? 'text-red-500' : 'text-green-500'
                                        }`}>
                                            {x.decision === 'BLOCK' ? <CircleAlert size={20} /> : <CheckCircle2 size={20} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
                                                    x.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 
                                                    x.priority === 'HIGH' ? 'bg-[#c29631]/10 text-[#c29631]' : 
                                                    'bg-[#202b36] text-[#75818d]'
                                                }`}>{x.priority}</span>
                                                <span className="text-[10px] text-[#4f5b67] uppercase tracking-widest">{x.dataQuality}</span>
                                            </div>
                                            <h4 className="text-base font-bold text-white mb-0.5">{x.title}</h4>
                                            <span className="text-xs text-[#75818d]">{x.subtitle}</span>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${
                                        x.decision === 'BLOCK' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                        x.decision === 'PROCEED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    }`}>{x.decision}</span>
                                </div>
                                <p className="text-sm text-[#eef2f6] leading-relaxed mb-6 pl-9">{x.reason}</p>
                                <div className="flex justify-between items-center pt-4 border-t border-[#202b36] pl-9">
                                    <span className="text-[10px] font-bold text-[#75818d] uppercase tracking-widest flex items-center gap-1">
                                        <ShieldCheck size={14} /> Evidence-backed guidance
                                    </span>
                                    <button 
                                        className="text-xs font-bold text-white flex items-center gap-1 hover:text-[#c29631] transition-colors"
                                        onClick={() => onNavigate(x.destination)}
                                    >
                                        {x.destination} <ArrowRight size={14} />
                                    </button>
                                </div>
                            </article>
                        )) : (
                            <div className="bg-[#101922] border border-[#202b36] rounded-xl p-8 text-center text-[#75818d]">
                                <Target size={24} className="mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No priority signals yet. As real RFQs, quotes and trades accumulate, this workspace will become more useful.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <section className="bg-[#101922] border border-[#202b36] rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck size={20} className="text-[#c29631]" />
                            <div>
                                <h3 className="font-bold text-white">How Tradevance Guides You</h3>
                                <p className="text-[10px] text-[#75818d] uppercase tracking-widest">Simple on surface. Rigorous underneath.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                'Uses only data visible to your role.',
                                'Separates observed evidence from inference.',
                                'Keeps REVIEW/BLOCK decisions non-transactional.',
                                'Never executes a material action from this workspace.'
                            ].map((x, i) => (
                                <div key={x} className="flex gap-3 text-sm">
                                    <span className="text-[#c29631] font-mono font-bold">0{i + 1}</span>
                                    <p className="text-[#eef2f6] leading-snug">{x}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-[#0c131b] border border-[#202b36] rounded-xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c29631] opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity"></div>
                        <span className="text-[10px] text-[#c29631] font-bold tracking-widest uppercase mb-2 block">Memory Signal</span>
                        <b className="text-base text-white block mb-2 leading-tight">
                            {data.stats.learningSamples > 0 ? `${data.stats.learningSamples} learning samples available` : 'Build real trade memory over time'}
                        </b>
                        <p className="text-xs text-[#75818d] mb-6">
                            {data.stats.learningSamples > 0 ? 'Past outcomes can improve prioritization without retraining the model automatically.' : 'Closed-loop intelligence becomes stronger as real trade outcomes are captured.'}
                        </p>
                        <button 
                            className="w-full bg-[#202b36] hover:bg-[#4f5b67] text-white py-2.5 rounded-lg flex justify-center items-center gap-2 text-xs font-bold transition-colors" 
                            onClick={() => onNavigate('Trade Memory')}
                        >
                            Open Trade Memory <ArrowRight size={14} />
                        </button>
                    </section>
                </aside>
            </div>
        </div>
    );
}

function Metric({ title, value, icon: Icon }: any) {
    return (
        <div className="bg-[#101922] border border-[#202b36] p-5 rounded-xl flex flex-col justify-between group hover:border-[#c29631]/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-[#75818d] uppercase tracking-wider font-bold">{title}</span>
                <Icon size={16} className="text-[#4f5b67] group-hover:text-[#c29631] transition-colors" />
            </div>
            <div>
                <strong className="block text-2xl text-white font-mono leading-none mb-1">{String(value)}</strong>
                <span className="text-[10px] text-[#4f5b67] font-bold">Current workspace</span>
            </div>
        </div>
    );
}