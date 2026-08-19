# Security Specification

## Data Invariants
1. A User profile in `/users/{userId}` can only be accessed or modified by the owner (`request.auth.uid == userId`) or an admin.
2. A User resume in `/users/{userId}/resumes/{resumeId}` can only be created, read, updated, or deleted by the owning user (`request.auth.uid == userId`).
3. A Hunt submission in `/hunt_submissions/{submissionId}` can be created by authenticated users or visitors submitting their CV profile, but can only be updated/deleted by authorized admins or the submitting user (if authenticated).

## The Dirty Dozen Payloads
1. User A attempts to write to `/users/userB` -> Rejected (Identity Violation).
2. User A attempts to list resumes in `/users/userB/resumes` -> Rejected (Unauthorized Subcollection Read).
3. Attacker submits candidate submission with 1MB oversized string in `jobTitle` -> Rejected (Boundary Guard Violation).
4. Malicious client modifies another user's resume `userId` during update -> Rejected (Immutable Field Violation).
5. Unauthenticated user attempts to delete someone's hunt submission -> Rejected (Unauthorized Deletion).
6. User attempts to inject malicious non-alphanumeric doc ID -> Rejected (`isValidId` Violation).
7. User attempts to set arbitrary role privileges in their user profile -> Rejected (Privilege Escalation Guard).
8. Attacker attempts batch modification of terminal status -> Rejected.
9. Malicious client attempts shadow update with undeclared fields -> Rejected (Strict Keys Validation).
10. Attacker attempts to forge `createdAt` with arbitrary timestamp -> Rejected (Temporal Integrity Guard).
11. Attacker attempts to write a null or invalid email string -> Rejected (Format Validation).
12. Attacker attempts to list all candidate submissions without authorization -> Rejected (Query Enforcer).
