import { api } from "@/api";
import {
  Entry,
  CreateEntryData,
  UpdateEntryData,
  GetEntriesParams,
  GetEntriesResponse,
} from "@/types/entry";

export const fetchEntries = async (
  params: GetEntriesParams
): Promise<GetEntriesResponse> => {
  const response = await api.get("/entries", { params });
  return response.data;
};

export const fetchEntry = async (entryId: string): Promise<Entry> => {
  const response = await api.get(`/entries/${entryId}`);
  return response.data;
};

export const createEntry = async (
  newEntry: CreateEntryData
): Promise<Entry> => {
  const response = await api.post("/entries", newEntry);
  return response.data;
};

export const updateEntry = async (
  updatedEntry: UpdateEntryData
): Promise<Entry> => {
  const response = await api.put(`/entries/${updatedEntry.id}`, updatedEntry);
  return response.data;
};

export const deleteEntry = async (entryId: string): Promise<void> => {
  await api.delete(`/entries/${entryId}`);
};
