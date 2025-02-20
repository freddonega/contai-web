import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useQuery,
  useQueryClient,
  useMutation,
  UseQueryOptions,
} from '@tanstack/react-query';
import { fetchCategories, deleteCategory } from '@/requests/categoryRequests';
import { GetCategoriesResponse } from '@/types/category';
import { useDebounce } from '@/utils/useDebounce';
import { DynamicTable } from '@/components/DynamicTable';
import { SearchInput } from '@/components/SearchInput';
import { ConfirmModal } from '@/components/ConfirmModal';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export const ListCategories = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<('asc' | 'desc')[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | number | null
  >(null);
  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<GetCategoriesResponse>({
    queryKey: [
      'categories',
      { search: debouncedSearch, page, itemsPerPage, sortBy, sortDirection },
    ],
    queryFn: () =>
      fetchCategories({
        search: debouncedSearch,
        page,
        items_per_page: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortDirection,
      }),
  } as UseQueryOptions<GetCategoriesResponse, Error, GetCategoriesResponse, readonly unknown[]>);

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteCategory(id.toString()),
    onSuccess: () => {
      setIsConfirmModalOpen(false);
      setSelectedCategoryId(null);
      toast.success('Categoria deletada com sucesso');
      // Refetch categories after deletion
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: unknown) => {
      setIsConfirmModalOpen(false);
      setSelectedCategoryId(null);
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.error);
      }
      toast.error('Ocorreu um erro');
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (
    accessors: string[],
    directions: ('asc' | 'desc')[],
  ) => {
    setSortBy(accessors);
    setSortDirection(directions);
  };

  const handleDelete = (id: string | number) => {
    setSelectedCategoryId(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategoryId) {
      deleteMutation.mutate(selectedCategoryId);
    }
  };

  const handleView = (id: string | number) => {
    navigate(`/categories/edit/${id}`);
  };

  const handleCreateCategory = () => {
    navigate('/categories/create');
  };

  const columns = [
    { header: 'Nome', accessor: 'name', width: '250px', sortable: true },
    {
      header: 'Tipo',
      accessor: 'type',
      sortable: true,
      Cell: ({ value }: { value: string }) =>
        value === 'expense' ? (
          <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-red-50 text-error-600 dark:bg-red-500/15 dark:text-error-500">
            Despesa
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-green-50 text-success-600 dark:bg-green-500/15 dark:text-success-500">
            Receita
          </span>
        ),
    },
    {
      header: 'Ações',
      accessor: 'actions',
      width: '100px',
      Cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(row.id)}
            className="bg-primary text-white/50 p-2 rounded-full"
          >
            <FaEye className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-500 text-white/50 p-2 rounded-full"
          >
            <FaTrash className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 border-t border-gray-100 dark:border-contai-darkBlue sm:p-6">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="px-4 pt-4 sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Categorias
                </h3>
              </div>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={handleCreateCategory}
                  className="bg-contai-lightBlue text-white px-2 py-2 rounded flex-grow sm:w-auto"
                >
                  Nova Categoria
                </button>
                <SearchInput value={search} onChange={handleSearchChange} />
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="p-4">
              <Skeleton
                count={10}
                height={40}
                baseColor="#333A48"
                highlightColor="#24303F"
              />
            </div>
          ) : (
            <DynamicTable
              columns={columns}
              data={
                data?.categories.map(category => ({
                  ...category,
                  actions: (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(category.id)}
                        className="text-blue-500 hover:underline"
                      >
                        <FaEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-500 hover:underline"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  ),
                })) || []
              }
              page={page}
              itemsPerPage={itemsPerPage}
              totalItems={data?.total || 0}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              sortBy={sortBy}
              sortDirection={sortDirection}
            />
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        message="Tem certeza que deseja deletar esta categoria?"
      />
    </div>
  );
};
