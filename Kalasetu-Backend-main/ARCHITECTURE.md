# KalaSetu Backend Architecture & System Blueprint
**SIH PS 26090 – Ministry of Social Justice & Empowerment**

KalaSetu is an AI-powered multilingual e-commerce and procurement platform enabling marginalized artisans to list, manage, and sell their products to B2C consumers, bulk commercial buyers, and government departments.

---

## Tech Stack Overview

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Framework** | **FastAPI (Python 3.11+)** | High-performance async REST APIs & WebSockets |
| **Database** | **PostgreSQL 15+** | Relational data persistence |
| **ORM / Migration** | **SQLAlchemy 2.0 (Async) + Alembic** | Database schema modeling & migrations |
| **Authentication** | **Firebase Auth (OTP) + JWT** | Phone OTP authentication & role-based RBAC |
| **AI & NLP** | **BHASHINI API** | Multilingual Speech-to-Text & translation |
| **Image Processing** | **OpenCV (Python)** | AI product image enhancement & optimization |
| **Payments** | **Razorpay API** | B2C transactions & checkout processing |
| **Logistics** | **ONDC Protocol** | Order tracking & fulfillment |
| **Verification** | **Mock UIDAI / NSDL / GSTN APIs** | SIH prototype verification of Aadhaar, PAN, GSTIN |

---

## System Architecture Diagram

```
                             +----------------------------------------+
                             |           Client Applications          |
                             | React Native (Expo) / Admin Web Portal |
                             +-------------------+--------------------+
                                                 |
                                     HTTP REST / WebSockets
                                                 |
                                                 v
                             +----------------------------------------+
                             |           FastAPI Gateway              |
                             |   Firebase Auth & Role Middleware      |
                             +----+--------------+--------------+-----+
                                  |              |              |
           +----------------------+              |              +----------------------+
           |                                     v                                     |
           v                        +-------------------------+                        v
+--------------------+              |   AI & Image Services   |              +--------------------+
|  Domain Routers    |              +-------------------------+              | External Services  |
| • Auth & Onboard   |              | • Bhashini STT & Trans  |              | • Firebase Auth    |
| • Artisan & Craft  |              | • OpenCV Image Enhance  |              | • Razorpay Payment |
| • Products & Stock |              | • AI Catalog Generator  |              | • ONDC Logistics   |
| • Tenders & Quotes |              +-------------------------+              | • Mock Verification|
| • Contracts & Order|                                                       +--------------------+
| • Chat (WebSocket) |
| • Admin & Schemes  |
+----------+---------+
           |
           v
+--------------------+
| PostgreSQL DB      |
+--------------------+
```

---

## User Roles & Capabilities

```
+-----------------------------------------------------------------------------------+
|                                 USER ROLES                                        |
+-----------------------------------------------------------------------------------+
| 1. ARTISAN              | Identity & craft verification, product creation (AI    |
|                         | photo/speech), quotation replies, tender bidding,       |
|                         | order status updates, sales analytics.                  |
+-------------------------+---------------------------------------------------------+
| 2. B2C CUSTOMER         | Product discovery, custom quotation request, direct    |
|                         | checkout (Razorpay), ONDC tracking, mandatory review.   |
+-------------------------+---------------------------------------------------------+
| 3. BULK BUYER           | Organization verification (GSTIN/PAN), post bulk        |
| (NGO / Corporate)       | tenders, quote comparison, digital contract execution.  |
+-------------------------+---------------------------------------------------------+
| 4. GOVT BUYER           | Department verification, government tender posting,     |
|                         | procurement workflows, legal contract signing.          |
+-------------------------+---------------------------------------------------------+
| 5. GOVT ADMIN           | Platform admin portal, artisan & buyer approvals,       |
|                         | tender/order oversight, government scheme publishing.   |
+-----------------------------------------------------------------------------------+
```

---

## Core Database Models

1. **`users` & `profiles`**: Handles core identities and multi-role profiles (`artisan_profiles`, `buyer_profiles`).
2. **`products` & `product_images`**: Product listings, raw audio links, AI enhanced image URLs, inventory.
3. **`tenders`**: Bulk & Government procurement listings with reference images and target timelines.
4. **`quotation_requests` & `quotations`**: Direct B2C quote queries & B2B/Govt tender bids.
5. **`contracts`**: Digital legal contract generated upon quote acceptance, tracking digital signatures.
6. **`orders`**: Active order status tracker (`CONTRACT_SIGNED`, `IN_PRODUCTION`, `READY_FOR_DISPATCH`, `DISPATCHED`, `COMPLETED`), Razorpay transaction details, ONDC tracking.
7. **`chats` & `messages`**: Real-time messaging sessions tied to quotations/tenders/orders with translation metadata.
8. **`government_schemes` & `reviews`**: Policy recommendation feed & mandatory buyer rating system.

---

## API Module Breakdown (`/api/v1`)

- `/auth` – User registration, phone OTP validation, role JWT issuance.
- `/verifications` – Mock Aadhaar, PAN, GSTIN verification check APIs.
- `/artisans` – Artisan profile, location, craft taxonomy, sales analytics dashboard.
- `/products` – Image upload (OpenCV enhancement), audio detail voice-to-text (Bhashini), catalog publish/CRUD.
- `/tenders` – Post bulk/govt tenders, list open tenders matching artisan craft.
- `/quotations` – Send quotes, compare quote responses, trigger chat threads.
- `/contracts` – Auto-generate contract documents, digital signature handlers.
- `/orders` – Order lifecycle updates, Razorpay payment verification, ONDC tracking updates.
- `/chat` – WebSocket connection for real-time multilingual messaging.
- `/schemes` – Government scheme feeds and notifications.
- `/admin` – User approvals, tender monitoring, platform metrics.

---

## Business Workflows

### 1. B2C Product Purchase Flow
1. Customer browses artisan catalog -> Clicks **Request Quotation**.
2. Artisan receives request -> Inputs available qty, unit price, production timeline -> Sends quote.
3. Chat thread opens automatically -> Customer accepts quote -> Payment via Razorpay.
4. Order transitions to `IN_PRODUCTION` -> Artisan dispatches via ONDC -> Customer receives & leaves mandatory review.

### 2. Bulk & Government Procurement Tender Flow
1. Bulk / Govt buyer posts tender (item, quantity, delivery location, specs).
2. Artisans receive tender notification -> Submit quotations with unit price & production capacity.
3. Buyer compares quotations -> Accepts optimal quotation.
4. Automated legal contract generated -> Both parties sign digitally.
5. Order activated -> Stage updates tracked until ONDC dispatch & completion.

---

## Deployment & Execution Environment

- **Containerization**: Docker & Docker Compose setup (`fastapi` backend + `postgres` database).
- **Database Migrations**: Managed via Alembic scripts.
- **Async Engine**: `asyncpg` with SQLAlchemy 2.0 async sessions for high-concurrency performance.
