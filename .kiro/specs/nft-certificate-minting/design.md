# Design Document: NFT Certificate Minting

## Overview

This document describes the frontend design for completing and polishing the NFT certificate minting flow in Stacks Academy. All changes are scoped to the Next.js frontend. The backend API and `lib/api/certificates.ts` client are already in place and must not be modified.

The five areas of work are:

1. Fix the hardcoded `{ moduleId: 0, score: 100 }` payload in `FinalAssessmentCard`.
2. Add a public user certificate profile page at `/certificates/user/[userId]`.
3. Replace the full-page spinner on `CertificatesPage` with a loading skeleton grid.
4. Standardise inline error handling across all three minting surfaces.
5. Introduce a `CertificatesContext` so `HeroProgressWidget` refreshes its NFT count after a mint without a page reload.

---

## Architecture

The current architecture has three independent components that each manage their own certificate state in local `useState`. This causes the NFT count in `HeroProgressWidget` to go stale after a mint in `FinalAssessmentCard`.

The new architecture introduces a thin shared context (`CertificatesContext`) that lives on the learning-path page tree. It owns the certificate list and exposes a `refresh` function. Both `FinalAssessmentCard` and `HeroProgressWidget` consume this context instead of calling the API directly.

`CertificatesPage` and `QuizResultsPage` are on separate routes and do not need the shared context — they manage their own local state as before.

```mermaid
graph TD
    subgraph learning-path route
        LP[LearningPathPage layout]
        CTX[CertificatesContext Provider]
        FAC[FinalAssessmentCard]
        HPW[HeroProgressWidget]
        LP --> CTX
        CTX --> FAC
        CTX --> HPW
    end

    subgraph /certificates route
        CP[CertificatesPage - local state]
    end

    subgraph /ai-tutor/quiz/results route
        QR[QuizResultsPage - local state]
    end

    subgraph /certificates/user/[userId] route
        PP[PublicProfilePage - local state]
    end

    FAC -->|mint()| API[certificatesApi]
    HPW -->|getMyCerts() via context| API
    CP -->|getMyCerts() + mint()| API
    QR -->|checkEligibility() + mint()| API
    PP -->|getUserCerts()| API
```

---

## Components and Interfaces

### CertificatesContext

New file: `app/learning-path/context/CertificatesContext.tsx`

```typescript
interface CertificatesContextValue {
  certs: Certificate[];
  nftCount: number; // certs.filter(c => !!c.txId).length
  isLoading: boolean;
  refresh: () => Promise<void>;
}
```

- Fetches `certificatesApi.getMyCerts()` on mount when the user is authenticated.
- `refresh()` re-fetches and updates `certs` in state.
- `nftCount` is derived from `certs` — no separate state.
- Exported hook: `useCertificates()`.

### FinalAssessmentCard (modified)

- Consumes `useCertificates()` instead of calling `getMyCerts()` directly.
- Reads `moduleId` and `score` from the `EligibilityResult.certificate` field when available, or from `EligibilityResult` itself if the backend surfaces those fields.
- After a successful mint, calls `context.refresh()` so `HeroProgressWidget` updates.
- Inline error is scoped to the card (no change to existing placement).

### HeroProgressWidget (modified)

- Consumes `useCertificates()` and reads `nftCount` from context instead of calling `getMyCerts()` directly.
- Removes its own `useEffect` certificate fetch.

### CertificatesPage (modified)

- Replaces the full-page `<Loader2>` spinner with a `CertificateSkeletonGrid` component while loading.
- Per-card inline error: each card tracks its own `mintError` string in a `Record<string, string>` map keyed by `cert.id`.
- Global page error is kept only for the initial fetch failure.

### QuizResultsPage (modified)

- No structural changes — already uses `courseId` and `result.score` correctly.
- Error handling already inline; standardise the fallback message to match the other surfaces.

### PublicProfilePage (new)

New file: `app/certificates/user/[userId]/page.tsx`

- Reads `userId` from `params`.
- Calls `certificatesApi.getUserCerts(userId)`.
- Filters to only show certificates where `!!cert.txId`.
- Three states: loading (skeleton grid), empty state, certificate grid.
- Each card shows: module name, score, mint date, Hiro Explorer link.
- No mint button — this is a read-only public view.

### CertificateSkeletonCard (new)

