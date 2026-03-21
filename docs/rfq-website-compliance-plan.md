# RFQ Website Compliance Plan

## Purpose

This document is a working guide for aligning the current project with the requirements from `RFQ for web site.docx` for the PIC EOP website.

It is intended to answer:

- what is already implemented
- what is only partially covered
- what is still missing
- what should be done first

## Source Reviewed

- RFQ Ref No. `PIC-EOP-NC-RFQ-01`
- RFQ date: `October 10, 2025`
- Section reviewed in detail:
  - `ANNEX 1: Purchaser's Requirements`
  - `1.1 List of Services and Delivery Period`
  - `1.2 Deliverables and Completion Schedule`
  - `1.3 Technical Requirements`

## Important RFQ Note

The RFQ appears internally inconsistent on post-launch support duration:

- In `1.1 List of Services and Delivery Period`: `90 days after contract signing for website launch + 6 months support`
- In `1.3 Technical Requirements`: `24 months after the website goes live`

This should be clarified with the client, because acceptance and support obligations are ambiguous.

## Current Compliance Summary

### Implemented

- Public website structure exists
- Multilingual support exists for `en`, `ru`, `tj`
- CMS/admin area exists
- Role/permission system exists
- News, pages, documents, procurement, media, GRM, search modules exist
- Audit logs exist
- Public SEO baseline now exists: sitemap, canonical/meta coverage, JSON-LD baseline, and configuration-gated analytics integration

### Partially Implemented

- CMS features required by RFQ are only partially covered
- CMS preview workflow now covers both inline field preview and owner-scoped full page/article draft preview, richer editorial controls, inline image upload, and server-side HTML sanitization now exist for HTML-based authoring, but there is still no block-based editor
- SEO is only partially covered
- Procurement workflow is only partially covered
- Search/document archive is only partially covered
- Accessibility is only partially covered, but public navigation/search/GRM semantics, public page content structure, and keyboard-safe mobile navigation are now materially stronger than the earlier BVI-only baseline
- Dashboard/activity tracking and operational readiness governance are now materially stronger, but still partial where external delivery evidence is concerned
- GRM tracking is now hardened with ticket + tracking token verification, reduced public disclosure, stricter attachment validation, private attachment storage, protected admin-only attachment downloads, masked PII for read-only admin access, assignment-aware operational permissions, explicit audit logging for key workflow actions, lifecycle-based public tracking retention for closed cases, and safer officer assignment checks

### Not Found or Not Confirmed

- Final production analytics deployment values
- Email subscriptions
- Push notifications
- Social media sharing
- Staff directory with hierarchy
- MIS / result indicators integration
- Automated broken-link detection
- Automated accessibility issue detection
- Backup/disaster recovery implementation evidence
- Training manuals / admin documentation deliverables
- 24-month support/helpdesk implementation evidence

## Requirement Matrix

