import { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

function copyToClipboard(text) {
    navigator.clipboard?.writeText(text);
}

export default function SchoolCodes({ codes }) {
    const { props } = usePage();
    const flash = props.flash ?? {};
    const [copied, setCopied] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        school_name: '',
        school_type: 'public',
    });

    function handleCopy(code) {
        copyToClipboard(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    }

    function handleDelete(id, code) {
        if (!confirm(`Delete code ${code}? This cannot be undone.`)) return;
        router.delete(route('admin.school-codes.destroy', { id }));
    }

    function submit(e) {
        e.preventDefault();
        post(route('admin.school-codes.store'), { onSuccess: () => reset() });
    }

    const total  = codes.length;
    const used   = codes.filter(c => c.used).length;
    const unused = total - used;

    return (
        <AdminLayout title="School Access Codes">
            <Head title="School Codes — Admin" />
            <div>

                    {/* Flash */}
                    {flash.success && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {flash.success}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Total Codes',  value: total,  color: 'from-slate-700 to-slate-600' },
                            { label: 'Available',    value: unused, color: 'from-emerald-700 to-emerald-600' },
                            { label: 'Used',         value: used,   color: 'from-amber-700 to-amber-600' },
                        ].map(s => (
                            <div key={s.label} className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5">
                                <div className={`absolute top-0 right-0 w-14 h-14 rounded-bl-3xl bg-gradient-to-br ${s.color} opacity-25`} />
                                <p className="text-3xl font-black text-white">{s.value}</p>
                                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Generate form */}
                        <div className="lg:col-span-1">
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sticky top-24">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Generate New Code</p>

                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">School Type</label>
                                        <div className="flex gap-2">
                                            {['public', 'private'].map(t => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setData('school_type', t)}
                                                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all capitalize ${
                                                        data.school_type === t
                                                            ? t === 'public'
                                                                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                                                                : 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                                                            : 'bg-transparent border-white/10 text-slate-500 hover:text-slate-300'
                                                    }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">School Name</label>
                                        <input
                                            type="text"
                                            value={data.school_name}
                                            onChange={e => setData('school_name', e.target.value)}
                                            placeholder="Enter full school name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-400/50 transition-all"
                                        />
                                        {errors.school_name && <p className="mt-1 text-xs text-red-400">{errors.school_name}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-amber-950 font-bold text-sm transition-all disabled:opacity-60 shadow-lg shadow-amber-500/20"
                                    >
                                        {processing ? 'Generating…' : 'Generate Code'}
                                    </button>
                                </form>

                                <div className="mt-5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Each code can only be used once. Share it directly with the school representative before they register.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Codes list */}
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl border border-white/10 overflow-hidden">
                                <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Generated Codes</p>
                                    <p className="text-xs text-slate-600">{codes.length} total</p>
                                </div>

                                {codes.length === 0 ? (
                                    <div className="py-16 text-center text-slate-600">
                                        <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                        No codes generated yet
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {codes.map(c => (
                                            <div key={c.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                                                {/* Type badge */}
                                                <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${
                                                    c.school_type === 'private'
                                                        ? 'bg-violet-500/15 text-violet-400 border-violet-500/30'
                                                        : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                                }`}>
                                                    {c.school_type}
                                                </span>

                                                {/* School name */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-white truncate">{c.school_name}</p>
                                                    <p className="text-xs text-slate-600 mt-0.5">{c.created_at?.slice(0, 10)}</p>
                                                </div>

                                                {/* Code */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className={`font-mono text-base font-bold tracking-widest ${c.used ? 'text-slate-600 line-through' : 'text-amber-400'}`}>
                                                        {c.code}
                                                    </span>
                                                    {!c.used && (
                                                        <button
                                                            onClick={() => handleCopy(c.code)}
                                                            title="Copy code"
                                                            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-all"
                                                        >
                                                            {copied === c.code ? (
                                                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Used badge / Delete */}
                                                <div className="shrink-0 flex items-center gap-2">
                                                    {c.used ? (
                                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-700/50 border border-white/10 text-slate-500">
                                                            Used
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                                                                Available
                                                            </span>
                                                            <button
                                                                onClick={() => handleDelete(c.id, c.code)}
                                                                title="Delete"
                                                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
            </div>
        </AdminLayout>
    );
}
