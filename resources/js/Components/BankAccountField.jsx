import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const RESOLVE_STATE = {
    IDLE:     'idle',
    LOADING:  'loading',
    SUCCESS:  'success',
    ERROR:    'error',
};

/**
 * BankAccountField
 *
 * Props:
 *   accountNumber   string           controlled value
 *   accountName     string           controlled value (read-only, set by resolve)
 *   bank            string           controlled value — Paystack bank code
 *   onAccountNumber (val) => void
 *   onAccountName   (val) => void
 *   onBank          (val) => void
 *   errors          { account_number, account_name, bank }
 *   accentColor     'amber' | 'blue' | 'violet'   (optional, default 'amber')
 *   accountNumberLabel  string (optional)
 *   accountNameLabel    string (optional)
 *   bankLabel           string (optional)
 */
export default function BankAccountField({
    accountNumber,
    accountName,
    bank,
    onAccountNumber,
    onAccountName,
    onBank,
    errors = {},
    accentColor = 'amber',
    accountNumberLabel = 'Account Number',
    accountNameLabel   = 'Account Name',
    bankLabel          = 'Bank',
    onResolvingChange  = null,
    onBankName         = null,
}) {
    const [banks, setBanks]             = useState([]);
    const [banksLoading, setBanksLoading] = useState(true);

    const [resolveState, setResolveState] = useState(RESOLVE_STATE.IDLE);
    const [resolveError, setResolveError] = useState('');

    // Modal state
    const [modal, setModal] = useState(null); // { resolvedName }

    const debounceRef = useRef(null);

    const accent = {
        amber:  { ring: 'focus:ring-amber-500/50 focus:border-amber-500/50', text: 'text-amber-400', btn: 'bg-amber-500 hover:bg-amber-400' },
        blue:   { ring: 'focus:ring-blue-500/50 focus:border-blue-500/50',   text: 'text-blue-400',  btn: 'bg-blue-600 hover:bg-blue-500'  },
        violet: { ring: 'focus:ring-violet-500/50 focus:border-violet-500/50', text: 'text-violet-400', btn: 'bg-violet-600 hover:bg-violet-500' },
    }[accentColor] ?? { ring: 'focus:ring-amber-500/50 focus:border-amber-500/50', text: 'text-amber-400', btn: 'bg-amber-500 hover:bg-amber-400' };

    // Fetch bank list on mount
    useEffect(() => {
        setBanksLoading(true);
        axios.get(route('paystack.banks'))
            .then(res => {
                const list = res.data?.data ?? [];
                setBanks(list);
            })
            .catch(() => {
                // silently fail — user will see empty dropdown
            })
            .finally(() => setBanksLoading(false));
    }, []);

    // Resolve when bank code + 10-digit account number are both set
    useEffect(() => {
        if (!bank || accountNumber.length !== 10) {
            setResolveState(RESOLVE_STATE.IDLE);
            setResolveError('');
            onResolvingChange?.(false);
            return;
        }

        setResolveState(RESOLVE_STATE.LOADING);
        setResolveError('');
        onResolvingChange?.(true);

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const res  = await axios.post(route('paystack.resolve'), {
                    account_number: accountNumber,
                    bank_code:      bank,
                });
                const data = res.data;

                // Backend returns { success: true, account_name, data: { account_name, ... } }
                const resolvedName = data?.account_name ?? data?.data?.account_name ?? null;

                if (data?.success && resolvedName) {
                    setResolveState(RESOLVE_STATE.SUCCESS);
                    setModal({ resolvedName });
                } else {
                    setResolveState(RESOLVE_STATE.ERROR);
                    setResolveError(data?.message ?? 'Could not resolve account.');
                }
            } catch (err) {
                setResolveState(RESOLVE_STATE.ERROR);
                const msg = err.response?.data?.message ?? 'Account resolution failed. Check your details.';
                setResolveError(msg);
            } finally {
                onResolvingChange?.(false);
            }
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [accountNumber, bank]);

    function handleProceed() {
        if (modal?.resolvedName) {
            onAccountName(modal.resolvedName);
        }
        setModal(null);
    }

    function handleChange() {
        setModal(null);
        onAccountNumber('');
        onAccountName('');
        setResolveState(RESOLVE_STATE.IDLE);
        setResolveError('');
    }

    const inputBase = `w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors text-sm ${accent.ring}`;

    return (
        <>
            {/* Bank Select */}
            <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                    {bankLabel}<span className="text-red-400 ml-1">*</span>
                </label>
                <select
                    value={bank}
                    onChange={e => {
                        const selected = banks.find(b => b.code === e.target.value);
                        onBank(e.target.value);
                        onBankName?.(selected?.name ?? '');
                    }}
                    disabled={banksLoading}
                    className={`${inputBase} ${banksLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <option value="" className="bg-slate-900">
                        {banksLoading ? 'Loading banks…' : 'Select your bank'}
                    </option>
                    {banks.map(b => (
                        <option key={b.code} value={b.code} className="bg-slate-900">
                            {b.name}
                        </option>
                    ))}
                </select>
                {errors.bank && <p className="mt-1 text-xs text-red-400">{errors.bank}</p>}
            </div>

            {/* Account Number */}
            <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                    {accountNumberLabel}<span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10-digit account number"
                        value={accountNumber}
                        onChange={e => {
                            onAccountNumber(e.target.value.replace(/\D/g, ''));
                            onAccountName(''); // clear resolved name on change
                            setResolveState(RESOLVE_STATE.IDLE);
                            setResolveError('');
                        }}
                        className={`${inputBase} pr-11 ${
                            resolveState === RESOLVE_STATE.SUCCESS ? 'border-emerald-500/70 ring-1 ring-emerald-500/30' :
                            resolveState === RESOLVE_STATE.ERROR   ? 'border-red-500/70 ring-1 ring-red-500/30' : ''
                        }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {resolveState === RESOLVE_STATE.LOADING && (
                            <svg className="animate-spin w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        )}
                        {resolveState === RESOLVE_STATE.SUCCESS && (
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {resolveState === RESOLVE_STATE.ERROR && (
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                </div>
                <p className="mt-1 text-xs text-slate-600 text-right">{accountNumber.length}/10</p>
                {resolveState === RESOLVE_STATE.ERROR && resolveError && (
                    <p className="mt-1 text-xs text-red-400">{resolveError}</p>
                )}
                {errors.account_number && <p className="mt-1 text-xs text-red-400">{errors.account_number}</p>}
            </div>

            {/* Account Name (read-only) */}
            <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                    {accountNameLabel}<span className="text-red-400 ml-1">*</span>
                </label>
                <input
                    type="text"
                    readOnly
                    placeholder="Filled automatically after account resolution"
                    value={accountName}
                    className={`${inputBase} cursor-not-allowed opacity-70`}
                />
                {accountName && (
                    <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Account verified
                    </p>
                )}
                {errors.account_name && <p className="mt-1 text-xs text-red-400">{errors.account_name}</p>}
            </div>

            {/* Confirmation Modal — rendered via portal so overflow-hidden on parent can't clip it */}
            {modal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    {/* Dialog */}
                    <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-base">Confirm Account</h3>
                                <p className="text-slate-400 text-xs">Is this your correct bank account?</p>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Account Name</p>
                            <p className="text-white font-semibold text-lg">{modal.resolvedName}</p>
                            <p className="text-xs text-slate-500 mt-2">Account No: {accountNumber}</p>
                        </div>

                        <p className="text-slate-400 text-xs mb-5 text-center">
                            Please confirm this name matches the name you registered with, as any mismatch will delay your process.
                        </p>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleChange}
                                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors"
                            >
                                Change
                            </button>
                            <button
                                type="button"
                                onClick={handleProceed}
                                className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors ${accent.btn}`}
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
