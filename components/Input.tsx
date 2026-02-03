
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', onBlur, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full text-left">
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        className={`border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        } ${className}`}
        onBlur={onBlur}
        {...props}
      />
      {error && <span className="text-xs text-red-600 font-medium h-4">{error}</span>}
    </div>
  );
};
