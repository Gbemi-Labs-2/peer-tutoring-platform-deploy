# Frontend–Backend Integration Audit

## 1. Purpose

This document tracks the integration between the CampusConnect peer-tutoring frontend and backend. Its purpose is to identify features that are documented, implemented, connected, and verified, while distinguishing confirmed findings from items that still require investigation.

## 2. Preliminary Findings

| Feature                | Frontend Evidence                                                                | Backend Documentation                                                                         | Audit Status                                                |
| ---------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Authentication         | The inspected `AuthView` calls `onLogin`, which changes the active view to Home. | Registration, OTP verification, OTP resend, login, and current-user endpoints are documented. | Backend integration not demonstrated in the inspected code. |
| Tutor recommendations  | README states that recommendations use mock data.                                | Student/profile and course endpoints are documented.                                          | Real API integration requires verification.                 |
| Upcoming sessions      | README states that upcoming sessions use mock data.                              | Tutoring booking and session-list endpoints are documented.                                   | Real API integration requires verification.                 |
| Campus verification    | README lists this as planned.                                                    | Authentication and verification endpoints are documented.                                     | Frontend workflow requires verification.                    |
| Study-partner matching | README lists matching as planned.                                                | Partner-matching endpoints are documented.                                                    | Frontend workflow requires verification.                    |
| Messaging              | README lists messaging as planned.                                               | Backend implementation and available endpoints require further inspection.                    | Not yet verified.                                           |
| Data persistence       | README lists persistence as planned.                                             | The backend documents PostgreSQL and TypeORM.                                                 | End-to-end persistence requires verification.               |

## 3. Authentication Finding

The inspected `App.jsx` code passes this callback to `AuthView`:

`onLogin={() => setActiveView("Home")}`

The login and signup buttons call `onLogin` directly. In the inspected snippet, there is no demonstrated request to the backend, credential submission, OTP verification, or authentication-response handling.

This is a preliminary finding based on the inspected code, not proof that authentication logic is absent throughout the repository.

## 4. Recommended Verification

1. Inspect the complete frontend source for API clients, authentication services, and other backend requests.
2. Compare the authentication request payloads and response handling with the backend API documentation.
3. Verify that navigation to protected views occurs only after successful authentication.
4. Check whether tutor recommendations and upcoming sessions retrieve real API data or use mock data.
5. Verify session booking, matching, error handling, loading states, and persistence.
6. Record reproducible results and update this audit as features are tested.

## 5. Evidence and Limitations

The initial findings are based on the frontend README, the inspected `AuthView` snippet, and the backend README/API reference.

Documented endpoints do not by themselves prove that the corresponding backend functionality works or that the frontend is integrated with it. Further source inspection and testing are required before classifying a feature as complete or defective.

## 6. Intended Outcome

Maintain a shared, evidence-based view of integration progress so the team can prioritize missing connections, avoid duplicate work, and verify the platform's readiness for students.
