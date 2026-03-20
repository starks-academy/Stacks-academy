# Implementation Plan: NFT Certificate Minting

## Overview

Incremental implementation of the five frontend improvements. Each task builds on the previous one. The shared `CertificatesContext` is introduced first because both the `FinalAssessmentCard` fix and the `HeroProgressWidget` refresh depend on it.

## Tasks

- [ ] 1. Create CertificatesContext for shared certificate state
  - Create `app/learning-path/context/CertificatesContext.tsx` exporting `CertificatesProvider` and `useCertificates()`
  - Context holds `certs: Certificate[]`, `nftCount` (derived), `isLoading: boolean`, and `refresh(): Promise<void>`
  - On mount (when `isAuthenticated`), fetch via `certificatesApi.getMyCerts()`
  - `refresh()` re-fetches and updates `certs` in state
  - Wrap the learning-path page layout (or the page component) with `<CertificatesProvider>`
  - _Requirements: 5.2, 5.3_

  - [ ]\* 1.1 Write property test for NFT count derivation
    - **Property 6: NFT count equals minted certificate count**
    - Generate arbitrary `Certificate[]` with random `txId` presence; assert `nftCount === certs.filter(c => !!c.txId).length`
    - **Validates: Requirements 5.1, 5.4**

- [ ] 2. Migrate HeroProgressWidget to consume CertificatesContext
  - Remove the `certificatesApi.getMyCerts()` call and `nftCount` local state from `HeroProgressWidget`
  - Read `nftCount` from `useCertificates()` instead
  - Keep the `coursesApi.getProgressSummary()` fetch as-is
  - _Requirements: 5.1, 5.5_

- [x] 3. Fix hardcoded mint payload in FinalAssessmentCard
  - Read `moduleId` and `score` from `eligibilityResult.certificate` when available
  - Pass real values to `certificatesApi.mint()` instead of `{ moduleId: 0, score: 100 }`
  - Disable the Mint button and show an inline error if `eligibilityResult.certificate` is null when the user tries to mint
  - After a successful mint, call `context.refresh()` from `useCertificates()` so `HeroProgressWidget` updates
  - _Requirements: 1.1, 1.2, 1.3, 5.1_

  - [ ]\* 3.1 Write property test for mint payload correctness
    - **Property 1: Mint payload uses real data**
    - Generate arbitrary `EligibilityResult` objects with non-null `certificate`; render `FinalAssessmentCard`, trigger mint, assert `certificatesApi.mint` was called with `certificate.moduleId` and `certificate.score`
    - **Validates: Requirements 1.1, 1.2**

- [ ] 4. Checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Add CertificateSkeletonCard component
  - Create `app/certificates/components/CertificateSkeletonCard.tsx`
  - Skeleton matches the real card shape: gradient strip placeholder, icon placeholder, title bar, score line, date line, button placeholder
  - Use CSS `animate-pulse` for the shimmer effect
  - Export a `CertificateSkeletonGrid` that renders 6 skeleton cards in the same responsive grid as the real cards (1 col / md:2 / lg:3)
  - _Requirements: 3.1, 3.3_

- [ ] 6. Replace spinner with skeleton on CertificatesPage
  - Import and render `CertificateSkeletonGrid` while `loading` is true instead of the full-page `<Loader2>` spinner
  - Keep the unauthenticated state and error state unchanged
  - _Requirements: 3.1, 3.2, 3.3_

  - [ ]\* 6.1 Write example test for skeleton loading state
    - Mock `certificatesApi.getMyCerts` to return a pending promise
    - Assert `CertificateSkeletonGrid` is rendered and no real certificate cards are present
    - **Validates: Requirements 3.1**

- [ ] 7. Standardise per-card error handling on CertificatesPage
  - Replace the single `error` string state with a `mintErrors: Record<string, string>` map keyed by `cert.id`
  - On mint failure, set `mintErrors[cert.id]` to the API error message (fallback: `"Minting failed. Please try again."`)
  - Clear `mintErrors[cert.id]` when a new mint attempt starts for that card
  - Clear `mintErrors[cert.id]` on mint success
  - Render the per-card error inline below the module name inside each certificate card
  - Keep the page-level `error` state only for the initial fetch failure
  - _Requirements: 4.3, 4.4, 4.5, 4.6_

  - [ ]\* 7.1 Write property test for per-card error isolation
    - **Property 3: Per-card error isolation with correct message**
    - Generate a list of N certificates; simulate one failing mint with a known error string; assert exactly one card shows the error and the message matches
    - **Validates: Requirements 4.3, 4.4**

  - [ ]\* 7.2 Write property test for error cleared on new attempt
    - **Property 4: Error cleared on new attempt or success**
    - For any card with a non-null error, starting a new mint should clear the error before the request resolves
    - **Validates: Requirements 4.5, 4.6**

- [ ] 8. Standardise error messages on QuizResultsPage and FinalAssessmentCard
  - Ensure both surfaces use the same fallback string: `"Minting failed. Please try again."`
  - Ensure both surfaces clear the error when a new mint attempt starts (`setMintError(null)` before the request — already present in QuizResultsPage, verify FinalAssessmentCard matches)
  - No structural changes needed; this is a copy/behaviour alignment task
  - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [ ] 9. Build PublicProfilePage at /certificates/user/[userId]
  - Create `app/certificates/user/[userId]/page.tsx` as a client component
  - Read `userId` from `useParams()`
  - Call `certificatesApi.getUserCerts(userId)` on mount
  - Filter results to only certificates where `!!cert.txId`
  - Loading state: render `CertificateSkeletonGrid`
  - Empty state: render an empty-state message ("This user has no public certificates yet.")
  - Error state: render an inline error message and a "Retry" button that re-triggers the fetch
  - Certificate grid: reuse the same card layout as `CertificatesPage` but read-only (no mint button); show module name, score, mint date, and Hiro Explorer link
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]\* 9.1 Write property test for public profile certificate filter
    - **Property 2: Public profile shows only on-chain certificates with required fields**
    - Generate arbitrary `Certificate[]` with mixed `txId` presence; assert rendered card count equals `certs.filter(c => !!c.txId).length` and each card contains module name, score, mint date, and explorer link
    - **Validates: Requirements 2.6, 2.7**

- [ ] 10. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
