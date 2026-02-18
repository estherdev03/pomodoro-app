import clsx from "clsx";
import React, { forwardRef } from "react";

type InputProps = {
  label: string;
  name?: string;
  type?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = "text", error, className, ...props }, ref) => {
    return (
      <div className={clsx("flex flex-col", className)}>
        <div className="flex flex-col items-start space-y-1">
          <label
            className="font-medium text-sm"
            htmlFor={props.id || props.name}
          >
            {label}
          </label>
          <input
            ref={ref}
            type={type}
            className={clsx(
              "w-full px-2 h-10 border rounded-md focus:ring-2 focus:ring-blue-500 text-sm font-medium",

              error ? "border-red-500" : "border-gray-300",
              className,
            )}
            id={props.id || props.name}
            {...props}
          />
          {error && (
            <p className="text-red-400 text-[0.75rem] font-medium">{error}</p>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
