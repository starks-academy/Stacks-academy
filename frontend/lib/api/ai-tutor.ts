import { request } from "@/lib/api/client";

// ── Enums matching backend ─────────────────────────────────────────────────

export enum PracticeModule {
  GENERAL = 0,
  BITCOIN_FUNDAMENTALS = 1,
  INTRODUCTION_TO_STACKS = 2,
  CLARITY_SMART_CONTRACTS = 3,
  BUILD_DAPPS = 4,
  ADVANCED_SMART_CONTRACT_PATTERNS = 5,
  BUILD_REAL_PROJECTS = 6,
}

export type PracticeQuizFormat = "multiple-choice" | "open-ended" | "mixed";

// ── Request DTOs ───────────────────────────────────────────────────────────

export interface ChatMessageDto {
  message: string;
  sessionId?: string;
  currentCourseId?: number;
  currentLessonId?: number;
}

export interface GeneratePracticeQuizDto {
  module?: PracticeModule;
  format?: PracticeQuizFormat;
  questionCount?: number;
}

export interface SubmitPracticeAnswerDto {
  questionId: string;
  answer: string;
  question: string;
  questionType: string;
}

// ── Response shapes ────────────────────────────────────────────────────────

export interface ChatResponse {
  sessionId: string;
  message: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  currentCourseId?: number;
  currentLessonId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeQuestion {
  id: string;
  type: "multiple-choice" | "open-ended";
  question: string;
  options?: { id: string; text: string }[];
  correctOptionId?: string;
  modelAnswer?: string;
}

export interface PracticeQuizResponse {
  questions: PracticeQuestion[];
}

export interface PracticeAnswerFeedback {
  isCorrect: boolean;
  feedback: string;
  explanation?: string;
}

// ── API client ─────────────────────────────────────────────────────────────

export const aiTutorApi = {
  /** Send a message to the context-aware AI tutor (requires auth). */
  chat: (dto: ChatMessageDto) =>
    request<ChatResponse>("/ai-tutor/chat", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  /** List all chat sessions for the current user. */
  getSessions: () => request<ChatSession[]>("/ai-tutor/sessions"),

  /** Get a single session with full message history. */
  getSession: (id: string) =>
    request<ChatSession & { messages: { role: string; content: string }[] }>(
      `/ai-tutor/sessions/${id}`,
    ),

  /** Delete a chat session. */
  deleteSession: (id: string) =>
    request<{ deleted: boolean }>(`/ai-tutor/sessions/${id}`, {
      method: "DELETE",
    }),

  /** Generate practice quiz questions (public, no auth required). */
  generatePracticeQuiz: (dto: GeneratePracticeQuizDto) =>
    request<PracticeQuizResponse>("/ai-tutor/practice/generate", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  /** Check a practice answer and get feedback (public, no auth required). */
  checkPracticeAnswer: (dto: SubmitPracticeAnswerDto) =>
    request<PracticeAnswerFeedback>("/ai-tutor/practice/check", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
};
