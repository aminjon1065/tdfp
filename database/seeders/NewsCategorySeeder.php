<?php

namespace Database\Seeders;

use App\Models\NewsCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NewsCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Project Updates',
            'Events',
            'Workshops',
            'Training Programs',
            'Partnerships',
            'Government Initiatives',
            'Press Releases',
        ];

        foreach ($categories as $name) {
            NewsCategory::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        }
    }
}
