<?php

namespace App\Core\Services;

use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;

class AccessibilityAuditService
{
    /**
     * @return array<int, array{path: string, issues: array<int, array{line: int, rule: string, message: string}>}>
     */
    public function audit(array $paths = []): array
    {
        return collect($this->resolvePaths($paths))
            ->map(fn (string $path): array => [
                'path' => $path,
                'issues' => $this->auditFile($path),
            ])
            ->all();
    }

    /**
     * @return array<int, string>
     */
    public function defaultPaths(): array
    {
        $paths = [
            resource_path('js/layouts/public-layout.tsx'),
            resource_path('js/components/social-share.tsx'),
        ];

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator(resource_path('js/pages/public'))
        );

        foreach ($iterator as $file) {
            if (! $file instanceof SplFileInfo || ! $file->isFile()) {
                continue;
            }

            if ($file->getExtension() !== 'tsx') {
                continue;
            }

            $paths[] = $file->getPathname();
        }

        $paths = array_values(array_unique(array_filter($paths, 'file_exists')));
        sort($paths);

        return $paths;
    }

    /**
     * @return array<int, array{line: int, rule: string, message: string}>
     */
    public function auditFile(string $path): array
    {
        $content = file_get_contents($path);

        if ($content === false) {
            return [[
                'line' => 1,
                'rule' => 'file-read-failed',
                'message' => 'Unable to read file contents.',
            ]];
        }

        $issues = [];
        $labels = $this->extractLabelTargets($content);

        if ($this->isPublicLayout($path)) {
            if (! preg_match('/href=\{"?#main-content"?\}/', $content) && ! str_contains($content, 'href="#main-content"')) {
                $issues[] = $this->issue($content, 1, 'missing-skip-link', 'Public layout must expose a skip link to #main-content.');
            }

            if (! preg_match('/<main\b[^>]*id="main-content"/', $content)) {
                $issues[] = $this->issue($content, 1, 'missing-main-landmark', 'Public layout must include <main id="main-content">.');
            }
        }

        if ($this->isPublicPage($path) && ! preg_match('/<h1\b/', $content, $match, PREG_OFFSET_CAPTURE)) {
            $issues[] = $this->issue($content, 1, 'missing-h1', 'Public pages must contain a primary <h1> heading.');
        }

        preg_match_all('/<(img|PublicImage)\b(?P<attrs>[^>]*)>/s', $content, $imageMatches, PREG_OFFSET_CAPTURE);

        foreach ($imageMatches[0] as $index => [$fullMatch, $offset]) {
            $attributes = $imageMatches['attrs'][$index][0];

            if ($this->hasAttribute($attributes, 'alt')) {
                continue;
            }

            if ($this->hasAttribute($attributes, 'aria-hidden') || preg_match('/role=(?:"presentation"|\'presentation\')/', $attributes)) {
                continue;
            }

            $issues[] = $this->issue(
                $content,
                $offset,
                'missing-image-alt',
                'Images must define an alt attribute or be explicitly decorative.'
            );
        }

        preg_match_all('/<(Input|input|select|textarea)\b(?P<attrs>[^>]*)>/s', $content, $controlMatches, PREG_OFFSET_CAPTURE);

        foreach ($controlMatches[0] as $index => [$fullMatch, $offset]) {
            $tag = $controlMatches[1][$index][0];
            $attributes = $controlMatches['attrs'][$index][0];

            if ($tag === 'input' || $tag === 'Input') {
                $type = $this->extractAttribute($attributes, 'type');

                if ($type === 'hidden') {
                    continue;
                }
            }

            if ($this->hasAttribute($attributes, 'aria-label') || $this->hasAttribute($attributes, 'aria-labelledby')) {
                continue;
            }

            $id = $this->extractAttribute($attributes, 'id');

            if ($id !== null && in_array($id, $labels, true)) {
                continue;
            }

            $issues[] = $this->issue(
                $content,
                $offset,
                'missing-form-label',
                'Form controls must provide a label, aria-label, or aria-labelledby.'
            );
        }

        return $issues;
    }

    /**
     * @return array<int, string>
     */
    private function resolvePaths(array $paths): array
    {
        if ($paths === []) {
            return $this->defaultPaths();
        }

        $resolved = [];

        foreach ($paths as $path) {
            $absolutePath = str_starts_with($path, DIRECTORY_SEPARATOR)
                ? $path
                : base_path($path);

            if (is_file($absolutePath)) {
                $resolved[] = $absolutePath;

                continue;
            }

            if (! is_dir($absolutePath)) {
                continue;
            }

            $iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($absolutePath)
            );

            foreach ($iterator as $file) {
                if (! $file instanceof SplFileInfo || ! $file->isFile()) {
                    continue;
                }

                if ($file->getExtension() !== 'tsx') {
                    continue;
                }

                $resolved[] = $file->getPathname();
            }
        }

        $resolved = array_values(array_unique($resolved));
        sort($resolved);

        return $resolved;
    }

    /**
     * @return array<int, string>
     */
    private function extractLabelTargets(string $content): array
    {
        preg_match_all(
            '/<(?:label|Label)\b[^>]*htmlFor=(?:"([^"]+)"|\'([^\']+)\'|\{"([^"]+)"\}|\{\'([^\']+)\'\})/s',
            $content,
            $matches
        );

        return collect($matches)
            ->slice(1)
            ->flatten()
            ->filter(fn (?string $value): bool => filled($value))
            ->values()
            ->all();
    }

    private function extractAttribute(string $attributes, string $name): ?string
    {
        $pattern = sprintf('/\b%s=(?:"([^"]+)"|\'([^\']+)\'|\{"([^"]+)"\}|\{\'([^\']+)\'\})/s', preg_quote($name, '/'));

        if (! preg_match($pattern, $attributes, $matches)) {
            return null;
        }

        foreach (array_slice($matches, 1) as $value) {
            if ($value !== '' && $value !== null) {
                return $value;
            }
        }

        return null;
    }

    private function hasAttribute(string $attributes, string $name): bool
    {
        return preg_match(sprintf('/\b%s=/', preg_quote($name, '/')), $attributes) === 1;
    }

    /**
     * @return array{line: int, rule: string, message: string}
     */
    private function issue(string $content, int $offset, string $rule, string $message): array
    {
        return [
            'line' => substr_count(substr($content, 0, $offset), "\n") + 1,
            'rule' => $rule,
            'message' => $message,
        ];
    }

    private function isPublicLayout(string $path): bool
    {
        return str_ends_with($path, 'resources/js/layouts/public-layout.tsx');
    }

    private function isPublicPage(string $path): bool
    {
        return str_contains(str_replace('\\', '/', $path), '/resources/js/pages/public/');
    }
}
