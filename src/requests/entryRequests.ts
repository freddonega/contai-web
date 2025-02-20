import { api } from '@/api';
import {
  Entry,
  CreateEntryData,
  UpdateEntryData,
  GetEntriesParams,
  GetEntriesResponse,
} from '@/types/entry';

export const fetchEntries = async (
  params: GetEntriesParams,
): Promise<GetEntriesResponse> => {
  const response = await api.get('/entries', { params });
  return response.data;
};

export const fetchEntry = async (entryId: string): Promise<Entry> => {
  const response = await api.get(`/entries/${entryId}`);
  return response.data;
};

export const createEntry = async (
  newEntry: CreateEntryData,
): Promise<Entry> => {
  let response;
  if (newEntry.recurring) {
    [, response] = await Promise.all([
      api.post('/entries', newEntry),
      api.post('/recurring_entry', {
        amount: newEntry.amount,
        description: newEntry.description,
        category_id: newEntry.category_id,
        frequency: newEntry.frequency,
        next_run: newEntry.next_run,
      }),
    ]);
  } else {
    response = await api.post('/entries', newEntry);
  }

  return response.data;
};

export const updateEntry = async (
  updatedEntry: UpdateEntryData,
): Promise<Entry> => {
  let response;
  if (updatedEntry.recurring) {
    [, response] = await Promise.all([
      api.put(`/entries/${updatedEntry.id}`, updatedEntry),
      api.post('/recurring_entry', {
        amount: updatedEntry.amount,
        description: updatedEntry.description,
        category_id: updatedEntry.category_id,
        frequency: updatedEntry.frequency,
        next_run: updatedEntry.next_run,
      }),
    ]);
  } else {
    response = await api.put(`/entries/${updatedEntry.id}`, updatedEntry);
  }

  return response.data;
};

export const deleteEntry = async (entryId: string): Promise<void> => {
  await api.delete(`/entries/${entryId}`);
};
