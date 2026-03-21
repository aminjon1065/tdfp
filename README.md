# TDFP

TDFP is a Laravel 12 + Inertia React application for managing a public-facing institutional website and its internal administration panel.

## Purpose

The project combines:

- A multilingual public website
- An internal admin panel for content and operations
- A GRM workflow for complaint submission and tracking
- Operational settings, audit logging, and role-based access control

## Stack

- PHP 8.4
- Laravel 12
- Inertia.js v2 with React 19 and TypeScript
- Laravel Fortify for authentication
- Laravel Wayfinder
- Spatie Permission for roles and permissions
- Spatie Translatable
- Pest 4 for testing

## Main Modules

- Public website pages and CMS content
- News, activities, documents, procurement, and media management
- GRM case submission and tracking
- Search index and public search
- Admin dashboard, users, settings, and audit logs

## Local Environment

Current local site configuration in Herd:

- App URL: `https://tdfp.test`
- Project path: `/Users/aminjon/Herd/tdfp`
- PHP: `8.4`
- Node.js: `v22.22.0`
- Database: MySQL
- Cache/session/queue: database-backed

If the frontend changes are not visible, run `npm run dev` or `npm run build`.

## Local Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed --force
npm install
npm run build
```

Or use the bundled bootstrap script:

```bash
composer run setup
```

If you are using Herd, make sure the site points to this project and MySQL is running.

## Environment Notes

The checked-in `.env.example` is SQLite-oriented, but the current local project is configured to use MySQL in Herd.

Relevant runtime defaults in the active environment:

- `APP_URL=https://tdfp.test`
- `APP_LOCALE=ru`
- `APP_FALLBACK_LOCALE=ru`
- `DB_CONNECTION=mysql`
- `SESSION_DRIVER=database`
- `QUEUE_CONNECTION=database`
- `CACHE_STORE=database`

## Development

```bash
composer run dev
```

This starts:

- Laravel app server
- Queue listener
- Laravel Pail log stream
- Vite dev server

For SSR mode:

```bash
composer run dev:ssr
```

Useful commands:

```bash
php artisan test --compact
npm run types
vendor/bin/pint --dirty
php artisan route:list --except-vendor
php artisan migrate:status
```

## Access

- Public site: `https://tdfp.test/`
- Admin panel: `https://tdfp.test/admin`
- User settings: `https://tdfp.test/settings/profile`

## Seed Data

`DatabaseSeeder` currently loads:

- roles and permissions
- default admin user
- default CMS pages
- news categories
- document categories
- site settings

Seeders of interest:

- [database/seeders/DatabaseSeeder.php](/Users/aminjon/Herd/tdfp/database/seeders/DatabaseSeeder.php)
- [database/seeders/AdminUserSeeder.php](/Users/aminjon/Herd/tdfp/database/seeders/AdminUserSeeder.php)
- [database/seeders/RolesAndPermissionsSeeder.php](/Users/aminjon/Herd/tdfp/database/seeders/RolesAndPermissionsSeeder.php)
- [database/seeders/SettingsSeeder.php](/Users/aminjon/Herd/tdfp/database/seeders/SettingsSeeder.php)
- [database/seeders/CmsPageSeeder.php](/Users/aminjon/Herd/tdfp/database/seeders/CmsPageSeeder.php)

Default seeded admin account:

- Email: `admin@pic.tj`
- Password: `Momajon10`

Change this immediately outside local development.

## Roles

The project seeds these core roles:

- `super_admin`
- `editor`
- `content_manager`
- `procurement_officer`
- `grm_officer`

Permissions are module-based and include actions like `view`, `create`, `edit`, `delete`, and `publish`. GRM uses a separate permission set such as `grm.view`, `grm.assign`, and `grm.update_status`.

## Main Routes

Public:

- `/`
- `/about`
- `/project`
- `/activities`
- `/news`
- `/documents`
- `/procurement`
- `/media`
- `/grm`
- `/search`
- `/contact`

Admin:

- `/admin`
- `/admin/pages`
- `/admin/news`
- `/admin/activities`
- `/admin/documents`
- `/admin/procurement`
- `/admin/media`
- `/admin/grm`
- `/admin/users`
- `/admin/settings`
- `/admin/audit-logs`

Settings and auth:

- `/settings/profile`
- `/settings/password`
- `/settings/appearance`
- `/settings/two-factor`

## Content and Operations Notes

- Public static pages are seeded for `about` and `project`.
- Site-wide contact and analytics values are stored in the `settings` table.
- GRM submissions generate a ticket number and tracking token.
- Public search reads from the `search_index` table.
- Audit entries are stored in `audit_logs`.

## Testing and Quality

Main checks used during development:

```bash
php artisan test --compact
php artisan test --compact tests/Feature/Settings/SettingCacheTest.php
npm run types
vendor/bin/pint --dirty
```

Current baseline after the latest fixes:

- Pest: passing
- TypeScript: passing
- Pint: passing

## Project Structure

- `app/Modules/*` contains business modules grouped by domain
- `resources/js/pages/*` contains Inertia pages
- `resources/js/components/*` contains shared UI and admin components
- `routes/web.php` contains public routes
- `routes/admin.php` contains admin routes
- `routes/settings.php` contains user settings routes
- `database/seeders/*` contains initial project data

## Operational Caveats

- Queue-dependent features expect the queue listener to be running in development.
- Mail is configured through SMTP in the active local environment.
- Cache, queue, and sessions use database tables, so migrations must be up to date.
- If Vite assets are missing, run `npm run build` or `npm run dev`.
