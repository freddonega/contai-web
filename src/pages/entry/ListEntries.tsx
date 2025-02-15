import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useQuery,
  useQueryClient,
  useMutation,
  UseQueryOptions,
} from "@tanstack/react-query";
import { fetchEntries, deleteEntry } from "@/requests/entryRequests";
import { GetEntriesResponse } from "@/types/entry";
import { useDebounce } from "@/utils/useDebounce";
import { DynamicTable } from "@/components/DynamicTable";
import { SearchInput } from "@/components/SearchInput";
import { ConfirmModal } from "@/components/ConfirmModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaEye, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const ListEntries = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>("category.type");
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >("desc");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<
    string | number | null
  >(null);
  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<GetEntriesResponse>({
    queryKey: [
      "entries",
      { search: debouncedSearch, page, itemsPerPage, sortBy, sortDirection },
    ],
    queryFn: () =>
      fetchEntries({
        search: debouncedSearch,
        page,
        items_per_page: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortDirection,
      }),
  } as UseQueryOptions<GetEntriesResponse, Error, GetEntriesResponse, readonly unknown[]>);

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteEntry(id.toString()),
    onSuccess: () => {
      setIsConfirmModalOpen(false);
      setSelectedEntryId(null);
      toast.success("Entrada deletada com sucesso");
      // Refetch entries after deletion
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
    onError: (error: unknown) => {
      setIsConfirmModalOpen(false);
      setSelectedEntryId(null);
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.error);
      }
      toast.error("Ocorreu um erro");
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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
    navigate("/entries/create");
  };

  const handleSortChange = (accessor: string, direction: "asc" | "desc") => {
    console.log(accessor, direction);
    setSortBy(accessor);
    setSortDirection(direction);
  };

  const columns = [
    {
      header: "Período",
      accessor: "period",
      width: "200px",
      sortable: true,
      Cell: ({ row }: { row: any }) => (
        <span>
          {new Date(row.period + "-02").toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
          })}
        </span>
      ),
    },
    {
      header: "Valor",
      accessor: "amount",
      width: "150px",
      Cell: ({ row }: { row: any }) => (
        <span className={row.category.type === "expense" ? "text-red-500" : ""}>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(row.category.type === "expense" ? -row.amount : row.amount)}
        </span>
      ),
    },
    {
      header: "Categoria",
      accessor: "category.name",
      width: "150px",
      sortable: true,
      Cell: ({ row }: { row: any }) => row.category.name,
    },
    {
      header: "Type",
      accessor: "category.type",
      width: "150px",
      sortable: true,
      Cell: ({ row }: { row: any }) =>
        row.category.type === "expense" ? (
          <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-red-50 text-error-600 dark:bg-red-500/15 dark:text-error-500">
            Despesa
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs bg-green-50 text-success-600 dark:bg-green-500/15 dark:text-success-500">
            Receita
          </span>
        ),
    },
    { header: "Descrição", accessor: "description" },
    {
      header: "Ações",
      accessor: "actions",
      width: "100px",
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
              <div className="flex gap-2">
                <SearchInput value={search} onChange={handleSearchChange} />
                <button
                  onClick={handleCreateEntry}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Nova Entrada
                </button>
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
                data?.entries.map((entry) => ({
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
