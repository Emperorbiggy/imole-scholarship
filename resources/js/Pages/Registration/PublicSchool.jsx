import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from '@inertiajs/react';
import FormLayout from '@/Components/FormLayout';
import { FormField, Input, SubmitButton } from '@/Components/FormField';
import BankAccountField from '@/Components/BankAccountField';

function nameMatch(a, b) {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export default function PublicSchool() {
    const [bankResolving, setBankResolving]           = useState(false);
    const [schoolMismatch, setSchoolMismatch]         = useState(false);
    const [schoolMismatchSeen, setSchoolMismatchSeen] = useState(false);

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        surname:               '',
        first_name:            '',
        middle_name:           '',
        school:                '',
        school_account_number: '',
        school_account_name:   '',
        bank:                  '',
        bank_name:             '',
    });

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

        if (!data.surname.trim())    { setError('surname',    'Surname is required.');    hasError = true; }
        if (!data.first_name.trim()) { setError('first_name', 'First name is required.'); hasError = true; }
        if (!data.school.trim())     { setError('school',     'School name is required.'); hasError = true; }
        if (!data.bank)              { setError('bank',                  'Please select a bank.');                              hasError = true; }
        if (!data.school_account_number || data.school_account_number.length !== 10) { setError('school_account_number', 'Account number must be 10 digits.'); hasError = true; }
        if (!data.school_account_name.trim()) { setError('school_account_name', 'Please complete account verification before submitting.'); hasError = true; }

        if (hasError) return;

        if (schoolMismatch && !schoolMismatchSeen) {
            setSchoolMismatch(true);
            return;
        }

        post(route('register.public_school.store'));
    }

    return (
        <FormLayout title="Schools" subtitle="Public" accentColor="blue" backLabel="← Back to Portal">
            <p className="text-slate-400 text-sm mb-8 text-center">
                Fill in all fields accurately. Ensure your school bank account details are correct.
            </p>

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
                            <Input
                                type="text"
                                placeholder="Official name of the public school"
                                value={data.school}
                                onChange={e => {
                                    setData('school', e.target.value);
                                    setSchoolMismatch(false);
                                    setSchoolMismatchSeen(false);
                                }}
                            />
                        </FormField>
                    </div>
                </div>

                {/* Bank Details */}
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
                            accentColor="blue"
                            accountNumberLabel="School Account Number"
                            accountNameLabel="School Account Name"
                            onResolvingChange={setBankResolving}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <SubmitButton accentColor="blue" loading={processing} disabled={processing || bankResolving}>
                        {bankResolving ? 'Please wait while we verify your account number…' : 'Submit Registration'}
                    </SubmitButton>
                    <p className="text-center text-slate-600 text-xs mt-3">Max 5 entries accepted for this category</p>
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
                            The school name you entered does not match the bank account name. This could delay your verification. Please confirm both names are correct before proceeding.
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setSchoolMismatch(false); setSchoolMismatchSeen(false); }}
                                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors"
                            >
                                Go Back &amp; Correct
                            </button>
                            <button
                                type="button"
                                onClick={() => { setSchoolMismatch(false); setSchoolMismatchSeen(true); post(route('register.public_school.store')); }}
                                className="flex-1 py-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-medium hover:bg-yellow-500/30 transition-colors"
                            >
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
