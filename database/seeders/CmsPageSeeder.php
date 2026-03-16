<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\PageTranslation;
use Illuminate\Database\Seeder;

class CmsPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            'about' => [
                'en' => [
                    'title' => 'About the Project',
                    'content' => 'Information about the Tajikistan Digital Foundations Project.',
                    'meta_title' => 'About',
                    'meta_description' => 'About the project.',
                ],
                'ru' => [
                    'title' => 'О проекте',
                    'content' => 'Информация о проекте Tajikistan Digital Foundations Project.',
                    'meta_title' => 'О проекте',
                    'meta_description' => 'Информация о проекте.',
                ],
                'tj' => [
                    'title' => 'Дар бораи лоиҳа',
                    'content' => 'Маълумот дар бораи лоиҳаи Tajikistan Digital Foundations Project.',
                    'meta_title' => 'Дар бораи лоиҳа',
                    'meta_description' => 'Маълумот дар бораи лоиҳа.',
                ],
            ],
            'project' => [
                'en' => [
                    'title' => 'Project Overview',
                    'content' => 'Overview, objectives, and implementation details for the project.',
                    'meta_title' => 'Project',
                    'meta_description' => 'Project overview.',
                ],
                'ru' => [
                    'title' => 'Обзор проекта',
                    'content' => 'Обзор, цели и детали реализации проекта.',
                    'meta_title' => 'Проект',
                    'meta_description' => 'Обзор проекта.',
                ],
                'tj' => [
                    'title' => 'Шарҳи лоиҳа',
                    'content' => 'Шарҳ, ҳадафҳо ва ҷузъиёти татбиқи лоиҳа.',
                    'meta_title' => 'Лоиҳа',
                    'meta_description' => 'Шарҳи лоиҳа.',
                ],
            ],
        ];

        foreach ($pages as $slug => $translations) {
            $page = Page::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'status' => 'published',
                    'published_at' => now(),
                    'created_by' => null,
                ]
            );

            foreach ($translations as $language => $translation) {
                PageTranslation::query()->updateOrCreate(
                    [
                        'page_id' => $page->id,
                        'language' => $language,
                    ],
                    $translation
                );
            }
        }
    }
}
