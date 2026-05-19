import { Head, Link } from '@inertiajs/react';

export default function FormLayout({ title, subtitle, accentColor = 'amber', backHref, backLabel = 'Back', children }) {
    const accents = {
        amber: {
            gradient: 'from-amber-500 to-yellow-400',
            text: 'text-amber-400',
            border: 'border-amber-400/30',
            bar: 'from-amber-500 to-yellow-400',
            bg: 'from-slate-900 via-purple-950 to-slate-900',
        },
        emerald: {
            gradient: 'from-emerald-500 to-teal-400',
            text: 'text-emerald-400',
            border: 'border-emerald-400/30',
            bar: 'from-emerald-500 to-teal-400',
            bg: 'from-slate-900 via-emerald-950 to-slate-900',
        },
        blue: {
            gradient: 'from-blue-500 to-indigo-400',
            text: 'text-blue-400',
            border: 'border-blue-400/30',
            bar: 'from-blue-500 to-indigo-400',
            bg: 'from-slate-900 via-blue-950 to-slate-900',
        },
        violet: {
            gradient: 'from-violet-500 to-fuchsia-400',
            text: 'text-violet-400',
            border: 'border-violet-400/30',
            bar: 'from-violet-500 to-fuchsia-400',
            bg: 'from-slate-900 via-violet-950 to-slate-900',
        },
    };

    const a = accents[accentColor] || accents.amber;

    return (
        <>
            <Head title={`${title} | 2026 Imole Award`} />
            <div className={`min-h-screen bg-gradient-to-br ${a.bg} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-3 rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-3 rounded-full -translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 flex flex-col min-h-screen py-12 px-4">
                    {/* Page header */}
                    <div className="text-center mb-10">
                        <Link href={route('home')} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm mb-6 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            {backLabel}
                        </Link>

                        <div className="flex justify-center mb-4">
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${a.gradient} flex items-center justify-center shadow-xl`}>
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                            </div>
                        </div>

                        <p className={`${a.text} text-xs font-semibold tracking-[0.3em] uppercase mb-1`}>
                            2026 Imole Award
                        </p>
                        <h1 className="text-3xl md:text-4xl font-black text-white">{title}</h1>
                        {subtitle && (
                            <p className={`mt-1 text-lg font-semibold bg-gradient-to-r ${a.gradient} bg-clip-text text-transparent`}>
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Form card */}
                    <div className="mx-auto w-full max-w-2xl">
                        <div className={`relative rounded-2xl bg-white/5 backdrop-blur-sm border ${a.border} shadow-2xl overflow-hidden`}>
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${a.bar}`} />
                            <div className="p-8 md:p-10">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
