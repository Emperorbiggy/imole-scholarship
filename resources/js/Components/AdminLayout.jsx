import { Link, useForm, usePage } from '@inertiajs/react';

const NAV = [
    {
        href: 'admin.index',
        label: 'Registrations',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        href: 'admin.school-codes.index',
        label: 'School Codes',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
        ),
    },
];

export default function AdminLayout({ children, title }) {
    const { url } = usePage();
    const { post: logout } = useForm();

    function isActive(routeName) {
        try {
            return url.startsWith(new URL(route(routeName)).pathname);
        } catch {
            return false;
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">

            {/* ── Sidebar ── */}
            <aside className="w-56 shrink-0 bg-slate-900/70 border-r border-white/10 flex flex-col sticky top-0 h-screen">

                {/* Logo */}
                <div className="px-5 py-5 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] text-amber-400/70 font-semibold uppercase tracking-widest leading-none">Imole 2026</p>
                            <p className="text-xs font-bold text-white leading-tight mt-0.5">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {NAV.map(item => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={route(item.href)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    active
                                        ? 'bg-amber-500/15 border border-amber-500/25 text-amber-300'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                <span className={active ? 'text-amber-400' : 'text-slate-500'}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign out */}
                <div className="px-3 py-4 border-t border-white/10">
                    <button
                        onClick={() => logout(route('admin.logout'))}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Top bar */}
                <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 px-6 py-3.5 flex items-center justify-between">
                    <h1 className="text-sm font-semibold text-white">{title}</h1>
                    <p className="text-xs text-slate-600">Imole Award 2026 &mdash; Admin</p>
                </header>

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
