import { api } from "@/api";
import { DashboardData, MonthlyTotalsResponse } from "@/types/dashboard";

export const fetchDashboardData = async (
  year: number
): Promise<DashboardData[]> => {
  const response = await api.get(`/dashboard/${year}`);
  return response.data;
};

export const fetchMonthlyTotals = async (
  monthYear: string
): Promise<MonthlyTotalsResponse> => {
  const [year, month] = monthYear.split("-");
  const response = await api.get(`/dashboard/${year}/${month}/totals`);
  return response.data;
};
