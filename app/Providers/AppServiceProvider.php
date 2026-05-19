<?php

namespace App\Providers;

use App\Services\ErmsService;
use App\Services\NINService;
use App\Services\PaystackService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ErmsService::class);
        $this->app->singleton(PaystackService::class);
        $this->app->singleton(NINService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
