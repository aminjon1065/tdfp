<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'site_title', 'value' => 'Projects Implementation Center', 'group' => 'general', 'type' => 'text'],
            ['key' => 'site_description', 'value' => 'Official website of the Projects Implementation Center implementing the Tajikistan Digital Foundations Project.', 'group' => 'general', 'type' => 'textarea'],
            ['key' => 'contact_email', 'value' => 'info@pic.tj', 'group' => 'contact', 'type' => 'email'],
            ['key' => 'grm_notification_email', 'value' => 'grm@pic.tj', 'group' => 'grm', 'type' => 'email'],
            ['key' => 'contact_phone', 'value' => '+992 000 000 000', 'group' => 'contact', 'type' => 'text'],
            ['key' => 'contact_address', 'value' => 'Dushanbe, Tajikistan', 'group' => 'contact', 'type' => 'text'],
            ['key' => 'facebook_url', 'value' => '', 'group' => 'social', 'type' => 'url'],
            ['key' => 'twitter_url', 'value' => '', 'group' => 'social', 'type' => 'url'],
            ['key' => 'youtube_url', 'value' => '', 'group' => 'social', 'type' => 'url'],
            ['key' => 'google_analytics_id', 'value' => '', 'group' => 'analytics', 'type' => 'text'],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
