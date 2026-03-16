# Database Schema
## Official Website – Projects Implementation Center (PIC)

Project: Tajikistan Digital Foundations Project  
Stack: Laravel + PostgreSQL

---

# 1. Database Overview

The database supports the following system modules:

CMS  
Activities  
News  
Documents  
Procurement  
Media  
GRM (Grievance Redress Mechanism)  
Users & Permissions  
Search  
Audit Logs  
Translations

---

# 2. Core Tables

## users

Stores administrator accounts.

fields:

id  
name  
email  
password  
role_id  
is_active  
created_at  
updated_at

---

## roles

Defines system roles.

fields:

id  
name  
description

roles:

super_admin  
editor  
content_manager  
procurement_officer  
grm_officer

---

# 3. CMS Tables

## pages

Static website pages.

fields:

id  
slug  
status  
created_by  
published_at  
created_at  
updated_at

status:

draft  
published  
archived

---

## page_translations

fields:

id  
page_id  
language  
title  
content  
meta_title  
meta_description

languages:

tj  
ru  
en

---

# 4. News Module

## news

fields:

id  
slug  
category_id  
author_id  
featured_image  
published_at  
status  
created_at  
updated_at

---

## news_translations

fields:

id  
news_id  
language  
title  
summary  
content

---

## news_categories

fields:

id  
name

---

# 5. Activities Module

## activities

fields:

id  
slug  
status  
start_date  
end_date  
created_at  
updated_at

status:

planned  
in_progress  
completed

---

## activity_translations

fields:

id  
activity_id  
language  
title  
description  
objectives

---

# 6. Documents Module

## documents

fields:

id  
category_id  
file_path  
file_type  
file_size  
published_at  
uploaded_by

---

## document_translations

fields:

id  
document_id  
language  
title  
description

---

## document_categories

fields:

id  
name

---

# 7. Procurement Module

## procurements

fields:

id  
reference_number  
status  
publication_date  
deadline  
created_at  
updated_at

status:

open  
closed  
awarded  
archived

---

## procurement_translations

fields:

id  
procurement_id  
language  
title  
description

---

## procurement_documents

fields:

id  
procurement_id  
document_id

---

# 8. Media Module

## media_items

fields:

id  
type  
file_path  
thumbnail  
uploaded_by  
created_at

type:

image  
video

---

# 9. GRM Module

## grm_cases

fields:

id  
ticket_number  
complainant_name  
email  
phone  
category  
description  
status  
created_at  
updated_at

status:

submitted  
under_review  
investigation  
resolved  
closed

---

## grm_messages

fields:

id  
case_id  
sender_type  
message  
created_at

sender_type:

user  
officer

---

## grm_attachments

fields:

id  
case_id  
file_path  
uploaded_at

---

## grm_status_history

fields:

id  
case_id  
status  
changed_by  
created_at

---

# 10. Taxonomy Tables

## tags

fields:

id  
name

---

## taggables

fields:

id  
tag_id  
taggable_type  
taggable_id

---

# 11. Search Index

## search_index

fields:

id  
entity_type  
entity_id  
title  
content  
language

---

# 12. Audit Logs

## audit_logs

fields:

id  
user_id  
action  
entity_type  
entity_id  
metadata  
created_at

---

# 13. System Settings

## settings

fields:

id  
key  
value

examples:

site_title  
contact_email  
grm_notification_email

---

# 14. File Storage

Files stored in:

storage/app/public

structure:

documents/  
media/  
grm/  

---

# 15. ERD Overview

Entity relationships:

Users → Roles  

Pages → Page Translations  

News → News Translations  
News → Categories  

Activities → Activity Translations  

Documents → Document Translations  
Documents → Categories  

Procurements → Procurement Translations  
Procurements → Documents  

GRM Cases → Messages  
GRM Cases → Attachments  
GRM Cases → Status History  

Tags → Taggables  

Audit Logs → Users

---

# 16. ERD Diagram (Simplified)

Users
 └── Roles

Pages
 └── PageTranslations

News
 ├── NewsTranslations
 └── NewsCategories

Activities
 └── ActivityTranslations

Documents
 ├── DocumentTranslations
 └── DocumentCategories

Procurements
 ├── ProcurementTranslations
 └── ProcurementDocuments

MediaItems

GRMCases
 ├── GRMMessages
 ├── GRMAttachments
 └── GRMStatusHistory

Tags
 └── Taggables

AuditLogs
 └── Users

---

# 17. Indexing Strategy

Indexes must exist for:

slug  
reference_number  
ticket_number  
status  
language

Full text index recommended for:

news content  
documents  
activities

---

# 18. Migration Order (Laravel)

Recommended migration order:

roles  
users  

pages  
page_translations  

news  
news_translations  
news_categories  

activities  
activity_translations  

documents  
document_translations  
document_categories  

procurements  
procurement_translations  
procurement_documents  

media_items  

grm_cases  
grm_messages  
grm_attachments  
grm_status_history  

tags  
taggables  

audit_logs  

settings

---

# 19. Data Integrity

Use foreign keys for:

translations  
document relations  
procurement relations  
GRM relations  

Use cascading deletes carefully.

---

# 20. Future Extensions

The schema must allow future modules:

Open Data Portal  
Project monitoring dashboards  
Public APIs  
Mobile applications
