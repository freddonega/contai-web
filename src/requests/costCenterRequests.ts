import { api } from '@/api';

export interface CostCenter {
  id: string;
  name: string;
}

export interface GetCostCentersResponse {
  cost_centers: CostCenter[];
  total: number;
}

export interface GetCostCenterResponse {
  id: string;
  name: string;
}

export interface CreateCostCenterData {
  name: string;
}

export interface UpdateCostCenterData {
  name: string;
}

export const fetchCostCenters = async (params?: {
  page?: number;
  items_per_page?: number;
  search?: string;
  sort_by?: string[];
  sort_order?: ('asc' | 'desc')[];
}): Promise<GetCostCentersResponse> => {
  const { data } = await api.get('/cost-center', { params });
  return data;
};

export const fetchCostCenter = async (id: string): Promise<GetCostCenterResponse> => {
  const { data } = await api.get(`/cost-center/${id}`);
  return data;
};

export const createCostCenter = async (costCenterData: CreateCostCenterData): Promise<GetCostCenterResponse> => {
  const { data } = await api.post('/cost-center', costCenterData);
  return data;
};

export const updateCostCenter = async (id: string, costCenterData: UpdateCostCenterData): Promise<GetCostCenterResponse> => {
  const { data } = await api.put(`/cost-center/${id}`, costCenterData);
  return data;
};

export const deleteCostCenter = async (id: string): Promise<void> => {
  await api.delete(`/cost-center/${id}`);
}; 