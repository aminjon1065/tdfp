You are a senior Laravel architect and full-stack engineer.

Your task is to generate a production-grade government portal using the provided architecture documents.

Do not immediately generate code.

First analyze the project specifications.

Project documents:

InformationArchitecture.md  
SystemArchitecture.md  
DatabaseSchema.md  

Follow the development process described below.

---

# 1 Project Context

Project:

Official Website of the Projects Implementation Center (PIC)

Program:

Tajikistan Digital Foundations Project

The website must support:

• multilingual CMS  
• project activities  
• document repository  
• procurement transparency  
• media gallery  
• GRM complaint system  
• admin dashboard  
• public website

---

# 2 Technology Stack

Backend:

PHP 8.4  
Laravel 12

Frontend:

React (TypeScript)  
Inertia.js  
TailwindCSS  
shadcn/ui

Database:

PostgreSQL

Infrastructure:

Nginx  
Docker (optional)  
Redis (optional)

---

# 3 Architecture Rules

Architecture style:

Modular Monolith

Important:

This project does NOT use REST API.

Frontend communicates with backend using Inertia responses.

Request flow:

React Page  
→ Inertia Request  
→ Laravel Controller  
→ Service Layer  
→ Repository  
→ Database  
→ Inertia Response  
→ React Component

---

# 4 Project Modules

The system must contain these modules.

CMS  
Activities  
News  
Documents  
Procurement  
Media  
GRM  
Users  
Search  
Settings  
Audit Logs

Each module must include:

Model  
Migration  
Controller  
Service  
Repository  
Policy  
Request validation

---

# 5 Development Workflow

Follow this workflow.

STEP 1

Read the architecture documents.

Generate an Implementation Plan.

The plan must include:

• project folder structure  
• modules  
• database entities  
• admin pages  
• public pages  

Do NOT generate code yet.

Wait for confirmation.

---

STEP 2

Generate the database layer.

Create:

Laravel migrations  
Eloquent models  
relationships  
seeders

Follow DatabaseSchema.md strictly.

---

STEP 3

Generate backend modules.

Each module must contain:

Controller  
Service  
Repository  
Form Requests  
Policies

Modules:

CMS  
Activities  
News  
Documents  
Procurement  
Media  
GRM  

---

STEP 4

Generate Admin Dashboard.

Admin features:

manage pages  
manage activities  
manage news  
manage documents  
manage procurement  
manage media  
manage GRM cases  
manage users  
system settings

Use:

Inertia + React

---

STEP 5

Generate Public Website.

Pages:

Home  
About PIC  
Project  
Activities  
News  
Documents  
Procurement  
Media  
GRM  
Contact

---

STEP 6

Generate GRM system.

Features:

complaint submission form  
ticket generation  
status tracking  
officer assignment  
email notifications  

Entities:

grm_cases  
grm_messages  
grm_attachments  
grm_status_history

---

STEP 7

Generate search functionality.

Search across:

news  
documents  
activities  
procurements

Use PostgreSQL full-text search.

---

STEP 8

Generate roles and permissions.

Roles:

super_admin  
editor  
content_manager  
procurement_officer  
grm_officer

Use:

spatie/laravel-permission

---

# 6 Frontend Architecture

Frontend must use:

React + TypeScript  
Inertia pages  
shadcn/ui components  
TailwindCSS

Structure:

resources/js

components  
layouts  
pages  
modules  
hooks  
lib  
types

---

# 7 UI Components

Create reusable components.

Components:

Navbar  
Footer  
Hero  
NewsCard  
ActivityCard  
DocumentList  
SearchBar  
GRMForm  

---

# 8 Security Requirements

The system must include:

CSRF protection  
XSS protection  
SQL injection protection  
secure file uploads  

Admin features must include:

role permissions  
audit logging  
optional 2FA

---

# 9 Performance Requirements

Use:

database indexes  
image optimization  
lazy loading  
Laravel caching

---

# 10 Code Standards

Backend:

PSR-12  
Service layer pattern  
Repository pattern  

Frontend:

TypeScript strict mode  
functional components  
hooks architecture

---

# 11 Output Format

When generating code:

1 show directory structure  
2 generate migrations  
3 generate models  
4 generate controllers  
5 generate services  
6 generate repositories  
7 generate React pages  

Do not generate the entire project in one message.

Generate module by module.

---

# 12 Important Rules

Never invent database tables not defined in DatabaseSchema.md.

Always follow SystemArchitecture.md.

Do not introduce REST APIs.

Always use Inertia responses.

If something is unclear ask questions.

---

# 13 First Task

Read these files:

InformationArchitecture.md  
SystemArchitecture.md  
DatabaseSchema.md  

Then generate the Implementation Plan.

Wait for approval before coding.
