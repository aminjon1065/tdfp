<?php

namespace Database\Seeders;

use App\Models\DocumentCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DocumentCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Project Documentation',
            'Technical Reports',
            'Strategies and Policies',
            'Procurement Documents',
            'Presentations',
            'Publications',
        ];

        foreach ($categories as $name) {
            DocumentCategory::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        }
    }
}
