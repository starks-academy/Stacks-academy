import { request } from "@/lib/api/client";

export interface Certificate {
  id: string;
  userId: string;
  moduleId: number;
  score: number;
  txId?: string;
  mintedAt?: string;
  createdAt: string;
}

export interface MintCertificateDto {
  moduleId: number;
  score: number;
}

export interface EligibilityResult {
  isEligible: boolean;
  curriculumComplete: boolean;
  progressPercentage: number;
  alreadyMinted: boolean;
  certificate: Certificate | null;
  message: string;
}

export const certificatesApi = {
  getMyCerts: () => request<Certificate[]>("/certificates/me"),

  getUserCerts: (userId: string) =>
    request<Certificate[]>(`/certificates/user/${userId}`),

  getCert: (id: string) => request<Certificate>(`/certificates/${id}`),

  checkEligibility: () =>
    request<EligibilityResult>("/certificates/eligibility"),

  mint: (dto: MintCertificateDto) =>
    request<Certificate>("/certificates/mint", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
};
