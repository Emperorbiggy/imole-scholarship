import { Head, Link } from '@inertiajs/react';

export default function PrivateWelcome() {
    return (
        <>
            <Head title="2026 Imole Award | Private Schools Portal" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 relative overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600 opacity-10 rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-600 opacity-10 rounded-full -translate-x-1/3 translate-y-1/3" />
                <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-purple-700 opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Header */}
                    <header className="pt-12 pb-6 text-center px-4">
                        {/* Emblem */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="absolute -inset-1 rounded-full border-2 border-violet-400/40 animate-pulse" />
                            </div>
                        </div>

                        <p className="text-violet-400 text-sm font-semibold tracking-[0.3em] uppercase mb-2">
                            Private Schools Portal
                        </p>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
                            IMOLE
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                                AWARD
                            </span>
                        </h1>
                        <div className="flex items-center justify-center gap-4 mt-3">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-violet-400" />
                            <p className="text-3xl md:text-4xl font-bold text-violet-300 tracking-widest">2026</p>
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-violet-400" />
                        </div>

                        <p className="mt-6 text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Private Schools Verification Portal &mdash; Register your institution for the 2026 Imole Award.
                        </p>
                    </header>

                    {/* Divider */}
                    <div className="flex items-center justify-center my-8 px-8">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
                        <div className="mx-4 flex gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-500 opacity-60" />
                            ))}
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-violet-500/40 to-transparent" />
                    </div>

                    {/* Main card */}
                    <main className="flex-1 flex items-start justify-center px-4 pb-16">
                        <div className="w-full max-w-lg">
                            <div className="relative flex flex-col p-10 rounded-2xl bg-white/5 backdrop-blur-sm border border-violet-400/30 shadow-2xl">
                                {/* Gradient top accent */}
                                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-violet-500 to-fuchsia-400" />

                                {/* Icon */}
                                <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-400 w-fit text-white shadow-lg mx-auto">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>

                                <h2 className="text-3xl font-bold text-white text-center mb-2">Schools</h2>
                                <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 text-center mb-4">
                                    Private
                                </p>
                                <p className="text-slate-400 text-sm leading-relaxed text-center mb-8">
                                    Private schools participating in the 2026 Imole Award programme. You will need to upload your most recent Harmonized Bill Payment and provide your school bank account details.
                                </p>

                                {/* Info box */}
                                <div className="mb-8 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                                    <p className="text-violet-300 text-xs font-semibold uppercase tracking-widest mb-2">Required Documents</p>
                                    <ul className="space-y-1 text-slate-300 text-sm">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                                            Most Recent Harmonized Bill Payment (PDF/Image)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                                            School Account Number &amp; Account Name
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                                            NIN of the authorized representative
                                        </li>
                                    </ul>
                                </div>

                                <Link
                                    href={route('register.private_school')}
                                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-lg text-center transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 block"
                                >
                                    Begin Registration
                                    <span className="ml-2">→</span>
                                </Link>

                                <p className="mt-4 text-center text-slate-600 text-xs">
                                    Max 5 entries accepted
                                </p>
                            </div>

                            {/* Back to main portal */}
                            <div className="mt-6 text-center">
                                <Link href={route('home')} className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                                    ← Back to Main Portal
                                </Link>
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
