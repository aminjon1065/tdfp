Technical Specification
Official Website of the Projects Implementation Center (PIC)

Project: Tajikistan Digital Foundations Project
Client: State Institution "Projects Implementation Center Fundamentals of Digitalization in Tajikistan"
Implementing agency: Executive Office of the President of the Republic of Tajikistan

Technology stack:

Laravel 11+

Inertia.js

React (TypeScript)

TailwindCSS

shadcn/ui

PostgreSQL

REST API

1. Purpose of the Website

The website will serve as the official public portal of the PIC responsible for implementing the Tajikistan Digital Foundations Project.

Primary objectives:

Provide transparent information about the project.

Publish project activities and results.

Provide access to procurement information.

Provide a document repository.

Provide public engagement tools including GRM.

Promote digital transformation initiatives in Tajikistan.

The website must comply with World Bank transparency and disclosure standards.

2. System Architecture
2.1 Architecture Overview

Frontend:

React + TypeScript

UI:

shadcn/ui + TailwindCSS

Backend:

Laravel API

Communication:

Inertia.js

Database:

PostgreSQL

Infrastructure:

Linux server
Nginx
Docker (recommended)

Architecture type:

Modular Monolith.

3. Core System Modules

The platform must include the following modules.

3.1 Public Website

Main public interface for visitors.

Functions:

view project information

browse activities

view documents

read news

submit complaints via GRM.

3.2 CMS (Admin Panel)

Content management interface for PIC staff.

Roles:

Super Admin

Editor

Content Manager

Procurement Officer

GRM Officer

Admin must manage:

pages

news

documents

activities

procurement notices

GRM submissions.

4. Website Structure
Main Navigation

Home
About PIC
The Project
Project Activities
News & Events
Procurement
Documents
Media
GRM (Submit Complaint)
Contact

4.1 Home Page

Sections:

Hero banner
Project overview
Key statistics
Latest news
Featured activities
Quick access to documents
Partners (World Bank / SDC)
GRM shortcut button.

4.2 About PIC

Subpages:

About the Institution
Mission & Vision
Organizational Structure
Leadership
Contact information.

4.3 The Project

Subpages:

Project Overview
Project Objectives
Project Components
Implementation Timeline
Financing
Results Framework.

4.4 Project Activities

This section must represent the activities defined in the project program.

Examples:

Digital Government Services
Interoperability Platform
BankID Development
Digital Authentication
Electronic Signature
Payment Gateway
Cybersecurity & CSIRT
Data Centers & Infrastructure
School Connectivity
Digital Skills Programs.

Each activity page must include:

description
goals
status
documents
photos.

4.5 News & Events

Content types:

news
press releases
workshops
trainings
public events.

4.6 Procurement

Required for donor transparency.

Subpages:

Procurement Notices
RFQ / RFP
Tender Documents
Contract Awards
Procurement Archive.

Fields:

title
description
documents
deadline
status.

4.7 Documents Repository

Categories:

Project Documents
Reports
Technical Studies
Policies
Strategies
Presentations.

Features:

search
filters
tags
preview
download.

4.8 Media

Photo gallery
Video gallery
Press coverage.

4.9 GRM – Grievance Redress Mechanism

Mandatory for World Bank funded projects.

Purpose:

Allow citizens, stakeholders and beneficiaries to submit complaints or feedback regarding the project.

GRM Form Fields

Name
Email
Phone
Category of complaint

Categories:

procurement
project activity
environment/social impact
corruption
other

Description
Attachments.

GRM Workflow

User submits complaint

Status stages:

Received
Under review
In progress
Resolved
Closed

Admin dashboard must allow:

assign officer
update status
respond to complainant
track history.

Features:

ticket number generation
email notifications
status tracking.

5. Multilingual Support

Languages:

Tajik
Russian
English

Requirements:

language switcher
localized content
separate translations for pages.

6. UI / UX Requirements

Design principles:

clean
modern
government-grade
accessible.

Mobile-first responsive design.

Must support:

desktop
tablet
mobile.

7. Security Requirements

The system must implement:

HTTPS
CSRF protection
XSS protection
SQL injection protection
OWASP Top 10 mitigation.

Admin panel must include:

2FA support
role-based permissions
audit logs.

8. Performance Requirements

Page load:

< 3 seconds

Caching:

Laravel cache
Redis (optional)

CDN support.

9. SEO Requirements

Features:

SEO friendly URLs
meta tags
OpenGraph
XML sitemap
structured data.

10. Analytics

Integration:

Google Analytics

Admin dashboard should display:

visitors
top pages
downloads.

11. Database Model (Core Entities)

Tables:

users
roles
pages
news
events
documents
activities
procurements
media
grm_cases
grm_comments
translations.

12. API Design

REST API endpoints:

/api/news
/api/documents
/api/activities
/api/procurements
/api/grm
/api/media.

Admin endpoints secured via authentication.

13. Deliverables

Vendor must provide:

1 Inception Report
2 UX/UI prototype
3 Software Requirement Specification
4 Beta version
5 Final production website
6 Source code
7 CMS manual
8 Staff training.

Timeline must follow RFQ requirements.

14. Support & Maintenance

Support period:

24 months

Includes:

bug fixes
security updates
CMS support
technical consultation.

15. Recommended Folder Structure

Laravel

app
modules
Http
Models
Services
Repositories

React

components
layouts
pages
modules
hooks
lib.

16. Suggested Packages

Laravel:

spatie/laravel-permission
spatie/laravel-translatable
spatie/laravel-medialibrary

Frontend:

react-query
zod
lucide-react
tanstack-table.

17. Deployment

CI/CD recommended.

Stack:

Docker
GitHub Actions
Nginx
Let's Encrypt SSL.
