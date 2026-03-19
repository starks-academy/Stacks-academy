import React from "react";

interface OpenEndedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isSubmitted: boolean;
  isCorrect: boolean | null;
}

export default function OpenEndedInput({
  value,
  onChange,
  isSubmitted,
}: OpenEndedInputProps) {
  let containerClasses =
    "w-full p-4 rounded-xl border-2 transition-all duration-300 min-h-[150px] md:min-h-[200px] outline-none text-white resize-y";

  if (!isSubmitted) {
    containerClasses +=
      " bg-[#14152C] border-[#2A2B4A] focus:border-[#F58320] focus:shadow-[0_0_15px_rgba(245,131,32,0.15)]";
  } else {
    // Open-ended answers are graded by AI — always show neutral pending state
    containerClasses += " bg-[#14152C]/60 border-[#2A2B4A] text-[#8E90B0]";
  }

  return (
    <textarea
      className={containerClasses}
      value={value}
      onChange={onChange}
      disabled={isSubmitted}
      placeholder="Type your explanation here..."
    />
  );
}
