import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const STATE = {
    IDLE:      'idle',
    LOADING:   'loading',
    NOT_FOUND: 'not_found',
    VALID:     'valid',
};

export default function BillIdField({ value, onChange, onBlockSubmit, error }) {
    const [status,   setStatus]   = useState(STATE.IDLE);
    const [message,  setMessage]  = useState('');
    const [billData, setBillData] = useState(null);
    const debounceRef             = useRef(null);

    useEffect(() => {
        if (value.trim().length < 5) {
            setStatus(STATE.IDLE);
            setMessage('');
            setBillData(null);
            onBlockSubmit?.(true);
            return;
        }

        setStatus(STATE.LOADING);
        setMessage('');
        setBillData(null);

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const res  = await axios.post(route('verify.bill'), { bill_id: value.trim() });
                const data = res.data;

                if (!data.found) {
                    setStatus(STATE.NOT_FOUND);
                    setMessage('Bill not found. Please check the ID and try again.');
                    onBlockSubmit?.(true);
                    return;
                }

                setBillData(data);
                setStatus(STATE.VALID);
                setMessage('Bill verified successfully.');
                onBlockSubmit?.(false);
            } catch (err) {
                setStatus(STATE.NOT_FOUND);
                setMessage(err.response?.data?.message ?? 'Bill not found. Please check the ID and try again.');
                onBlockSubmit?.(true);
            }
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [value]);

    const inputStyles = {
        [STATE.IDLE]:      'border-white/10',
        [STATE.LOADING]:   'border-slate-400/50',
        [STATE.NOT_FOUND]: 'border-red-500/70 ring-1 ring-red-500/30',
        [STATE.VALID]:     'border-emerald-500/70 ring-1 ring-emerald-500/30',
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Bill ID
                <span className="text-red-400 ml-1">*</span>
            </label>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Enter your ERMS bill ID"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-colors text-sm ${inputStyles[status]}`}
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {status === STATE.LOADING && (
                        <svg className="animate-spin w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    )}
                    {status === STATE.NOT_FOUND && (
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    {status === STATE.VALID && (
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>

            {message && (
                <p className={`mt-1.5 text-xs ${status === STATE.NOT_FOUND ? 'text-red-400' : status === STATE.VALID ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {message}
                </p>
            )}

            {billData && status === STATE.VALID && (
                <div className="mt-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 space-y-0.5">
                    {billData.school_name && <p>Company: <span className="text-slate-200">{billData.school_name}</span></p>}
                    {billData.year        && <p>Year: <span className="text-slate-200">{billData.year}</span></p>}
                    {billData.ipn         && <p>IPN: <span className="text-slate-200">{billData.ipn}</span></p>}
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
}
