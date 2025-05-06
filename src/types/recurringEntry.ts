export interface RecurringEntry {
  id: string;
  amount: number;
  description: string;
  frequency: string;
  category: {
    id: string;
    name: string;
    type: string;
  };
  payment_type: {
    id: string;
    name: string;
  };
  next_run: string;
  last_run?: string;
}

export interface GetRecurringEntriesResponse {
  recurring_entries: RecurringEntry[];
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
