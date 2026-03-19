"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Sparkles,
  ListChecks,
  FileText,
  Shuffle,
  Loader2,
  Coins,
  Zap,
  Layers,
  Rocket,
  BookOpen,
  Check,
  Code,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { coursesApi, type Course } from "@/lib/api/courses";

type QuizFormat = "multi-choice" | "open-ended" | "mixed" | null;

const COURSE_ICONS: Record<number, React.ReactNode> = {
  0: <BookOpen className="w-5 h-5" />, // General (all modules)
  1: <Coins className="w-5 h-5" />, // Bitcoin Fundamentals
  2: <Zap className="w-5 h-5" />, // Introduction to Stacks
  3: <FileText className="w-5 h-5" />, // Clarity Smart Contracts
  4: <Code className="w-5 h-5" />, // Build dApps
  5: <Layers className="w-5 h-5" />, // Advanced Smart Contract Patterns
  6: <Rocket className="w-5 h-5" />, // Build Real Projects
};

const GENERAL_COURSE = {
  id: 0,
  title: "General Knowledge",
  description: "Questions spanning all Stacks and Bitcoin modules.",
};

const FORMAT_OPTIONS = [
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

function AITutorForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTopic = searchParams.get("topic") || "";
  const isTopicLocked = !!initialTopic;

  const [topic, setTopic] = useState(initialTopic);
  const [selectedFormat, setSelectedFormat] = useState<QuizFormat>(null);
  const includeAdvanced = false;
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(!isTopicLocked);

  useEffect(() => {
    if (isTopicLocked) return;
    coursesApi
      .getCurriculum()
      .then((data) => setCourses(data.filter((c) => c.lessons?.length > 0)))
      .catch(() => {})
      .finally(() => setLoadingCourses(false));
  }, [isTopicLocked]);

  const canGenerate = !!topic.trim() && !!selectedFormat;

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
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Test your Knowledge
        </h1>
        <p className="text-[#8E90B0] text-lg max-w-xl mx-auto">
          Pick a course and choose your quiz format
        </p>
      </div>

      <div className="w-full space-y-10">
        {/* Topic — locked pill (from learning path) OR course cards */}
        <div>
          <label className="block text-[#8E90B0] font-medium mb-3">
            {isTopicLocked ? "Topic" : "Select a course"}
          </label>

          {isTopicLocked ? (
            <div className="w-full bg-[#14152C] border border-[#F58320]/40 rounded-xl px-6 py-4 flex items-center gap-3">
              <span className="text-white text-lg font-semibold flex-1">
                {topic}
              </span>
              <span className="text-xs text-[#F58320] bg-[#F58320]/10 border border-[#F58320]/20 px-2.5 py-1 rounded-full shrink-0">
                From Learning Path
              </span>
            </div>
          ) : loadingCourses ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#F58320] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[GENERAL_COURSE, ...courses].map((course) => {
                const isSelected = topic === course.title;
                return (
                  <button
                    key={course.id}
                    onClick={() => setTopic(course.title)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200
                      ${
                        isSelected
                          ? "bg-[#1F1B40] border-[#F58320] shadow-[0_0_20px_rgba(245,131,32,0.15)]"
                          : "bg-[#14152C] border-[#2A2B4A] hover:border-[#F58320]/50"
                      }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                      ${isSelected ? "bg-[#F58320]/20 text-[#F58320]" : "bg-[#2A2B4A]/60 text-[#8E90B0]"}`}
                    >
                      {COURSE_ICONS[course.id] ?? (
                        <BookOpen className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`font-semibold text-sm truncate ${isSelected ? "text-white" : "text-[#8E90B0]"}`}
                      >
                        {course.title}
                      </p>
                      {course.description && (
                        <p className="text-xs text-[#8E90B0]/60 truncate mt-0.5">
                          {course.description}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <span className="ml-auto text-[#F58320] shrink-0">
                        <Check className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-[#8E90B0] font-medium mb-3">
            Choose the format
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FORMAT_OPTIONS.map((option) => (
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

        {/* Advanced toggle */}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className={`w-full py-5 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all
            ${
              canGenerate
                ? "bg-linear-to-r from-[#F58320] to-[#FF4500] text-white shadow-[0_0_30px_rgba(245,131,32,0.4)] hover:shadow-[0_0_40px_rgba(245,131,32,0.6)]"
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

export default function AITutorPage() {
  return (
    <div className="min-h-screen bg-[#0A0B1A] pt-32 pb-20 px-4 md:px-8 font-sans flex justify-center">
      <Suspense
        fallback={
          <div className="text-[#F58320] text-center mt-20 flex items-center gap-3">
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
