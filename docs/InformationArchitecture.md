# Information Architecture (IA)
## Official Website of the Projects Implementation Center (PIC)
### Tajikistan Digital Foundations Project

---

# 1. Overview

This document defines the **Information Architecture (IA)** for the official website of the **Projects Implementation Center (PIC)** implementing the **Tajikistan Digital Foundations Project**.

The IA defines:

- website structure
- navigation hierarchy
- content organization
- relationships between sections
- content types and data models

The architecture must support:

- transparency requirements for World Bank-funded projects
- public communication
- document publication
- procurement transparency
- GRM (Grievance Redress Mechanism)

The system must support **three languages**:

- Tajik
- Russian
- English

---

# 2. Global Navigation

Main navigation menu:
Home
About PIC
The Project
Project Activities
News & Events
Procurement
Documents
Media
GRM (Complaints & Feedback)
Contact


Header elements:

- logo
- language switcher
- main menu
- search
- GRM quick access button

Footer elements:

- quick links
- social media
- contact info
- legal / privacy
- partner logos

---

# 3. Sitemap
Home
│
├── About PIC
│ ├── About the Institution
│ ├── Mission and Vision
│ ├── Organizational Structure
│ ├── Leadership
│ └── Contact Information
│
├── The Project
│ ├── Project Overview
│ ├── Project Objectives
│ ├── Project Components
│ ├── Implementation Timeline
│ ├── Financing
│ └── Results Framework
│
├── Project Activities
│ ├── Digital Government Services
│ ├── Interoperability Platform
│ ├── BankID Development
│ ├── Digital Authentication & eSignature
│ ├── Payment Gateway
│ ├── Cybersecurity & CSIRT
│ ├── Data Centers & Infrastructure
│ ├── School Connectivity
│ ├── Digital Skills Programs
│ └── Public Awareness Campaigns
│
├── News & Events
│ ├── News
│ ├── Press Releases
│ ├── Events
│ └── Workshops & Trainings
│
├── Procurement
│ ├── Procurement Notices
│ ├── RFQ / RFP
│ ├── Tender Documents
│ ├── Contract Awards
│ └── Procurement Archive
│
├── Documents
│ ├── Project Documents
│ ├── Reports
│ ├── Technical Studies
│ ├── Policies
│ ├── Strategies
│ └── Presentations
│
├── Media
│ ├── Photo Gallery
│ ├── Video Gallery
│ └── Press Coverage
│
├── GRM
│ ├── Submit Complaint
│ ├── Track Complaint
│ └── GRM Policy
│
└── Contact
├── Contact Form
├── Office Location
└── General Inquiries




---

# 4. Page Types

The system must support multiple page templates.

## 4.1 Static Page

Used for:

- About pages
- Policies
- Institutional information

Fields:
title
slug
content
language
meta_title
meta_description
published_at


---

## 4.2 News Article

Used for announcements and updates.

Fields:
title
slug
summary
content
featured_image
category
tags
author
published_at
language


---

## 4.3 Activity Page

Represents a project initiative or activity.

Fields:

title
slug
description
objectives
status
related_documents
related_news
images
language

Status options:
planned
in progress
completed


---

## 4.4 Procurement Item

Represents procurement announcements.

Fields:

title
reference_number
description
documents
publication_date
submission_deadline
status
language


Status:
open
closed
awarded
archived


---

## 4.5 Document Item

Document repository entry.

Fields:
title
description
category
file
file_type
file_size
publication_date
tags
language


Categories:
reports
technical_documents
policies
studies
presentations


---

## 4.6 Media Item

Media assets for galleries.

Fields:
title
media_type
file
thumbnail
description
date
language


Types:
image
video


---

# 5. GRM Information Architecture

The GRM module must be accessible from:

- main navigation
- homepage shortcut
- footer

---

## GRM Structure
GRM
│
├── Submit Complaint
├── Track Complaint
└── GRM Policy


---

## Complaint Submission Flow
User opens GRM form
↓
User fills complaint form
↓
System generates ticket number
↓
Email confirmation sent
↓
Complaint stored in database
↓
GRM officer reviews complaint
↓
Status updates recorded
↓
User notified of resolution


---

## GRM Complaint Fields
ticket_number
name
email
phone
complaint_category
description
attachments
submission_date
status


Complaint categories:
procurement
project implementation
environment/social impact
corruption
other


---

# 6. Search Architecture

Global search must include:
pages
news
documents
procurement
activities


Search filters:
content_type
category
date
language


---

# 7. Content Relationships

Entities must support relationships.

Examples:
activity → related news
activity → documents
news → documents
procurement → documents
documents → activities


---

# 8. Language Architecture

Multilingual support must follow this structure:
entity_id
language
translated_fields


Example:
activity_translations
page_translations
news_translations
document_translations


---

# 9. Admin Information Architecture

Admin dashboard modules:
Dashboard
Pages
Activities
News
Procurement
Documents
Media
GRM
Users
Settings


---

# 10. URL Structure

SEO friendly URLs.

Examples:
/
/about
/project
/activities
/activities/bankid
/news
/news/digital-government-event
/documents
/documents/reports
/procurement
/procurement/rfq-2025-01
/grm
/contact


---

# 11. Homepage Information Architecture

