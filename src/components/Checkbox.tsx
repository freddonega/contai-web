import React, { forwardRef } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, ref) => (
    <div className="flex items-center space-x-3 cursor-pointer text-gray-800 dark:text-gray-200">
      <input
        ref={ref}
        type="checkbox"
        className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-brand-500 dark:checked:border-brand-500 focus:ring-offset-0 focus:outline-none"
        {...props}
      />
      <label className="text-sm font-medium">{label}</label>
    </div>
  )
);

export default Checkbox;