| RFQ Requirement | Status | Current Project Evidence | Action Needed |
|---|---|---|---|
| Public institutional website | Partial | [routes/web.php](/Users/aminjon/Herd/tdfp/routes/web.php) | Verify section structure against final RFQ sitemap |
| 3 languages: English, Tajik, Russian | Implemented | [config/app.php](/Users/aminjon/Herd/tdfp/config/app.php), [app/Http/Middleware/SetLocale.php](/Users/aminjon/Herd/tdfp/app/Http/Middleware/SetLocale.php) | Ensure all public content is truly maintained in 3 languages |
| Responsive design | Partial | Public pages and layouts exist in [resources/js/pages/public](/Users/aminjon/Herd/tdfp/resources/js/pages/public) | Run complete mobile review across all public pages |
| Low-bandwidth optimization | Partial | Public image delivery now uses a shared loading policy with `lazy/eager`, async decoding, fetch priority, and responsive `sizes` hints in [resources/js/components/public-image.tsx](/Users/aminjon/Herd/tdfp/resources/js/components/public-image.tsx), [resources/js/pages/public/home.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/home.tsx), [resources/js/pages/public/news/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/news/index.tsx), [resources/js/pages/public/activities/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/activities/index.tsx), [resources/js/pages/public/activities/show.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/activities/show.tsx), and [resources/js/pages/public/media/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/media/index.tsx) | Continue with asset sizing/compression review, browser/device verification, and low-bandwidth UX testing |
| CMS for content management | Partial | Admin modules in [app/Modules](/Users/aminjon/Herd/tdfp/app/Modules) | Expand CMS to match RFQ capabilities |
| WYSIWYG / block-based editing | Partial | Tiptap-based rich text editing, inline field preview, full page/article draft preview, inline image upload, and editorial controls now exist in [resources/js/components/admin/rich-text-editor.tsx](/Users/aminjon/Herd/tdfp/resources/js/components/admin/rich-text-editor.tsx), [resources/js/components/admin/translation-tabs.tsx](/Users/aminjon/Herd/tdfp/resources/js/components/admin/translation-tabs.tsx), [resources/js/components/admin/editorial-preview-button.tsx](/Users/aminjon/Herd/tdfp/resources/js/components/admin/editorial-preview-button.tsx), [app/Http/Controllers/Admin/EditorialPreviewController.php](/Users/aminjon/Herd/tdfp/app/Http/Controllers/Admin/EditorialPreviewController.php), and [app/Modules/Media/Controllers/AdminMediaController.php](/Users/aminjon/Herd/tdfp/app/Modules/Media/Controllers/AdminMediaController.php) | Expand toward block-based authoring only if RFQ/client explicitly requires it beyond a full rich text CMS editor |
| Role-based permissions | Implemented | Policies and admin middleware in [routes/admin.php](/Users/aminjon/Herd/tdfp/routes/admin.php) | Review exact role mapping against RFQ |
| Searchable document archive | Partial | Public archive filtering now covers year, category, file type, text search, and tag facets through [app/Modules/Documents/Repositories/DocumentRepository.php](/Users/aminjon/Herd/tdfp/app/Modules/Documents/Repositories/DocumentRepository.php), [app/Modules/Documents/Controllers/PublicDocumentController.php](/Users/aminjon/Herd/tdfp/app/Modules/Documents/Controllers/PublicDocumentController.php), and [resources/js/pages/public/documents/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/documents/index.tsx) | Confirm whether additional archive taxonomy or sorting rules are required by RFQ/client |
| Media section | Implemented | [app/Modules/Media/Controllers/PublicMediaController.php](/Users/aminjon/Herd/tdfp/app/Modules/Media/Controllers/PublicMediaController.php), [resources/js/pages/public/media/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/media/index.tsx) | Expand metadata and public storytelling if required |
| Procurement section with filters/status/process | Partial | Public filtering by status/year/search now exists, and public lifecycle/process visibility is serialized through [app/Modules/Procurement/Controllers/PublicProcurementController.php](/Users/aminjon/Herd/tdfp/app/Modules/Procurement/Controllers/PublicProcurementController.php), [app/Modules/Procurement/Repositories/ProcurementRepository.php](/Users/aminjon/Herd/tdfp/app/Modules/Procurement/Repositories/ProcurementRepository.php), [resources/js/pages/public/procurement/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/procurement/index.tsx), and [resources/js/pages/public/procurement/show.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/procurement/show.tsx) | Confirm any remaining client-specific process disclosure rules and expand archive visibility only if required |
| GRM / feedback section | Partial | Public tracking now requires `ticket + tracking token`, with reduced public disclosure in [app/Modules/GRM/Controllers/PublicGrmController.php](/Users/aminjon/Herd/tdfp/app/Modules/GRM/Controllers/PublicGrmController.php) and [resources/js/pages/public/grm/track.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/grm/track.tsx); attachments are now stored on a private disk and exposed only through authorized admin downloads, read-only admin access receives masked contact data, operational actions are assignment-aware, key workflow actions now generate explicit audit log entries, and closed cases now have lifecycle-based public tracking expiry through [app/Modules/GRM/Services/GrmService.php](/Users/aminjon/Herd/tdfp/app/Modules/GRM/Services/GrmService.php), [app/Models/GrmCase.php](/Users/aminjon/Herd/tdfp/app/Models/GrmCase.php), and [config/grm.php](/Users/aminjon/Herd/tdfp/config/grm.php) | Confirm final retention periods and any closure policy details with the client if stricter rules are required |
| What’s New / announcements | Partial | News now uses featured-first public ordering and an explicit `What’s New` announcement stream on home and news index via [app/Modules/News/Repositories/NewsRepository.php](/Users/aminjon/Herd/tdfp/app/Modules/News/Repositories/NewsRepository.php), [app/Http/Controllers/PublicController.php](/Users/aminjon/Herd/tdfp/app/Http/Controllers/PublicController.php), [app/Modules/News/Controllers/PublicNewsController.php](/Users/aminjon/Herd/tdfp/app/Modules/News/Controllers/PublicNewsController.php), [resources/js/pages/public/home.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/home.tsx), and [resources/js/pages/public/news/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/news/index.tsx) | Confirm whether any additional announcement-specific workflow is required beyond featured/recent editorial treatment |
| SEO support | Partial | Meta fields, shared SEO component, canonical/OG/Twitter tags, and JSON-LD now exist in [resources/js/components/seo.tsx](/Users/aminjon/Herd/tdfp/resources/js/components/seo.tsx) | Expand per-module SEO coverage and media/social metadata strategy |
| Google Analytics or equivalent | Partial | Analytics is now governed through validated admin settings with explicit enablement, provider selection, owner metadata, and admin readiness visibility in [app/Modules/Settings/Requests/UpdateSettingRequest.php](/Users/aminjon/Herd/tdfp/app/Modules/Settings/Requests/UpdateSettingRequest.php), [resources/js/pages/admin/settings/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/admin/settings/index.tsx), [app/Modules/Admin/Controllers/AdminDashboardController.php](/Users/aminjon/Herd/tdfp/app/Modules/Admin/Controllers/AdminDashboardController.php), [resources/js/pages/admin/dashboard.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/admin/dashboard.tsx), and [resources/js/layouts/public-layout.tsx](/Users/aminjon/Herd/tdfp/resources/js/layouts/public-layout.tsx) | Finalize production measurement ID and final owner values |
| Accessibility / WCAG 2.1 AA | Partial | BVI functionality exists in [resources/js/components/bvi](/Users/aminjon/Herd/tdfp/resources/js/components/bvi), public navigation/search/GRM flows now include skip-link target focus, `aria-current` navigation state, accessible search semantics, field-level error associations, live status messaging, and a dialog-based mobile navigation pattern with managed focus/escape behavior in [resources/js/layouts/public-layout.tsx](/Users/aminjon/Herd/tdfp/resources/js/layouts/public-layout.tsx), [resources/js/pages/public/search.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/search.tsx), [resources/js/pages/public/grm/submit.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/grm/submit.tsx), and [resources/js/pages/public/grm/track.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/grm/track.tsx), and public content templates now use stronger breadcrumb, list/article, `time`, and contact/media semantics in [resources/js/pages/public/news/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/news/index.tsx), [resources/js/pages/public/news/show.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/news/show.tsx), [resources/js/pages/public/procurement/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/procurement/index.tsx), [resources/js/pages/public/procurement/show.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/procurement/show.tsx), [resources/js/pages/public/documents/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/documents/index.tsx), [resources/js/pages/public/contact.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/contact.tsx), [resources/js/pages/public/media/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/media/index.tsx), [resources/js/pages/public/grm/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/grm/index.tsx), and [resources/js/pages/public/grm/submitted.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/grm/submitted.tsx) | Continue with full WCAG remediation, browser/device verification, and automated/manual testing |
| Browser compatibility | Not confirmed | No explicit browser testing evidence | Add browser/device test coverage |
| Audit logging | Implemented | [app/Core/Observers/AuditObserver.php](/Users/aminjon/Herd/tdfp/app/Core/Observers/AuditObserver.php) | Expand if needed for CMS activity reporting |
| CMS activity dashboard | Partial | Admin dashboard now exposes readiness monitoring in [app/Modules/Admin/Controllers/AdminDashboardController.php](/Users/aminjon/Herd/tdfp/app/Modules/Admin/Controllers/AdminDashboardController.php) and [resources/js/pages/admin/dashboard.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/admin/dashboard.tsx), while audit reporting now supports user/action/entity/date filtering in [app/Modules/Admin/Controllers/AdminAuditLogController.php](/Users/aminjon/Herd/tdfp/app/Modules/Admin/Controllers/AdminAuditLogController.php) and [resources/js/pages/admin/audit-logs/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/admin/audit-logs/index.tsx) | Expand only if the client requires more formal reporting/export workflows |
| Sitemap generation | Implemented | [app/Http/Controllers/SitemapController.php](/Users/aminjon/Herd/tdfp/app/Http/Controllers/SitemapController.php), [routes/web.php](/Users/aminjon/Herd/tdfp/routes/web.php), [resources/views/sitemap.blade.php](/Users/aminjon/Herd/tdfp/resources/views/sitemap.blade.php) | Review final sitemap coverage against approved information architecture |
| Structured data | Partial | JSON-LD now covers organization/website baseline, breadcrumbs, item lists, search results, and key public detail pages through [resources/js/components/seo.tsx](/Users/aminjon/Herd/tdfp/resources/js/components/seo.tsx), [resources/js/layouts/public-layout.tsx](/Users/aminjon/Herd/tdfp/resources/js/layouts/public-layout.tsx), and public page templates | Expand only where additional public entity types or client-mandated schema patterns are still missing |
| Email subscriptions | Not found | No implementation found | Add subscriptions module |
| Push notifications | Not found | No implementation found | Implement or formally exclude |
| Social media sharing | Not found | No implementation found | Add public share actions |
| Staff directory with hierarchy | Not found | No implementation found | Design and implement dedicated module |
| MIS / indicators integration | Not found | No implementation found | Define integration scope and implement |
| Broken-link detection | Not found | No implementation found | Add automated checking |
| Accessibility issue detection | Not found | No implementation found | Add automated audits |
| Backup / DR / operations documentation | Partial | Product-side operational governance now exists through admin settings and dashboard readiness checks for support/reporting/backup policy fields in [database/seeders/SettingsSeeder.php](/Users/aminjon/Herd/tdfp/database/seeders/SettingsSeeder.php), [app/Modules/Settings/Requests/UpdateSettingRequest.php](/Users/aminjon/Herd/tdfp/app/Modules/Settings/Requests/UpdateSettingRequest.php), [app/Modules/Admin/Controllers/AdminDashboardController.php](/Users/aminjon/Herd/tdfp/app/Modules/Admin/Controllers/AdminDashboardController.php), and [resources/js/pages/admin/dashboard.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/admin/dashboard.tsx) | Add real infrastructure evidence, backup execution details, and delivery documentation outside the product codebase |
| Training materials and manuals | Not found in repo | No evidence in repository | Prepare near delivery phase |
| 24-month support / helpdesk | Not found in product | No evidence in repository | Define support model, SLA, reporting |

