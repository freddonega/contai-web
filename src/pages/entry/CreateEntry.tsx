import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createEntry, fetchEntry, updateEntry } from "@/requests/entryRequests";
import { Input } from "@/components/Input";
import { SelectSearch } from "@/components/SelectSearch";
import { CreateEntryData, Entry } from "@/types/entry";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/requests/categoryRequests";
import { CurrencyInput } from "react-currency-mask";
import Checkbox from "@/components/Checkbox";
import { ButtonSelector } from "@/components/ButtonSelector";
import { use } from "echarts";

// Define the validation schema
const schema = yup.object().shape({
  amount: yup
    .number()
    .required("O valor da movimentação é obrigatório")
    .min(0, "O valor deve ser maior que 0"),
  description: yup.string(),
  category_id: yup.number().required("Categoria é obrigatória"),
  period: yup.string().required("Período é obrigatório"),
  recurring: yup.boolean(),
  frequency: yup.string().when("recurring", {
    is: true,
    then: (schema) => schema.required("Frequência é obrigatória"),
  }),
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
      recurring: false,
    },
  });

  const watchCategory = watch("category_id");
  const recurring = watch("recurring");

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
    if (categories) {
      if (categories.categories.length === 0) {
        toast.error(
          "Você precisa criar uma categoria antes de criar uma movimentação"
        );
        navigate("/categories");
      }
    }
  }, []);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

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

  const onSubmit = (data: Omit<CreateEntryData, "id">) => {
    const today = new Date().getDate();
    const nextRunDate = new Date(`${data.period}-${today}`);
    data.recurring = data.recurring || false;

    if (data.recurring) {
      switch (data.frequency) {
        case "daily":
          nextRunDate.setDate(nextRunDate.getDate() + 1);
          break;
        case "weekly":
          nextRunDate.setDate(nextRunDate.getDate() + 7);
          break;
        case "monthly":
          nextRunDate.setMonth(nextRunDate.getMonth() + 1);
          break;
        case "yearly":
          nextRunDate.setFullYear(nextRunDate.getFullYear() + 1);
          break;
        default:
          throw new Error("Invalid frequency");
      }
      data.next_run = nextRunDate.toISOString().split("T")[0];
    }
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
              error={errors.category_id?.message}
            />
            <Input
              label="Período"
              type="month"
              placeholder="ex: 2023-01"
              {...register("period")}
              error={errors.period?.message}
            />
            <div>
              <label className="flex items-center">
                <Checkbox {...register("recurring")} label="Recorrente?" />
              </label>
            </div>
            {recurring && (
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <ButtonSelector
                    label="Selecione a frequência"
                    options={[
                      { value: "daily", label: "Diária" },
                      { value: "weekly", label: "Semanal" },
                      { value: "monthly", label: "Mensal" },
                      { value: "yearly", label: "Anual" },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.frequency?.message}
                  />
                )}
              />
            )}
            <div>
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
      </div>
    </form>
  );
};
