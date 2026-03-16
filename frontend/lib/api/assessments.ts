import { request } from "@/lib/api/client";

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface QuizSession {
  id: string;
  moduleId: number;
  questions: QuizQuestion[];
  status: "pending" | "submitted" | "graded";
  score?: number;
  createdAt: string;
}

export interface GradeResult {
  sessionId: string;
  score: number;
  passed: boolean;
  feedback: string;
}

export interface QuizQuota {
  used: number;
  limit: number;
  remaining: number;
  resetsAt: string;
}

export interface GenerateQuizDto {
  moduleId: number;
  questionCount?: number; // default: 5
}

export interface SubmitAnswersDto {
  answers: Record<string, string>; // { questionId: selectedOption }
}

export const assessmentsApi = {
  /**
   * Ask the AI (Claude 3.5 Haiku) to generate a personalized quiz
   * for a given course module.
   */
  generate: (dto: GenerateQuizDto) =>
    request<QuizSession>("/assessments/generate", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  /**
   * Submit quiz answers for AI grading.
   * Returns the score, pass/fail status, and feedback.
   */
  submit: (sessionId: string, dto: SubmitAnswersDto) =>
    request<GradeResult>(`/assessments/${sessionId}/submit`, {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  /** Get the user's past quiz sessions and scores. */
  getHistory: () => request<QuizSession[]>("/assessments/history"),

  /** Check how many quizzes the user can still generate today. */
  getQuota: () => request<QuizQuota>("/assessments/quota"),
};
