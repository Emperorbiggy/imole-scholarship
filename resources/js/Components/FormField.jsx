export function FormField({ label, error, children, required }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
}

export function Input({ className = '', ...props }) {
    return (
        <input
            className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors text-sm ${className}`}
            {...props}
        />
    );
}

export function Select({ children, className = '', ...props }) {
    return (
        <select
            className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors text-sm appearance-none ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

export function FileInput({ label, hint, error, name, onChange, accept }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                {label} <span className="text-red-400">*</span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <svg className="w-8 h-8 text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-slate-400 text-sm">Click to upload</p>
                {hint && <p className="text-slate-600 text-xs mt-0.5">{hint}</p>}
                <input type="file" name={name} accept={accept} onChange={onChange} className="hidden" />
            </label>
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
}

export function SubmitButton({ children, loading, disabled, accentColor = 'amber' }) {
    const colors = {
        amber: 'from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 shadow-amber-500/25',
        emerald: 'from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-500/25',
        blue: 'from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 shadow-blue-500/25',
        violet: 'from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 shadow-violet-500/25',
    };

    return (
        <button
            type="submit"
            disabled={disabled ?? loading}
            className={`w-full py-4 px-6 rounded-xl bg-gradient-to-r ${colors[accentColor] || colors.amber} text-white font-bold text-base transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0`}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting...
                </span>
            ) : children}
        </button>
    );
}
