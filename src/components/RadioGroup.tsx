import { forwardRef } from "react";
import { Radio } from "./Radio";

interface RadioGroupProps {
  options: { label: string; value: string }[];
  name: string;
  label?: string;
  error?: string;
  value: string;
  disabled?: boolean;
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ options, label, value, error, ...rest }, ref) => {
    return (
      <>
        <div className="flex flex-wrap items-center gap-8">
          {options.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              label={option.label}
              checked={option.value === value}
              {...rest}
              ref={ref}
            />
          ))}
        </div>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </>
    );
  }
);
