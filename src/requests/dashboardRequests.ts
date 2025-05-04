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
  try {
    const response = await api.get(`/dashboard/${year}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const fetchMonthlyTotals = async (
  monthYear: string,
): Promise<MonthlyTotalsResponse> => {
  try {
    const [year, month] = monthYear.split('-');
    const response = await api.get(`/dashboard/${year}/${month}/totals`);
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly totals:', error);
    throw error;
  }
};

export const fetchCurrentMonthBalance =
  async (): Promise<CurrentMonthBalanceResponse> => {
    try {
      const response = await api.get('/dashboard/month/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching current month balance:', error);
      throw error;
    }
  };

export const fetchCategoryComparison =
  async (): Promise<CategoryComparisonResponse> => {
    try {
      const response = await api.get('/dashboard/category/comparison');
      return response.data;
    } catch (error) {
      console.error('Error fetching category comparison:', error);
      throw error;
    }
  };

export const fetchSurvivalTime = async (): Promise<SurvivalTimeResponse> => {
  try {
    const response = await api.get('/dashboard/balance/survival');
    return response.data;
  } catch (error) {
    console.error('Error fetching survival time:', error);
    throw error;
  }
};

export const fetchIncomeExpenseRatio =
  async (): Promise<IncomeExpenseRatioResponse> => {
    try {
      const response = await api.get('/dashboard/month/current/ratio');
      return response.data;
    } catch (error) {
      console.error('Error fetching income expense ratio:', error);
      throw error;
    }
  };

export const fetchTotalBalance = async (): Promise<TotalBalanceResponse> => {
  try {
    const response = await api.get('/dashboard/balance/total');
    return response.data;
  } catch (error) {
    console.error('Error fetching total balance:', error);
    throw error;
  }
};

export const fetchMonthlyTotalsByType = async (
  monthYear: string,
): Promise<MonthlyTotalsByTypeResponse[]> => {
  try {
    const [year, month] = monthYear.split('-');
    const response = await api.get(`/dashboard/${year}/${month}/totals_by_type`);
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly totals by type:', error);
    throw error;
  }
};
