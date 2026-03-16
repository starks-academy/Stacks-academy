"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import QuizHeader from "../components/QuizHeader";
import QuestionDisplay from "../components/QuestionDisplay";
import OptionItem, { OptionState } from "../components/OptionItem";
import FeedbackAlert from "../components/FeedbackAlert";
import QuizActions from "../components/QuizActions";
import OpenEndedInput from "../components/OpenEndedInput";
import { assessmentsApi, QuizSession, QuizQuestion } from "@/lib/api/assessments";

// Map topic keywords → moduleId (1-6 as accepted by the backend DTO)
const TOPIC_TO_MODULE: Record<string, number> = {
  "clarity": 1,
  "stacks": 2,
  "defi": 3,
  "nft": 4,
  "dao": 5,
  "bitcoin": 6,
};

function getModuleId(topic: string): number {
  const lower = topic.toLowerCase();
  for (const [keyword, id] of Object.entries(TOPIC_TO_MODULE)) {
    if (lower.includes(keyword)) return id;
  }
  // Default to module 1 if no match
  return 1;
}

// We track answers as a map from questionId -> chosen option text
type AnswerMap = Record<string, string>;

function ActiveQuizInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Clarity";

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

  // Generate quiz on mount
  useEffect(() => {
    const moduleId = getModuleId(topic);
    assessmentsApi
      .generate({ moduleId, questionCount: 5 })
      .then((sess) => {
        setSession(sess);
        setQuestions(sess.questions ?? []);
      })
      .catch((err) => setError(err?.message ?? "Failed to generate quiz. Please try again."))
      .finally(() => setLoading(false));
  }, [topic]);

  const currentQuestion: QuizQuestion | undefined = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleOptionClick = (optionId: string) => {
    if (!isSubmitted) setSelectedOptionId(optionId);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isSubmitted) setOpenTextAnswer(e.target.value);
  };

  const hasSelectedAnswer =
    selectedOptionId !== null || openTextAnswer.trim().length > 0;

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
      // Store result so the results page can read it without a round-trip
      sessionStorage.setItem("quizResult", JSON.stringify(result));
      sessionStorage.setItem("quizTopic", topic);
      router.push("/ai-tutor/quiz/results");
    } catch {
      // Fallback: still navigate but without data
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
    if (!isSubmitted) return selectedOptionId === optionId ? "selected" : "default";
    // After submit, highlight user's pick — backend grading happens on full submit
    return selectedOptionId === optionId ? "selected" : "default";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B1A] pt-32 flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center mb-2">
          <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white">Generating Your Quiz…</h2>
        <p className="text-[#8E90B0] max-w-sm">
          Claude is crafting personalized questions about <span className="text-brand-orange font-semibold">{topic}</span>. This takes a few seconds.
        </p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0B1A] pt-32 flex flex-col items-center justify-center gap-6 text-center px-4">
        <p className="text-red-400 text-lg font-medium">{error ?? "No questions were generated."}</p>
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
            <QuestionDisplay question={currentQuestion.text} />

            {/* Render options if the question has them, otherwise open-ended */}
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              <div className="space-y-4">
                {currentQuestion.options.map((opt, i) => {
                  const optId = `opt_${i}`;
                  return (
                    <OptionItem
                      key={optId}
                      text={opt}
                      state={getOptionState(optId)}
                      onClick={() => handleOptionClick(optId)}
                      disabled={isSubmitted}
                    />
                  );
                })}
              </div>
            ) : (
              <OpenEndedInput
                value={openTextAnswer}
                onChange={handleTextChange}
                isSubmitted={isSubmitted}
                isCorrect={false}
              />
            )}

            {/* After checking, show a neutral "answer recorded" message since real grading happens server-side */}
            {isSubmitted && (
              <FeedbackAlert
                isCorrect={true}
                explanation="Your answer has been recorded. You'll see the full AI-graded breakdown on the results page."
              />
            )}
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
