import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const STATE = {
    IDLE:     'idle',
    LOADING:  'loading',
    SUCCESS:  'success',
    ERROR:    'error',
    SERVICE:  'service', // service unavailable — non-blocking
};

export default function NINField({ value, onChange, error, onVerified, nameMismatch, registrationType, onDuplicateChange }) {
    const [status, setStatus]     = useState(STATE.IDLE);
    const [message, setMessage]   = useState('');
    const [dupModal, setDupModal] = useState(false);
    const debounceRef             = useRef(null);

    useEffect(() => {
        if (value.length !== 11) {
            setStatus(STATE.IDLE);
            setMessage('');
            onDuplicateChange?.(false);
            return;
        }

        setStatus(STATE.LOADING);
        setMessage('');

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                // 1. Check for duplicate in our DB first
                if (registrationType) {
                    const dupRes = await axios.post(route('check.nin'), { nin: value, type: registrationType });
                    if (dupRes.data.duplicate) {
                        setStatus(STATE.ERROR);
                        setMessage('This NIN is already registered.');
                        setDupModal(true);
                        onVerified?.(null);
                        onDuplicateChange?.(true);
                        return;
                    }
                }

                // 2. Verify with Prembly
                const res  = await axios.post(route('verify.nin'), { nin: value });
                const data = res.data;

                if (data.verified) {
                    setStatus(STATE.SUCCESS);
                    setMessage('NIN verified successfully');
                    onDuplicateChange?.(false);
                    onVerified?.({
                        first_name:  data.first_name  ?? '',
                        middle_name: data.middle_name ?? '',
                        surname:     data.surname     ?? '',
                    });
                } else {
                    setStatus(STATE.ERROR);
                    setMessage(data.message ?? 'NIN could not be verified.');
                    onVerified?.(null);
                }
            } catch (err) {
                const httpStatus = err.response?.status;
                const data       = err.response?.data;

                if (httpStatus === 422) {
                    setStatus(STATE.ERROR);
                    setMessage(data?.message ?? 'NIN could not be verified.');
                    onVerified?.(null);
                } else {
                    // 503 or network error — non-blocking
                    setStatus(STATE.SERVICE);
                    setMessage('Verification service temporarily unavailable. You may proceed.');
                }
            }
        }, 400);

        return () => clearTimeout(debounceRef.current);
    }, [value]);

    const statusStyles = {
        [STATE.IDLE]:    '',
        [STATE.LOADING]: 'border-slate-400/50',
        [STATE.SUCCESS]: nameMismatch
            ? 'border-red-500/70 ring-1 ring-red-500/30'
            : 'border-emerald-500/70 ring-1 ring-emerald-500/30',
        [STATE.ERROR]:   'border-red-500/70 ring-1 ring-red-500/30',
        [STATE.SERVICE]: 'border-amber-500/50',
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                NIN (National Identification Number)
                <span className="text-red-400 ml-1">*</span>
            </label>

            <div className="relative">
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="Enter your 11-digit NIN"
                    value={value}
                    onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors text-sm ${statusStyles[status]}`}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {status === STATE.LOADING && (
                        <svg className="animate-spin w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    )}
                    {status === STATE.SUCCESS && !nameMismatch && (
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    {status === STATE.SUCCESS && nameMismatch && (
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    {status === STATE.ERROR && (
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    {status === STATE.SERVICE && (
                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    )}
                </div>
            </div>

            {status === STATE.SUCCESS && nameMismatch && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    Name mismatch — please correct your name or use the right NIN
                </p>
            )}
            {message && !(status === STATE.SUCCESS && nameMismatch) && (
                <p className={`mt-1.5 text-xs flex items-center gap-1 ${
                    status === STATE.SUCCESS ? 'text-emerald-400' :
                    status === STATE.ERROR   ? 'text-red-400'     :
                    status === STATE.SERVICE ? 'text-amber-400'   : 'text-slate-400'
                }`}>
                    {message}
                </p>
            )}

            <p className="mt-1 text-xs text-slate-600 text-right">{value.length}/11</p>

            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

            {/* Duplicate NIN Modal */}
            {dupModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-base">NIN Already Registered</h3>
                                <p className="text-slate-400 text-xs">Duplicate entry detected</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-5 text-center">
                            A registration with this NIN already exists in our system. Each person can only register once.
                            If you believe this is an error, please contact the Imole Award team.
                        </p>
                        <button
                            type="button"
                            onClick={() => setDupModal(false)}
                            className="w-full py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors"
                        >
                            Close &amp; Correct
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
