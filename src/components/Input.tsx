import { forwardRef } from "react";
import { IconType } from "react-icons";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: IconType;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-contai-darkBlue dark:text-gray-400">
              <Icon size={20} />
            </span>
          )}
          <input
            ref={ref}
            className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 bg-transparent text-gray-800 border-contai-lightBlue focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 no-calendar-icon no-number-icon ${
              Icon ? "pl-[62px]" : ""
            }`}
            {...props}
          />
        </div>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  }
);
