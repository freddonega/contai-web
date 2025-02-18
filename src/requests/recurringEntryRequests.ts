import { api } from "@/api";
import {
  GetRecurringEntriesResponse,
  RecurringEntry,
} from "@/types/recurringEntry";

export const fetchRecurringEntries = async (params: {
  search?: string;
  page?: number;
  items_per_page?: number;
  sort_by?: string;
  sort_order?: string;
}): Promise<GetRecurringEntriesResponse> => {
  const { data } = await api.get("/recurring_entry", { params });
  return data;
};

export const fetchRecurringEntry = async (
  id: string
): Promise<RecurringEntry> => {
  const { data } = await api.get(`/recurring_entry/${id}`);
  return data;
};

export const createRecurringEntry = async (
  entry: Omit<RecurringEntry, "id">
): Promise<RecurringEntry> => {
  const { data } = await api.post("/recurring_entry", entry);
  return data;
};

export const updateRecurringEntry = async (
  entry: RecurringEntry
): Promise<RecurringEntry> => {
  const { data } = await api.put(`/recurring_entry/${entry.id}`, entry);
  return data;
};

export const deleteRecurringEntry = async (id: string): Promise<void> => {
  await api.delete(`/recurring_entry/${id}`);
};