New file: `app/certificates/components/CertificateSkeletonCard.tsx`

- A single skeleton card matching the shape of the real certificate card (gradient strip, icon placeholder, title, score, date, button).
- Used by both `CertificatesPage` and `PublicProfilePage`.

---

## Data Models

No new data models. Existing types from `lib/api/certificates.ts` are used throughout:

```typescript
interface Certificate {
  id: string;
  userId: string;
  moduleId: number;
  score: number;
  txId?: string;
  mintedAt?: string;
  createdAt: string;
}

interface EligibilityResult {
  isEligible: boolean;
  curriculumComplete: boolean;
  progressPercentage: number;
  alreadyMinted: boolean;
  certificate: Certificate | null; // used to extract moduleId + score
  message: string;
}
```

The `EligibilityResult.certificate` field already contains the `moduleId` and `score` needed to fix the hardcoded payload in `FinalAssessmentCard`.

---

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

Property 1: Mint payload uses real data
_For any_ eligibility result that contains a non-null `certificate` field, the `moduleId` and `score` passed to `certificatesApi.mint()` by `FinalAssessmentCard` should equal `certificate.moduleId` and `certificate.score` respectively.
**Validates: Requirements 1.1, 1.2**

Property 2: Public profile shows only on-chain certificates
_For any_ array of certificates returned by `getUserCerts()`, the PublicProfilePage should render only those certificates where `txId` is a non-empty string.
**Validates: Requirements 2.6**

Property 3: Skeleton card count matches grid columns
_For any_ loading state on CertificatesPage or PublicProfilePage, the number of skeleton cards rendered should be a positive integer consistent with the grid layout (e.g. 6 skeletons for a 3-column grid).
**Validates: Requirements 3.1, 3.3**

Property 4: Per-card error isolation
_For any_ set of certificate cards where one mint fails, only the card whose mint failed should display an error message; all other cards should have no error message.
**Validates: Requirements 4.3**

Property 5: Error cleared on new attempt
_For any_ certificate card that has a non-null error message, starting a new mint attempt should result in the error message being null before the new request resolves.
**Validates: Requirements 4.5**

Property 6: NFT count equals minted certificate count
_For any_ certificate list in CertificatesContext, `nftCount` should equal the count of certificates in the list where `txId` is a non-empty string.
**Validates: Requirements 5.1, 5.4**

Property 7: Context refresh updates NFT count
_For any_ initial certificate list, after calling `refresh()` and the new list contains one additional minted certificate, `nftCount` should increase by exactly 1.
**Validates: Requirements 5.4**

---

## Error Handling

| Surface             | Fetch error                       | Mint error                                        |
| ------------------- | --------------------------------- | ------------------------------------------------- |
| CertificatesPage    | Page-level banner (existing)      | Per-card inline error (new)                       |
| FinalAssessmentCard | Silently ignored (existing)       | Inline below description (existing, standardised) |
| QuizResultsPage     | Silently ignored (existing)       | Inline in banner (existing, standardised)         |
| PublicProfilePage   | Inline error + retry button (new) | N/A — no mint on public page                      |

All mint error messages use the API-returned message, falling back to `"Minting failed. Please try again."`.

---

## Testing Strategy

### Unit tests

- `CertificatesContext`: verify `nftCount` derivation, verify `refresh()` updates state.
- `FinalAssessmentCard`: verify mint is called with `certificate.moduleId` and `certificate.score` from the eligibility response; verify button is disabled when `certificate` is null.
- `CertificateSkeletonCard`: snapshot test to prevent unintended layout changes.
- `PublicProfilePage`: verify only `txId`-bearing certificates are rendered; verify empty state; verify error + retry.

### Property-based tests

Property tests use [fast-check](https://github.com/dubzzz/fast-check) (already available in the JS ecosystem). Each test runs a minimum of 100 iterations.

- **Property 2** — `getUserCerts` filter: generate arbitrary `Certificate[]` arrays with random `txId` presence; assert rendered count equals filtered count.
- **Property 4** — per-card error isolation: generate a list of N certificates, simulate one failing mint, assert exactly one card has a non-null error.
- **Property 6** — NFT count derivation: generate arbitrary `Certificate[]`; assert `nftCount === certs.filter(c => !!c.txId).length`.

Tag format for each test: `Feature: nft-certificate-minting, Property {N}: {property_text}`
