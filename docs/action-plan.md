# WuLab — Requirements & Action Plan
## Siam Master Concrete Co., Ltd.

> **Version:** 1.0  
> **Updated:** 2026-05-02  
> **Repo:** https://github.com/tiw25999/WuLab

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Functional Requirements](#2-functional-requirements)
3. [Non-Functional Requirements](#3-non-functional-requirements)
4. [MVP Action Plan — Day 1](#4-mvp-action-plan--day-1)
5. [Full Action Plan — 3 Phases](#5-full-action-plan--3-phases)
6. [Acceptance Criteria](#6-acceptance-criteria)
7. [Constraints & Assumptions](#7-constraints--assumptions)
8. [Tech Stack](#8-tech-stack)

---

## 1. Project Overview

| Field | Detail |
|-------|--------|
| Project | WuLab — Company website + online sales system |
| Company | Siam Master Concrete Co., Ltd. (บริษัท สยามมาสเตอร์คอนกรีต จำกัด) |
| Founded | 1994 (พ.ศ. 2537) — 30+ years of experience |
| Business | Manufacture and sell prestressed concrete products |
| Objective | Present the company and products, receive RFQ submissions, manage customers online |
| Target Users | General public · Private companies · Government agencies |
| Languages | Thai (default) + English |
| Contact Channels | Online / Phone / Walk-in |
| Customer System | No login required — submit RFQ directly |

### Company Strengths

| # | Strength | Detail |
|---|----------|--------|
| 1 | TIS/มอก. Certified | Products certified by Thai Industrial Standard |
| 2 | Rare Hollow Core | Very few manufacturers in Thailand — strong market advantage |
| 3 | High Production Capacity | Can handle large-scale projects |
| 4 | Quality & Precision | Factory-controlled production process |

### Products

| # | Product | Use Cases |
|---|---------|-----------|
| 1 | Prestressed Concrete Pole (เสาไฟฟ้า) | High-voltage utility poles, infrastructure |
| 2 | Hollow Core Slab (แผ่นพื้น Hollow Core) | Buildings, condos, warehouses, parking structures |
| 3 | Prestressed Concrete Pile (เสาเข็ม) | Foundation work, housing estates, large structures |

---

## 2. Functional Requirements

> Priority: **High** = must have · **Medium** = should have · **Low** = nice to have

### FR-01 Landing Page & Company Presentation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01-1 | Display company name, logo, and slogan in Hero section | High |
| FR-01-2 | Show 4 company strengths (TIS cert, Hollow Core rarity, capacity, quality) | High |
| FR-01-3 | CTA buttons linking to RFQ form and product catalog | High |
| FR-01-4 | Company history section — founded 1994, 30+ years | High |
| FR-01-5 | Display TIS/มอก. certification badges | High |
| FR-01-6 | Portfolio section with project reference photos | Medium |
| FR-01-7 | News & articles section | Low |

### FR-02 Product Catalog

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-02-1 | List all 3 products with real product images | High |
| FR-02-2 | Product detail page: specs, dimensions, weight, load capacity | High |
| FR-02-3 | Use case section per product | High |
| FR-02-4 | Download Datasheet (PDF) and TIS/มอก. certificate | High |
| FR-02-5 | Filter products by type or use case | Medium |
| FR-02-6 | Compare specs between products | Low |

### FR-03 RFQ System (Request for Quotation)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-03-1 | General form: name, phone, email, product, quantity, message | High |
| FR-03-2 | Private company form: company info, project type, file attachment | High |
| FR-03-3 | Government form: agency info, procurement reference no., file attachment | High |
| FR-03-4 | Save submission to database with unique reference code | High |
| FR-03-5 | Send confirmation email to customer automatically | High |
| FR-03-6 | Notify admin via email on new submission | High |
| FR-03-7 | Success page showing reference code and submission summary | High |
| FR-03-8 | Customer can track inquiry status by reference code | Medium |

### FR-04 Admin Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-04-1 | Admin login with username + password (JWT) | High |
| FR-04-2 | View all inquiries with filters by status, date, customer type | High |
| FR-04-3 | Update inquiry status: New → In Progress → Completed | High |
| FR-04-4 | CRUD products — add, edit, delete + upload images and datasheet | High |
| FR-04-5 | Edit content: About, Portfolio, News | Medium |
| FR-04-6 | Dashboard summary: today's inquiries, monthly chart | Low |
| FR-04-7 | Export inquiries to Excel | Low |

### FR-05 Bilingual Support

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-05-1 | All pages support Thai / English toggle | High |
| FR-05-2 | Product content and specs available in both languages | High |
| FR-05-3 | Remember user's language preference | Medium |

---

## 3. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | Page load under 3 seconds on 4G |
| NFR-02 | Responsiveness | Correct layout on mobile, tablet, and desktop |
| NFR-03 | Security | Protect against SQL injection and XSS · HTTPS on all pages |
| NFR-04 | Availability | System uptime ≥ 99% per month |
| NFR-05 | Concurrency | Support at least 100 simultaneous visitors |
| NFR-06 | Maintainability | Clean code structure — easy to extend with new features |
| NFR-07 | Backup | Automatic daily database backup |
| NFR-08 | SEO | Complete meta tags · Google-indexable |

---

## 4. MVP Action Plan — Day 1

> **Goal:** Working website online with product catalog + RFQ form in 8 hours  
> **Output:** Live Vercel URL ready for Demo or Pitch

| Time | Task | What to do | Done when |
|------|------|-----------|-----------|
| 08:00–09:00 | **T1 — Scaffold** | Create Next.js 14 + Tailwind CSS<br>Connect Prisma + SQLite<br>Create Product and Inquiry tables<br>Seed 3 products with real data<br>Push to GitHub | App runs on localhost:3000 with product data |
| 09:00–11:00 | **T2 — Landing + About** | Hero: logo, company name, slogan, CTA buttons<br>Strengths section — 4 cards<br>TIS/มอก. certification section<br>Company history — 30 years<br>Full navigation menu | Landing and About pages complete on all devices |
| 11:00–13:00 | **T3 — Product Catalog** | Product list page — all 3 products<br>Load real images from `images/`<br>Product detail page + specs table<br>PDF download button (Datasheet) | All 3 products display with real images and specs |
| 13:00–14:00 | **Lunch break** | — | — |
| 14:00–16:00 | **T4 — RFQ Form** | 3-type form with tab selector<br>Client-side validation<br>Save to DB + generate reference code<br>Send email notification to admin<br>Success page with reference code | Form submits successfully, admin receives email |
| 16:00–17:00 | **T5 — Test + Deploy** | Test all pages on mobile and desktop<br>Test form submission end-to-end<br>Push to GitHub<br>Deploy to Vercel<br>Verify live URL | Website is online with working live URL |

### MVP Deliverables

| ✅ Included in Day 1 | ❌ Not included (next phases) |
|---------------------|------------------------------|
| Landing page + About | Admin dashboard |
| Product catalog — 3 products with real images | Thai/English language toggle |
| RFQ form for all 3 customer types | Portfolio page |
| Email notification to admin | Inquiry status tracking |
| Live Vercel URL | Customer account system |

---

## 5. Full Action Plan — 3 Phases

### Phase 1 — MVP Showcase `5–7 working days`

| Task | Description | Est. | Done when |
|------|-------------|------|-----------|
| T1.1 Scaffold | Next.js + Prisma + SQLite + seed data | 0.5d | App runs locally with seed data |
| T1.2 Landing page | Hero, strengths, certs, stats, CTA | 0.5d | Renders correctly on all devices |
| T1.3 About page | Company history, vision, values | 0.5d | Content complete |
| T1.4 Product catalog | List + detail + specs + PDF download | 1.5d | All 3 products visible with real images |
| T1.5 RFQ form | 3 customer types + DB save + email | 1d | Form works, email reaches admin |
| T1.6 i18n | Thai / English toggle across all pages | 1d | Language switch works correctly |
| T1.7 Test + Deploy | Full page test + Vercel deploy | 0.5d | Live URL passing all pages |

### Phase 2 — Sales System `10–14 working days`

| Task | Description | Est. | Done when |
|------|-------------|------|-----------|
| T2.1 Admin login | JWT auth + protected routes | 0.5d | Admin can log in securely |
| T2.2 Inquiry management | List + filter + status update | 1.5d | Admin can manage all inquiries |
| T2.3 Product management | CRUD + image upload + PDF upload | 2d | Admin can edit products via dashboard |
| T2.4 Inquiry tracking | Customer checks status by reference code | 1d | Status lookup works correctly |
| T2.5 Portfolio page | Project references with categories | 2d | Portfolio displays and filters correctly |
| T2.6 Excel export | Download inquiry list as .xlsx | 1d | Excel file downloads correctly |
| T2.7 Test + fixes | Full feature test + bug fixes | 2–4d | All Phase 2 features pass testing |

### Phase 3 — Customer Portal `7–10 working days` *(optional)*

| Task | Description | Est. | Done when |
|------|-------------|------|-----------|
| T3.1 Customer accounts | Register + login + profile | 2d | Customer can register and log in |
| T3.2 Inquiry history | View past submissions + status | 2d | History shows correctly per account |
| T3.3 Government docs | Procurement documents section | 2d | Documents complete and downloadable |
| T3.4 Test + Deploy | Full system test on production | 1–4d | All systems working on production |

---

## 6. Acceptance Criteria

### Phase 1 — MVP
- [ ] Landing page presents company with all 4 strengths and TIS/มอก. certs
- [ ] All 3 products display with real images and downloadable Datasheet
- [ ] RFQ form works for all 3 customer types
- [ ] Admin receives email notification on new submission
- [ ] Pages render correctly on mobile and desktop
- [ ] Live URL accessible on Vercel

### Phase 2 — Sales System
- [ ] Admin can log in and update inquiry status
- [ ] Admin can CRUD products via dashboard
- [ ] Customer can track inquiry by reference code
- [ ] Excel export downloads correctly

### Phase 3 — Customer Portal
- [ ] Customer can register and log in
- [ ] Inquiry history visible and accurate per account
- [ ] Government procurement documents section functional
- [ ] All systems working on production

---

## 7. Constraints & Assumptions

### Constraints
- No pricing system integration — prices managed manually in the admin panel
- No ERP/external system connection
- No online payment in Phase 1
- No customer login in Phase 1

### Assumptions
- 11 real product images available in `images/` directory
- Datasheet PDF files will be provided for all 3 products
- Admin email account available for notifications
- English content will be provided or approved by the client

---

## 8. Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js 14 (App Router) | Single repo for pages + API routes |
| ORM | Prisma | Type-safe queries, easy migration |
| DB (dev) | SQLite | Zero setup, no Docker needed |
| DB (prod) | PostgreSQL | Scalable, managed |
| Styling | Tailwind CSS | Fast, flexible, utility-first |
| Images | Cloudinary or `/public` | Product photos and portfolio |
| Admin auth | bcryptjs + JWT | Stateless, secure |
| Email | Resend or Nodemailer | RFQ notification + confirmation |
| i18n | next-intl | Thai/English language routing |
| Deploy | Vercel | Auto-deploy from GitHub |
| Repo | github.com/tiw25999/WuLab | Branch: main |

---

> Document will be updated when requirements or timeline change.
