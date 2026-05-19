<?php

namespace App\Http\Controllers;

use App\Models\Awardee;
use App\Models\Teacher;
use App\Models\PrivateSchool;
use App\Models\PublicSchool;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $awardees       = Awardee::orderByDesc('created_at')->get()->map(fn($r) => $this->format($r, 'awardee'));
        $teachers       = Teacher::orderByDesc('created_at')->get()->map(fn($r) => $this->format($r, 'teacher'));
        $privateSchools = PrivateSchool::orderByDesc('created_at')->get()->map(fn($r) => $this->format($r, 'private_school'));
        $publicSchools  = PublicSchool::orderByDesc('created_at')->get()->map(fn($r) => $this->format($r, 'public_school'));

        $all = $awardees->concat($teachers)->concat($privateSchools)->concat($publicSchools)
            ->sortByDesc('sort_ts')->values();

        return Inertia::render('Admin/Index', [
            'registrations' => $all,
            'counts' => [
                'all'            => $all->count(),
                'awardee'        => $awardees->count(),
                'teacher'        => $teachers->count(),
                'private_school' => $privateSchools->count(),
                'public_school'  => $publicSchools->count(),
                'verified'       => $all->where('status', 'verified')->count(),
                'pending'        => $all->where('status', 'pending')->count(),
                'rejected'       => $all->where('status', 'rejected')->count(),
            ],
        ]);
    }

    public function show(string $type, int $id)
    {
        $record = $this->getModel($type)::findOrFail($id);
        $data   = $record->toArray();

        if (!empty($data['harmonized_bill_path'])) {
            $data['harmonized_bill_url'] = asset('storage/' . $data['harmonized_bill_path']);
        }
        if (!empty($data['appointment_letter_path'])) {
            $data['appointment_letter_url'] = asset('storage/' . $data['appointment_letter_path']);
        }

        return Inertia::render('Admin/Show', [
            'record' => $data,
            'type'   => $type,
        ]);
    }

    public function verify(string $type, int $id)
    {
        $this->getModel($type)::findOrFail($id)->update(['status' => 'verified']);
        return back()->with('success', 'Registration verified successfully.');
    }

    public function reject(string $type, int $id)
    {
        $this->getModel($type)::findOrFail($id)->update(['status' => 'rejected']);
        return back()->with('success', 'Registration rejected.');
    }

    public function pending(string $type, int $id)
    {
        $this->getModel($type)::findOrFail($id)->update(['status' => 'pending']);
        return back()->with('success', 'Status reset to pending.');
    }

    private function getModel(string $type)
    {
        return match($type) {
            'awardee'        => Awardee::class,
            'teacher'        => Teacher::class,
            'private_school' => PrivateSchool::class,
            'public_school'  => PublicSchool::class,
            default          => abort(404),
        };
    }

    private function format($record, string $type): array
    {
        $fullName = trim(implode(' ', array_filter([
            $record->surname,
            $record->first_name,
            $record->middle_name,
        ])));

        return [
            'id'         => $record->id,
            'type'       => $type,
            'name'       => $fullName,
            'school'     => $record->school ?? null,
            'status'     => $record->status,
            'created_at' => $record->created_at?->format('d M Y, g:i A'),
            'sort_ts'    => $record->created_at?->timestamp ?? 0,
        ];
    }
}
