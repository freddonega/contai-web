import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCategory,
  fetchCategory,
  updateCategory,
} from "@/requests/categoryRequests";
import { Input } from "@/components/Input";
import { RadioGroup } from "@/components/RadioGroup";
import { Category } from "@/types/category";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

// Define the validation schema
const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  type: yup.string().required("Tipo é obrigatório"),
});

export const CreateCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("type", category.type);
    }
  }, [category, setValue]);

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

  const onSubmit = (data: Omit<Category, "id">) => {
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
          </div>
          <div>
            <RadioGroup
              {...register("type")}
              options={[
                { label: "Saída", value: "expense" },
                { label: "Entrada", value: "income" },
              ]}
              value={type}
              error={errors.type?.message}
            />
          </div>
          <div className="flex justify-end p-4 space-x-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-primary text-white shadow-theme-xs hover:bg-primary disabled:bg-primary/50 disabled:cursor-not-allowed"
            >
              {id ? "Atualizar" : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
