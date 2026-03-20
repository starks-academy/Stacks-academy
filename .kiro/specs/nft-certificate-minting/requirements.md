# Requirements Document

## Introduction

This document covers the frontend improvements needed to complete and polish the NFT certificate minting flow in Stacks Academy. The backend API and the API client layer (`lib/api/certificates.ts`) are already implemented. The work is scoped entirely to the Next.js frontend: fixing a hardcoded mint payload, adding a public user certificate profile page, adding loading skeletons to the certificates page, standardising error handling across all three minting surfaces, and refreshing the HeroProgressWidget NFT count after a successful mint without a full page reload.

## Glossary

- **Certificate**: A record returned by the backend representing a completed module, optionally minted as a SIP-009 NFT on the Stacks blockchain. Defined by the `Certificate` interface in `lib/api/certificates.ts`.
- **EligibilityResult**: The response from `GET /certificates/eligibility`, containing `isEligible`, `alreadyMinted`, `certificate`, and related fields.
- **MintButton**: Any UI control that triggers `certificatesApi.mint()`.
- **FinalAssessmentCard**: The component at `app/learning-path/components/FinalAssessmentCard.tsx`.
- **QuizResultsPage**: The page at `app/ai-tutor/quiz/results/page.tsx`.
- **CertificatesPage**: The page at `app/certificates/page.tsx`.
- **HeroProgressWidget**: The component at `app/learning-path/components/HeroProgressWidget.tsx`.
- **PublicProfilePage**: The new Next.js route at `app/certificates/user/[userId]/page.tsx`.
- **CertificatesContext**: A new React context that owns the certificate list state and exposes a `refresh` function so multiple components can stay in sync.
- **Skeleton**: A placeholder UI element shown while data is loading, matching the shape of the real content.

---

## Requirements

### Requirement 1: Fix Hardcoded Mint Payload in FinalAssessmentCard

**User Story:** As a learner, I want my minted certificate to reflect my actual module and score, so that the on-chain record is accurate.

#### Acceptance Criteria

1. WHEN the FinalAssessmentCard calls `certificatesApi.mint()`, THE FinalAssessmentCard SHALL pass the real `moduleId` derived from the eligibility response rather than the hardcoded value `0`.
2. WHEN the FinalAssessmentCard calls `certificatesApi.mint()`, THE FinalAssessmentCard SHALL pass the real `score` derived from the eligibility response rather than the hardcoded value `100`.
3. WHEN the EligibilityResult does not contain a `moduleId` or `score`, THE FinalAssessmentCard SHALL disable the Mint button and display an inline error message indicating the data is unavailable.

---

### Requirement 2: Public User Certificate Profile Page

**User Story:** As a visitor, I want to view another user's public certificates at a shareable URL, so that learners can showcase their achievements.

#### Acceptance Criteria

1. THE PublicProfilePage SHALL be accessible at the route `/certificates/user/[userId]`.
2. WHEN the PublicProfilePage loads, THE PublicProfilePage SHALL call `certificatesApi.getUserCerts(userId)` and display all returned certificates.
3. WHEN the certificates are loading, THE PublicProfilePage SHALL display a Skeleton layout matching the certificate card grid.
4. WHEN no certificates are found for the user, THE PublicProfilePage SHALL display an empty-state message indicating the user has no certificates yet.
5. IF `certificatesApi.getUserCerts()` returns an error, THEN THE PublicProfilePage SHALL display an error message and a retry button.
6. THE PublicProfilePage SHALL only display certificates that have a `txId` (i.e., minted on-chain), since this is a public view.
7. WHEN a certificate is displayed, THE PublicProfilePage SHALL show the module name, score, mint date, and a link to the Hiro Explorer transaction.

---

### Requirement 3: Loading Skeleton for Certificates Page

**User Story:** As a learner, I want to see a loading skeleton on the certificates page instead of a spinner, so that the page feels faster and the layout does not shift.

#### Acceptance Criteria

1. WHEN the CertificatesPage is loading certificates, THE CertificatesPage SHALL display a grid of Skeleton cards matching the shape of the real certificate cards.
2. WHEN the CertificatesPage finishes loading, THE CertificatesPage SHALL replace the Skeleton cards with the real certificate cards without layout shift.
3. THE Skeleton cards SHALL match the column count of the real grid (1 column on mobile, 2 on md, 3 on lg).

---

### Requirement 4: Consistent Error Handling Across Minting Surfaces

**User Story:** As a learner, I want clear and consistent error feedback when minting fails, so that I know what went wrong and can take action.

#### Acceptance Criteria

1. WHEN a mint operation fails on the QuizResultsPage, THE QuizResultsPage SHALL display the error message inline within the certificate banner, below the description text.
2. WHEN a mint operation fails on the FinalAssessmentCard, THE FinalAssessmentCard SHALL display the error message inline within the card, below the description text.
3. WHEN a mint operation fails on the CertificatesPage, THE CertificatesPage SHALL display the error message inline on the specific certificate card that failed, not as a global page-level error.
4. WHEN a mint operation fails on any surface, THE System SHALL display the error message returned by the API client, falling back to "Minting failed. Please try again." if no message is available.
5. WHEN a new mint attempt is started on any surface, THE System SHALL clear the previous error message for that surface before the new request begins.
6. WHEN a mint operation succeeds on any surface, THE System SHALL clear any existing error message for that surface.

---

### Requirement 5: Refresh HeroProgressWidget NFT Count After Mint

**User Story:** As a learner, I want the NFT count in the HeroProgressWidget to update immediately after I mint a certificate, so that I see accurate progress without reloading the page.

#### Acceptance Criteria

1. WHEN a certificate is successfully minted on any surface within the learning-path page, THE HeroProgressWidget SHALL update its displayed NFT count to reflect the new total without a full page reload.
2. THE System SHALL expose a mechanism (CertificatesContext or equivalent) that allows the FinalAssessmentCard and HeroProgressWidget to share certificate state.
3. WHEN `CertificatesContext` is initialised and the user is authenticated, THE CertificatesContext SHALL fetch the current certificate list via `certificatesApi.getMyCerts()`.
4. WHEN a mint succeeds through `CertificatesContext`, THE CertificatesContext SHALL update the certificate list in state so all consumers reflect the new count immediately.
5. WHILE the CertificatesContext is fetching certificates, THE HeroProgressWidget SHALL continue to display the last known NFT count (or zero if none).
