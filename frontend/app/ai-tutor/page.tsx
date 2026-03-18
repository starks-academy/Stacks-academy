"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Sparkles, ListChecks, FileText, Shuffle, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { assessmentsApi, QuizQuota } from "@/lib/api/assessments";
import { useAuth } from "@/context/AuthContext";

type QuizFormat = "multi-choice" | "open-ended" | "mixed" | null;

function AITutorForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const initialTopic = searchParams.get("topic") || "";

  const [topic, setTopic] = useState(initialTopic);
  const [selectedFormat, setSelectedFormat] = useState<QuizFormat>(null);
  const [includeAdvanced, setIncludeAdvanced] = useState(false);
  const [quota, setQuota] = useState<QuizQuota | null>(null);

  useEffect(() => {
    const topicParam = searchParams.get("topic");
    if (topicParam) setTopic(topicParam);
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      assessmentsApi
        .getQuota()
        .then(setQuota)
        .catch(() => null);
    }
  }, [isAuthenticated]);

  const formatOptions = [
    {
      id: "multi-choice" as QuizFormat,
      label: "Multi-Choice",
      icon: <ListChecks className="w-6 h-6 mb-3" />,
    },
    {
      id: "open-ended" as QuizFormat,
      label: "Open-Ended",
      icon: <FileText className="w-6 h-6 mb-3" />,
    },
    {
      id: "mixed" as QuizFormat,
      label: "Mixed",
      icon: <Shuffle className="w-6 h-6 mb-3" />,
    },
  ];

  const quotaExhausted = quota !== null && quota.remaining <= 0;
  const canGenerate = !!topic.trim() && !!selectedFormat && !quotaExhausted;

  const handleGenerate = () => {
    if (!canGenerate) return;
    const params = new URLSearchParams({
      topic: topic.trim(),
      format: selectedFormat!,
      ...(includeAdvanced ? { advanced: "1" } : {}),
    });
    router.push(`/ai-tutor/quiz?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      {/* Usage Pill */}
      <div className="flex items-center gap-3 bg-[#14152C] rounded-full px-4 py-2 border border-[#2A2B4A] shadow-lg mb-10">
        <span className="text-[#8E90B0] text-sm">
          {quota
            ? `${quota.used} of ${quota.limit} quizzes used today`
            : "Daily AI quizzes"}
        </span>
        <button className="bg-[#F58320] text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-orange-600 transition-colors">
          Need more? Upgrade
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Test your Knowledge
        </h1>
        <p className="text-[#8E90B0] text-lg max-w-xl mx-auto">
          Create a personalized quiz to test your understanding of any topic
        </p>
      </div>

      {/* Configuration Form */}
      <div className="w-full space-y-10">
        {/* Topic Input */}
        <div>
          <label className="block text-[#8E90B0] font-medium mb-3">
            What topic would you like to quiz yourself on?
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="e.g., Clarity Contracts, Stacks Architecture, POX"
            className="w-full bg-[#14152C] text-white text-lg placeholder:text-[#8E90B0]/50 border border-[#2A2B4A] focus:border-[#F58320] rounded-xl px-6 py-4 outline-none transition-colors shadow-inner"
          />
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-[#8E90B0] font-medium mb-3">
            Choose the format
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formatOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedFormat(option.id)}
                className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all duration-200
                  ${
                    selectedFormat === option.id
                      ? "bg-[#1F1B40] border-[#F58320] text-[#F58320] shadow-[0_0_20px_rgba(245,131,32,0.15)]"
                      : "bg-[#14152C] border-[#2A2B4A] text-[#8E90B0] hover:border-[#F58320]/50 hover:text-white"
                  }`}
              >
                {option.icon}
                <span
                  className={`font-semibold ${selectedFormat === option.id ? "text-white" : ""}`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Checkbox */}
        <div
          className="flex items-center p-5 rounded-xl border border-[#2A2B4A] bg-[#14152C]/50 hover:bg-[#14152C] transition-colors cursor-pointer"
          onClick={() => setIncludeAdvanced(!includeAdvanced)}
        >
          <div
            className={`w-6 h-6 rounded border flex items-center justify-center mr-4 shrink-0 transition-colors
            ${includeAdvanced ? "bg-[#F58320] border-[#F58320]" : "bg-[#0A0B1A] border-[#2A2B4A]"}`}
          >
            {includeAdvanced && (
              <span className="text-[#0A0B1A] font-bold text-sm">✓</span>
            )}
          </div>
          <span className="text-white">
            Include advanced questions for a deeper challenge
          </span>
        </div>

        {/* Quota exhausted warning */}
        {quotaExhausted && (
          <p className="text-center text-yellow-400 text-sm bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-3">
            You&apos;ve used all your daily quiz generations. Resets at
            midnight.
          </p>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className={`w-full py-5 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all
            ${
              canGenerate
                ? "bg-gradient-to-r from-[#F58320] to-[#FF4500] text-white shadow-[0_0_30px_rgba(245,131,32,0.4)] hover:shadow-[0_0_40px_rgba(245,131,32,0.6)]"
                : "bg-[#14152C] text-[#8E90B0] cursor-not-allowed border border-[#2A2B4A]"
            }`}
        >
          <Sparkles className="w-6 h-6" />
          Generate Quiz
        </button>
      </div>
    </div>
  );
}

export default function AITutorQuizPage() {
  return (
    <div className="min-h-screen bg-[#0A0B1A] pt-32 pb-20 px-4 md:px-8 font-sans flex justify-center">
      <Suspense
        fallback={
          <div className="text-white text-center mt-20 text-xl font-bold animate-pulse text-[#F58320] flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            Loading AI Tutor...
          </div>
        }
      >
        <AITutorForm />
      </Suspense>
    </div>
  );
}
