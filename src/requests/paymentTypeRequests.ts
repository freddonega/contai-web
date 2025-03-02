import { api } from '@/api';
import {
  PaymentType,
  CreatePaymentTypeData,
  UpdatePaymentTypeData,
  GetPaymentTypesParams,
  GetPaymentTypesResponse,
} from '@/types/paymentType';

export const fetchPaymentType = async (
  paymentTypeId: string,
): Promise<PaymentType> => {
  const response = await api.get(`/payment_types/${paymentTypeId}`);
  return response.data;
};

export const fetchPaymentTypes = async (
  params: GetPaymentTypesParams,
): Promise<PaymentType[]> => {
  const response = await api.get('/payment_types', { params });
  return response.data;
};

export const createPaymentType = async (
  newPaymentType: CreatePaymentTypeData,
): Promise<PaymentType> => {
  const response = await api.post('/payment_types', newPaymentType);
  return response.data;
};

export const updatePaymentType = async (
  updatedPaymentType: UpdatePaymentTypeData,
): Promise<PaymentType> => {
  const response = await api.put(
    `/payment_types/${updatedPaymentType.id}`,
    updatedPaymentType,
  );
  return response.data;
};

export const deletePaymentType = async (
  paymentTypeId: string,
): Promise<void> => {
  await api.delete(`/payment_types/${paymentTypeId}`);
};
