import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createCostCenter,
  fetchCostCenter,
  updateCostCenter,
} from '@/requests/costCenterRequests';
import { Input } from '@/components/Input';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';

export const CreateCostCenter = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: costCenter, isLoading: isFetchingCostCenter } = useQuery({
    queryKey: ['costCenter', id],
    queryFn: () => fetchCostCenter(id),
    enabled: !!id,
  });

  // Define the validation schema
  const schema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: costCenter?.name || '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createCostCenter,
    onSuccess: () => {
      toast.success('Centro de custo criado com sucesso');
      navigate('/costCenters');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      toast.error('Ocorreu um erro');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      updateCostCenter(id, data),
    onSuccess: () => {
      toast.success('Centro de custo atualizado com sucesso');
      navigate('/costCenters');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      toast.error('Ocorreu um erro');
    },
  });

  const onSubmit = (data: { name: string }) => {
    if (id) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isFetchingCostCenter) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3 mt-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {id ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 border-t border-gray-100 dark:border-contai-darkBlue sm:p-6">
            <div className="space-y-6">
              <Input
                label="Nome"
                type="text"
                placeholder="ex: Marketing"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100 dark:border-contai-darkBlue sm:px-6">
            <button
              type="button"
              onClick={() => navigate('/costCenters')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05] dark:focus:ring-white/[0.05] dark:focus:ring-offset-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {id ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 