"use client";

import React, { useEffect, useState } from "react";
import HeroProgressWidget from "./components/HeroProgressWidget";
import ModuleCard, { Step, ModuleState } from "./components/ModuleCard";
import FinalAssessmentCard from "./components/FinalAssessmentCard";
import {
  Loader2,
  Coins,
  Zap,
  FileText,
  Code,
  Layers,
  Rocket,
  BookOpen,
} from "lucide-react";
import { coursesApi, type Course } from "@/lib/api/courses";
import { useAuth } from "@/context/AuthContext";

// Map course id to icon component name (since icons can't come from backend)
const COURSE_ICONS: Record<number, React.ReactNode> = {
  1: <Coins className="w-5 h-5" />, // Bitcoin Fundamentals
  2: <Zap className="w-5 h-5" />, // Introduction to Stacks
  3: <FileText className="w-5 h-5" />, // Clarity Smart Contracts
  4: <Code className="w-5 h-5" />, // Build dApps
  5: <Layers className="w-5 h-5" />, // Advanced Smart Contract Patterns
  6: <Rocket className="w-5 h-5" />, // Build Real Projects
};

function deriveModuleState(
  course: Course,
  progressMap: Record<number, number>,
  index: number,
  allCourses: Course[],
): ModuleState {
  const pct = progressMap[course.id] ?? 0;
  if (pct === 100) return "completed";
  if (pct > 0) return "in-progress";
  if (index === 0) return "in-progress";
  const prevCourse = allCourses[index - 1];
  if (!prevCourse?.id) return "locked";
  const prevPct = progressMap[prevCourse.id] ?? 0;
  return prevPct === 100 ? "in-progress" : "locked";
}

export default function LearningPathPage() {
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesApi
      .getCurriculum()
      .then(async (data) => {
        setCourses(data);

        if (isAuthenticated) {
          try {
            const summary = await coursesApi.getProgressSummary();
            const map: Record<number, number> = {};
            summary.courses.forEach((c) => {
              map[c.courseId] = c.progressPercentage;
            });
            setProgressMap(map);
          } catch {
            // fallback: leave progressMap empty
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B1A] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B1A] pt-28 pb-20 px-4 md:px-8 font-sans">
      <HeroProgressWidget />

      <div className="relative max-w-4xl mx-auto pt-10">
        {/* Vertical connector line */}
        <div className="absolute top-0 bottom-0 left-[50%] -translate-x-1/2 w-1 bg-linear-to-b from-[#2A2B4A]/50 via-[#2A2B4A]/80 to-[#2A2B4A]/10 hidden md:block" />
        <div className="absolute top-0 bottom-0 left-6 w-[2px] bg-linear-to-b from-[#2A2B4A]/50 to-[#2A2B4A]/10 md:hidden" />

        <div className="flex flex-col gap-12 relative z-10">
          {courses
            .filter((course) => course.lessons?.length > 0)
            .map((course, index, filteredCourses) => {
              const state = deriveModuleState(
                course,
                progressMap,
                index,
                filteredCourses,
              );
              const progressPct = progressMap[course.id] ?? 0;

              // Map backend lessons/steps to ModuleCard Step format
              const steps: Step[] = course.lessons.map((lesson) => ({
                title: lesson.title,
                state:
                  (progressMap[course.id] ?? 0) === 100
                    ? "completed"
                    : index === 0 && lesson.id === 1
                      ? "in-progress"
                      : state === "locked"
                        ? "locked"
                        : "pending",
              }));

              return (
                <ModuleCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  state={state}
                  icon={
                    COURSE_ICONS[course.id] ?? <BookOpen className="w-5 h-5" />
                  }
                  steps={steps}
                  progressPercentage={progressPct > 0 ? progressPct : undefined}
                  alignment={index % 2 === 0 ? "left" : "right"}
                  nextCourseTitle={courses[index + 1]?.title}
                />
              );
            })}
        </div>

        <FinalAssessmentCard />
      </div>
    </div>
  );
}
