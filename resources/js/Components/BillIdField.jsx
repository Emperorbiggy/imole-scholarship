import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const STATE = {
    IDLE:      'idle',
    LOADING:   'loading',
    NOT_FOUND: 'not_found',
    MISMATCH:  'mismatch',
    PENDING:   'pending',
    PAID:      'paid',
};

function namesOverlap(a, b) {
    const x = a.trim().toLowerCase();
    const y = b.trim().toLowerCase();
    return x.includes(y) || y.includes(x);
}

export default function BillIdField({ value, onChange, schoolName, onBlockSubmit, error }) {
    const [status,     setStatus]     = useState(STATE.IDLE);
    const [message,    setMessage]    = useState('');
    const [billData,   setBillData]   = useState(null);
    const [modal,      setModal]      = useState(false);
    const debounceRef                 = useRef(null);

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

                const companyName = data.school_name ?? '';
                if (companyName && schoolName && !namesOverlap(companyName, schoolName)) {
                    setStatus(STATE.MISMATCH);
                    setMessage(`Name on bill "${companyName}" does not match your school name. Please fix this before submitting.`);
                    setModal(true);
                    onBlockSubmit?.(true);
                    return;
                }

                if (data.invoice_status === 'paid') {
                    setStatus(STATE.PAID);
                    setMessage('Bill verified — invoice status: Paid. Your registration will be automatically verified.');
                } else {
                    setStatus(STATE.PENDING);
                    setMessage('Bill found — invoice status: Pending. Your registration will be reviewed manually.');
                }
                onBlockSubmit?.(false);
            } catch (err) {
                const data = err.response?.data;
                setStatus(STATE.NOT_FOUND);
                setMessage(data?.message ?? 'Bill not found. Please check the ID and try again.');
                onBlockSubmit?.(true);
            }
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [value, schoolName]);

    const inputStyles = {
        [STATE.IDLE]:      'border-white/10',
        [STATE.LOADING]:   'border-slate-400/50',
        [STATE.NOT_FOUND]: 'border-red-500/70 ring-1 ring-red-500/30',
        [STATE.MISMATCH]:  'border-red-500/70 ring-1 ring-red-500/30',
        [STATE.PENDING]:   'border-amber-500/70 ring-1 ring-amber-500/30',
        [STATE.PAID]:      'border-emerald-500/70 ring-1 ring-emerald-500/30',
    };

    const messageStyles = {
        [STATE.NOT_FOUND]: 'text-red-400',
        [STATE.MISMATCH]:  'text-red-400',
        [STATE.PENDING]:   'text-amber-400',
        [STATE.PAID]:      'text-emerald-400',
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
                    {(status === STATE.NOT_FOUND || status === STATE.MISMATCH) && (
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    {status === STATE.PENDING && (
                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    )}
                    {status === STATE.PAID && (
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>

            {message && (
                <p className={`mt-1.5 text-xs flex items-center gap-1 ${messageStyles[status] ?? 'text-slate-400'}`}>
                    {message}
                </p>
            )}

            {billData && (status === STATE.PAID || status === STATE.PENDING) && (
                <div className="mt-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 space-y-0.5">
                    {billData.school_name && <p>Company: <span className="text-slate-200">{billData.school_name}</span></p>}
                    {billData.year        && <p>Year: <span className="text-slate-200">{billData.year}</span></p>}
                    {billData.ipn         && <p>IPN: <span className="text-slate-200">{billData.ipn}</span></p>}
                </div>
            )}

            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

            {/* Name Mismatch Modal */}
            {modal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-base">School Name Mismatch</h3>
                                <p className="text-slate-400 text-xs">Bill belongs to a different school</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-2 text-center">
                            The name on the bill does not match your registered school name.
                        </p>
                        <div className="mb-5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-center space-y-1">
                            <p>Bill company: <span className="text-red-300 font-medium">{billData?.school_name}</span></p>
                            <p>Your school: <span className="text-slate-200 font-medium">{schoolName}</span></p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setModal(false)}
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
