import React, { useState, useRef, useEffect } from 'react';
import { useDebounce } from '@/utils/useDebounce';

interface SelectProps {
  placeholder?: string;
  options: {
    value: string | number;
    label: string;
  }[];
  onChange: (value: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  value?: string | number;
}

export const SelectSearch = ({
  placeholder = 'Selecione...',
  options,
  onChange,
  onSearchChange,
  label,
  value,
  error,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

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

  useEffect(() => {
    onSearchChange({
      target: { value: debouncedSearch },
    } as React.ChangeEvent<HTMLInputElement>);
  }, [debouncedSearch, onSearchChange]);

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {label}
        </label>
      )}
      <div className="relative mt-0" ref={dropdownRef}>
        <div
          onClick={toggleOpen}
          className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-contai-lightBlue bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 cursor-pointer"
        >
          {value
            ? options.find(option => option.value == value)?.label ||
              placeholder
            : placeholder}
        </div>
        {isOpen && (
          <div className="absolute bg-gray-900 border border-contai-lightBlue rounded-md mt-1 w-full z-999">
            <input
              type="text"
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full p-2 border-b border-contai-lightBlue rounded-t-md dark:bg-gray-900 dark:text-white/90 dark:placeholder-text-white/30"
            />
            <ul className="w-full p-2 max-h-60 overflow-y-auto">
              {options.map(option => (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value?.toString());
                    toggleOpen();
                  }}
                  className="cursor-pointer p-2 hover:bg-black/50 dark:text-white/90"
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
        <span className="pointer-events-none absolute right-4 top-1/2 z-30 -translate-y-1/2 dark:text-white/90">
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
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    </div>
  );
};
