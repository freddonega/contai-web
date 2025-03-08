import React from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

interface Column {
  header: string;
  accessor: string;
  width?: string;
  Cell?: (props: { value: any; row: any }) => JSX.Element;
  sortable?: boolean;
}

interface DynamicTableProps {
  columns: Column[];
  data: any[];
  page?: number;
  itemsPerPage?: number;
  totalItems?: number;
  onPageChange?: (newPage: number) => void;
  onSortChange?: (accessor: string[], direction: ('asc' | 'desc')[]) => void;
  sortBy?: string[];
  sortDirection?: ('asc' | 'desc')[];
  totalAmount?: number;
}

export const DynamicTable: React.FC<DynamicTableProps> = ({
  columns,
  data,
  page = 1,
  itemsPerPage = 10,
  totalItems = 0,
  onPageChange,
  onSortChange,
  sortBy,
  sortDirection,
  totalAmount,
}) => {
  const handleSort = (accessor: string) => {
    if (onSortChange) {
      let newSortBy = [...(sortBy || [])];
      let newSortDirection = [...(sortDirection || [])];
      const existingIndex = newSortBy.indexOf(accessor);

      if (existingIndex > -1) {
        if (newSortDirection[existingIndex] === 'asc') {
          newSortDirection[existingIndex] = 'desc';
        } else if (newSortDirection[existingIndex] === 'desc') {
          newSortBy.splice(existingIndex, 1);
          newSortDirection.splice(existingIndex, 1);
        } else {
          newSortDirection[existingIndex] = 'asc';
        }
      } else {
        newSortBy.unshift(accessor);
        newSortDirection.unshift('asc');
      }

      onSortChange(newSortBy, newSortDirection);
    }
  };

  return (
    <div className="max-w-full">
      <div className="overflow-x-auto">
        <div className="min-w-[617px] 2xl:min-w-[808px]">
          <table className="min-w-full">
            <thead className="border-gray-100 border-y dark:border-white/[0.05]">
              <tr>
                {columns.map(column => (
                  <th
                    key={column.accessor}
                    className="px-4 py-3 font-medium text-gray-500 sm:px-6 text-start text-theme-xs dark:text-gray-400"
                    style={{ width: column.width }}
                    onClick={() =>
                      column.sortable && handleSort(column.accessor)
                    }
                  >
                    <span
                      className={`flex items-center gap-1 ${
                        column.sortable ? 'cursor-pointer' : ''
                      }`}
                    >
                      {column.header}
                      {column.sortable && (
                        <span>
                          {sortBy?.includes(column.accessor) ? (
                            sortDirection[sortBy.indexOf(column.accessor)] ===
                            'asc' ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSort />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map(column => (
                    <td
                      key={column.accessor}
                      className="px-4 py-3 text-gray-500 sm:px-6 text-start text-theme-sm dark:text-gray-400"
                      style={{ width: column.width }}
                    >
                      {column.Cell
                        ? column.Cell({ value: row[column.accessor], row })
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalAmount && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center justify-end">
            <span
              className={`text-lg font-medium text-right ${
                totalAmount < 0 ? 'text-contai-red' : 'text-contai-green'
              }`}
            >
              Total:{' '}
              {totalAmount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </div>
      )}
      {page && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center justify-between">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
              disabled={page === 1}
              onClick={() => onPageChange && onPageChange(page - 1)}
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.58301 9.99868C2.58272 10.1909 2.65588 10.3833 2.80249 10.53L7.79915 15.5301C8.09194 15.8231 8.56682 15.8233 8.85981 15.5305C9.15281 15.2377 9.15297 14.7629 8.86018 14.4699L5.14009 10.7472L16.6675 10.7472C17.0817 10.7472 17.4175 10.4114 17.4175 9.99715C17.4175 9.58294 17.0817 9.24715 16.6675 9.24715L5.14554 9.24715L8.86017 5.53016C9.15297 5.23717 9.15282 4.7623 8.85983 4.4695C8.56684 4.1767 8.09197 4.17685 7.79917 4.46984L2.84167 9.43049C2.68321 9.568 2.58301 9.77087 2.58301 9.99715C2.58301 9.99766 2.58301 9.99817 2.58301 9.99868Z"
                  fill=""
                ></path>
              </svg>
              <span className="hidden sm:inline">Anterior</span>
            </button>
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 sm:hidden">
              {page} de {Math.ceil(totalItems / itemsPerPage)}
            </span>
            <ul className="hidden items-center gap-0.5 sm:flex">
              {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }).map(
                (_, index) => (
                  <li key={index}>
                    <button
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-theme-sm font-medium text-gray-700 hover:bg-brand-500/[0.08] dark:hover:bg-brand-500 dark:hover:text-white hover:text-brand-500 dark:text-gray-400 ${
                        index + 1 === page ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => onPageChange && onPageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ),
              )}
            </ul>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
              onClick={() => onPageChange && onPageChange(page + 1)}
              disabled={data.length < itemsPerPage}
            >
              <span className="hidden sm:inline">Próxima</span>
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.4175 9.9986C17.4178 10.1909 17.3446 10.3832 17.198 10.53L12.2013 15.5301C11.9085 15.8231 11.4337 15.8233 11.1407 15.5305C10.8477 15.2377 10.8475 14.7629 11.1403 14.4699L14.8604 10.7472L3.33301 10.7472C2.91879 10.7472 2.58301 10.4114 2.58301 9.99715C2.58301 9.58294 2.91879 9.24715 3.33301 9.24715L14.8549 9.24715L11.1403 5.53016C10.8475 5.23717 10.8477 4.7623 11.1407 4.4695C11.4336 4.1767 11.9085 4.17685 12.2013 4.46984L17.1588 9.43049C17.3173 9.568 17.4175 9.77087 17.4175 9.99715C17.4175 9.99763 17.4175 9.99812 17.4175 9.9986Z"
                  fill=""
                ></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
