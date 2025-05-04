export interface PaymentType {
  id: string;
  name: string;
}

export type CreatePaymentTypeData = Omit<PaymentType, 'id'>;
export type UpdatePaymentTypeData = PaymentType;

export interface GetPaymentTypesResponse {
  payment_types: PaymentType[];
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
