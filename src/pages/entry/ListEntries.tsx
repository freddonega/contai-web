import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useQuery,
  useQueryClient,
  useMutation,
  UseQueryOptions,
} from '@tanstack/react-query';
import { fetchEntries, deleteEntry } from '@/requests/entryRequests';
import { GetEntriesResponse } from '@/types/entry';
import { useDebounce } from '@/utils/useDebounce';
import { DynamicTable } from '@/components/DynamicTable';
import { ConfirmModal } from '@/components/ConfirmModal';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { Select } from '@/components/Select';
import { Input } from '@/components/Input';
import { fetchCategories } from '@/requests/categoryRequests';
import { SelectSearch } from '@/components/SelectSearch';
import { fetchPaymentTypes } from '@/requests/paymentTypeRequests';

export const ListEntries = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string[]>(['period', 'category.type']);
  const [sortDirection, setSortDirection] = useState<('asc' | 'desc')[]>([
    'desc',
    'desc',
  ]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryType, setCategoryType] = useState<string | null>(null);
  const [paymentTypeId, setPaymentTypeId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<
    string | number | null
  >(null);
  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [paymentTypes, setPaymentTypes] = useState<
    { value: string; label: string }[]
  >([]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', debouncedSearch],
    queryFn: () =>
      fetchCategories({
        search: debouncedSearch,
      }),
  });

  const { data: paymentTypesData } = useQuery({
    queryKey: ['paymentTypes', debouncedSearch],
    queryFn: () =>
      fetchPaymentTypes({
        search: debouncedSearch,
      }),
  });

  useEffect(() => {
    if (categoriesData) {
      const categoryOptions = categoriesData.categories.map(category => ({
        value: category.id.toString(),
        label: category.name,
      }));
      setCategories(categoryOptions);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (paymentTypesData) {
      const paymentTypeOptions = paymentTypesData.map(paymentType => ({
        value: paymentType.id.toString(),
        label: paymentType.name,
      }));
      setPaymentTypes(paymentTypeOptions);
    }
  }, [paymentTypesData]);

  const { data, isLoading } = useQuery<GetEntriesResponse>({
    queryKey: [
      'entries',
      {
        page,
        itemsPerPage,
        sortBy,
        sortDirection,
        ...(categoryId && { categoryId }),
        ...(categoryType && { categoryType }),
        ...(paymentTypeId && { paymentTypeId }),
        ...(dateRange.from && { from: dateRange.from }),
        ...(dateRange.to && { to: dateRange.to }),
      },
    ],
    queryFn: () =>
      fetchEntries({
        page,
        items_per_page: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortDirection,
        ...(categoryId && { category_id: categoryId }),
        ...(categoryType && { category_type: categoryType }),
        ...(paymentTypeId && { payment_type_id: paymentTypeId }),
        ...(dateRange.from && { from: dateRange.from }),
        ...(dateRange.to && { to: dateRange.to }),
      }),
  } as UseQueryOptions<GetEntriesResponse, Error, GetEntriesResponse, readonly unknown[]>);

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteEntry(id.toString()),
    onSuccess: () => {
      setIsConfirmModalOpen(false);
      setSelectedEntryId(null);
      toast.success('Entrada deletada com sucesso');
      // Refetch entries after deletion
      queryClient.invalidateQueries({ queryKey: ['entries'] });
    },
    onError: (error: unknown) => {
      setIsConfirmModalOpen(false);
      setSelectedEntryId(null);
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.error);
      }
      toast.error('Ocorreu um erro');
    },
  });

  const handleCategoryIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
    setPage(1);
  };

  const handleCategoryTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCategoryType(e.target.value);
    setPage(1);
  };

  const handlePaymentTypeIdChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPaymentTypeId(e.target.value);
    setPage(1);
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDelete = (id: string | number) => {
    setSelectedEntryId(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEntryId) {
      deleteMutation.mutate(selectedEntryId);
    }
  };

  const handleView = (id: string | number) => {
    navigate(`/entries/edit/${id}`);
  };

  const handleCreateEntry = () => {
    navigate('/entries/create');
  };

  const handleSortChange = (
    accessors: string[],
    directions: ('asc' | 'desc')[],
  ) => {
    setSortBy(accessors);
    setSortDirection(directions);
  };

  const columns = [
    {
      header: 'Período',
      accessor: 'period',
      width: '200px',
      Cell: ({ row }: { row: any }) => (
        <span>
          {new Date(row.period + '-02').toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
          })}
        </span>
      ),
    },
    {
      header: 'Valor',
      accessor: 'amount',
      width: '150px',
      Cell: ({ row }: { row: any }) => (
        <span className={row.category.type === 'expense' ? 'text-red-500' : ''}>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(row.category.type === 'expense' ? -row.amount : row.amount)}
        </span>
      ),
    },
    {
      header: 'Categoria',
      accessor: 'category.name',
      width: '150px',
      Cell: ({ row }: { row: any }) => row.category.name,
    },
    {
      header: 'Type',
      accessor: 'category.type',
      width: '150px',

      Cell: ({ row }: { row: any }) =>
        row.category.type === 'expense' ? (
          <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-red-50 text-error-600 dark:bg-red-500/15 dark:text-error-500">
            Despesa
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-green-50 text-success-600 dark:bg-green-500/15 dark:text-success-500">
            Receita
          </span>
        ),
    },
    { header: 'Descrição', accessor: 'description' },
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
                  Movimentações
                </h3>
              </div>
              <div className="grid lg:grid-cols-5 gap-2">
                <SelectSearch
                  placeholder="Categoria"
                  options={[{ value: '', label: 'Cancelar' }, ...categories]}
                  onSearchChange={e => setSearch(e.target.value)}
                  onChange={value => {
                    handleCategoryIdChange({
                      target: { value },
                    } as React.ChangeEvent<HTMLSelectElement>);
                  }}
                />

                <Select
                  options={[
                    { value: '', label: 'Tipo de Categoria' },
                    { value: 'income', label: 'Receita' },
                    { value: 'expense', label: 'Despesa' },
                  ]}
                  onChange={handleCategoryTypeChange}
                />

                <SelectSearch
                  placeholder="Tipo de Pagamento"
                  options={[{ value: '', label: 'Cancelar' }, ...paymentTypes]}
                  onSearchChange={e => setSearch(e.target.value)}
                  onChange={value => {
                    handlePaymentTypeIdChange({
                      target: { value },
                    } as React.ChangeEvent<HTMLSelectElement>);
                  }}
                />

                <Input
                  type="month"
                  name="from"
                  value={dateRange.from}
                  onChange={handleDateRangeChange}
                />
                <Input
                  type="month"
                  name="to"
                  value={dateRange.to}
                  onChange={handleDateRangeChange}
                />
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
                data?.entries.map(entry => ({
                  ...entry,
                  actions: (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(entry.id)}
                        className="text-blue-500 hover:underline"
                      >
                        <FaEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
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
              totalAmount={data?.total_amount}
            />
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        message="Tem certeza que deseja deletar esta entrada?"
      />
    </div>
  );
};
