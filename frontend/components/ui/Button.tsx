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
    "px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition";
  const variantStyles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-gray-400 hover:cursor-pointer disabled:bg-blue-300",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 hover:cursor-pointer disabled:bg-gray-100",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 hover:cursor-pointer disabled:bg-red-300",
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
