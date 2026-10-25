# 🚀 Minimum Viable Product (MVP) Product Requirement Document (PRD)

## 1. Document Context
* **Project Title:** PeerLink
* **Target Environment:** Higher Education Infrastructure (Nigeria)
* **Status:** Draft / Active Development

---

## 2. Core Functional Requirements (MVP Scope)

### 🧩 Module 1: Identity & Trust Gateway (FR-1)
* **FR-1.1: Institutional Authentication Domain Check**
  * *Description:* System must validate registration credentials using school email networks.
  * *Technical Goal:* Eradicate "Fake or misleading profiles."
* **FR-1.2: Dual-Intent Dynamic Profiles**
  * *Description:* Allow single profiles to transition smoothly between learning and tutoring functionalities.
  * *Technical Goal:* Build fluid inventory for both standard study matches and accessible peer tutors without forcing separate accounts.

### 🧠 Module 2: The Proximity Matching Engine (FR-2)
* **FR-2.1: Course Code Alignment Sync**
  * *Description:* Algorithm must parse database tables to match users based on matching course arrays (`User_Courses`).
  * *Priority:* High.
* **FR-2.2: Availability Overlap Index**
  * *Description:* System checks intersection maps of overlapping free day/time slots between matching students.
  * *Priority:* High.

### 💬 Module 3: Structural Collaboration & Communication (FR-3)
* **FR-3.1: Sandboxed In-App Text Messenger**
  * *Description:* Instant-messaging text environment linking paired students together.
  * *Security Protocol:* Mask personal WhatsApp numbers and personal phone configurations to preserve early privacy.
* **FR-3.2: Attendance Verification Loops**
  * *Description:* Post-session interactive checking prompt evaluating partner follow-through.
  * *Accountability Goal:* Flag and drop search rankings for "Unreliable study partners."

---

## 3. Product Launch & Phased Feature Roadmap

```text
┌────────────────────────────────┐
│      PHASE 1: THE MVP          │ ──► Focus: Safe Matching & Timetable Matrix
└───────────────┬────────────────┘
                │
                ▼
┌────────────────────────────────┐
│   PHASE 2: COLLABORATION HUB   │ ──► Focus: PDF/Link Uploads & Study Reminders
└───────────────┬────────────────┘
                │
                ▼
┌────────────────────────────────┐
│   PHASE 3: MARKETPLACE TRUST   │ ──► Focus: Verified Tutor Badges & Escrow Wallets
└────────────────────────────────┘
```

### Phase 1: MVP Release (Active Phase)
* Core deployment of institutional checks, matching parameters, and safe text chats.
* Zero financial transactions or advanced streaming functions.

### Phase 2: Engagement Layer
* Implementation of document upload structures (PDFs, YouTube link anchors).
* Push notifications notifying users of upcoming test and exam dates to counter personal distraction rates.

### Phase 3: Marketplace Scaling & Optimization
* Introduction of academic verification systems (Transcript/Grade badge uploads to ensure subject competency).
* Introduction of micro-transaction engines mapping specialized hourly fees for premium 1-on-1 tutoring.

---

## 4. Operational Boundaries & Constraints
* **Low-Bandwidth Resilience:** System interfaces, loading frameworks, and text channels must remain responsive under standard on-campus data limitations.
* **Data Security Boundary:** Student location coordinates, full profiles, and custom timetables must never be exposed or searchable to unauthenticated guest visitors.
