export interface PaymentType {
  id: number;
  name: string;
}

export type CreatePaymentTypeData = Omit<PaymentType, 'id'>;
export type UpdatePaymentTypeData = PaymentType;

export interface GetPaymentTypesResponse {
  paymentTypes: PaymentType[];
  total: number;
  page: number;
  items_per_page: number;
}

export interface GetPaymentTypesParams {
  search?: string;
  page?: number;
  items_per_page?: number;
  sort_by?: string[];
  sort_order?: Array<'asc' | 'desc'>;
}
