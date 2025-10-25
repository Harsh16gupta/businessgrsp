'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  asChild?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    asChild = false, 
    loading = false,
    fullWidth = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    const variantStyles = {
      default: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-102 active:scale-98",
      destructive: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm hover:from-red-700 hover:to-rose-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:scale-102 active:scale-98",
      outline: "border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-102 active:scale-98 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
      secondary: "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 hover:scale-102 active:scale-98 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
      ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 hover:scale-102 active:scale-98 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100",
      link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-lg sm:h-9 sm:px-3 sm:text-sm",
      default: "h-10 px-4 text-sm rounded-lg sm:h-11 sm:px-5 sm:text-base",
      lg: "h-12 px-6 text-base rounded-xl sm:h-14 sm:px-8 sm:text-lg",
      xl: "h-14 px-8 text-lg rounded-xl sm:h-16 sm:px-10 sm:text-xl",
      icon: "h-10 w-10 rounded-lg sm:h-11 sm:w-11"
    };

    const baseStyles = cn(
      "inline-flex items-center justify-center whitespace-nowrap font-semibold",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed",
      "cursor-pointer select-none",
      fullWidth && "w-full",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    // Loading spinner component
    const LoadingSpinner = () => (
      <div className="flex items-center justify-center gap-2">
        <div className={cn(
          "animate-spin rounded-full border-2 border-current border-t-transparent",
          size === 'sm' ? "h-3 w-3" :
          size === 'default' ? "h-4 w-4" :
          size === 'lg' ? "h-5 w-5" :
          "h-4 w-4"
        )} />
        <span>Loading...</span>
      </div>
    );

    const buttonContent = loading ? <LoadingSpinner /> : children;

    return (
      <Comp
        className={baseStyles}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };