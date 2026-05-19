import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from '@inertiajs/react';
import FormLayout from '@/Components/FormLayout';
import { FormField, Input, FileInput, SubmitButton } from '@/Components/FormField';
import NINField from '@/Components/NINField';
import BankAccountField from '@/Components/BankAccountField';

function nameMatch(entered, verified) {
    return entered.trim().toLowerCase() === (verified ?? '').trim().toLowerCase();
}

function accountNameMatchesTeacher(surname, firstName, accountName) {
    const acc = (accountName ?? '').toLowerCase();
    return acc.includes(surname.trim().toLowerCase()) && acc.includes(firstName.trim().toLowerCase());
}

export default function Teacher() {
    const [bankResolving, setBankResolving]           = useState(false);
    const [ninVerified, setNinVerified]               = useState(false);
    const [mismatch, setMismatch]                     = useState(false);
    const [ninHasMismatch, setNinHasMismatch]         = useState(false);
    const [accountMismatch, setAccountMismatch]       = useState(false);
    const [accountMismatchSeen, setAccountMismatchSeen] = useState(false);

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        surname:            '',
        first_name:         '',
        middle_name:        '',
        school:             '',
        nin:                '',
        subjects_taught:    '',
        appointment_letter: null,
        account_number:     '',
        account_name:       '',
        bank:               '',
        bank_name:          '',
    });

    function handleNINVerified(ninData) {
        if (!ninData) { setNinVerified(false); return; }
        setNinVerified(true);

        const surnameOk   = nameMatch(data.surname,    ninData.surname);
        const firstNameOk = nameMatch(data.first_name, ninData.first_name);

        if (!surnameOk || !firstNameOk) {
            setNinHasMismatch(true);
            setMismatch(true);
        }
    }

    function handleAccountName(val) {
        setData('account_name', val);
        if (val && data.surname && data.first_name && !accountNameMatchesTeacher(data.surname, data.first_name, val)) {
            setAccountMismatch(true);
            setAccountMismatchSeen(false);
        } else {
            setAccountMismatch(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        clearErrors();

        let hasError = false;

        if (!data.surname.trim())          { setError('surname',            'Surname is required.');                     hasError = true; }
        if (!data.first_name.trim())       { setError('first_name',         'First name is required.');                  hasError = true; }
        if (!data.school.trim())           { setError('school',             'School name is required.');                  hasError = true; }
        if (!data.nin || data.nin.length !== 11) { setError('nin',          'NIN must be 11 digits.');                   hasError = true; }
        if (!data.subjects_taught.trim())  { setError('subjects_taught',    'Please enter the subject(s) you teach.');    hasError = true; }
        if (!data.appointment_letter)      { setError('appointment_letter', 'Please upload your appointment letter.');    hasError = true; }
        if (!data.bank)                    { setError('bank',               'Please select a bank.');                     hasError = true; }
        if (!data.account_number || data.account_number.length !== 10) { setError('account_number', 'Account number must be 10 digits.'); hasError = true; }
        if (!data.account_name.trim())     { setError('account_name',       'Please complete account verification before submitting.'); hasError = true; }

        if (hasError) return;

        if (accountMismatch && !accountMismatchSeen) {
            setAccountMismatch(true);
            return;
        }

        post(route('register.teacher.store'), { forceFormData: true });
    }

    return (
        <FormLayout title="Teachers" subtitle="& Principals" accentColor="emerald" backLabel="← Back to Portal">
            <p className="text-slate-400 text-sm mb-8 text-center">
                Fill in all fields accurately. Upload your appointment letter in PDF or image format.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal Info */}
                <div className="pb-4 border-b border-white/10">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Personal Information</p>
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

                        <FormField label="School" error={errors.school} required>
                            <Input
                                type="text"
                                placeholder="Name of your school"
                                value={data.school}
                                onChange={e => setData('school', e.target.value)}
                            />
                        </FormField>

                        <NINField
                            value={data.nin}
                            onChange={val => { setData('nin', val); setNinVerified(false); setMismatch(false); setNinHasMismatch(false); }}
                            error={errors.nin}
                            onVerified={handleNINVerified}
                            nameMismatch={ninHasMismatch}
                        />
                    </div>
                </div>

                {/* Teaching Details */}
                <div className="pb-4 border-b border-white/10">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Teaching Details</p>
                    <div className="space-y-4">
                        <FormField label="Which Subject(s) Do You Teach?" error={errors.subjects_taught} required>
                            <Input
                                type="text"
                                placeholder="e.g. Mathematics, English Language, Biology"
                                value={data.subjects_taught}
                                onChange={e => setData('subjects_taught', e.target.value)}
                            />
                            <p className="mt-1 text-xs text-slate-600">Separate multiple subjects with commas</p>
                        </FormField>
                    </div>
                </div>

                {/* Upload */}
                <div className="pb-4 border-b border-white/10">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Document Upload</p>
                    <FileInput
                        label="Appointment Letter"
                        hint="PDF, JPG or PNG — max 5MB"
                        error={errors.appointment_letter}
                        name="appointment_letter"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => setData('appointment_letter', e.target.files[0])}
                    />
                    {data.appointment_letter && (
                        <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {data.appointment_letter.name}
                        </p>
                    )}
                </div>

                {/* Bank Account */}
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Bank Account Details</p>
                    <div className="space-y-4">
                        <BankAccountField
                            accountNumber={data.account_number}
                            accountName={data.account_name}
                            bank={data.bank}
                            onAccountNumber={val => setData('account_number', val)}
                            onAccountName={handleAccountName}
                            onBank={val => setData('bank', val)}
                            onBankName={val => setData('bank_name', val)}
                            errors={{
                                account_number: errors.account_number,
                                account_name:   errors.account_name,
                                bank:           errors.bank,
                            }}
                            accentColor="emerald"
                            onResolvingChange={setBankResolving}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <SubmitButton accentColor="emerald" loading={processing} disabled={processing || bankResolving || ninHasMismatch}>
                        {bankResolving ? 'Please wait while we verify your account number…' : 'Submit Registration'}
                    </SubmitButton>
                    <p className="text-center text-slate-600 text-xs mt-3">Max 25 entries accepted for this category</p>
                </div>
            </form>

            {/* Account Name Mismatch Modal */}
            {accountMismatch && !accountMismatchSeen && createPortal(
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
                                <h3 className="text-white font-semibold text-base">Name Mismatch</h3>
                                <p className="text-slate-400 text-xs">Please verify before submitting</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs mb-5 text-center">
                            Your name does not match the bank account name. This could delay your verification. Please confirm both are correct before proceeding.
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setAccountMismatch(false); setAccountMismatchSeen(false); }}
                                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors"
                            >
                                Go Back &amp; Correct
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAccountMismatch(false); setAccountMismatchSeen(true); post(route('register.teacher.store'), { forceFormData: true }); }}
                                className="flex-1 py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-medium hover:bg-yellow-500/30 transition-colors"
                            >
                                Proceed Anyway
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* NIN Name Mismatch Modal */}
            {mismatch === true && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-base">Name Mismatch</h3>
                                <p className="text-slate-400 text-xs">Please use the correct NIN</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs mb-5 text-center">
                            The name on your NIN does not match the name you entered. Please use the correct NIN number or correct your name above.
                        </p>
                        <button
                            type="button"
                            onClick={() => setMismatch(false)}
                            className="w-full py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors"
                        >
                            Close &amp; Correct
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </FormLayout>
    );
}
