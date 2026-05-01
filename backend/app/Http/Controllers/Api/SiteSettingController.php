<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function get($key)
    {
        $setting = SiteSetting::where('key', $key)->first();
        return response()->json($setting ? $setting->value : null);
    }

    public function set(Request $request, $key)
    {
        $setting = SiteSetting::updateOrCreate(
            ['key' => $key],
            ['value' => $request->value]
        );
        return response()->json($setting);
    }

    public function all()
    {
        return response()->json(SiteSetting::all()->pluck('value', 'key'));
    }
}
