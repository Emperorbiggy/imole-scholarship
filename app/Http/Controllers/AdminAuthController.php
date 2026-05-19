<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Inertia\Inertia;

class AdminAuthController extends Controller
{
    public function showLogin()
    {
        // Already authenticated — redirect to admin
        if (auth('admin')->check()) {
            return redirect()->route('admin.index');
        }

        return Inertia::render('Admin/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!$token = auth('admin')->attempt($credentials)) {
            return back()->withErrors(['email' => 'Invalid credentials. Please try again.']);
        }

        $ttl    = config('jwt.ttl', 1440); // minutes
        $cookie = cookie('admin_jwt', $token, $ttl, '/', null, false, true, false, 'Strict');

        return redirect()->route('admin.index')->withCookie($cookie);
    }

    public function logout()
    {
        try {
            $token = request()->cookie('admin_jwt');
            if ($token) {
                auth('admin')->setToken($token)->invalidate();
            }
        } catch (\Exception) {
            // token already invalid — ignore
        }

        return redirect()->route('admin.login')
            ->withCookie(Cookie::forget('admin_jwt'));
    }
}
