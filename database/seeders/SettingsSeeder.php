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
            ['key' => 'analytics_enabled', 'value' => '0', 'group' => 'analytics', 'type' => 'boolean'],
            ['key' => 'analytics_provider', 'value' => 'ga4', 'group' => 'analytics', 'type' => 'text'],
            ['key' => 'google_analytics_id', 'value' => '', 'group' => 'analytics', 'type' => 'text'],
            ['key' => 'analytics_owner_name', 'value' => '', 'group' => 'analytics', 'type' => 'text'],
            ['key' => 'analytics_owner_email', 'value' => '', 'group' => 'analytics', 'type' => 'email'],
            ['key' => 'support_contact_name', 'value' => '', 'group' => 'operations', 'type' => 'text'],
            ['key' => 'support_contact_email', 'value' => '', 'group' => 'operations', 'type' => 'email'],
            ['key' => 'support_contact_phone', 'value' => '', 'group' => 'operations', 'type' => 'text'],
            ['key' => 'support_hours', 'value' => '', 'group' => 'operations', 'type' => 'text'],
            ['key' => 'incident_contact_email', 'value' => '', 'group' => 'operations', 'type' => 'email'],
            ['key' => 'maintenance_report_email', 'value' => '', 'group' => 'operations', 'type' => 'email'],
            ['key' => 'backup_frequency', 'value' => '', 'group' => 'operations', 'type' => 'text'],
            ['key' => 'backup_retention_days', 'value' => '30', 'group' => 'operations', 'type' => 'number'],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
