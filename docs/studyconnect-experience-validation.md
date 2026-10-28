# StudyConnect experience: review and validation

Branch: `feat/studyconnect-experience`

## Result

The frontend now provides a consistent responsive StudyConnect workspace with actual account, discovery, booking, session, partner, material, profile, and notification data. The initial undefined auth state crash, inconsistent auth payloads/URL prefixes, lost login user, nullable course arrays, and wrong-session navigation are repaired. The backend OTP persistence bug found during live validation is also repaired without changing public DTOs or response shapes.

## Changed areas

- `frontend/src/App.jsx`: authentication lifecycle, grouped navigation, legacy route aliases, ID-based detail URLs, desktop sidebar, mobile dialog drawer, theme, and application composition.
- `frontend/src/components/`: shared dialog/loading/error/empty states; account access, dashboard, discovery/profile, booking/session/history/review, partner matching, library, notifications/messages, and profile/settings screens.
- `frontend/src/styles.css`, `frontend/public/fonts/`, and `frontend/index.html`: design tokens, local licensed Inter font, responsive layouts, dark theme, focus and reduced-motion support, and StudyConnect title.
- `frontend/src/Auth.js`, `api.js`, and `config.js`: shared request/URL handling, backend-compatible auth payloads, API methods, readable validation errors, and protected-session expiry handling.
- `frontend/src/SafetyGuidance.jsx`: compact contextual, expandable meetup checklist.
- Backend auth/users services and their existing test files: persist email verification before issuing tokens and retain non-editable verification fields.
- `frontend/test/api.test.js` and package script: nine regression tests using Node's built-in runner; no added npm dependencies or dependency/lockfile changes.
- Integration audit: actual supported features and backend gaps, replacing preliminary assumptions.

## Automated checks

| Check | Outcome |
| --- | --- |
| Frontend frozen install | `npm ci --no-audit --no-fund` |
| Frontend tests | 9 passed |
| Frontend production build | Passed |
| Backend build | Passed |
| Backend unit suite | 9 suites, 43 tests passed |
| Backend HTTP end-to-end suite | 1 test passed |
| Whitespace check | `git diff --check` |

The frontend production bundle is approximately 218 kB JavaScript / 68 kB gzip, plus 27 kB CSS / 6 kB gzip and a 48 kB self-hosted font. No application dependency was added.

## Chromium validation against local services

The backend, PostgreSQL, and Vite were running. QA users, courses, sessions, resources, matches, and reviews were created for this run; existing user data was not repurposed. QA records were removed after validation.

Passed browser flows:

- Real invalid login feedback, registration, OTP verification, persisted verification, authenticated reload, logout, and subsequent login.
- Tutor search/filtering, actual profile/reviews, one-to-one booking, distinct dashboard session IDs, and detail reload.
- Profile editing persisted through `/auth/me`.
- Hosted-material metadata sharing and tracked access to the returned link.
- Partner matching through the implemented API with compatibility limitations stated in the UI.
- Real notification empty state and, with one explicitly seeded QA notification, unread badge plus mark-read persistence.
- Light/dark theme persistence across reload.
- API failure/retry, delayed loading, and expired-session handling. Only these negative tests intercepted responses; the app does not mock backend data.
- Assigned-tutor confirm/complete actions, participant cancellation, completed-session review, online group booking, and another student's open-group join.
- Password recovery, OTP entry, mismatched-password validation, reset persistence, and login with the updated password.
- All ten main screens and login/registration at 320, 375, 768, 1024, and 1440px without document horizontal overflow.
- Native mobile drawer focus trap, Escape, focus return, close-on-navigation, and reduced-motion behavior.
- No browser runtime errors during the completed main or extended runs.

The backend rate limit was respected by pacing responsive tests. Earlier test attempts exposed the null-course-array and OTP persistence defects; both were fixed and the affected flows rerun successfully.

## Accessibility

Axe WCAG 2 A/AA and 2.1 AA automated checks reported zero violations in ten states: authentication, dashboard, tutor discovery, sessions, profile, settings, materials, partners, dark settings, and mobile navigation. Theme checks waited for the color transition to finish. These automated results and keyboard checks do not substitute for a complete manual accessibility review or assistive-technology testing.

## Screenshots

Chromium captured desktop and mobile account access, dashboard, tutor discovery, and mobile navigation. They use clearly identified QA data. The current workspace stores the screenshots and JSON validation records under `/workspace/shared/studyconnect/`; they are review artifacts, not production data or permanent hosting links.

## Remaining limits

See the integration audit for missing chat/attachments, timetable and compatibility algorithms, invitation approval, institutional scoping, notification preferences/automatic event creation, and binary file storage. Those features are not represented as completed in the interface. Real external email delivery, remote deployment, and production multi-user operation were not exercised.

Changes are prepared on the feature branch. No direct push to main is part of this work.
