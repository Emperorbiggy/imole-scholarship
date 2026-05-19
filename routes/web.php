<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AwardeeController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\PrivateSchoolController;
use App\Http\Controllers\PublicSchoolController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NINVerificationController;
use App\Http\Controllers\PaystackController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Main landing page — renders private or public portal based on PORTAL env
Route::get('/', function () {
    return env('PORTAL') === 'private'
        ? Inertia::render('PrivateWelcome')
        : Inertia::render('Welcome');
})->name('home');

// Private school landing page (for subdomain)
Route::get('/private', function () {
    return Inertia::render('PrivateWelcome');
})->name('private.home');

// Awardees (Students)
Route::get('/register/awardee', [AwardeeController::class, 'create'])->name('register.awardee');
Route::post('/register/awardee', [AwardeeController::class, 'store'])->name('register.awardee.store');

// Teachers & Principals
Route::get('/register/teacher', [TeacherController::class, 'create'])->name('register.teacher');
Route::post('/register/teacher', [TeacherController::class, 'store'])->name('register.teacher.store');

// Private Schools
Route::get('/register/private-school', [PrivateSchoolController::class, 'create'])->name('register.private_school');
Route::post('/register/private-school', [PrivateSchoolController::class, 'store'])->name('register.private_school.store');

// Public Schools
Route::get('/register/public-school', [PublicSchoolController::class, 'create'])->name('register.public_school');
Route::post('/register/public-school', [PublicSchoolController::class, 'store'])->name('register.public_school.store');

// NIN Verification (AJAX)
Route::post('/verify/nin', [NINVerificationController::class, 'verify'])->name('verify.nin');

// Paystack (AJAX)
Route::get('/paystack/banks', [PaystackController::class, 'banks'])->name('paystack.banks');
Route::post('/paystack/resolve', [PaystackController::class, 'resolve'])->name('paystack.resolve');

// Success page
Route::get('/success', function () {
    return Inertia::render('Success');
})->name('success');

// Admin auth (JWT — no middleware on login routes)
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login',  [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.store');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

    // Protected admin routes
    Route::middleware(['admin.jwt'])->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::get('/{type}/{id}', [AdminController::class, 'show'])->name('show');
        Route::patch('/{type}/{id}/verify',  [AdminController::class, 'verify'])->name('verify');
        Route::patch('/{type}/{id}/reject',  [AdminController::class, 'reject'])->name('reject');
        Route::patch('/{type}/{id}/pending', [AdminController::class, 'pending'])->name('pending');
    });
});

// Auth & Profile routes
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
