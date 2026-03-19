import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface FeedbackAlertProps {
  isCorrect: boolean;
  explanation: React.ReactNode;
}

export default function FeedbackAlert({
  isCorrect,
  explanation,
}: FeedbackAlertProps) {
  const containerClasses = `w-full mt-6 p-6 rounded-xl border flex flex-col md:flex-row gap-4
    ${
      isCorrect
        ? "bg-[#052E16]/40 border-[#22C55E]/50"
        : "bg-[#450A0A]/40 border-[#EF4444]/50"
    }
  `;

  return (
    <div className={containerClasses} role="alert">
      <div
        className={`shrink-0 mt-1 w-9 h-9 rounded-full flex items-center justify-center
        ${isCorrect ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}
      >
        {isCorrect ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <XCircle className="w-5 h-5" />
        )}
      </div>
      <div>
        <h4
          className={`text-lg font-bold mb-2 ${isCorrect ? "text-[#22C55E]" : "text-[#EF4444]"}`}
        >
          {isCorrect ? "Correct Answer" : "Incorrect Answer"}
        </h4>
        <p className="text-[#E2E8F0] leading-relaxed text-sm">{explanation}</p>
      </div>
    </div>
  );
}
