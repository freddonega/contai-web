import { api } from '@/api';
import {
  GetRecurringEntriesResponse,
  RecurringEntry,
} from '@/types/recurringEntry';

export const fetchRecurringEntries = async (params: {
  search?: string;
  page?: number;
  items_per_page?: number;
  sort_by?: string[];
  sort_order?: Array<'asc' | 'desc'>;
}): Promise<GetRecurringEntriesResponse> => {
  try {
    const { data } = await api.get('/recurring_entry', { params });
    return data;
  } catch (error) {
    console.error('Error fetching recurring entries:', error);
    throw error;
  }
};

export const fetchRecurringEntry = async (
  id: string,
): Promise<RecurringEntry> => {
  try {
    const { data } = await api.get(`/recurring_entry/${id}`);
    return data;
  } catch (error) {
    console.error('Error fetching recurring entry:', error);
    throw error;
  }
};

export const createRecurringEntry = async (
  entry: Omit<RecurringEntry, 'id'>,
): Promise<RecurringEntry> => {
  try {
    const { data } = await api.post('/recurring_entry', entry);
    return data;
  } catch (error) {
    console.error('Error creating recurring entry:', error);
    throw error;
  }
};

export const updateRecurringEntry = async (
  entry: RecurringEntry,
): Promise<RecurringEntry> => {
  try {
    const { data } = await api.put(`/recurring_entry/${entry.id}`, entry);
    return data;
  } catch (error) {
    console.error('Error updating recurring entry:', error);
    throw error;
  }
};

export const deleteRecurringEntry = async (id: string): Promise<void> => {
  try {
    await api.delete(`/recurring_entry/${id}`);
  } catch (error) {
    console.error('Error deleting recurring entry:', error);
    throw error;
  }
};
