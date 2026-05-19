<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class AdminJwt
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->cookie('admin_jwt');

        if (!$token) {
            return $this->redirectToLogin($request);
        }

        try {
            auth('admin')->setToken($token)->authenticate();
        } catch (TokenExpiredException) {
            return $this->redirectToLogin($request, 'Your session has expired. Please sign in again.');
        } catch (JWTException) {
            return $this->redirectToLogin($request);
        }

        return $next($request);
    }

    private function redirectToLogin(Request $request, string $message = null)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return redirect()->route('admin.login')
            ->with('status', $message);
    }
}
