"use client";

import React, { useEffect, useState } from "react";
import HeroProgressWidget from "./components/HeroProgressWidget";
import ModuleCard, { Step, ModuleState } from "./components/ModuleCard";
import FinalAssessmentCard from "./components/FinalAssessmentCard";
import { Loader2 } from "lucide-react";
import { coursesApi, type Course } from "@/lib/api/courses";
import { useAuth } from "@/context/AuthContext";

// Map course id to icon component name (since icons can't come from backend)
const COURSE_ICONS: Record<number, React.ReactNode> = {
  1: <span className="text-lg">₿</span>,
  2: <span className="text-lg">⚡</span>,
  3: <span className="text-lg">📝</span>,
  4: <span className="text-lg">🧱</span>,
  5: <span className="text-lg">🔬</span>,
  6: <span className="text-lg">🚀</span>,
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
  // First course always unlocked, rest locked until previous is done
  if (index === 0) return "in-progress";
  const prevCourse = allCourses[index - 1];
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

        // Fetch progress for each course if authenticated
        if (isAuthenticated) {
          const entries = await Promise.allSettled(
            data.map((c) => coursesApi.getCourseProgress(c.id)),
          );
          const map: Record<number, number> = {};
          entries.forEach((result, i) => {
            if (result.status === "fulfilled") {
              map[data[i].id] = result.value.progressPercentage;
            }
          });
          setProgressMap(map);
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
          {courses.map((course, index) => {
            const state = deriveModuleState(course, progressMap, index, courses);
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
                icon={COURSE_ICONS[course.id] ?? <span>📚</span>}
                steps={steps}
                progressPercentage={progressPct > 0 ? progressPct : undefined}
                alignment={index % 2 === 0 ? "left" : "right"}
              />
            );
          })}
        </div>

        <FinalAssessmentCard />
      </div>
    </div>
  );
}
