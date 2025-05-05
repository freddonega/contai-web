import React, { useState, useRef, useEffect } from 'react';
import Checkbox from './Checkbox';

interface SelectMultipleProps {
  label?: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  placeholder?: string;
}

export const SelectMultiple: React.FC<SelectMultipleProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = 'Selecione...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const toggleAll = () => {
    if (value.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map(option => option.value));
    }
  };

  const getSelectedLabels = () => {
    if (value.length === 0) return '';
    if (value.length === options.length) return 'Todos selecionados';
    
    const selectedLabels = options
      .filter(option => value.includes(option.value))
      .map(option => option.label);

    if (selectedLabels.length <= 2) {
      return selectedLabels.join(', ');
    }

    return `${selectedLabels[0]}, ${selectedLabels[1]}... (+${selectedLabels.length - 2})`;
  };

  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {label}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-contai-lightBlue bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
        >
          {getSelectedLabels() || placeholder}
        </div>
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-900 dark:border dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2">
                <Checkbox
                  label="Selecionar todos"
                  checked={value.length === options.length}
                  onChange={toggleAll}
                />
              </div>
            </div>
            <ul className="max-h-60 overflow-auto py-1">
              {options.map(option => (
                <li
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Checkbox
                    label={option.label}
                    checked={value.includes(option.value)}
                    onChange={() => {}}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
        <span className="pointer-events-none absolute right-4 top-1/2 z-30 -translate-y-1/2 text-gray-700 dark:text-gray-400">
          <svg
            className="stroke-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
              stroke=""
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}; 