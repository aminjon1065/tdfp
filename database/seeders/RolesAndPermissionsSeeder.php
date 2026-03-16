<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = ['pages', 'news', 'activities', 'documents', 'procurement', 'media', 'users', 'settings', 'audit_logs'];
        $actions = ['view', 'create', 'edit', 'delete', 'publish'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$module}.{$action}"]);
            }
        }

        // GRM specific permissions
        foreach (['view', 'assign', 'update_status', 'close', 'message'] as $action) {
            Permission::firstOrCreate(['name' => "grm.{$action}"]);
        }

        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $superAdmin->syncPermissions(Permission::all());

        $editor = Role::firstOrCreate(['name' => 'editor']);
        $editor->syncPermissions([
            'news.view', 'news.create', 'news.edit',
            'activities.view', 'activities.create', 'activities.edit',
            'documents.view', 'documents.create',
            'media.view', 'media.create',
        ]);

        $contentManager = Role::firstOrCreate(['name' => 'content_manager']);
        $contentManager->syncPermissions([
            'pages.view', 'pages.create', 'pages.edit', 'pages.publish',
            'news.view', 'news.create', 'news.edit', 'news.publish',
            'activities.view', 'activities.create', 'activities.edit', 'activities.publish',
            'documents.view', 'documents.create', 'documents.edit', 'documents.publish',
            'media.view', 'media.create', 'media.edit', 'media.delete',
        ]);

        $procurementOfficer = Role::firstOrCreate(['name' => 'procurement_officer']);
        $procurementOfficer->syncPermissions([
            'procurement.view', 'procurement.create', 'procurement.edit',
            'procurement.publish', 'procurement.delete',
            'documents.view', 'documents.create',
        ]);

        $grmOfficer = Role::firstOrCreate(['name' => 'grm_officer']);
        $grmOfficer->syncPermissions([
            'grm.view', 'grm.assign', 'grm.update_status', 'grm.close', 'grm.message',
        ]);
    }
}