## Critical Gaps

### 1. CMS does not yet meet RFQ editorial requirements

Current state:

- admin content forms exist
- multilingual content entry exists
- rich text editor now exists for HTML-based authoring
- preview workflow now exists for both richtext authoring and owner-scoped full page/article draft rendering before publish
- inline image upload now exists for editorial content
- server-side sanitization now protects saved page/news HTML content
- no block-based editor

Impact:

- this is one of the clearest mismatches with RFQ expectations

Needed:

- extend the current rich content editor with any missing editorial capabilities
- preserve and refine preview before publish, now that page/article draft preview URLs exist
- improve editor UX for multilingual content teams
- decide whether block-based authoring is a contractual requirement or only a nice-to-have beyond the current editor

### 2. SEO requirements are incomplete

Current state:

- shared SEO layer now provides canonical, meta description, Open Graph, Twitter card, and JSON-LD baseline
- sitemap exists
- analytics is now feature-flagged, validated, and admin-governed, but is not yet configured with final production ownership and reporting values
- operational readiness governance now exists in the admin product for ownership/support/reporting/backup policy fields, but this is not the same as infrastructure evidence
- admin audit/reporting visibility now supports practical filtering and operational review, but this is not the same as formal delivery reporting artifacts
- per-module SEO coverage has improved, but is not yet comprehensive

