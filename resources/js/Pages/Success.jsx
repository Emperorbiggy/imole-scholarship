import { Head, Link } from '@inertiajs/react';

export default function Success() {
    return (
        <>
            <Head title="Registration Submitted | 2026 Imole Award" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    {/* Success icon */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="absolute -inset-2 rounded-full border-2 border-emerald-400/20 animate-pulse" />
                        </div>
                    </div>

                    <p className="text-emerald-400 text-sm font-semibold tracking-[0.3em] uppercase mb-2">
                        2026 Imole Award
                    </p>
                    <h1 className="text-4xl font-black text-white mb-3">
                        Registration Submitted!
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed mb-8">
                        Thank you for submitting your details. Your registration has been received and will be reviewed for verification. You will be contacted if additional information is needed.
                    </p>

                    {/* Info box */}
                    <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-left mb-8">
                        <p className="text-slate-300 text-sm font-semibold mb-3">What happens next?</p>
                        <ul className="space-y-2">
                            {[
                                'Your submission is being reviewed by our team',
                                'Verification may take 5–10 business days',
                                'You will be notified via your school or representative',
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-2 text-slate-400 text-sm">
                                    <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center flex-shrink-0 font-bold">
                                        {i + 1}
                                    </span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link
                        href={route('home')}
                        className="inline-block px-8 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-all duration-200 border border-white/10 hover:border-white/20"
                    >
                        ← Return to Portal
                    </Link>
                </div>
            </div>
        </>
    );
}
