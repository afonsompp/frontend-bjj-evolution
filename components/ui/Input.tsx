import React, { forwardRef, useId } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, label, error, type = 'text', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-zinc-400 mb-1.5"
          >
            {label}
          </label>
        )}
        
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            // Estilos Base
            "flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white",
            "placeholder:text-zinc-600",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            
            // Estados de Focus/Hover
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",

            // Estado de Erro
            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20 text-red-100",

            // Classes customizadas passadas via props sobrescrevem as anteriores
            className
          )}
          {...props}
        />

        {error && (
          <p className="mt-1 text-xs text-red-400 font-medium animate-in slide-in-from-top-1 fade-in duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';