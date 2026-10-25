## MVP for StudyConnect

The MVP is the smallest version that lets a student get matched, learn, and give feedback end to end. It's free for everyone, so there are no payment, subscription, or pricing screens.

**In the MVP**

## MVP

| Area | What ships |
|---|---|
| Landing page | The first screen every user sees, with Log in and Create account. New users create an account, and returning users log in. Both go to the home dashboard. |
| Sign-up and login | Sign up with name, student ID, department, level and email. Choose learner or tutor. Log in with email and password. |
| Home dashboard | The starting point for finding tutors, sessions, resources, messages and notifications. |
| Settings | Edit profile details, change the courses you teach or need help with, change your password, set notification preferences, and log out. |
| Profiles | Tutors list the courses they can teach. Learners list the courses they need help with. |
| System pairing | A rule-based match on course, topic, level and availability, finding up to 6 tutors per learner. |
| One-to-many session | One learner with up to 6 tutors. It has a date, time and location, and the statuses pending, confirmed, completed and cancelled. |
| Chat session | Real-time chat inside each session, with file attachments. |
| Material sharing | Upload and download past questions, notes and textbooks, filtered by course and department. |
| Ratings and reviews | A per-course tutor rating after a completed session, plus a written review. |
| User history | A record of each user's sessions, chats, uploads, downloads and ratings. |
| In-app notifications | Basic alerts for new matches, confirmations and messages. |
| Report button | A simple way to flag a user, which matters because sessions are in person. |


# 🚀 Minimum Viable Product (MVP) Core Features Specification

This document defines the core functional scope that the engineering team must implement for the initial launch of the platform.

---

## 🧩 Module 1: Identity & Trust Gateway

### 1.1 Institutional Authentication Domain Check
* **Description:** The signup gateway strictly requires and validates user credentials using verified school email domains.
* **Technical Goal:** Eradicate "Fake or misleading profiles."
* **MVP Scope:** Regex verification mapping matching domain formats (e.g., `.edu.ng`).

### 1.2 Dual-Intent Dynamic Profiles
* **Description:** Allow a single profile matrix to dynamically handle both learning match metrics and peer tutoring availability configurations.
* **Technical Goal:** Build internal supply for tutors and partners simultaneously without forcing the creation of separate user records.

---

## 🧠 Module 2: The Proximity Matching Engine

### 2.1 Course Code Alignment Sync
* **Description:** The system core matches student pairs sharing matching arrays of active semester course selections.
* **Technical Goal:** Target immediate common dependencies across identical fields of study (e.g., Computer Science, Cybersecurity, Law).

### 2.2 Availability Overlap Index
* **Description:** An algorithm designed to cross-reference macro-blocks of available hours entered by students during registration.
* **Technical Goal:** Mitigate scheduling coordination failures by highlighting overlapping slots (e.g., Monday Morning, Wednesday Evening).

---

## 💬 Module 3: Structural Collaboration & Communication

### 3.1 Sandboxed In-App Text Messenger
* **Description:** A text communication environment allowing matched pairs to sync location points and schedule details.
* **Security Protocol:** Mask and sandbox personal user contact information (such as WhatsApp data or phone numbers) to protect early interactions.

### 3.2 Attendance Verification Loops
* **Description:** A quick confirmation dialogue box issued to both users immediately after a scheduled study event completes.
* **Accountability Goal:** Dynamically lower matching platform rankings for users flagged as "Unreliable study partners."

**After the MVP**
- Progress tracking dashboards
- Course communities
- Reading and study partner matching
- Reshuffling of pairs
- Demand and supply counts per course
- Push notifications
- Online video sessions

**To prove the MVP works:** In this demo, one learner signs up, gets paired with tutors, joins a session, chats and shares a file, then rates the tutors. Afterwards the tutor's rating and both histories show the update.


