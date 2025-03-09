export interface RecurringEntry {
  id: number;
  amount: number;
  description: string;
  frequency: string;
  category: {
    id: number;
    name: string;
    type: string;
  };
  payment_type: {
    id: number;
    name: string;
  };
  next_run: string;
}

export interface GetRecurringEntriesResponse {
  entries: RecurringEntry[];
  total: number;
  page: number;
  items_per_page: number;
}

export interface GetRecurringEntriesParams {
  search?: string;
  page?: number;
  items_per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
