export interface DashboardData {
  month: string;
  income: number;
  expense: number;
}

export interface MonthlyTotal {
  category_id: number;
  category_name: string;
  type: 'income' | 'expense';
  total: number;
}

export interface MonthlyTotalsResponse {
  year: number;
  month: number;
  totals: MonthlyTotal[];
}

export interface CurrentMonthBalanceResponse {
  currentMonthBalance: number;
  previousMonthBalance: number;
  percentageChange: number;
}

export interface CategoryComparisonResponse {
  highestIncome: {
    category: string;
    amount: number;
    percentageChange: number;
  };
  highestExpense: {
    category: string;
    amount: number;
    percentageChange: number;
  };
}

export interface SurvivalTimeResponse {
  survivalTime: number;
}

export interface IncomeExpenseRatioResponse {
  ratio: number;
}

export interface TotalBalanceResponse {
  totalBalance: number;
}

export interface MonthlyTotalsByTypeResponse {
  payment_type_name: string;
  total: number;
}
