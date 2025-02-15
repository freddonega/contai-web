export interface DashboardData {
  month: string;
  income: number;
  expense: number;
}

export interface MonthlyTotal {
  category_id: number;
  category_name: string;
  type: "income" | "expense";
  total: number;
}

export interface MonthlyTotalsResponse {
  year: number;
  month: number;
  totals: MonthlyTotal[];
}
