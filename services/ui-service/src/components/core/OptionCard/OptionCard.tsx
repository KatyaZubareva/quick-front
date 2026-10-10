import React from "react";
import { FiCheck } from "react-icons/fi";

interface OptionCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string;
  multi?: boolean;
  children?: React.ReactNode;
}

const OptionCard: React.FC<OptionCardProps> = ({
  title,
  description,
  selected,
  onClick,
  icon,
  disabled = false,
  badge,
  multi = false,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-pressed={selected}
    className={`group relative flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-all duration-150 ${
      selected
        ? "border-brand-500/70 bg-brand-500/[0.08] shadow-glow"
        : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
    } ${disabled ? "cursor-not-allowed opacity-40 hover:border-white/[0.08] hover:bg-white/[0.02]" : ""}`}
  >
    {icon && (
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-lg transition-colors ${
          selected ? "border-brand-500/40 bg-brand-500/15 text-brand-300" : "border-white/10 bg-white/[0.04] text-zinc-300"
        }`}
      >
        {icon}
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="flex items-center gap-2">
        <span className="font-medium text-zinc-100">{title}</span>
        {badge && <span className="chip py-0 text-[11px]">{badge}</span>}
      </span>
      {description && <span className="mt-1 block text-[13px] leading-snug text-zinc-400">{description}</span>}
      {children}
    </span>
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-all ${
        multi ? "rounded-md" : "rounded-full"
      } ${selected ? "border-brand-500 bg-brand-500 text-white" : "border-white/20 text-transparent group-hover:border-white/40"}`}
    >
      <FiCheck size={12} strokeWidth={3} />
    </span>
  </button>
);

export default OptionCard;
