export interface Entry {
  id: string;
  amount: number;
  description?: string;
  category: {
    id: string;
    name: string;
    type: string;
    cost_center?: {
      id: string;
      name: string;
    };
  };
  payment_type?: {
    id: string;
    name: string;
  };
  user_id: string;
  period: string;
}

export interface CreateEntryData {
  amount: number;
  description?: string;
  category_id: string;
  payment_type_id?: string;
  period: string;
  recurring?: boolean;
  frequency?: string;
  next_run?: string;
}

export interface UpdateEntryData {
  id: string;
  amount: number;
  description?: string;
  category_id: string;
  payment_type_id?: string;
  period: string;
  recurring?: boolean;
  frequency?: string;
  next_run?: string;
}

export interface GetEntriesParams {
  search?: string;
  page?: number;
  items_per_page?: number;
  sort_by?: string[];
  sort_order?: ('asc' | 'desc')[];
  category_id?: string[] | null;
  category_type?: string[] | null;
  payment_type_id?: string[] | null;
  cost_center_id?: string[] | null;
  from?: string;
  to?: string;
}

export interface EntryResponse {
  id: string;
  amount: number;
  description?: string;
  category_id: string;
  user_id: string;
  period: string;
}

export interface GetEntriesResponse {
  entries: EntryResponse[];
  total: number;
  page: number;
  items_per_page: number;
  total_amount: number;
}
