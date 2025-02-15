import React, { forwardRef } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, ref) => (
    <div className="mb-4 flex items-center">
      <input
        ref={ref}
        type="checkbox"
        className="mr-2 leading-tight"
        {...props}
      />
      <label className="text-gray-700 text-sm">{label}</label>
    </div>
  )
);

export default Checkbox;
