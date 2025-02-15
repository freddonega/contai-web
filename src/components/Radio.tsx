import { forwardRef } from "react";

interface RadioboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  checked?: boolean;
  isRequired?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioboxProps>(
  ({ label, error, checked, isRequired, ...props }, ref) => {
    return (
      <div>
        <label className="relative flex cursor-pointer select-none items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-400">
          <input type="radio" className="sr-only" ref={ref} {...props} />
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] ${
              checked
                ? "border-primary bg-primary"
                : "bg-transparent border-contai-lightBlue dark:border-gray-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full bg-white ${
                checked ? "block" : "hidden"
              }`}
            ></span>
          </span>
          {label}
        </label>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  }
);
