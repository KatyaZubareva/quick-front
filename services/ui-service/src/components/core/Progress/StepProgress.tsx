import React from "react";
import { FiCheck } from "react-icons/fi";

export interface StepInfo {
  title: string;
  description: string;
}

interface StepProgressProps {
  steps: StepInfo[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

const StepProgress: React.FC<StepProgressProps> = ({ steps, currentStep, onStepClick }) => (
  <>
    <div className="lg:hidden">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-200">{steps[currentStep]?.title}</span>
        <span className="text-zinc-500">
          Шаг {currentStep + 1} из {steps.length}
        </span>
      </div>
      <div className="flex gap-1.5">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              index <= currentStep ? "bg-brand-500" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>

    <ol className="hidden lg:block">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isLast = index === steps.length - 1;
        const clickable = isCompleted && !!onStepClick;

        return (
          <li key={step.title} className="relative pb-7 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[13px] top-8 h-[calc(100%-2.25rem)] w-px transition-colors duration-300 ${
                  isCompleted ? "bg-brand-500/60" : "bg-white/10"
                }`}
              />
            )}
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(index)}
              className={`group flex w-full items-start gap-3.5 text-left ${clickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "border-brand-500 bg-brand-500 text-white"
                    : isActive
                      ? "border-brand-500 bg-brand-500/15 text-brand-300 ring-4 ring-brand-500/15"
                      : "border-white/15 bg-zinc-900 text-zinc-500"
                }`}
              >
                {isCompleted ? <FiCheck size={14} strokeWidth={3} /> : index + 1}
              </span>
              <span className="pt-0.5">
                <span
                  className={`block text-sm font-medium transition-colors ${
                    isActive ? "text-white" : isCompleted ? "text-zinc-300 group-hover:text-white" : "text-zinc-500"
                  }`}
                >
                  {step.title}
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500">{step.description}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  </>
);

export default StepProgress;
