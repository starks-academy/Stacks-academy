import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Lock, Play } from "lucide-react";

export type ModuleState = "completed" | "in-progress" | "locked";

export interface Step {
  title: string;
  state: "completed" | "in-progress" | "locked" | "pending";
}

export interface ModuleCardProps {
  id: number;
  title: string;
  description?: string;
  state: ModuleState;
  steps: Step[];
  icon: React.ReactNode;
  progressPercentage?: number;
  alignment: "left" | "right";
}

export default function ModuleCard({
  id,
  title,
  description,
  state,
  steps,
  icon,
  progressPercentage = 0,
  alignment = "left",
}: ModuleCardProps) {
  const isLocked = state === "locked";
  const isCompleted = state === "completed";
  const isInProgress = state === "in-progress";

  return (
    <div className={`relative flex w-full max-w-4xl mx-auto my-12 ${alignment === "left" ? "justify-start" : "justify-end"}`}>
      
      {/* Number Icon inside the path */}
      <div 
        className={`absolute top-0 bottom-0 ${alignment === "left" ? "left-[50%]" : "right-[50%]"} 
        hidden md:flex flex-col items-center justify-center -translate-x-1/2`}
      >
        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 shadow-lg 
            ${isCompleted ? "bg-[#0A0B1A] border-[#22C55E]" : 
              isInProgress ? "bg-[#0A0B1A] border-[#F58320]" : 
              "bg-[#14152C] border-[#2A2B4A]"}`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
          ) : isInProgress ? (
            <div className="w-4 h-4 rounded-full bg-[#F58320] animate-pulse"></div>
          ) : (
            <Lock className="w-5 h-5 text-[#8E90B0]" />
          )}
        </div>
      </div>

      <div 
        className={`w-full md:w-[45%] bg-[#14152C] rounded-2xl border ${isLocked ? "border-[#2A2B4A]" : "border-[#2A2B4A] hover:border-[#F58320]/50 transition-colors"} shadow-xl overflow-hidden relative z-20`}
      >
        {/* Horizontal Connecting Line (Desktop) */}
        <div 
          className={`hidden md:block absolute top-[50%] h-[2px] w-[5%] -z-10 bg-linear-to-r 
          ${isCompleted ? "from-[#22C55E]/50 to-[#22C55E]/10" : 
            isInProgress ? "from-[#F58320]/50 to-[#F58320]/10" : 
            "from-[#2A2B4A] to-[#2A2B4A]"}
          ${alignment === "left" ? "right-[50%]" : "left-[50%]"}`}
        ></div>
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#2A2B4A]/50">
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center
              ${isCompleted ? "bg-[#22C55E]/10 text-[#22C55E]" : 
                isInProgress ? "bg-[#F58320]/10 text-[#F58320]" : 
                "bg-[#2A2B4A]/50 text-[#8E90B0]"}`}
            >
              {icon}
            </div>
            <h3 className={`text-lg font-bold ${isLocked ? "text-[#8E90B0]" : "text-white"}`}>
              {title}
            </h3>
          </div>
          {description && (
            <p className="text-sm text-[#8E90B0] mt-2 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Steps List */}
        <div className="p-6 pt-4 space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {step.state === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
              ) : step.state === "in-progress" ? (
                <Circle className="w-5 h-5 text-[#F58320] shrink-0 fill-[#F58320]/20" />
              ) : step.state === "locked" ? (
                <Lock className="w-4 h-4 text-[#8E90B0] shrink-0 ml-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-[#2A2B4A] shrink-0" />
              )}
              
              <span className={`text-sm ${
                step.state === "completed" ? "text-white" : 
                step.state === "in-progress" ? "text-white font-medium" : 
                "text-[#8E90B0]"
              }`}>
                {step.title}
              </span>
            </div>
          ))}

          {/* Progress Bar for In-Progress */}
          {isInProgress && (
             <div className="mt-6">
               <div className="flex justify-between text-xs mb-2">
                 <span className="text-[#8E90B0]">Progress</span>
                 <span className="text-[#F58320] font-bold">{progressPercentage}%</span>
               </div>
               <div className="h-1.5 w-full bg-[#0A0B1A] rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-linear-to-r from-[#F58320] to-[#FFB067]" 
                   style={{ width: `${progressPercentage}%` }}
                 ></div>
               </div>
             </div>
          )}

          {/* Action Button */}
          <div className="mt-6 pt-2">
            {isLocked ? (
              <button 
                className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all bg-[#0A0B1A] text-[#8E90B0] cursor-not-allowed border border-[#2A2B4A]"
                disabled
              >
                <Lock className="w-4 h-4" /> Locked
              </button>
            ) : (
              <Link href={`/ai-tutor?topic=${encodeURIComponent(title)}`} className="w-full block">
                <button 
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all
                    ${isCompleted ? "bg-[#2A2B4A] text-white hover:bg-[#2A2B4A]/80" : 
                      isInProgress ? "bg-[#F58320] text-white hover:bg-[#F58320]/90 shadow-[0_0_15px_rgba(245,131,32,0.3)]" : 
                      ""}`}
                >
                  {isCompleted ? (
                    <>Test Knowledge with AI</>
                  ) : (
                    <>Continue Learning <Play className="w-4 h-4 fill-current" /></>
                  )}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
