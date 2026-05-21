import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import FormLayout from '@/Components/FormLayout';
import { FormField, Input, FileInput, SubmitButton } from '@/Components/FormField';
import BankAccountField from '@/Components/BankAccountField';

function nameMatch(a, b) {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export default function PrivateSchool() {
    const [codeVerified,      setCodeVerified]      = useState(false);
    const [codeInput,         setCodeInput]          = useState('');
    const [codeError,         setCodeError]          = useState('');
    const [codeChecking,      setCodeChecking]       = useState(false);
    const [bankResolving,     setBankResolving]      = useState(false);
    const [accountDuplicate,  setAccountDuplicate]   = useState(false);
    const [schoolMismatch,    setSchoolMismatch]     = useState(false);
    const [schoolMismatchSeen,setSchoolMismatchSeen] = useState(false);

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        school_code:           '',
        surname:               '',
        first_name:            '',
        middle_name:           '',
        school:                '',
        harmonized_bill:       null,
        tax_clearance_no:      '',
        school_account_number: '',
        school_account_name:   '',
        bank:                  '',
        bank_name:             '',
    });

    async function verifyCode(e) {
        e.preventDefault();
        setCodeError('');
        setCodeChecking(true);
        try {
            const res = await axios.post(route('school-code.verify'), { code: codeInput.trim().toUpperCase() });
            if (res.data.valid) {
                if (res.data.school_type !== 'private') {
                    setCodeError('This code is for a public school. Please use the correct registration page.');
                    return;
                }
                setData(d => ({ ...d, school_code: codeInput.trim().toUpperCase(), school: res.data.school_name }));
                setCodeVerified(true);
            } else {
                setCodeError(res.data.message ?? 'Invalid code.');
            }
        } catch (err) {
            setCodeError(err.response?.data?.message ?? 'Invalid or expired access code.');
        } finally {
            setCodeChecking(false);
        }
    }

    function handleAccountName(val) {
        setData('school_account_name', val);
        if (val && data.school && !nameMatch(data.school, val)) {
            setSchoolMismatch(true);
            setSchoolMismatchSeen(false);
        } else {
            setSchoolMismatch(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        clearErrors();

        let hasError = false;

        if (!data.surname.trim())          { setError('surname',               'Surname is required.');                              hasError = true; }
        if (!data.first_name.trim())       { setError('first_name',            'First name is required.');                           hasError = true; }
        if (!data.harmonized_bill)         { setError('harmonized_bill',       'Please upload the harmonized bill payment.');         hasError = true; }
        if (!data.tax_clearance_no.trim()) { setError('tax_clearance_no',      'Tax clearance number is required.');                  hasError = true; }
        if (!data.bank)                    { setError('bank',                  'Please select a bank.');                              hasError = true; }
        if (!data.school_account_number || data.school_account_number.length !== 10) { setError('school_account_number', 'Account number must be 10 digits.'); hasError = true; }
        if (!data.school_account_name.trim()) { setError('school_account_name', 'Please complete account verification before submitting.'); hasError = true; }

        if (hasError) return;

        if (schoolMismatch && !schoolMismatchSeen) { setSchoolMismatch(true); return; }

        post(route('register.private_school.store'), { forceFormData: true });
    }

    // ── Code Gate ──────────────────────────────────────────────────────────────
    if (!codeVerified) {
        return (
            <FormLayout title="Schools" subtitle="Private" accentColor="violet" backLabel="← Back to Portal">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h2 className="text-white font-bold text-lg mb-1">Enter Access Code</h2>
                    <p className="text-slate-400 text-sm">
                        You need a valid access code issued by the Imole Award team to register your school.
                    </p>
                </div>

                <form onSubmit={verifyCode} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Access Code</label>
                        <input
                            type="text"
                            value={codeInput}
                            onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError(''); }}
                            placeholder="e.g. AB12CD34"
                            maxLength={8}
                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-center text-xl font-mono font-bold tracking-widest placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                                codeError ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:border-violet-400/50 focus:ring-violet-400/20'
                            }`}
                        />
                        {codeError && (
                            <p className="mt-2 text-xs text-red-400 text-center flex items-center justify-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {codeError}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={codeChecking || codeInput.length < 6}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
                    >
                        {codeChecking ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Verifying…
                            </span>
                        ) : 'Verify & Continue'}
                    </button>
                </form>
            </FormLayout>
        );
    }

    // ── Main Form ──────────────────────────────────────────────────────────────
    return (
        <FormLayout title="Schools" subtitle="Private" accentColor="violet" backLabel="← Back to Portal">
            {/* Code verified banner */}
            <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-emerald-400 font-medium">Code verified — <span className="font-bold">{data.school_code}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Representative Info */}
                <div className="pb-4 border-b border-white/10">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Representative Information</p>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Surname" error={errors.surname} required>
                                <Input
                                    type="text"
                                    placeholder="Surname"
                                    value={data.surname}
                                    onChange={e => setData('surname', e.target.value)}
                                />
                            </FormField>
                            <FormField label="First Name" error={errors.first_name} required>
                                <Input
                                    type="text"
                                    placeholder="First name"
                                    value={data.first_name}
                                    onChange={e => setData('first_name', e.target.value)}
                                />
                            </FormField>
                        </div>

                        <FormField label="Middle Name" error={errors.middle_name}>
                            <Input
                                type="text"
                                placeholder="Middle name (optional)"
                                value={data.middle_name}
                                onChange={e => setData('middle_name', e.target.value)}
                            />
                        </FormField>

                        <FormField label="School Name" error={errors.school} required>
                            <Input type="text" value={data.school} readOnly
                                className="cursor-not-allowed opacity-60" />
                            <p className="mt-1 text-xs text-slate-600">Pre-filled from your access code</p>
                        </FormField>
                    </div>
                </div>

                {/* Documents & Verification */}
                <div className="pb-4 border-b border-white/10">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Documents & Verification</p>
                    <div className="space-y-4">
                        <FileInput
                            label="Most Recent Harmonized Bill Payment"
                            hint="PDF, JPG or PNG — max 5MB"
                            error={errors.harmonized_bill}
                            name="harmonized_bill"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={e => setData('harmonized_bill', e.target.files[0])}
                        />
                        {data.harmonized_bill && (
                            <p className="text-xs text-violet-400 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {data.harmonized_bill.name}
                            </p>
                        )}

                        <FormField label="Tax Clearance Number" error={errors.tax_clearance_no} required>
                            <Input
                                type="text"
                                placeholder="Enter your tax clearance number"
                                value={data.tax_clearance_no}
                                onChange={e => setData('tax_clearance_no', e.target.value)}
                            />
                        </FormField>
                    </div>
                </div>

                {/* School Account */}
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">School Bank Account</p>
                    <div className="space-y-4">
                        <BankAccountField
                            accountNumber={data.school_account_number}
                            accountName={data.school_account_name}
                            bank={data.bank}
                            onAccountNumber={val => setData('school_account_number', val)}
                            onAccountName={handleAccountName}
                            onBank={val => setData('bank', val)}
                            onBankName={val => setData('bank_name', val)}
                            errors={{
                                account_number: errors.school_account_number,
                                account_name:   errors.school_account_name,
                                bank:           errors.bank,
                            }}
                            accentColor="violet"
                            accountNumberLabel="School Account Number"
                            accountNameLabel="School Account Name"
                            onResolvingChange={setBankResolving}
                            registrationType="private_school"
                            onDuplicateChange={setAccountDuplicate}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <SubmitButton accentColor="violet" loading={processing} disabled={processing || bankResolving || accountDuplicate}>
                        {bankResolving ? 'Please wait while we verify your account number…' : 'Submit Registration'}
                    </SubmitButton>
                </div>
            </form>

            {schoolMismatch && !schoolMismatchSeen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative w-full max-w-sm bg-slate-900 border border-yellow-500/30 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-base">School Name Mismatch</h3>
                                <p className="text-slate-400 text-xs">Please verify before submitting</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs mb-5 text-center">
                            The school name does not match the bank account name. This could delay your verification.
                        </p>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => { setSchoolMismatch(false); setSchoolMismatchSeen(false); }}
                                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors">
                                Go Back &amp; Correct
                            </button>
                            <button type="button" onClick={() => { setSchoolMismatch(false); setSchoolMismatchSeen(true); post(route('register.private_school.store'), { forceFormData: true }); }}
                                className="flex-1 py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-medium hover:bg-yellow-500/30 transition-colors">
                                Proceed Anyway
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </FormLayout>
    );
}
