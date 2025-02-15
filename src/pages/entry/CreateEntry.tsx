import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createEntry, fetchEntry, updateEntry } from "@/requests/entryRequests";
import { Input } from "@/components/Input";
import { SelectSearch } from "@/components/SelectSearch";
import { Entry } from "@/types/entry";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/requests/categoryRequests";
import { CurrencyInput } from "react-currency-mask";

// Define the validation schema
const schema = yup.object().shape({
  amount: yup.number().required("Valor é obrigatório"),
  description: yup.string(),
  category_id: yup.number().required("Categoria é obrigatória"),
  period: yup.string().required("Período é obrigatório"),
});

export const CreateEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      period: new Date().toISOString().split("T")[0].slice(0, 7),
    },
  });

  const watchCategory = watch("category_id");

  const { data: entry, isLoading: isFetchingEntry } = useQuery({
    queryKey: ["entry", id],
    queryFn: () => fetchEntry(id),
    enabled: !!id,
  });

  const { data: categories } = useQuery({
    queryKey: [
      "categories",
      {
        search,
      },
    ],
    queryFn: () =>
      fetchCategories({
        page: 1,
        search,
        items_per_page: 1000,
      }),
  });

  useEffect(() => {
    if (categories) {
      setCategoryOptions(
        categories.categories.map((category) => ({
          value: category.id,
          label: `${category.name} (${
            category.type === "expense" ? "Despesa" : "Receita"
          })`,
        }))
      );
    }
  }, [categories]);

  useEffect(() => {
    if (entry) {
      setValue("amount", entry.amount);
      setValue("description", entry.description);
      setValue("category_id", entry.category_id);
      setValue("period", entry.period);
    }
  }, [entry, setValue]);

  const createMutation = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      toast.success("Entrada criada com sucesso");
      navigate("/entries");
    },
    onError: (error: any) => {
      toast.error(
        `Erro ao criar entrada: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEntry,
    onSuccess: () => {
      toast.success("Entrada atualizada com sucesso");
      navigate("/entries");
    },
    onError: (error: any) => {
      toast.error(
        `Erro ao atualizar entrada: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const onSubmit = (data: Omit<Entry, "id">) => {
    if (id) {
      updateMutation.mutate({ id: Number(id), ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-contai-darkBlue dark:bg-white/[0.03] ">
        <div className="px-6 py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {id ? "Editar movimentação" : "Cadastro de movimentação"}
          </h3>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-contai-darkBlue sm:p-6">
          <div className="space-y-6">
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onChangeValue={(event, value) => field.onChange(value)}
                  InputElement={
                    <Input
                      label="Valor previsto (R$)"
                      error={errors.amount?.message}
                    />
                  }
                />
              )}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs italic">
                {errors.amount.message}
              </p>
            )}
            <Input
              label="Descrição"
              type="text"
              placeholder="ex: Salário"
              {...register("description")}
              error={errors.description?.message}
            />
            <SelectSearch
              label="Categoria"
              options={categoryOptions}
              onSearchChange={(e) => setSearch(e.target.value)}
              onChange={(value) => {
                console.log(value);
                setValue("category_id", Number(value));
              }}
              value={watchCategory?.toString()}
            />
            <Input
              label="Período"
              type="month"
              placeholder="ex: 2023-01"
              {...register("period")}
              error={errors.period?.message}
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
