import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

const TYPE_LABELS = {
    awardee:        'Awardee (Student)',
    teacher:        'Teacher / Principal',
    private_school: 'Private School',
    public_school:  'Public School',
};

const STATUS_META = {
    verified: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400', label: 'Verified' },
    pending:  { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30',   dot: 'bg-amber-400',   label: 'Pending'  },
    rejected: { bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/30',     dot: 'bg-red-400',     label: 'Rejected' },
};

function Field({ label, value, mono }) {
    if (!value) return null;
    return (
        <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-slate-200 text-sm ${mono ? 'font-mono' : ''}`}>{value}</p>
        </div>
    );
}

function FileField({ label, url }) {
    if (!url) return null;
    return (
        <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors"
            >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
                View / Download File
            </a>
        </div>
    );
}

export default function AdminShow({ record, type }) {
    const { props } = usePage();
    const flash = props.flash ?? {};
    const status = STATUS_META[record.status] ?? STATUS_META.pending;

    function handleVerify() {
        router.patch(route('admin.verify', { type, id: record.id }));
    }

    function handleReject() {
        router.patch(route('admin.reject', { type, id: record.id }));
    }

    const fullName = [record.surname, record.first_name, record.middle_name].filter(Boolean).join(' ');

    return (
        <AdminLayout title={fullName}>
            <Head title={`${fullName} — Admin`} />
            <div className="max-w-4xl">

                    {/* Flash message */}
                    {flash.success && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {flash.success}
                        </div>
                    )}

                    {/* Header card */}
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">
                                    {TYPE_LABELS[type] ?? type}
                                </p>
                                <h2 className="text-2xl font-black text-white">{fullName}</h2>
                                {record.school && (
                                    <p className="text-slate-400 text-sm mt-1">{record.school}</p>
                                )}
                                <p className="text-slate-600 text-xs mt-2">{record.created_at}</p>
                            </div>

                            <div className="flex flex-col items-start md:items-end gap-3">
                                {/* Current status badge */}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border ${status.bg} ${status.text} ${status.border}`}>
                                    <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                                    {status.label}
                                </span>

                                {/* Action buttons */}
                                <div className="flex gap-2">
                                    {record.status !== 'verified' && (
                                        <button
                                            onClick={handleVerify}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/30 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Verify
                                        </button>
                                    )}
                                    {record.status !== 'rejected' && (
                                        <button
                                            onClick={handleReject}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-semibold hover:bg-red-500/30 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Reject
                                        </button>
                                    )}
                                    {record.status !== 'pending' && (
                                        <button
                                            onClick={() => router.patch(route('admin.pending', { type, id: record.id }))}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold hover:bg-white/10 transition-all"
                                        >
                                            Reset to Pending
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Personal / Representative Info */}
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
                                {type === 'awardee' || type === 'teacher' ? 'Personal Information' : 'Representative Information'}
                            </p>
                            <div className="space-y-4">
                                <Field label="Surname"    value={record.surname} />
                                <Field label="First Name" value={record.first_name} />
                                <Field label="Middle Name" value={record.middle_name} />
                                {record.school && <Field label="School" value={record.school} />}
                                {record.designation && <Field label="Designation" value={record.designation} />}
                                {record.nin && <Field label="NIN" value={record.nin} mono />}
                            </div>
                        </div>

                        {/* Bank / Account Info */}
                        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Bank Account</p>
                            <div className="space-y-4">
                                <Field label="Bank" value={record.bank_name ? `${record.bank_name} (${record.bank})` : record.bank} />
                                <Field label="Account Number" value={record.account_number ?? record.school_account_number} mono />
                                <Field label="Account Name"   value={record.account_name   ?? record.school_account_name} />
                            </div>
                        </div>

                        {/* Teaching details (teacher only) */}
                        {type === 'teacher' && (
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Teaching Details</p>
                                <div className="space-y-4">
                                    <Field label="Subjects Taught" value={record.subjects_taught} />
                                    <FileField label="Appointment Letter" url={record.appointment_letter_url} />
                                </div>
                            </div>
                        )}

                        {/* Private school docs */}
                        {type === 'private_school' && (
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Documents & Verification</p>
                                <div className="space-y-4">
                                    <Field label="Bill ID" value={record.bill_id} mono />
                                    <Field label="Invoice Status" value={record.bill_invoice_status} />
                                    <Field label="School Code" value={record.school_code} mono />
                                    <FileField label="Harmonized Bill Payment" url={record.harmonized_bill_url} />
                                </div>
                            </div>
                        )}
                    </div>
            </div>
        </AdminLayout>
    );
}
