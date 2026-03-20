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

### Partially Implemented

- CMS features required by RFQ are only partially covered
- SEO is only partially covered
- Procurement workflow is only partially covered
- Search/document archive is only partially covered
- Accessibility is only partially covered
- Dashboard/activity tracking is only partially covered

### Not Found or Not Confirmed

- Google Analytics or equivalent
- Email subscriptions
- Push notifications
- Social media sharing
- Sitemap generation
- Structured data / JSON-LD
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
| Low-bandwidth optimization | Not confirmed | No explicit implementation found | Add optimization strategy and testing |
| CMS for content management | Partial | Admin modules in [app/Modules](/Users/aminjon/Herd/tdfp/app/Modules) | Expand CMS to match RFQ capabilities |
| WYSIWYG / block-based editing | Partial | `richtext` is rendered as textarea in [resources/js/components/admin/translation-tabs.tsx](/Users/aminjon/Herd/tdfp/resources/js/components/admin/translation-tabs.tsx) | Introduce real editor and preview |
| Role-based permissions | Implemented | Policies and admin middleware in [routes/admin.php](/Users/aminjon/Herd/tdfp/routes/admin.php) | Review exact role mapping against RFQ |
| Searchable document archive | Partial | [app/Modules/Documents/Repositories/DocumentRepository.php](/Users/aminjon/Herd/tdfp/app/Modules/Documents/Repositories/DocumentRepository.php) | Add tags, richer filters, better UX |
| Media section | Implemented | [app/Modules/Media/Controllers/PublicMediaController.php](/Users/aminjon/Herd/tdfp/app/Modules/Media/Controllers/PublicMediaController.php), [resources/js/pages/public/media/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/media/index.tsx) | Expand metadata and public storytelling if required |
| Procurement section with filters/status/process | Partial | [app/Modules/Procurement/Controllers/PublicProcurementController.php](/Users/aminjon/Herd/tdfp/app/Modules/Procurement/Controllers/PublicProcurementController.php), [resources/js/pages/public/procurement/index.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/procurement/index.tsx) | Add process tracking, archive logic, compliant filtering |
| GRM / feedback section | Partial | [app/Modules/GRM/Controllers/PublicGrmController.php](/Users/aminjon/Herd/tdfp/app/Modules/GRM/Controllers/PublicGrmController.php), [resources/js/pages/public/grm/submit.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/grm/submit.tsx) | Close privacy/security gaps and align UX with RFQ |
| What’s New / announcements | Partial | News/home blocks exist | Add explicit “What’s New” treatment and time-sensitive publishing behavior |
| SEO support | Partial | Meta fields for pages in [resources/js/pages/public/page.tsx](/Users/aminjon/Herd/tdfp/resources/js/pages/public/page.tsx) | Add sitemap, structured data, per-module SEO coverage |
| Google Analytics or equivalent | Not found | No implementation found | Add analytics integration |
| Accessibility / WCAG 2.1 AA | Partial | BVI functionality exists in [resources/js/components/bvi](/Users/aminjon/Herd/tdfp/resources/js/components/bvi) | Perform real WCAG remediation and testing |
| Browser compatibility | Not confirmed | No explicit browser testing evidence | Add browser/device test coverage |
| Audit logging | Implemented | [app/Core/Observers/AuditObserver.php](/Users/aminjon/Herd/tdfp/app/Core/Observers/AuditObserver.php) | Expand if needed for CMS activity reporting |
| CMS activity dashboard | Partial | [app/Modules/Admin/Controllers/AdminDashboardController.php](/Users/aminjon/Herd/tdfp/app/Modules/Admin/Controllers/AdminDashboardController.php), audit logs | Add filtering by user/date/content type |
| Sitemap generation | Not found | No implementation found | Add sitemap generation |
| Structured data | Not found | No implementation found | Add JSON-LD/schema markup |
| Email subscriptions | Not found | No implementation found | Add subscriptions module |
| Push notifications | Not found | No implementation found | Implement or formally exclude |
| Social media sharing | Not found | No implementation found | Add public share actions |
| Staff directory with hierarchy | Not found | No implementation found | Design and implement dedicated module |
| MIS / indicators integration | Not found | No implementation found | Define integration scope and implement |
| Broken-link detection | Not found | No implementation found | Add automated checking |
| Accessibility issue detection | Not found | No implementation found | Add automated audits |
| Backup / DR / operations documentation | Not confirmed in repo | No evidence in repository | Define infra + ops + documentation plan |
| Training materials and manuals | Not found in repo | No evidence in repository | Prepare near delivery phase |
| 24-month support / helpdesk | Not found in product | No evidence in repository | Define support model, SLA, reporting |

