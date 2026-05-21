import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from '@inertiajs/react';
import FormLayout from '@/Components/FormLayout';
import { FormField, Input, SubmitButton } from '@/Components/FormField';
import NINField from '@/Components/NINField';
import BankAccountField from '@/Components/BankAccountField';

function nameMatch(entered, verified) {
    return entered.trim().toLowerCase() === (verified ?? '').trim().toLowerCase();
}

export default function Awardee() {
    const [bankResolving, setBankResolving]   = useState(false);
    const [ninVerified, setNinVerified]       = useState(false);
    const [mismatch, setMismatch]             = useState(false);
    const [ninHasMismatch, setNinHasMismatch] = useState(false);
    const [ninDuplicate, setNinDuplicate]     = useState(false);
    const [accountDuplicate, setAccountDuplicate] = useState(false);

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        surname:        '',
        first_name:     '',
        middle_name:    '',
        school:         '',
        nin:            '',
        account_number: '',
        account_name:   '',
        bank:           '',
        bank_name:      '',
    });

    function handleNINVerified(ninData) {
        if (!ninData) { setNinVerified(false); return; }
        setNinVerified(true);

        // Compare entered names with NIN names (case-insensitive)
        const surnameOk    = nameMatch(data.surname,     ninData.surname);
        const firstNameOk  = nameMatch(data.first_name,  ninData.first_name);

        if (!surnameOk || !firstNameOk) {
            setNinHasMismatch(true);
            setMismatch(true);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        clearErrors();

        let hasError = false;

        if (!data.surname.trim())    { setError('surname',    'Surname is required.');    hasError = true; }
        if (!data.first_name.trim()) { setError('first_name', 'First name is required.'); hasError = true; }
        if (!data.school.trim())     { setError('school',     'School name is required.'); hasError = true; }
        if (!data.nin || data.nin.length !== 11) { setError('nin', 'NIN must be 11 digits.'); hasError = true; }
        if (!data.bank)              { setError('bank',           'Please select a bank.');                              hasError = true; }
        if (!data.account_number || data.account_number.length !== 10) { setError('account_number', 'Account number must be 10 digits.'); hasError = true; }
        if (!data.account_name.trim()) { setError('account_name', 'Please complete account verification before submitting.'); hasError = true; }

        if (hasError) return;

        post(route('register.awardee.store'));
    }

    return (
        <FormLayout title="Awardees" subtitle="Students" accentColor="amber" backLabel="← Back to Portal">
            <p className="text-slate-400 text-sm mb-8 text-center">
                Fill in all fields accurately. Your NIN must be valid and will be used for verification.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal Information */}
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
                            onChange={val => { setData('nin', val); setNinVerified(false); setMismatch(false); setNinHasMismatch(false); setNinDuplicate(false); }}
                            error={errors.nin}
                            onVerified={handleNINVerified}
                            nameMismatch={ninHasMismatch}
                            registrationType="awardee"
                            onDuplicateChange={setNinDuplicate}
                        />
                    </div>
                </div>

                {/* Bank Account Details */}
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Bank Account Details</p>
                    <div className="space-y-4">
                        <BankAccountField
                            accountNumber={data.account_number}
                            accountName={data.account_name}
                            bank={data.bank}
                            onAccountNumber={val => setData('account_number', val)}
                            onAccountName={val => setData('account_name', val)}
                            onBank={val => setData('bank', val)}
                            onBankName={val => setData('bank_name', val)}
                            errors={{ account_number: errors.account_number, account_name: errors.account_name, bank: errors.bank }}
                            accentColor="amber"
                            onResolvingChange={setBankResolving}
                            registrationType="awardee"
                            onDuplicateChange={setAccountDuplicate}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <SubmitButton accentColor="amber" loading={processing} disabled={processing || bankResolving || ninHasMismatch || ninDuplicate || accountDuplicate}>
                        {bankResolving ? 'Please wait while we verify your account number…' : 'Submit Registration'}
                    </SubmitButton>
                    <p className="text-center text-slate-600 text-xs mt-3">Max 270 entries accepted for this category</p>
                </div>
            </form>

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
