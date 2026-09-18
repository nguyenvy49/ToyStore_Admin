import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  type?: "button" | "submit" | "reset"; // Button type
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"; // Button size
  variant?: "primary" | "outline" | "warning" | "danger" | "success" | "info" | "light" | "dark" | "outline_danger"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
}

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    xxs: "px-2 py-1 text-[10px]",   // siêu nhỏ
    xs: "px-3 py-1.5 text-xs",      // rất nhỏ
    sm: "px-4 py-2 text-sm",        // nhỏ
    md: "px-5 py-2.5 text-base",    // trung bình (default)
    lg: "px-6 py-3 text-lg",        // lớn
    xl: "px-7 py-3.5 text-xl",      // rất lớn
    "2xl": "px-8 py-4 text-2xl"     // siêu lớn
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    warning:
      "bg-yellow-500 text-white shadow-theme-xs hover:bg-yellow-600 disabled:bg-yellow-300",
    danger:
      "bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300",
    success:
      "bg-green-500 text-white shadow-theme-xs hover:bg-green-600 disabled:bg-green-300",
    info:
      "bg-blue-500 text-white shadow-theme-xs hover:bg-blue-600 disabled:bg-blue-300",
    light:
      "bg-white text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700",
    dark:
      "bg-gray-800 text-white shadow-theme-xs hover:bg-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
    outline_danger:
      "bg-white text-red-500 ring-1 ring-inset ring-red-300 hover:bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:ring-red-700 dark:hover:bg-white/[0.03] dark:hover:text-red-300",
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      type={type || "button"} 
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
