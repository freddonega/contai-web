export interface Entry {
  id: number;
  amount: number;
  description?: string;
  category_id: number;
  user_id: number;
  period: string;
}

export interface CreateEntryData {
  amount: number;
  description?: string;
  category_id: number;
  period: string;
  recurring?: boolean;
  frequency?: string;
  next_run?: string;
}

export interface UpdateEntryData {
  id: number;
  amount: number;
  description?: string;
  category_id: number;
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
  sort_order?: Array<'asc' | 'desc'>;
}

export interface EntryResponse {
  id: number;
  amount: number;
  description?: string;
  category_id: number;
  user_id: number;
  period: string;
}

export interface GetEntriesResponse {
  entries: EntryResponse[];
  total: number;
  page: number;
  items_per_page: number;
}
