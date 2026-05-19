import { useForm, Head } from '@inertiajs/react';

export default function AdminLogin({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email:    '',
        password: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.login.store'), { onFinish: () => reset('password') });
    }

    return (
        <>
            <Head title="Admin Login — Imole Award 2026" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">

                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-500 opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-400 opacity-5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.04)_0%,transparent_70%)] pointer-events-none" />

                <div className="relative w-full max-w-md">

                    {/* Logo / Emblem */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                                <svg className="w-10 h-10 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                            </div>
                            <div className="absolute -inset-1 rounded-2xl border border-amber-400/20 animate-pulse" />
                        </div>
                        <p className="text-amber-400 text-xs font-semibold tracking-[0.3em] uppercase mb-1">Imole Award 2026</p>
                        <h1 className="text-2xl font-black text-white">Admin Portal</h1>
                        <p className="text-slate-500 text-sm mt-1">Sign in to manage registrations</p>
                    </div>

                    {/* Card */}
                    <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

                        {status && (
                            <div className="mb-6 px-4 py-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    autoComplete="username"
                                    autoFocus
                                    placeholder="admin@imoleaward.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all"
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    placeholder="••••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all"
                                />
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
                                )}
                            </div>

                            {/* JWT notice */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                <svg className="w-3.5 h-3.5 text-amber-500/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p className="text-xs text-slate-600">Secured with JSON Web Token authentication</p>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-amber-950 font-bold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Authenticating…
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-slate-700 text-xs mt-6">
                        &copy; 2026 Imole Award &mdash; Restricted Access
                    </p>
                </div>
            </div>
        </>
    );
}
