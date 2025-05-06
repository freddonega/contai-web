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
  try {
    const response = await api.get('/entries', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching entries:', error);
    throw error;
  }
};

export const fetchEntry = async (entryId: string): Promise<Entry> => {
  try {
    const response = await api.get(`/entries/${entryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching entry:', error);
    throw error;
  }
};

export const createEntry = async (
  newEntry: CreateEntryData,
): Promise<Entry> => {
  try {
    let response;
    if (newEntry.recurring) {
      [, response] = await Promise.all([
        api.post('/entries', newEntry),
        api.post('/recurring_entry', {
          amount: newEntry.amount,
          description: newEntry.description,
          category_id: newEntry.category_id,
          payment_type_id: newEntry.payment_type_id,
          frequency: newEntry.frequency,
          next_run: newEntry.next_run,
          last_run: newEntry.last_run,
        }),
      ]);
    } else {
      response = await api.post('/entries', newEntry);
    }

    return response.data;
  } catch (error) {
    console.error('Error creating entry:', error);
    throw error;
  }
};

export const updateEntry = async (
  updatedEntry: UpdateEntryData,
): Promise<Entry> => {
  try {
    let response;
    if (updatedEntry.recurring) {
      [, response] = await Promise.all([
        api.put(`/entries/${updatedEntry.id}`, updatedEntry),
        api.post('/recurring_entry', {
          amount: updatedEntry.amount,
          description: updatedEntry.description,
          category_id: updatedEntry.category_id,
          payment_type_id: updatedEntry.payment_type_id,
          frequency: updatedEntry.frequency,
          next_run: updatedEntry.next_run,
          last_run: updatedEntry.last_run,
        }),
      ]);
    } else {
      response = await api.put(`/entries/${updatedEntry.id}`, updatedEntry);
    }

    return response.data;
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
};

export const deleteEntry = async (entryId: string): Promise<void> => {
  try {
    await api.delete(`/entries/${entryId}`);
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
};
