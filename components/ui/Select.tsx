import React, { forwardRef, useId } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  options?: { label: string; value: string | number }[]; // Opcional: pode passar children ou options array
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, containerClassName, label, error, children, options, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label 
            htmlFor={selectId} 
            className="block text-sm font-medium text-zinc-400 mb-1.5"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "flex h-10 w-full appearance-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          >
            {/* Se passar options via prop, renderiza aqui */}
            {options 
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                )) 
              : children}
          </select>
          
          {/* Ícone de seta customizado (Chevron Down) */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>

        {error && (
          <p className="mt-1 text-xs text-red-400 font-medium animate-in slide-in-from-top-1 fade-in duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';