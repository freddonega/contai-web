import { api } from '@/api';
import {
  CurrentMonthBalanceResponse,
  DashboardData,
  MonthlyTotalsResponse,
  CategoryComparisonResponse,
  SurvivalTimeResponse,
  IncomeExpenseRatioResponse,
  TotalBalanceResponse,
  MonthlyTotalsByTypeResponse, // Add this import
} from '@/types/dashboard';

export const fetchDashboardData = async (
  year: number,
): Promise<DashboardData[]> => {
  const response = await api.get(`/dashboard/${year}`);
  return response.data;
};

export const fetchMonthlyTotals = async (
  monthYear: string,
): Promise<MonthlyTotalsResponse> => {
  const [year, month] = monthYear.split('-');
  const response = await api.get(`/dashboard/${year}/${month}/totals`);
  return response.data;
};

export const fetchCurrentMonthBalance =
  async (): Promise<CurrentMonthBalanceResponse> => {
    const response = await api.get('/dashboard/month/current');
    return response.data;
  };

export const fetchCategoryComparison =
  async (): Promise<CategoryComparisonResponse> => {
    const response = await api.get('/dashboard/category/comparison');
    return response.data;
  };

export const fetchSurvivalTime = async (): Promise<SurvivalTimeResponse> => {
  const response = await api.get('/dashboard/balance/survival');
  return response.data;
};

export const fetchIncomeExpenseRatio =
  async (): Promise<IncomeExpenseRatioResponse> => {
    const response = await api.get('/dashboard/month/current/ratio');
    return response.data;
  };

export const fetchTotalBalance = async (): Promise<TotalBalanceResponse> => {
  const response = await api.get('/dashboard/balance/total');
  return response.data;
};

export const fetchMonthlyTotalsByType = async (
  monthYear: string,
): Promise<MonthlyTotalsByTypeResponse[]> => {
  const [year, month] = monthYear.split('-');
  const response = await api.get(`/dashboard/${year}/${month}/totals_by_type`);
  return response.data;
};
