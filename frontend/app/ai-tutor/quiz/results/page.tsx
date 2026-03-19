"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RotateCcw, Plus, Trophy, AlertCircle, Sparkles } from "lucide-react";
import ScoreSummaryCard from "../../components/ScoreSummaryCard";
import ResultsBreakdownCard from "../../components/ResultsBreakdownCard";
import { GradeResult } from "@/lib/api/assessments";

export default function QuizResultsPage() {
  const [result] = useState<GradeResult | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem("quizResult");
      return raw ? (JSON.parse(raw) as GradeResult) : null;
    } catch {
      return null;
    }
  });

  const [topic] = useState<string>(() => {
    if (typeof window === "undefined") return "your quiz";
    return sessionStorage.getItem("quizTopic") ?? "your quiz";
  });

  if (!result) {
    // Navigated here directly without completing a quiz
    return (
      <div className="min-h-screen bg-[#0A0B1A] pt-32 pb-20 px-4 flex justify-center">
        <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            No Quiz Results Found
          </h2>
          <p className="text-[#8E90B0] max-w-sm">
            It looks like you haven&apos;t completed a quiz yet. Start one from
            the AI Tutor page.
          </p>
          <Link href="/ai-tutor">
            <button className="mt-2 px-8 py-4 bg-brand-orange text-white rounded-xl font-bold hover:bg-orange-500 transition-colors shadow-[0_0_20px_rgba(245,131,32,0.3)]">
              Start a Quiz
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const total = result.totalQuestions;
  const correct = result.correctCount;
  const incorrect = result.incorrectCount;
  const percentage = result.score;
  const passed = result.passed ?? percentage >= 60;

  let performanceLabel = "Keep Trying";
  if (percentage >= 80) performanceLabel = "Excellent";
  else if (percentage >= 60) performanceLabel = "Good Job";
  else if (percentage >= 40) performanceLabel = "Fair";

  return (
    <div className="min-h-screen bg-[#0A0B1A] pt-32 pb-20 px-4 md:px-8 font-sans flex justify-center">
      <div className="w-full max-w-3xl flex flex-col items-center">
        <div className="w-full bg-[#0F1023] rounded-3xl p-6 md:p-10 border border-[#2A2B4A]/50 shadow-2xl relative">
          {/* Pass / Fail banner */}
          <div
            className={`flex items-center gap-3 mb-8 px-5 py-3 rounded-xl border ${
              passed
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${passed ? "bg-green-500/10" : "bg-red-500/10"}`}
            >
              <Trophy className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">
              {passed
                ? `You passed! Great work on ${topic}.`
                : `You didn't pass this time — keep practicing ${topic}!`}
            </span>
          </div>

          <ScoreSummaryCard
            score={correct}
            total={total}
            percentage={percentage}
            performanceLabel={performanceLabel}
          />

          <ResultsBreakdownCard
            correctCount={correct}
            incorrectCount={incorrect}
            skippedCount={0}
            total={total}
          />

          {/* Per-question feedback */}
          {result.results && result.results.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-white font-bold text-lg">
                Question Feedback
              </h3>
              {result.results.map((r, i) => (
                <div
                  key={r.questionId}
                  className={`rounded-xl border p-5 ${
                    r.correct
                      ? "bg-[#052E16]/30 border-[#22C55E]/40"
                      : "bg-[#450A0A]/30 border-[#EF4444]/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        r.correct
                          ? "bg-[#22C55E]/20 text-[#22C55E]"
                          : "bg-[#EF4444]/20 text-[#EF4444]"
                      }`}
                    >
                      {r.correct ? "Correct" : "Incorrect"}
                    </span>
                    <span className="text-[#8E90B0] text-xs">
                      Question {i + 1}
                    </span>
                  </div>
                  <p className="text-[#E2E8F0] text-sm leading-relaxed">
                    {r.feedback}
                  </p>
                  {r.userAnswer && (
                    <p className="text-[#8E90B0] text-xs mt-2">
                      Your answer:{" "}
                      <span className="text-white">{r.userAnswer}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Claude's AI feedback */}
          {result.feedback && (
            <div className="mt-6 bg-[#14152C] border border-[#2A2B4A] rounded-xl p-6">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#F58320]/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                </div>
                AI Feedback
              </h3>
              <p className="text-[#8E90B0] text-sm leading-relaxed whitespace-pre-line">
                {result.feedback}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href={`/ai-tutor/quiz?topic=${encodeURIComponent(topic)}`}
              className="w-full"
            >
              <button className="w-full py-4 rounded-xl flex items-center justify-center gap-2 border-2 border-[#2A2B4A] bg-[#14152C] text-white font-bold hover:border-[#F58320]/50 hover:bg-[#1A1A32] transition-colors shadow-sm">
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
            </Link>

            <Link href="/ai-tutor" className="w-full">
              <button className="w-full py-4 rounded-xl flex items-center justify-center gap-2 border-2 border-[#F58320] bg-gradient-to-r from-[#F58320] to-[#FFB067] text-[#0A0B1A] font-bold hover:shadow-[0_0_20px_rgba(245,131,32,0.4)] transition-all">
                <Plus className="w-5 h-5" />
                New Quiz
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
