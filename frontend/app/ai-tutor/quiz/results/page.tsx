"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RotateCcw, Plus, Trophy, AlertCircle } from "lucide-react";
import ScoreSummaryCard from "../../components/ScoreSummaryCard";
import ResultsBreakdownCard from "../../components/ResultsBreakdownCard";
import { GradeResult } from "@/lib/api/assessments";

export default function QuizResultsPage() {
  const [result, setResult] = useState<GradeResult | null>(null);
  const [topic, setTopic] = useState("your quiz");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("quizResult");
      const savedTopic = sessionStorage.getItem("quizTopic");
      if (raw) setResult(JSON.parse(raw) as GradeResult);
      if (savedTopic) setTopic(savedTopic);
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!result) {
    // Navigated here directly without completing a quiz
    return (
      <div className="min-h-screen bg-[#0A0B1A] pt-32 pb-20 px-4 flex justify-center">
        <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">No Quiz Results Found</h2>
          <p className="text-[#8E90B0] max-w-sm">
            It looks like you haven&apos;t completed a quiz yet. Start one from the AI Tutor page.
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

  const total = 5; // matches the questionCount we request
  const correct = Math.round((result.score / 100) * total);
  const incorrect = total - correct;
  const percentage = result.score;

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
              result.passed
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <Trophy className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-sm">
              {result.passed
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

          {/* Claude's AI feedback */}
          {result.feedback && (
            <div className="mt-6 bg-[#14152C] border border-[#2A2B4A] rounded-xl p-6">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span className="text-brand-orange">✦</span> AI Feedback
              </h3>
              <p className="text-[#8E90B0] text-sm leading-relaxed whitespace-pre-line">
                {result.feedback}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href={`/ai-tutor/quiz?topic=${encodeURIComponent(topic)}`} className="w-full">
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
