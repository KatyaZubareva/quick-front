import React from "react";
import Spinner from "../Spinner/Spinner";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border border-white/10 bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(0,0,0,0.4)] hover:from-brand-400 hover:to-brand-500 active:translate-y-px active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] disabled:border-white/5 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 disabled:shadow-none",
  secondary:
    "bg-white text-zinc-900 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500",
  outline:
    "border border-white/10 bg-white/[0.03] text-zinc-200 hover:border-white/20 hover:bg-white/[0.06] disabled:text-zinc-600",
  ghost:
    "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100 disabled:text-zinc-600",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2 rounded-xl",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  children,
  type = "button",
  ...rest
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`inline-flex select-none items-center whitespace-nowrap justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    {...rest}
  >
    {loading ? <Spinner className="h-4 w-4" /> : icon}
    {children}
    {!loading && iconRight}
  </button>
);

export default Button;
