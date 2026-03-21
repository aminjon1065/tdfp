<?php

namespace App\Core\Services;

use Illuminate\Http\Request;
use Illuminate\Routing\Exceptions\RouteNotFoundException;
use Illuminate\Support\Facades\Route;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class BrokenLinkAuditService
{
    /**
     * @return array<int, array{path: string, issues: array<int, array{line: int, rule: string, link: string, message: string}>}>
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
     * @return array<int, array{line: int, rule: string, link: string, message: string}>
     */
    public function auditFile(string $path): array
    {
        $content = file_get_contents($path);

        if ($content === false) {
            return [[
                'line' => 1,
                'rule' => 'file-read-failed',
                'link' => '',
                'message' => 'Unable to read file contents.',
            ]];
        }

        $issues = [];

        foreach ($this->extractInternalLinks($content) as $match) {
            $link = $match['link'];

            if ($this->isAllowedLink($link) || $this->linkExists($link)) {
                continue;
            }

            $issues[] = [
                'line' => $this->lineNumber($content, $match['offset']),
                'rule' => 'broken-internal-link',
                'link' => $link,
                'message' => 'Literal internal link does not match any registered application route.',
            ];
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
     * @return array<int, array{link: string, offset: int}>
     */
    private function extractInternalLinks(string $content): array
    {
        $patterns = [
            '/\bhref=(?:"(\/[^"]*)"|\'(\/[^\']*)\'|\{"(\/[^"]*)"\}|\{\'(\/[^\']*)\'\})/s',
            '/\b(?:visit|get|post|put|patch|delete)\((?:"(\/[^"]*)"|\'(\/[^\']*)\')/s',
        ];

        $matches = [];

        foreach ($patterns as $pattern) {
            preg_match_all($pattern, $content, $found, PREG_OFFSET_CAPTURE);

            foreach ($found[0] as $index => [, $offset]) {
                $link = $this->firstNonEmptyMatch(array_slice($found, 1), $index);

                if ($link === null) {
                    continue;
                }

                $matches[] = [
                    'link' => $link,
                    'offset' => $offset,
                ];
            }
        }

        return collect($matches)
            ->unique(fn (array $match) => $match['link'].'@'.$match['offset'])
            ->values()
            ->all();
    }

    /**
     * @param  array<int, array<int, array{0: string, 1: int}>>  $groups
     */
    private function firstNonEmptyMatch(array $groups, int $index): ?string
    {
        foreach ($groups as $group) {
            $value = $group[$index][0] ?? null;

            if ($value !== null && $value !== '') {
                return $value;
            }
        }

        return null;
    }

    private function isAllowedLink(string $link): bool
    {
        if ($link === '' || str_starts_with($link, '//')) {
            return true;
        }

        if (str_starts_with($link, '/storage/')) {
            return true;
        }

        return false;
    }

    private function linkExists(string $link): bool
    {
        $path = parse_url($link, PHP_URL_PATH);

        if (! is_string($path) || $path === '') {
            return false;
        }

        try {
            Route::getRoutes()->match(Request::create($path, 'GET'));

            return true;
        } catch (NotFoundHttpException|RouteNotFoundException|MethodNotAllowedHttpException) {
            return false;
        }
    }

    private function lineNumber(string $content, int $offset): int
    {
        return substr_count(substr($content, 0, $offset), "\n") + 1;
    }
}
