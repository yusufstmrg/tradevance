import React, { useState } from 'react';
import { api } from '@appdeploy/client';
import { Bot, Send, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import TradeOSFlow from './TradeOSFlow';

export default function TradeDeskCopilot() {
    const [q, setQ] = useState('');
    const [answer, setAnswer] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const ask = async (question = q) => {
        const text = question.trim();
        if (!text || busy) return;
        setQ(text);
        setBusy(true);
        setError('');
        try {
            const r = await api.post('/api/copilot', { question: text });
            setAnswer(r.data.answer || 'No answer returned.');
        } catch {
            setError('Tradevance Copilot is temporarily unavailable. Retry.');
        } finally {
            setBusy(false);
        }
    };

    const suggestions = [
        'Which activated-carbon opportunity should we qualify first?',
        'Find the strongest sulphur supplier signal.',
        'What evidence gap should we close next?',
        'Compare buyer demand vs supplier coverage.'
    ];

    return (
        <section className="bg-[#101922] border border-[#202b36] rounded-xl p-8 mb-8">
            <TradeOSFlow />
            
            <div className="flex items-start gap-4 mb-8">
                <div className="mt-1 bg-blue-500/10 text-blue-400 p-2 rounded-lg border border-blue-500/20">
                    <Bot size={20} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Tradevance Copilot</h3>
                    <p className="text-sm text-[#75818d]">AI trade desk with role-scoped context and explicit verification boundaries.</p>
                </div>
            </div>

            <div className="bg-gradient-to-r from-[#0c131b] to-[#101922] border border-[#202b36] rounded-xl p-6 mb-8 flex items-center gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#c29631] blur-xl opacity-20 rounded-full animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-[#070b10] border-2 border-[#c29631]/50 rounded-full flex items-center justify-center">
                        <Sparkles size={24} className={busy ? 'text-[#c29631] animate-spin' : 'text-[#c29631]'} />
                    </div>
                </div>
                <div>
                    <b className="block text-lg text-white mb-1">{busy ? 'Analyzing trade context…' : 'AI trade desk online'}</b>
                    <span className="text-xs text-[#c29631] font-bold tracking-widest uppercase">Role-scoped intelligence · protected counterparties</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {suggestions.map(x => (
                    <button 
                        key={x} 
                        onClick={() => ask(x)}
                        className="bg-[#0c131b] border border-[#202b36] text-[#75818d] hover:text-white hover:border-blue-500/50 hover:bg-[#131c26] text-left p-4 rounded-xl text-sm transition-all shadow-sm"
                    >
                        {x}
                    </button>
                ))}
            </div>

            {answer && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 mb-8 relative">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4 border-b border-blue-500/10 pb-3">
                        <ShieldCheck size={14} /> Tradevance Assessment
                    </div>
                    <p className="text-[#eef2f6] leading-relaxed whitespace-pre-wrap text-sm">{answer}</p>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 text-sm flex items-start gap-3">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="relative">
                <input 
                    className="w-full bg-[#0c131b] border-2 border-[#202b36] focus:border-[#c29631] focus:outline-none rounded-xl py-4 pl-4 pr-16 text-white placeholder:text-[#4f5b67] transition-colors"
                    value={q} 
                    onChange={e => setQ(e.target.value)} 
                    onKeyDown={e => { if (e.key === 'Enter') ask(); }} 
                    placeholder="Ask Tradevance AI anything..."
                    disabled={busy}
                />
                <button 
                    className="absolute right-2 top-2 bottom-2 bg-[#c29631] hover:bg-[#a37c23] text-[#070b10] disabled:bg-[#202b36] disabled:text-[#4f5b67] w-12 rounded-lg flex items-center justify-center transition-colors"
                    onClick={() => ask()} 
                    disabled={busy || !q.trim()}
                >
                    <Send size={18} className={busy ? 'animate-pulse' : ''} />
                </button>
            </div>
        </section>
    );
}