Needed:

- per-page/module SEO strategy
- expand metadata and structured data coverage where it is still thin
- finalize production analytics deployment values, reporting ownership, and operational reporting workflow

### 3. Procurement flow is underpowered versus RFQ

Current state:

- procurement listing and detail pages exist
- public status/year/search filtering and lifecycle handling are stronger than before
- public process visibility now exposes meaningful lifecycle states such as submission open, deadline passed, under evaluation, awarded, and archived
- process-following requirements may still need additional client-specific disclosure rules

Needed:

- confirm archive and disclosure rules against business requirements
- confirm whether any additional public process milestones are contractually required beyond the current lifecycle view

### 4. GRM exists but needs compliance hardening

Current state:

- public complaint submission exists
- tracking exists
- tracking token protection now exists
- attachment validation is stricter
- attachments now live on private storage and are downloadable only through authorized admin routes
- read-only admin viewers now receive masked complainant contact data
- operational actions now respect case assignment, not just generic GRM permissions
- key operational actions now create explicit audit log entries
- closed cases now have a configurable public tracking retention window
- public tracking now exposes less case detail
- officer assignment is checked more strictly
- final retention periods and closure policy details may still require client confirmation

Needed:

- confirm whether additional masking, expiry, or citizen-authenticated follow-up is required
- align the remaining workflow with complaint-handling expectations

