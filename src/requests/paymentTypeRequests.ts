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
  try {
    const response = await api.get(`/payment_types/${paymentTypeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment type:', error);
    throw error;
  }
};

export const fetchPaymentTypes = async (
  params: GetPaymentTypesParams,
): Promise<PaymentType[]> => {
  try {
    const response = await api.get('/payment_types', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment types:', error);
    throw error;
  }
};

export const createPaymentType = async (
  newPaymentType: CreatePaymentTypeData,
): Promise<PaymentType> => {
  try {
    const response = await api.post('/payment_types', newPaymentType);
    return response.data;
  } catch (error) {
    console.error('Error creating payment type:', error);
    throw error;
  }
};

export const updatePaymentType = async (
  updatedPaymentType: UpdatePaymentTypeData,
): Promise<PaymentType> => {
  try {
    const response = await api.put(
      `/payment_types/${updatedPaymentType.id}`,
      updatedPaymentType,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating payment type:', error);
    throw error;
  }
};

export const deletePaymentType = async (
  paymentTypeId: string,
): Promise<void> => {
  try {
    await api.delete(`/payment_types/${paymentTypeId}`);
  } catch (error) {
    console.error('Error deleting payment type:', error);
    throw error;
  }
};
