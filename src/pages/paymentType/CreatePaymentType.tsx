import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createPaymentType,
  fetchPaymentType,
  updatePaymentType,
} from '@/requests/paymentTypeRequests';
import { Input } from '@/components/Input';
import { PaymentType } from '@/types/paymentType';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

// Define the validation schema
const schema = yup.object().shape({
  name: yup.string().required('O nome do tipo de pagamento é obrigatório'),
});

export const CreatePaymentType = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { data: paymentType, isLoading: isFetchingPaymentType } = useQuery({
    queryKey: ['paymentType', id],
    queryFn: () => fetchPaymentType(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (paymentType) {
      setValue('name', paymentType.name);
    }
  }, [paymentType, setValue]);

  const createMutation = useMutation({
    mutationFn: createPaymentType,
    onSuccess: () => {
      toast.success('Tipo de pagamento criado com sucesso');
      navigate('/paymentTypes');
    },
    onError: (error: any) => {
      toast.error(
        `Erro ao criar tipo de pagamento: ${
          error.response?.data?.message || error.message
        }`,
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePaymentType,
    onSuccess: () => {
      toast.success('Tipo de pagamento atualizado com sucesso');
      navigate('/paymentTypes');
    },
    onError: (error: any) => {
      toast.error(
        `Erro ao atualizar tipo de pagamento: ${
          error.response?.data?.message || error.message
        }`,
      );
    },
  });

  const onSubmit = (data: Omit<PaymentType, 'id'>) => {
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
            {id ? 'Editar tipo de pagamento' : 'Cadastro de tipo de pagamento'}
          </h3>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-contai-darkBlue sm:p-6">
          <div className="space-y-6">
            <Input
              label="Nome do tipo de pagamento"
              type="text"
              placeholder="ex: Cartão de Crédito"
              {...register('name')}
              error={errors.name?.message}
            />

            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg transition w-full px-4 py-3 text-sm bg-contai-lightBlue text-white shadow-theme-xs hover: disabled:bg-gray-500/50 disabled:cursor-not-allowed"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Carregando...'
                : id
                ? 'Atualizar'
                : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
