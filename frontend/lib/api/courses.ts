import { request } from "@/lib/api/client";

export interface CourseStep {
  id: number;
  title: string;
  state?: "locked" | "in_progress" | "completed";
}

export interface CourseLesson {
  id: number;
  title: string;
  steps: CourseStep[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  lessons: CourseLesson[];
}

export interface CourseProgress {
  lessons: CourseLesson[];
  totalSteps: number;
  completedSteps: number;
  progressPercentage: number;
}

export interface ProgressSummary {
  completedCourses: number;
  totalCourses: number;
  overallPercentage: number;
  completedSteps: number;
  totalSteps: number;
  courses: {
    courseId: number;
    progressPercentage: number;
    completedSteps: number;
    totalSteps: number;
    isComplete: boolean;
  }[];
}

export const coursesApi = {
  getCurriculum: () => request<Course[]>("/courses"),

  getCourse: (id: number) => request<Course>(`/courses/${id}`),

  getCourseProgress: (id: number) =>
    request<CourseProgress>(`/courses/${id}/progress`),

  getProgressSummary: () =>
    request<ProgressSummary>("/courses/progress/summary"),

  completeStep: (courseId: number, lessonId: number, stepId: number) =>
    request(
      `/courses/${courseId}/lessons/${lessonId}/steps/${stepId}/complete`,
      { method: "POST" },
    ),

  completeCourse: (courseId: number) =>
    request(`/courses/${courseId}/complete`, { method: "POST" }),
};