Homepage sections:
Hero banner
Project introduction
Key statistics
Featured activities
Latest news
Latest documents
Procurement highlights
Partners
GRM shortcut
Footer


---

# 12. Content Governance

Content workflow:
Draft
Review
Published
Archived

Roles:
Admin
Editor
Content Manager
Procurement Officer
GRM Officer


---

# 13. Analytics Architecture

Analytics events:
page view
document download
form submission
grm submission
search query


---

# 14. Future Extensions

Architecture must support future modules:
Open Data Portal
Interactive Dashboards
Project Monitoring System
Digital Services Catalog

---

---

# 15. Navigation Design

## 15.1 Primary Navigation

Primary navigation must remain simple and accessible.

Structure:

Home  
About PIC  
The Project  
Project Activities  
News & Events  
Procurement  
Documents  
Media  
GRM  
Contact  

Rules:

- maximum 8–9 main items
- visible GRM entry
- language switcher always visible
- search always accessible

---

## 15.2 Secondary Navigation

Used inside sections.

Example:

The Project

Project Overview  
Objectives  
Components  
Timeline  
Financing  
Results  

Activities

Activity Overview  
Status  
Documents  
Related News  

---

## 15.3 Breadcrumb Navigation

Breadcrumbs must be implemented for usability.

Example:

Home / Activities / BankID Development

Structure:

Home > Section > Subpage

---

# 16. Content Categorization

To ensure scalability, content must be categorized.

## 16.1 Categories for News

Possible categories:

Project Updates  
Events  
Workshops  
Training Programs  
Partnerships  
Government Initiatives  

---

## 16.2 Categories for Documents

Documents must be grouped into logical categories.

Categories:

Project Documentation  
Technical Reports  
Strategies and Policies  
Procurement Documents  
Presentations  
Publications  

Each document must support tags.

Example tags:

digital government  
cybersecurity  
bankid  
digital skills  
education  

---

# 17. Taxonomy Structure

Taxonomy improves search and filtering.

Main taxonomies:

Category  
Tags  
Language  
Content type  

Example:

Document  
Category: Technical Reports  
Tags: cybersecurity, csirt

---

# 18. File Management Architecture

Documents and media must be structured.

Storage structure example:

/storage/documents

    /reports
    /procurement
    /studies
    /presentations

/storage/media

    /photos
    /videos
    /logos

Files must include metadata.

Metadata:

title  
description  
category  
tags  
publication date  

---

# 19. Accessibility Architecture

The system must support accessibility standards.

Requirements:

WCAG 2.1 compliance

Features:

keyboard navigation  
high contrast text  
accessible forms  
alternative text for images  

---

# 20. GRM Case Management Architecture

The GRM module must include a structured case workflow.

## Case Lifecycle

New  
Assigned  
Under Review  
Investigation  
Resolved  
Closed  

Each stage must record:

timestamp  
responsible officer  
notes  

---

## GRM Data Model

Main entities:

grm_cases  
grm_messages  
grm_attachments  
grm_status_history  

Example structure:

grm_cases

id  
ticket_number  
complainant_name  
email  
phone  
category  
description  
status  
created_at  

---

# 21. Content Lifecycle

All content must support lifecycle management.

Stages:

Draft  
Under Review  
Published  
Archived  

Example workflow:

Editor creates content  
Content manager reviews  
Admin publishes  

---

# 22. Permissions Model

Role-based access control.

Roles:

Super Admin  
Editor  
Content Manager  
Procurement Officer  
GRM Officer  

Permissions example:

Editor

create news  
edit news  

Content Manager

publish content  
manage documents  

GRM Officer

manage complaints  
update status  

---

# 23. Search Index Architecture

Search engine must index:

Pages  
News  
Activities  
Documents  
Procurement items  

Indexed fields:

title  
description  
content  
tags  

Search must support:

full-text search  
filters  
sorting  

---

# 24. Content Relationships

Relationships must allow linking between entities.

Example:

Activity

linked documents  
linked news  
linked media  

News

related activities  
related documents  

Documents

related activities  

---

# 25. Homepage Content Priority

Homepage must highlight the most important content.

Priority order:

1 Project overview  
2 Latest news  
3 Featured activities  
4 Procurement announcements  
5 Document highlights  
6 Events  
7 GRM access  

---

# 26. Metadata Architecture

Each content item must support metadata.

Metadata fields:

meta_title  
meta_description  
keywords  
social_image  

These fields are required for SEO.

---

# 27. URL Strategy

All URLs must be human-readable.

Example:

/activities/bankid-development  
/news/digital-skills-training  
/documents/project-reports  
/procurement/rfq-2025-01  

Rules:

lowercase only  
hyphen separated  
no dynamic IDs in URLs  

---

# 28. API Exposure

Public data must be accessible via API.

Example endpoints:

/api/news  
/api/documents  
/api/activities  
/api/procurements  

This allows future integrations.

---

# 29. Performance Architecture

Performance must be optimized.

Techniques:

server caching  
database indexing  
lazy loading images  
document caching  

Optional:

Redis caching  
CDN integration  

---

# 30. Future Expansion

Architecture must allow future modules.

Possible extensions:

Open Data Portal  
Project Monitoring Dashboard  
Digital Services Catalog  
Interactive statistics  

The IA must remain modular to allow integration of new systems.

