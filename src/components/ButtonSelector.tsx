import { forwardRef } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface ButtonSelectorProps {
  label?: string;
  options: Option[];
  multiple?: boolean;
  value?: string | number | (string | number)[] | null;
  onChange?: (value: string | number | (string | number)[] | null) => void;
  error?: string;
}

export const ButtonSelector = forwardRef<HTMLDivElement, ButtonSelectorProps>(
  ({ label, options, value, onChange, error, multiple = false }, ref) => {
    const handleSelect = (optionValue: string | number) => {
      let newValue;

      if (multiple) {
        const selectedArray = Array.isArray(value) ? value : [];
        newValue = selectedArray.includes(optionValue)
          ? selectedArray.filter(v => v !== optionValue)
          : [...selectedArray, optionValue];
      } else {
        newValue = value === optionValue ? null : optionValue;
      }

      onChange?.(newValue);
    };

    return (
      <div ref={ref}>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            {label}
          </label>
        )}
        <div className="grid lg:grid-cols-2 gap-2 bg-black/50 p-2 rounded-lg">
          {options.map(option => {
            const isSelected = multiple
              ? Array.isArray(value) && value.includes(option.value)
              : value === option.value;

            return (
              <button
                type="button"
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-4 py-2 rounded ${
                  isSelected ? 'bg-contai-lightBlue text-white' : 'bg-black/80 '
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  },
);
