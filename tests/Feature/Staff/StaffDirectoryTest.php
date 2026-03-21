<?php

use App\Models\StaffMember;
use App\Models\StaffMemberTranslation;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('public staff directory renders only published hierarchy in sorted order', function () {
    $director = StaffMember::factory()->create([
        'is_leadership' => true,
        'sort_order' => 1,
        'is_published' => true,
    ]);

    StaffMemberTranslation::create([
        'staff_member_id' => $director->id,
        'language' => 'en',
        'full_name' => 'Director General',
        'job_title' => 'Executive Director',
    ]);

    StaffMemberTranslation::create([
        'staff_member_id' => $director->id,
        'language' => 'ru',
        'full_name' => 'Генеральный директор',
        'job_title' => 'Исполнительный директор',
    ]);

    StaffMemberTranslation::create([
        'staff_member_id' => $director->id,
        'language' => 'tj',
        'full_name' => 'Директори генералӣ',
        'job_title' => 'Директори иҷроия',
    ]);

    $manager = StaffMember::factory()->create([
        'parent_id' => $director->id,
        'sort_order' => 2,
        'is_published' => true,
    ]);

    foreach (['en' => ['Operations Manager', 'Operations'], 'ru' => ['Менеджер по операциям', 'Операции'], 'tj' => ['Менеҷери амалиёт', 'Амалиёт']] as $language => [$name, $jobTitle]) {
        StaffMemberTranslation::create([
            'staff_member_id' => $manager->id,
            'language' => $language,
            'full_name' => $name,
            'job_title' => $jobTitle,
        ]);
    }

    $draft = StaffMember::factory()->create([
        'sort_order' => 0,
        'is_published' => false,
    ]);

    foreach (['en', 'ru', 'tj'] as $language) {
        StaffMemberTranslation::create([
            'staff_member_id' => $draft->id,
            'language' => $language,
            'full_name' => 'Draft Staff',
            'job_title' => 'Hidden Role',
        ]);
    }

    $this->get(route('team.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/staff/index')
            ->where('staffHierarchy', function (Collection $items) use ($director, $manager) {
                return $items->count() === 1
                    && $items->first()['id'] === $director->id
                    && count($items->first()['children']) === 1
                    && $items->first()['children'][0]['id'] === $manager->id;
            })
        );
});

test('super admins can create staff members with translations and photo upload', function () {
    Storage::fake('public');

    $admin = User::factory()->create();
    $admin->assignRole('super_admin');

    $this->actingAs($admin);

    $response = $this->post(route('admin.staff-members.store'), [
        'parent_id' => null,
        'email' => 'director@example.com',
        'phone' => '+992 900 000 001',
        'photo' => UploadedFile::fake()->image('director.jpg'),
        'is_leadership' => true,
        'is_published' => true,
        'sort_order' => 1,
        'translations' => [
            'en' => [
                'full_name' => 'Director General',
                'job_title' => 'Executive Director',
                'department' => 'Leadership',
                'biography' => 'Leads overall delivery.',
            ],
            'ru' => [
                'full_name' => 'Генеральный директор',
                'job_title' => 'Исполнительный директор',
                'department' => 'Руководство',
                'biography' => 'Отвечает за общее руководство.',
            ],
            'tj' => [
                'full_name' => 'Директори генералӣ',
                'job_title' => 'Директори иҷроия',
                'department' => 'Роҳбарият',
                'biography' => 'Ба роҳбарии умумӣ масъул аст.',
            ],
        ],
    ]);

    $response->assertRedirect(route('admin.staff-members.index'));

    $staffMember = StaffMember::query()->first();

    expect($staffMember)->not->toBeNull()
        ->and($staffMember?->is_leadership)->toBeTrue()
        ->and($staffMember?->translations()->count())->toBe(3);

    Storage::disk('public')->assertExists($staffMember->photo_path);
});

test('staff members cannot be reassigned to their own descendants', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super_admin');

    $this->actingAs($admin);

    $director = StaffMember::factory()->create();
    $manager = StaffMember::factory()->create(['parent_id' => $director->id]);

    foreach ([$director, $manager] as $member) {
        foreach (['en', 'ru', 'tj'] as $language) {
            StaffMemberTranslation::create([
                'staff_member_id' => $member->id,
                'language' => $language,
                'full_name' => "Staff {$member->id} {$language}",
                'job_title' => 'Role',
            ]);
        }
    }

    $response = $this->from(route('admin.staff-members.edit', $director))
        ->put(route('admin.staff-members.update', $director), [
            'parent_id' => $manager->id,
            'email' => $director->email,
            'phone' => $director->phone,
            'is_leadership' => false,
            'is_published' => true,
            'sort_order' => 1,
            'translations' => [
                'en' => ['full_name' => 'Director', 'job_title' => 'Director', 'department' => '', 'biography' => ''],
                'ru' => ['full_name' => 'Директор', 'job_title' => 'Директор', 'department' => '', 'biography' => ''],
                'tj' => ['full_name' => 'Директор', 'job_title' => 'Директор', 'department' => '', 'biography' => ''],
            ],
        ]);

    $response->assertStatus(422);
});