## Critical Gaps

### 1. CMS does not yet meet RFQ editorial requirements

Current state:

- admin content forms exist
- multilingual content entry exists
- no true WYSIWYG/block editor
- no real preview workflow

Impact:

- this is one of the clearest mismatches with RFQ expectations

Needed:

- integrate a real rich content editor
- support preview before publish
- improve editor UX for multilingual content teams

### 2. SEO requirements are incomplete

Current state:

- pages support `meta_title` and `meta_description`
- no sitemap found
- no structured data found
- no analytics found

Needed:

- sitemap generation
- schema / JSON-LD
- per-page/module SEO strategy
- analytics integration

### 3. Procurement flow is underpowered versus RFQ

Current state:

- procurement listing and detail pages exist
- public filtering is limited
- process-following requirements are not fully reflected

Needed:

- status-aware filtering aligned with business rules
- archive and lifecycle handling
- better public process visibility if required by RFQ

### 4. GRM exists but needs compliance hardening

Current state:

- public complaint submission exists
- tracking exists
- prior review identified privacy/security concerns

Needed:

- close privacy leaks
- review public tracking behavior
- align with complaint-handling expectations

### 5. Accessibility is present as a feature, but not yet proven as compliance

Current state:

- special accessibility mode exists
- no evidence of full WCAG 2.1 AA verification

Needed:

- semantic accessibility review
- keyboard navigation audit
- form and error-state accessibility review
- automated and manual accessibility testing

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

### Phase 2. Public Modules Compliance

Goal:

- align public-facing modules with RFQ scope

Tasks:

- expand procurement filters and lifecycle logic
- improve document repository search/filter/tagging
- formalize “What’s New” and public updates
- confirm whether staff directory is required in MVP and implement if yes

Priority:

- `P1`

### Phase 3. Search and SEO Compliance

Goal:

- make the portal discoverable and structurally compliant

Tasks:

- improve search indexing and filtering
- add sitemap generation
- add structured data / JSON-LD
- implement analytics
- review metadata strategy for all public modules

Priority:

- `P1`

### Phase 4. GRM and Security Compliance

Goal:

- make complaint handling safe and production-acceptable

Tasks:

- fix privacy/security weaknesses in GRM
- review public/private content boundaries
- review assignment and status update permissions
- verify audit logging coverage

Priority:

- `P1`

### Phase 5. Accessibility and Frontend Quality

Goal:

- move from “has accessibility features” to “is accessibility-compliant”

Tasks:

- WCAG review
- keyboard/focus audit
- form accessibility audit
- mobile and cross-browser testing
- low-bandwidth optimization pass

Priority:

- `P2`

### Phase 6. Operations and Post-Launch Readiness

Goal:

- prepare for formal delivery and support obligations

Tasks:

- define analytics/reporting ownership
- backup and disaster recovery plan
- helpdesk/support process
- maintenance reporting model
- documentation, manuals, and training materials

Priority:

- `P2`

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

- Real CMS editor
- Content preview workflow
- Procurement compliance improvements
- Document archive improvements
- Search improvements
- Sitemap
- Structured data
- Analytics
- GRM security/privacy fixes

### P2

- Accessibility compliance pass
- Browser/device test pass
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
