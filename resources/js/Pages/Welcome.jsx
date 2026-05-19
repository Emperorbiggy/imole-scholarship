import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    const categories = [
        {
            key: 'awardee',
            title: 'Awardees',
            subtitle: 'Students',
            description: 'Students selected for the 2026 Imole Award. Click to submit your verification details.',
            href: route('register.awardee'),
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
            ),
            color: 'from-amber-500 to-yellow-400',
            border: 'border-amber-400',
        },
        {
            key: 'teacher',
            title: 'Teachers',
            subtitle: '& Principals',
            description: 'Educators and school leaders eligible for the 2026 Imole Award recognition.',
            href: route('register.teacher'),
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            color: 'from-emerald-500 to-teal-400',
            border: 'border-emerald-400',
        },
        {
            key: 'public_school',
            title: 'Schools',
            subtitle: '(Public)',
            description: 'Public schools participating in the 2026 Imole Award programme.',
            href: route('register.public_school'),
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            color: 'from-blue-500 to-indigo-400',
            border: 'border-blue-400',
        },
    ];

    return (
        <>
            <Head title="2026 Imole Award | Verification Portal" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative overflow-hidden">
                {/* Background decorative blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-600 opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Header */}
                    <header className="pt-12 pb-4 text-center px-4">
                        {/* Emblem */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                                    <svg className="w-12 h-12 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                    </svg>
                                </div>
                                <div className="absolute -inset-1 rounded-full border-2 border-amber-400/30 animate-pulse" />
                            </div>
                        </div>

                        {/* Title */}
                        <p className="text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-2">
                            Official Portal
                        </p>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
                            IMOLE
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                                AWARD
                            </span>
                        </h1>
                        <div className="flex items-center justify-center gap-4 mt-3">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
                            <p className="text-3xl md:text-4xl font-bold text-amber-300 tracking-widest">2026</p>
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
                        </div>

                        <p className="mt-6 text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Awardee Verification Portal &mdash; Select your category below to begin your registration and verification process.
                        </p>
                    </header>

                    {/* Decorative divider */}
                    <div className="flex items-center justify-center my-8 px-8">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                        <div className="mx-4 flex gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-60" />
                            ))}
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-500/40 to-transparent" />
                    </div>

                    {/* Category Cards */}
                    <main className="flex-1 flex items-start justify-center px-4 pb-16">
                        <div className="w-full max-w-5xl">
                            <h2 className="text-center text-slate-400 text-sm font-semibold tracking-widest uppercase mb-8">
                                Select Your Category
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.key}
                                        href={cat.href}
                                        className={`group relative flex flex-col p-8 rounded-2xl bg-white/5 backdrop-blur-sm border ${cat.border}/30 hover:bg-white/10 hover:border-opacity-70 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
                                    >
                                        {/* Gradient top accent bar */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${cat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />

                                        {/* Icon */}
                                        <div className={`mb-6 p-3 rounded-xl bg-gradient-to-br ${cat.color} w-fit text-white shadow-lg`}>
                                            {cat.icon}
                                        </div>

                                        <h3 className="text-2xl font-bold text-white">{cat.title}</h3>
                                        <p className={`text-lg font-semibold bg-gradient-to-r ${cat.color} bg-clip-text text-transparent mb-3`}>
                                            {cat.subtitle}
                                        </p>
                                        <p className="text-slate-400 text-sm leading-relaxed flex-1">
                                            {cat.description}
                                        </p>

                                        <div className="mt-6 flex items-center justify-end">
                                            <svg
                                                className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                        </div>
                    </main>

                    <footer className="text-center pb-8 text-slate-600 text-xs">
                        &copy; 2026 Imole Award. All rights reserved.
                    </footer>
                </div>
            </div>
        </>
    );
}
