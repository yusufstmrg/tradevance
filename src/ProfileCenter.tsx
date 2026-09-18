import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@appdeploy/client';
import { Building2, Camera, CheckCircle2, FileCheck2, Globe2, Mail, Phone, Save, ShieldCheck, Upload, UserRound, AlertTriangle } from 'lucide-react';

type Profile = { role: string; verificationStatus?: string; verificationSubmittedAt?: string; verifiedAt?: string; verificationReason?: string; avatarUrl?: string; company?: string; legalName?: string; country?: string; website?: string; industry?: string; description?: string; address?: string; city?: string; postalCode?: string; taxId?: string; registrationNumber?: string; contactName?: string; contactTitle?: string; phone?: string; products?: string[]; capacity?: string; port?: string; incoterms?: string; paymentTerms?: string; annualVolume?: string; email?: string };

export default function ProfileCenter({ onToast }: { onToast: (x: string) => void }) {
    const [p, setP] = useState<Profile>({ role: 'pending' });
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        api.get('/api/profile').then(r => { setP(r.data); setPreview(r.data.avatarUrl || ''); }).catch(() => { });
    }, []);

    const verified = p.verificationStatus === 'verified' || p.role === 'operator';
    const status = verified ? 'Verified' : p.verificationStatus === 'review' ? 'Under review' : 'Not verified';

    const update = (k: keyof Profile, v: any) => setP(x => ({ ...x, [k]: v }));
    const products = useMemo(() => Array.isArray(p.products) ? p.products.join(', ') : '', [p.products]);

    const save = async () => {
        setSaving(true);
        try {
            const payload = { ...p, products: products.split(',').map(x => x.trim()).filter(Boolean) };
            const r = await api.post('/api/profile/update', payload);
            setP(r.data);
            onToast('Profile saved successfully.');
        } catch {
            onToast('Profile could not be saved.');
        } finally {
            setSaving(false);
        }
    };

    const submit = async () => {
        setSubmitting(true);
        try {
            const r = await api.post('/api/profile/submit-verification', {
                notes: 'Organization requested verification from Profile & Verification workspace.',
                evidence: [p.website ? 'Public website supplied' : 'Website missing', p.registrationNumber ? 'Registration number supplied' : 'Registration number missing', p.legalName ? 'Legal name supplied' : 'Legal name missing']
            });
            setP(r.data);
            onToast('Verification request submitted for review.');
        } catch {
            onToast('Verification request could not be submitted.');
        } finally {
            setSubmitting(false);
        }
    };

    const avatar = async (file?: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = String(reader.result || '');
            try {
                const r = await api.post('/api/profile/avatar', { base64, contentType: file.type });
                setPreview(r.data.avatarUrl);
                setP(r.data.profile);
                onToast('Profile photo updated.');
            } catch {
                onToast('Profile photo upload failed.');
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-[#070b10] min-h-screen text-[#eef2f6] p-8 pb-32">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-[#c9a34a] text-xs font-bold tracking-widest uppercase mb-3">
                    <Building2 size={14} /> PROFILE & VERIFICATION
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2">Organization Identity</h2>
                <p className="text-[#75818d] text-sm max-w-2xl">Complete your company profile, upload your photo, and submit evidence before any transaction can move.</p>
            </div>

            <div className={`mb-8 p-4 rounded-xl border flex items-start gap-4 ${verified ? 'bg-green-500/10 border-green-500/30 text-green-500' : p.verificationStatus === 'review' ? 'bg-[#c29631]/10 border-[#c29631]/30 text-[#c29631]' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                {verified ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
                <div>
                    <h3 className="font-bold text-lg mb-1">{status}</h3>
                    <p className="text-sm opacity-80">
                        {verified ? 'Transactional access enabled. You can now execute trades and requests.' : p.verificationStatus === 'review' ? 'Transactions remain locked until an authorized reviewer approves the account.' : 'Complete the profile and submit verification to unlock platform features.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <section className="xl:col-span-2 space-y-6">
                    <div className="bg-[#101922] border border-[#202b36] rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-[#202b36] flex items-center gap-6">
                            <div className="w-20 h-20 rounded-xl bg-[#202b36] border border-[#4f5b67] flex items-center justify-center overflow-hidden shrink-0">
                                {preview ? <img src={preview} alt="Profile" className="w-full h-full object-cover" /> : <Building2 size={32} className="text-[#4f5b67]" />}
                            </div>
                            <div>
                                <b className="text-lg text-white block mb-1">Company Logo / Photo</b>
                                <span className="text-xs text-[#75818d] block mb-3">Use a clear company representative or authorized account photo.</span>
                                <label className="inline-flex items-center gap-2 bg-[#202b36] hover:bg-[#4f5b67] text-white px-4 py-2 rounded text-xs font-bold cursor-pointer transition-colors">
                                    <Camera size={14} /> Upload Photo
                                    <input type="file" accept="image/*" className="hidden" onChange={e => avatar(e.target.files?.[0])} />
                                </label>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            <div>
                                <h3 className="text-[#c9a34a] font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2"><Globe2 size={16}/> Core Organization</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        ['company', 'Company / trading name'],
                                        ['legalName', 'Legal entity name'],
                                        ['country', 'Country'],
                                        ['website', 'Website'],
                                        ['industry', 'Industry'],
                                        ['registrationNumber', 'Registration number'],
                                        ['taxId', 'Tax ID / VAT'],
                                        ['address', 'Registered address'],
                                        ['city', 'City'],
                                        ['postalCode', 'Postal code']
                                    ].map(([k, l]) => (
                                        <label key={k} className="block">
                                            <span className="text-xs text-[#75818d] block mb-1">{l}</span>
                                            <input className="w-full bg-[#070b10] border border-[#202b36] rounded-lg px-3 py-2 text-sm text-white focus:border-[#c29631] outline-none transition-colors" value={(p as any)[k] || ''} onChange={e => update(k as keyof Profile, e.target.value)} />
                                        </label>
                                    ))}
                                    <label className="block md:col-span-2">
                                        <span className="text-xs text-[#75818d] block mb-1">Company Description</span>
                                        <textarea className="w-full bg-[#070b10] border border-[#202b36] rounded-lg px-3 py-2 text-sm text-white focus:border-[#c29631] outline-none transition-colors h-24 resize-none" value={p.description || ''} onChange={e => update('description', e.target.value)} />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[#c9a34a] font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2"><Globe2 size={16}/> Commercial Profile</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        ['products', 'Products / commodities'],
                                        ['capacity', 'Capacity / allocation'],
                                        ['port', 'Primary port / logistics hub'],
                                        ['incoterms', 'Preferred Incoterms'],
                                        ['paymentTerms', 'Preferred payment terms'],
                                        ['annualVolume', 'Annual trade volume']
                                    ].map(([k, l]) => (
                                        <label key={k} className="block">
                                            <span className="text-xs text-[#75818d] block mb-1">{l}</span>
                                            <input className="w-full bg-[#070b10] border border-[#202b36] rounded-lg px-3 py-2 text-sm text-white focus:border-[#c29631] outline-none transition-colors" value={k === 'products' ? products : (p as any)[k] || ''} onChange={e => update(k as keyof Profile, e.target.value)} />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[#c9a34a] font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2"><UserRound size={16}/> Authorized Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        ['contactName', 'Full name'],
                                        ['contactTitle', 'Title / position'],
                                        ['phone', 'Phone number']
                                    ].map(([k, l]) => (
                                        <label key={k} className="block">
                                            <span className="text-xs text-[#75818d] block mb-1">{l}</span>
                                            <input className="w-full bg-[#070b10] border border-[#202b36] rounded-lg px-3 py-2 text-sm text-white focus:border-[#c29631] outline-none transition-colors" value={(p as any)[k] || ''} onChange={e => update(k as keyof Profile, e.target.value)} />
                                        </label>
                                    ))}
                                    <label className="block">
                                        <span className="text-xs text-[#75818d] block mb-1">Email Address</span>
                                        <input className="w-full bg-[#070b10] border border-[#202b36] rounded-lg px-3 py-2 text-sm text-[#4f5b67] cursor-not-allowed" value={p.email || 'user@example.com'} disabled />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-[#0c131b] border-t border-[#202b36] flex justify-end gap-3">
                            <button className="bg-[#202b36] hover:bg-[#4f5b67] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors disabled:opacity-50" onClick={save} disabled={saving}>
                                <Save size={16} /> {saving ? 'Saving…' : 'Save Profile'}
                            </button>
                            {!verified && (
                                <button className="bg-[#c29631] hover:bg-[#a37c23] text-[#070b10] px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors disabled:opacity-50" onClick={submit} disabled={submitting}>
                                    <FileCheck2 size={16} /> {submitting ? 'Submitting…' : 'Submit Verification'}
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                <aside className="space-y-6">
                    <div className="bg-[#101922] border border-[#202b36] rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck size={20} className="text-[#c29631]" />
                            <h3 className="font-bold text-white">Verification Gate</h3>
                        </div>
                        <div className="space-y-4 mb-6">
                            {[
                                ['Legal identity', !!p.legalName],
                                ['Public website', !!p.website],
                                ['Registration', !!p.registrationNumber],
                                ['Country / address', !!p.country && !!p.address],
                                ['Commercial profile', !!p.products?.length || !!products],
                                ['Authorized contact', !!p.contactName && !!p.phone]
                            ].map(([label, ok]) => (
                                <div key={label as string} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className={ok ? 'text-green-500' : 'text-[#4f5b67]'} />
                                        <span className="text-sm text-[#eef2f6]">{label as string}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ok ? 'bg-green-500/10 text-green-500' : 'bg-[#202b36] text-[#75818d]'}`}>
                                        {ok ? 'READY' : 'MISSING'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-[#0c131b] border border-[#202b36] rounded-lg flex items-start gap-3 text-xs text-[#75818d] leading-relaxed">
                            <LockKeyhole size={16} className="text-[#c29631] shrink-0 mt-0.5" />
                            <p>Buyer/Seller accounts cannot create RFQs, request introductions, submit quotes or execute transactions until verified by the compliance team.</p>
                        </div>
                    </div>

                    <div className="bg-[#101922] border border-[#202b36] rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Globe2 size={20} className="text-blue-400" />
                            <h3 className="font-bold text-white">Profile Visibility</h3>
                        </div>
                        <p className="text-sm text-[#75818d] leading-relaxed">
                            Tradevance exposes qualified company intelligence while protecting direct contact details. Your private information is only disclosed through governed introduction workflows upon your explicit approval.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}