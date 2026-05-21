import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

const TYPE_META = {
    awardee:        { label: 'Awardee',        color: 'amber',  bg: 'bg-amber-500/15',  text: 'text-amber-400',  border: 'border-amber-500/30' },
    teacher:        { label: 'Teacher',         color: 'emerald', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    private_school: { label: 'Private School', color: 'violet', bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30' },
    public_school:  { label: 'Public School',  color: 'blue',   bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/30' },
};

const STATUS_META = {
    verified: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400', label: 'Verified' },
    pending:  { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30',   dot: 'bg-amber-400',   label: 'Pending'  },
    rejected: { bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/30',     dot: 'bg-red-400',     label: 'Rejected' },
};

function StatusBadge({ status }) {
    const m = STATUS_META[status] ?? STATUS_META.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${m.bg} ${m.text} ${m.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
            {m.label}
        </span>
    );
}

function TypeBadge({ type }) {
    const m = TYPE_META[type] ?? {};
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${m.bg} ${m.text} ${m.border}`}>
            {m.label}
        </span>
    );
}

export default function AdminIndex({ registrations, counts }) {
    const [typeFilter,   setTypeFilter]   = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [search,       setSearch]       = useState('');

    const filtered = useMemo(() => {
        return registrations.filter(r => {
            if (typeFilter   !== 'all' && r.type   !== typeFilter)   return false;
            if (statusFilter !== 'all' && r.status !== statusFilter) return false;
            if (search) {
                const q = search.toLowerCase();
                if (!r.name.toLowerCase().includes(q) && !(r.school ?? '').toLowerCase().includes(q)) return false;
            }
            return true;
        });
    }, [registrations, typeFilter, statusFilter, search]);

    const tabs = [
        { key: 'all',            label: 'All',            count: counts.all },
        { key: 'awardee',        label: 'Awardees',       count: counts.awardee },
        { key: 'teacher',        label: 'Teachers',        count: counts.teacher },
        { key: 'private_school', label: 'Private Schools', count: counts.private_school },
        { key: 'public_school',  label: 'Public Schools',  count: counts.public_school },
    ];

    return (
        <AdminLayout title="Registrations">
            <Head title="Admin — Imole Award 2026" />
            <div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total',    value: counts.all,      color: 'from-slate-700 to-slate-600',   icon: '≡' },
                            { label: 'Verified', value: counts.verified,  color: 'from-emerald-600 to-emerald-500', icon: '✓' },
                            { label: 'Pending',  value: counts.pending,   color: 'from-amber-600 to-amber-500',   icon: '⧖' },
                            { label: 'Rejected', value: counts.rejected,  color: 'from-red-700 to-red-600',       icon: '✕' },
                        ].map(s => (
                            <div key={s.label} className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5">
                                <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-3xl bg-gradient-to-br ${s.color} opacity-20`} />
                                <p className="text-3xl font-black text-white">{s.value}</p>
                                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {/* Type tabs */}
                        <div className="flex gap-2 flex-wrap">
                            {tabs.map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => setTypeFilter(t.key)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                                        typeFilter === t.key
                                            ? 'bg-white/15 border-white/30 text-white'
                                            : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                                    }`}
                                >
                                    {t.label}
                                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${typeFilter === t.key ? 'bg-white/20' : 'bg-white/10'}`}>
                                        {t.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3 md:ml-auto">
                            {/* Status filter */}
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-white/30"
                            >
                                <option value="all">All Statuses</option>
                                <option value="verified">Verified</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            {/* Search */}
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search name or school…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-white/30 w-56"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-2xl border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">School</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-5 py-3.5" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-16 text-slate-600">
                                                <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                No registrations found
                                            </td>
                                        </tr>
                                    ) : filtered.map((r, i) => (
                                        <tr key={`${r.type}-${r.id}`} className="hover:bg-white/[0.03] transition-colors">
                                            <td className="px-5 py-4 text-slate-600 font-mono text-xs">{i + 1}</td>
                                            <td className="px-5 py-4 font-semibold text-white">{r.name}</td>
                                            <td className="px-5 py-4"><TypeBadge type={r.type} /></td>
                                            <td className="px-5 py-4 text-slate-400 max-w-[200px] truncate">{r.school ?? '—'}</td>
                                            <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                                            <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">{r.created_at}</td>
                                            <td className="px-5 py-4">
                                                <Link
                                                    href={route('admin.show', { type: r.type, id: r.id })}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-all"
                                                >
                                                    View
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filtered.length > 0 && (
                            <div className="px-5 py-3 bg-white/[0.02] border-t border-white/10 text-xs text-slate-600">
                                Showing {filtered.length} of {counts.all} registrations
                            </div>
                        )}
                    </div>
            </div>
        </AdminLayout>
    );
}