### 5. Accessibility is present as a feature, but not yet proven as compliance

Current state:

- special accessibility mode exists
- public navigation now exposes clearer current-page and skip-link behavior
- public mobile navigation now uses a dialog/sheet interaction model instead of a custom inline panel
- public search and GRM forms now expose labels, help text, error associations, and live status feedback more safely
- public content/detail templates now use more consistent breadcrumb, list/article, `time`, and contact/media semantics
- public image-heavy templates now use a shared loading strategy that is safer for slower connections and mobile devices
- the product-side accessibility/frontend hardening work is now substantially implemented
- remaining gaps are primarily formal WCAG/browser/device verification evidence rather than missing baseline UI work

Needed:

- formal WCAG review
- browser/device verification evidence
- automated and manual accessibility testing evidence

## Recommended Delivery Phases

### Phase 1. CMS and Editorial Compliance

Goal:

- make the platform usable for real institutional content operations

Tasks:

- replace textarea-based “richtext” with a real editor
- add content preview
- improve multilingual authoring workflow
- review media/document upload UX
- normalize content model behavior across pages/news/documents

Priority:

- `P1`

Current implementation note:

- content preview and state-driven multilingual authoring tabs are now implemented, including owner-scoped full page/article draft preview before publish
- a real rich text editor is now implemented for HTML-based editorial content
- inline editorial image upload is now implemented through the media subsystem
- saved editorial HTML is now sanitized server-side before persistence
- the main remaining open item in this phase is whether RFQ requires block-based authoring rather than a conventional rich text editor

### Phase 2. Public Modules Compliance

Goal:

- align public-facing modules with RFQ scope

Tasks:

- deepen procurement compliance only where RFQ/client requires more than the current public lifecycle baseline
- improve document repository archive UX or taxonomy only where RFQ/client needs more than the current search/filter/tag baseline
- refine public updates only if RFQ/client needs more than the current featured/recent announcement treatment
- confirm whether staff directory is required in MVP and implement if yes

