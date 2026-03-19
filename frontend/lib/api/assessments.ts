import { request } from "@/lib/api/client";

// ── Question types matching the backend question.types.ts ──────────────────

export type QuestionType = "multiple-choice" | "open-ended";

export interface QuestionOption {
  id: string; // "a" | "b" | "c" | "d"
  text: string;
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  codeSnippet?: string;
  explanation: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: QuestionOption[];
  correctOptionId: string;
}

export interface OpenEndedQuestion extends BaseQuestion {
  type: "open-ended";
  modelAnswer: string;
}

export type QuizQuestion = MultipleChoiceQuestion | OpenEndedQuestion;

// ── Session / result shapes ────────────────────────────────────────────────

export interface QuizSession {
  id: string;
  userId: string;
  topic: string;
  format: "multi_choice" | "open_ended" | "mixed";
  includeAdvanced: boolean;
  questions: QuizQuestion[];
  score?: number;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  feedback: string;
}

export interface GradeResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  passed?: boolean;
  feedback?: string;
  results: QuestionResult[];
}

// ── Request DTOs matching the backend GenerateQuizDto ─────────────────────

export type QuizFormatDto = "multi_choice" | "open_ended" | "mixed";

export interface GenerateQuizDto {
  topic: string;
  format: QuizFormatDto;
  includeAdvanced?: boolean;
}

export interface SubmitAnswersDto {
  answers: Record<string, string>; // { questionId: optionId | openText }
}

// ── API client ────────────────────────────────────────────────────────────

export const assessmentsApi = {
  /** Generate a personalized AI quiz. */
  generate: (dto: GenerateQuizDto) =>
    request<QuizSession>("/assessments/generate", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  /** Submit answers for AI grading. */
  submit: (sessionId: string, dto: SubmitAnswersDto) =>
    request<GradeResult>(`/assessments/${sessionId}/submit`, {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  /** Get the user's past quiz sessions. */
  getHistory: () => request<QuizSession[]>("/assessments/history"),
};
