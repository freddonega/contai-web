import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  fetchCostCenters,
  deleteCostCenter,
  CostCenter,
} from '@/requests/costCenterRequests';
import { useDebounce } from '@/utils/useDebounce';
import { DynamicTable } from '@/components/DynamicTable';
import { SearchInput } from '@/components/SearchInput';
import { ConfirmModal } from '@/components/ConfirmModal';
import Skeleton from 'react-loading-skeleton';
import { FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import 'react-loading-skeleton/dist/skeleton.css';

export const ListCostCenters = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string[]>(['name']);
  const [sortDirection, setSortDirection] = useState<('asc' | 'desc')[]>(['asc']);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCostCenterId, setSelectedCostCenterId] = useState<string | number | null>(null);
  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [
      'costCenters',
      {
        search: debouncedSearch,
        page,
        itemsPerPage,
        sortBy,
        sortDirection,
      },
    ],
    queryFn: () =>
      fetchCostCenters({
        search: debouncedSearch,
        page,
        items_per_page: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortDirection,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteCostCenter(id.toString()),
    onSuccess: () => {
      setIsConfirmModalOpen(false);
      setSelectedCostCenterId(null);
      toast.success('Centro de custo deletado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['costCenters'] });
    },
    onError: (error: unknown) => {
      setIsConfirmModalOpen(false);
      setSelectedCostCenterId(null);
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
    setSelectedCostCenterId(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCostCenterId) {
      deleteMutation.mutate(selectedCostCenterId);
    }
  };

  const handleView = (id: string | number) => {
    navigate(`/costCenters/edit/${id}`);
  };

  const handleCreateCostCenter = () => {
    navigate('/costCenters/create');
  };

  const columns = [
    {
      header: 'Nome',
      accessor: 'name',
      width: '250px',
      sortable: true,
    },
    {
      header: 'Ações',
      accessor: 'actions',
      width: '100px',
      Cell: ({ row }: { row: CostCenter }) => (
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Centros de Custo
        </h2>
        <button
          onClick={handleCreateCostCenter}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Novo Centro de Custo
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-4 sm:p-6">
          <div className="mb-4">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar centros de custo..."
            />
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
              data={data?.cost_centers || []}
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
        message="Tem certeza que deseja deletar este centro de custo?"
      />
    </div>
  );
}; 