"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Clock, BookOpen } from "lucide-react";
import QuizHeader from "../components/QuizHeader";
import QuestionDisplay from "../components/QuestionDisplay";
import OptionItem, { OptionState } from "../components/OptionItem";
import FeedbackAlert from "../components/FeedbackAlert";
import QuizActions from "../components/QuizActions";
import OpenEndedInput from "../components/OpenEndedInput";
import {
  assessmentsApi,
  QuizSession,
  QuizQuestion,
  QuizFormatDto,
} from "@/lib/api/assessments";

// Map frontend format labels → backend QuizFormatDto values
const FORMAT_MAP: Record<string, QuizFormatDto> = {
  "multi-choice": "multi_choice",
  "open-ended": "open_ended",
  mixed: "mixed",
};

// Reference docs mapped by topic keywords
const DOCS_REFS: { keywords: string[]; label: string; url: string }[] = [
  {
    keywords: ["clarity", "contract", "smart contract"],
    label: "Clarity Language Reference",
    url: "https://docs.stacks.co/clarity/overview",
  },
  {
    keywords: ["stacks", "stx", "layer 2"],
    label: "Stacks Documentation",
    url: "https://docs.stacks.co",
  },
  {
    keywords: ["bitcoin", "btc", "proof of work", "pow", "utxo"],
    label: "Bitcoin Developer Docs",
    url: "https://developer.bitcoin.org/devguide/",
  },
  {
    keywords: ["nft", "sip-009", "non-fungible"],
    label: "SIP-009 NFT Standard",
    url: "https://github.com/stacksgov/sips/blob/main/sips/sip-009",
  },
  {
    keywords: ["defi", "fungible", "sip-010", "token"],
    label: "SIP-010 Fungible Token Standard",
    url: "https://github.com/stacksgov/sips/blob/main/sips/sip-010",
  },
  {
    keywords: ["dao", "governance", "voting"],
    label: "Stacks Governance",
    url: "https://docs.stacks.co/concepts/governance",
  },
  {
    keywords: ["pox", "proof of transfer", "stacking"],
    label: "Proof of Transfer (PoX)",
    url: "https://docs.stacks.co/concepts/proof-of-transfer",
  },
  {
    keywords: ["wallet", "auth", "authentication", "connect"],
    label: "Stacks Connect",
    url: "https://docs.hiro.so/stacks/connect",
  },
  {
    keywords: ["hiro", "api", "explorer"],
    label: "Hiro Platform Docs",
    url: "https://docs.hiro.so",
  },
];

function getDocRef(
  topic: string,
  questionText: string,
): { label: string; url: string } | null {
  const haystack = `${topic} ${questionText}`.toLowerCase();
  for (const ref of DOCS_REFS) {
    if (ref.keywords.some((kw) => haystack.includes(kw))) {
      return { label: ref.label, url: ref.url };
    }
  }
  return { label: "Stacks Documentation", url: "https://docs.stacks.co" };
}

type AnswerMap = Record<string, string>;

function ActiveQuizInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Clarity";
  const formatParam = searchParams.get("format") || "mixed";
  const format: QuizFormatDto = FORMAT_MAP[formatParam] ?? "mixed";
  const includeAdvanced = searchParams.get("advanced") === "1";

  const [session, setSession] = useState<QuizSession | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [openTextAnswer, setOpenTextAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittingFinal, setSubmittingFinal] = useState(false);

  // Generate quiz on mount using the real backend contract
  useEffect(() => {
    let cancelled = false;
    assessmentsApi
      .generate({ topic, format, includeAdvanced })
      .then((sess) => {
        if (cancelled) return;
        setSession(sess);
        setQuestions((sess.questions as QuizQuestion[]) ?? []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message ?? "Failed to generate quiz. Please try again.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [topic, format, includeAdvanced]);

  const currentQuestion: QuizQuestion | undefined = questions[currentIndex];
  const totalQuestions = questions.length;
  const isMultipleChoice = currentQuestion?.type === "multiple-choice";

  const handleOptionClick = (optionId: string) => {
    if (!isSubmitted) setSelectedOptionId(optionId);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isSubmitted) setOpenTextAnswer(e.target.value);
  };

  const hasSelectedAnswer =
    selectedOptionId !== null || openTextAnswer.trim().length > 0;

  // For MC: check correctness immediately using the data we already have
  const isCurrentAnswerCorrect = (() => {
    if (!isSubmitted || !currentQuestion) return false;
    if (currentQuestion.type === "multiple-choice") {
      return (
        selectedOptionId ===
        (
          currentQuestion as import("@/lib/api/assessments").MultipleChoiceQuestion
        ).correctOptionId
      );
    }
    // Open-ended: we can't grade locally, defer to backend
    return false;
  })();

  const handleCheck = () => {
    if (!hasSelectedAnswer || !currentQuestion) return;
    const ans = selectedOptionId ?? openTextAnswer;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: ans }));
    setIsSubmitted(true);
  };

  const finishQuiz = useCallback(async () => {
    if (!session) return;
    setSubmittingFinal(true);
    try {
      const result = await assessmentsApi.submit(session.id, { answers });
      sessionStorage.setItem("quizResult", JSON.stringify(result));
      sessionStorage.setItem("quizTopic", topic);
      router.push("/ai-tutor/quiz/results");
    } catch {
      router.push("/ai-tutor/quiz/results");
    }
  }, [session, answers, topic, router]);

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOptionId(null);
      setOpenTextAnswer("");
      setIsSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const getOptionState = (optionId: string): OptionState => {
    if (!isSubmitted)
      return selectedOptionId === optionId ? "selected" : "default";
    if (currentQuestion?.type !== "multiple-choice") return "default";
    const correctId = (
      currentQuestion as import("@/lib/api/assessments").MultipleChoiceQuestion
    ).correctOptionId;
    if (optionId === correctId) return "correct";
    if (optionId === selectedOptionId) return "incorrect";
    return "default";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B1A] pt-32 flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center mb-2">
          <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white">Generating Your Quiz…</h2>
        <p className="text-[#8E90B0] max-w-sm">
          Claude is crafting personalized questions about{" "}
          <span className="text-brand-orange font-semibold">{topic}</span>. This
          takes a few seconds.
        </p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0B1A] pt-32 flex flex-col items-center justify-center gap-6 text-center px-4">
        <p className="text-red-400 text-lg font-medium">
          {error ?? "No questions were generated."}
        </p>
        <button
          onClick={() => router.push("/ai-tutor")}
          className="mt-4 px-6 py-3 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B1A] pt-32 pb-20 px-4 md:px-8 font-sans flex justify-center">
      <div className="w-full max-w-3xl flex flex-col items-center">
        <div className="w-full bg-[#0F1023] rounded-3xl p-8 md:p-12 border border-[#2A2B4A]/50 shadow-2xl relative">
          <QuizHeader
            currentQuestion={currentIndex + 1}
            totalQuestions={totalQuestions}
            canGoBack={currentIndex > 0 && !isSubmitted}
            canGoForward={false}
            onPrevious={() => {
              if (currentIndex > 0 && !isSubmitted) {
                setCurrentIndex((i) => i - 1);
                setSelectedOptionId(null);
                setOpenTextAnswer("");
                setIsSubmitted(false);
              }
            }}
          />

          <div className="bg-[#14152C] rounded-2xl p-6 md:p-10 border border-[#2A2B4A] shadow-inner mb-8">
            {/* Use the `question` field from the backend, not `text` */}
            <QuestionDisplay question={currentQuestion.question} />

            {/* Optional code snippet */}
            {currentQuestion.codeSnippet && (
              <pre className="mt-4 mb-6 bg-[#0A0B1A] text-[#8E90B0] text-sm rounded-xl p-4 overflow-x-auto border border-[#2A2B4A]">
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            )}

            {isMultipleChoice ? (
              <div className="space-y-4">
                {(
                  currentQuestion as import("@/lib/api/assessments").MultipleChoiceQuestion
                ).options.map((opt) => (
                  <OptionItem
                    key={opt.id}
                    text={`${opt.id.toUpperCase()}. ${opt.text}`}
                    state={getOptionState(opt.id)}
                    onClick={() => handleOptionClick(opt.id)}
                    disabled={isSubmitted}
                  />
                ))}
              </div>
            ) : (
              <OpenEndedInput
                value={openTextAnswer}
                onChange={handleTextChange}
                isSubmitted={isSubmitted}
                isCorrect={false}
              />
            )}

            {isSubmitted &&
              (currentQuestion.type === "open-ended" ? (
                <div className="mt-6 space-y-3">
                  <div className="p-5 rounded-xl border border-[#2A2B4A] bg-[#14152C]/60">
                    <h4 className="text-[#F58320] font-bold mb-2 text-sm">
                      Model Answer
                    </h4>
                    <p className="text-[#E2E8F0] text-sm leading-relaxed">
                      {
                        (
                          currentQuestion as import("@/lib/api/assessments").OpenEndedQuestion
                        ).modelAnswer
                      }
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#2A2B4A] bg-[#0A0B1A]/60 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#F58320] shrink-0" />
                    <p className="text-[#8E90B0] text-sm">
                      Claude will grade your answer when you finish the quiz.
                    </p>
                  </div>
                  {(() => {
                    const ref = getDocRef(topic, currentQuestion.question);
                    return ref ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#2A2B4A] bg-[#14152C] hover:border-[#F58320]/50 transition-colors group"
                      >
                        <BookOpen className="w-4 h-4 text-[#F58320] shrink-0" />
                        <span className="text-[#8E90B0] text-sm group-hover:text-white transition-colors">
                          Learn more:{" "}
                          <span className="text-[#F58320]">{ref.label}</span>
                        </span>
                      </a>
                    ) : null;
                  })()}
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  <FeedbackAlert
                    isCorrect={isCurrentAnswerCorrect}
                    explanation={currentQuestion.explanation}
                  />
                  {(() => {
                    const ref = getDocRef(topic, currentQuestion.question);
                    return ref ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#2A2B4A] bg-[#14152C] hover:border-[#F58320]/50 transition-colors group"
                      >
                        <BookOpen className="w-4 h-4 text-[#F58320] shrink-0" />
                        <span className="text-[#8E90B0] text-sm group-hover:text-white transition-colors">
                          Learn more:{" "}
                          <span className="text-[#F58320]">{ref.label}</span>
                        </span>
                      </a>
                    ) : null;
                  })()}
                </div>
              ))}
          </div>

          <QuizActions
            isAnswerSubmitted={isSubmitted}
            isLastQuestion={currentIndex === totalQuestions - 1}
            hasSelectedOption={hasSelectedAnswer}
            onSkipClick={handleNext}
            onSubmitClick={handleCheck}
            onNextClick={submittingFinal ? () => {} : handleNext}
          />

          {submittingFinal && (
            <div className="absolute inset-0 bg-black/60 rounded-3xl flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
              <p className="text-white font-semibold">Grading your answers…</p>
            </div>
          )}
        </div>

        <p className="text-[#8E90B0]/50 text-xs mt-8">
          AI can make mistakes — verify important information independently.
        </p>
      </div>
    </div>
  );
}

export default function ActiveQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0B1A] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
        </div>
      }
    >
      <ActiveQuizInner />
    </Suspense>
  );
}