Priority:

- `P1`

### Phase 3. Search and SEO Compliance

Goal:

- make the portal discoverable and structurally compliant

Tasks:

- improve search indexing and filtering beyond the current public search baseline
- expand sitemap coverage only where content types or IA still need it
- expand structured data / JSON-LD coverage only where additional public entity types still need it
- complete analytics production configuration, owner assignment, and reporting workflow
- review metadata strategy for all public modules

Priority:

- `P1`

### Phase 4. GRM and Security Compliance

Goal:

- make complaint handling safe and production-acceptable

Tasks:

- fix privacy/security weaknesses in GRM
- review public/private content boundaries
- refine remaining assignment and status update business rules if needed
- confirm final client-approved retention/privacy periods for long-lived GRM cases and attachments

Priority:

- `P1`

### Phase 5. Accessibility and Frontend Quality

Goal:

- move from “has accessibility features” to “is accessibility-compliant”

Tasks:

- complete formal WCAG review and browser/device verification evidence
- run automated and manual accessibility testing against the now-hardened public UI baseline
- continue low-bandwidth optimization only if testing reveals remaining heavy pages

Priority:

- `P2`

Current implementation note:

- public navigation, search, GRM, content templates, mobile navigation behavior, and image-delivery baseline have all been hardened
- Phase 5 is effectively complete at the product/code level
- the main remaining work is verification evidence from formal WCAG, mobile, and cross-browser testing

### Phase 6. Operations and Post-Launch Readiness

Goal:

- prepare for formal delivery and support obligations

Tasks:

- finalize real deployment values for analytics/support/reporting settings
- produce infrastructure evidence for backup and disaster recovery
- formalize helpdesk/support process outside the product codebase
- prepare delivery documentation, manuals, and training materials

Priority:

- `P2`

Current implementation note:

- product-side operational governance now exists through admin settings and dashboard readiness checks
- admin reporting visibility now includes practical audit-log filtering by user, action, entity type, and date
- launch ownership, support, reporting, and backup-policy placeholders can now be configured and tracked in-product
- remaining Phase 6 work is primarily operational evidence and delivery artifacts, not missing application structure

## Recommended First Sprint

The first sprint should focus on the highest-value gaps:

1. Introduce a real CMS editor with preview
2. Implement sitemap + structured data + analytics
3. Bring procurement/document filtering closer to RFQ expectations
4. Fix GRM privacy/security issues
5. Produce a final list of RFQ requirements that are:
   - already covered
   - planned for implementation
   - proposed for exclusion or clarification

## Backlog by Priority

### P1

- Remaining CMS/editorial compliance work
- Procurement compliance improvements
- Document archive improvements
- Search improvements
- Remaining SEO/schema/analytics work
- Remaining GRM workflow/privacy fixes

### P2

- Formal accessibility/browser/device verification evidence
- Staff directory
- Email subscriptions
- Social share features
- Better admin activity dashboard
- Operations and support readiness

### P3

- Push notifications
- MIS/dashboard integration
- Advanced automation for broken links/accessibility scans
- Additional public engagement features beyond core RFQ scope

## Items Requiring Clarification with Client

- Is support expected for `6 months` or `24 months`?
- Are push notifications mandatory or optional?
- Is staff directory mandatory for launch?
- Is MIS/result indicators integration mandatory for launch or phase 2?
- Are email subscriptions mandatory for launch?
- Is analytics expected to be Google Analytics specifically, or any equivalent?

## Working Conclusion

The current project already contains the foundation of the requested portal, but it should be treated as:

- a strong base implementation
- not yet a fully RFQ-compliant delivery

The best path forward is to complete the work in structured phases, starting with:

- CMS/editorial compliance
- public module compliance
- search/SEO
- GRM/security

Only after that should the team focus on extended operational and enhancement features.
