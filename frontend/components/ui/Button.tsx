import clsx from "clsx";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  type: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  type = "button",
  children,
  variant = "primary",
  className = "",
  isLoading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50";
  const variantStyles = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 hover:cursor-pointer",
    secondary:
      "bg-slate-200 text-slate-800 hover:bg-slate-300 hover:cursor-pointer",
    danger:
      "bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer",
  };
  return (
    <button
      type={type}
      className={clsx(baseStyles, variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
