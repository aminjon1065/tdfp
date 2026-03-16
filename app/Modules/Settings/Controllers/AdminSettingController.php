<?php

namespace App\Modules\Settings\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Modules\Settings\Requests\UpdateSettingRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/settings/index', [
            'settings' => Setting::all()->groupBy('group'),
        ]);
    }

    public function update(UpdateSettingRequest $request): RedirectResponse
    {
        foreach ($request->validated('settings') as $key => $value) {
            Setting::set($key, $value);
        }

        return back()->with('success', 'Settings saved.');
    }
}
