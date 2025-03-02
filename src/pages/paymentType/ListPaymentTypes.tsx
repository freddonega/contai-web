import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  fetchPaymentTypes,
  deletePaymentType,
} from '@/requests/paymentTypeRequests';
import { useDebounce } from '@/utils/useDebounce';
import { DynamicTable } from '@/components/DynamicTable';
import { SearchInput } from '@/components/SearchInput';
import { ConfirmModal } from '@/components/ConfirmModal';
import Skeleton from 'react-loading-skeleton';
import { FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import 'react-loading-skeleton/dist/skeleton.css';

interface ListPaymentTypesProps {}

export const ListPaymentTypes = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<('asc' | 'desc')[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedPaymentTypeId, setSelectedPaymentTypeId] = useState<
    string | number | null
  >(null);
  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [
      ['paymentTypes'],
      { search: debouncedSearch, page, itemsPerPage, sortBy, sortDirection },
    ],
    queryFn: () =>
      fetchPaymentTypes({
        search: debouncedSearch,
        page,
        items_per_page: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortDirection,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deletePaymentType(id.toString()),
    onSuccess: () => {
      setIsConfirmModalOpen(false);
      setSelectedPaymentTypeId(null);
      toast.success('Tipo de pagamento deletado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['paymentTypes'] });
    },
    onError: (error: unknown) => {
      setIsConfirmModalOpen(false);
      setSelectedPaymentTypeId(null);
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
    setSelectedPaymentTypeId(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPaymentTypeId) {
      deleteMutation.mutate(selectedPaymentTypeId);
    }
  };

  const handleView = (id: string | number) => {
    navigate(`/paymentTypes/edit/${id}`);
  };

  const handleCreatePaymentType = () => {
    navigate('/paymentTypes/create');
  };

  const columns = [
    { header: 'Nome', accessor: 'name', width: '250px', sortable: true },
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
                  Tipos de Pagamento
                </h3>
              </div>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={handleCreatePaymentType}
                  className="bg-contai-lightBlue text-white px-2 py-2 rounded flex-grow sm:w-auto"
                >
                  Novo Tipo de Pagamento
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
                data?.map(paymentType => ({
                  ...paymentType,
                  actions: (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(paymentType.id)}
                        className="text-blue-500 hover:underline"
                      >
                        <FaEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(paymentType.id)}
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
        message="Tem certeza que deseja deletar este tipo de pagamento?"
      />
    </div>
  );
};
