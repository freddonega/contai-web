import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCategory,
  fetchCategory,
  updateCategory,
} from "@/requests/categoryRequests";
import { Input } from "@/components/Input";
import { RadioGroup } from "@/components/RadioGroup";
import { SelectSearch } from "@/components/SelectSearch";
import { Category } from "@/types/category";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCostCenters } from "@/requests/costCenterRequests";

// Define the validation schema
const schema = yup.object().shape({
  name: yup.string().required("O nome da categoria é obrigatório"),
  type: yup.string().required("O tipo da categoria é obrigatório"),
  cost_center_id: yup.string().required("O centro de custo é obrigatório"),
});

export const CreateCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [costCenterOptions, setCostCenterOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [initialCostCenter, setInitialCostCenter] = useState<{ id: string; name: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const type = watch("type");

  const { data: category, isLoading: isFetchingCategory } = useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategory(id),
    enabled: !!id,
  });

  const { data: costCenters } = useQuery({
    queryKey: ["costCenters", { search }],
    queryFn: () =>
      fetchCostCenters({
        page: 1,
        search,
        items_per_page: 1000,
      }),
  });

  // Efeito para definir os valores iniciais do formulário
  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("type", category.type);
      if (category.cost_center) {
        setInitialCostCenter(category.cost_center);
        setValue("cost_center_id", category.cost_center.id);
      }
    }
  }, [category, setValue]);

  // Efeito para gerenciar as opções de centro de custo
  useEffect(() => {
    if (costCenters) {
      let options = costCenters.cost_centers.map((costCenter) => ({
        value: costCenter.id,
        label: costCenter.name,
      }));

      // Se tiver um centro de custo inicial e ele não estiver nas opções, adiciona ele
      if (initialCostCenter) {
        const costCenterExists = options.some(
          (option) => option.value === initialCostCenter.id
        );
        if (!costCenterExists) {
          options = [
            {
              value: initialCostCenter.id,
              label: initialCostCenter.name,
            },
            ...options,
          ];
        }
      }

      setCostCenterOptions(options);
    }
  }, [costCenters, initialCostCenter]);

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Categoria criada com sucesso");
      navigate("/categories");
    },
    onError: (error: any) => {
      toast.error(
        `Erro ao criar categoria: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso");
      navigate("/categories");
    },
    onError: (error: any) => {
      toast.error(
        `Erro ao atualizar categoria: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const onSubmit = (data: Omit<Category, "id" | "cost_center">) => {
    if (id) {
      updateMutation.mutate({ id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-contai-darkBlue dark:bg-white/[0.03] ">
        <div className="px-6 py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {id ? "Editar categoria" : "Cadastro de categoria"}
          </h3>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-contai-darkBlue sm:p-6">
          <div className="space-y-6">
            <Input
              label="Nome da categoria"
              type="text"
              placeholder="ex: Mercado"
              {...register("name")}
              error={errors.name?.message}
            />

            <RadioGroup
              {...register("type")}
              options={[
                { label: "Saída", value: "expense" },
                { label: "Entrada", value: "income" },
              ]}
              value={type}
              error={errors.type?.message}
            />

            <SelectSearch
              label="Centro de Custo"
              options={costCenterOptions}
              onSearchChange={(e) => setSearch(e.target.value)}
              onChange={(value) => {
                setValue("cost_center_id", value);
              }}
              value={watch("cost_center_id")?.toString()}
              error={errors.cost_center_id?.message}
            />

            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg transition w-full px-4 py-3 text-sm bg-contai-lightBlue text-white shadow-theme-xs hover: disabled:bg-gray-500/50 disabled:cursor-not-allowed"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Carregando..."
                : id
                ? "Atualizar"
                : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
