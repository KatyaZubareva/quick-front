import React from "react";

interface StepHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const StepHeader: React.FC<StepHeaderProps> = ({ eyebrow, title, description, action }) => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-brand-400">{eyebrow}</p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">{title}</h2>
      {description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">{description}</p>}
    </div>
    {action}
  </div>
);

export default StepHeader;
