import { PerformanceChart } from '@/components/PerformanceChart';
import { useQuery } from '@tanstack/react-query';
import {
  fetchCurrentMonthBalance,
  fetchDashboardData,
  fetchMonthlyTotals,
  fetchCategoryComparison,
  fetchSurvivalTime,
  fetchIncomeExpenseRatio,
  fetchTotalBalance,
  fetchMonthlyTotalsByType,
} from '@/requests/dashboardRequests';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Select } from '@/components/Select';
import { useState } from 'react';
import { Input } from '@/components/Input';
import { MonthlyCategoryChart } from '@/components/MonthlyCategoryChart';
import { CurrentBalances } from '@/components/CurrentBalances';
import { CurrentMonthCategoryBalance } from '@/components/CurrentMonthCategoryBalance';
import { CurrentRatioAndSurvival } from '@/components/CurrentRatioAndSurvival';
import { set } from 'react-hook-form';
import { PaymentTypeCart } from '@/components/PaymentTypeCart';

export const Dashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [monthYear, setMonthYear] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', year],
    queryFn: () => fetchDashboardData(Number(year)),
  });

  const { data: monthlyTotals, isLoading: montlyIsLoading } = useQuery({
    queryKey: ['monthlyTotals', monthYear],
    queryFn: () => fetchMonthlyTotals(monthYear),
  });

  const { data: currentMonthBalance } = useQuery({
    queryKey: ['currentMonthBalance'],
    queryFn: () => fetchCurrentMonthBalance(),
  });

  const { data: categoryComparison } = useQuery({
    queryKey: ['categoryComparison'],
    queryFn: () => fetchCategoryComparison(),
  });

  const { data: survivalTime } = useQuery({
    queryKey: ['survivalTime'],
    queryFn: () => fetchSurvivalTime(),
  });

  const { data: incomeExpenseRatio } = useQuery({
    queryKey: ['incomeExpenseRatio'],
    queryFn: () => fetchIncomeExpenseRatio(),
  });

  const { data: totalBalance } = useQuery({
    queryKey: ['totalBalance'],
    queryFn: () => fetchTotalBalance(),
  });

  const { data: monthlyTotalsByType, isLoading: monthlyTotalsByTypeLoading } =
    useQuery({
      queryKey: ['monthlyTotalsByType', monthYear],
      queryFn: () => fetchMonthlyTotalsByType(monthYear),
    });

  const formattedData = data?.map(item => {
    const monthDate = new Date(item.month + '-02');
    const monthName = monthDate
      .toLocaleDateString('pt-BR', { month: 'short' })
      .replace('.', '');
    return {
      month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      income: item.income,
      expense: item.expense,
    };
  });

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="flex gap-2 col-span-12  sm:flex-grow sm:w-auto">
        <Input
          defaultValue={monthYear}
          type="month"
          onChange={e => {
            setMonthYear(e.target.value);
            setYear(e.target.value.slice(0, 4));
          }}
        />
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          <CurrentBalances
            month_balance={currentMonthBalance}
            total_balance={totalBalance}
          />
          <CurrentMonthCategoryBalance data={categoryComparison} />
        </div>
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-6">
        <CurrentRatioAndSurvival
          survivalTime={survivalTime}
          incomeExpenseRatio={incomeExpenseRatio}
        />
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-6">
        <div className="border-t border-gray-100 dark:border-contai-darkBlue">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="px-4 pt-4 sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between ">
                  <div className="flex-grow sm:w-auto">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      Balanço Anual - {year}
                    </h3>
                  </div>
                </div>
                <div className="relative p-10">
                  {isLoading ? (
                    <Skeleton
                      height={300}
                      baseColor="#333A48"
                      highlightColor="#24303F"
                    />
                  ) : (
                    <PerformanceChart data={formattedData} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-6">
        <div className="border-t border-gray-100 dark:border-contai-darkBlue">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="px-4 pt-4 sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-grow sm:w-auto">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      Balanço Mensal por Categoria
                    </h3>
                  </div>
                </div>
                <div className="relative p-10">
                  {montlyIsLoading ? (
                    <Skeleton
                      height={300}
                      baseColor="#333A48"
                      highlightColor="#24303F"
                    />
                  ) : (
                    <MonthlyCategoryChart data={monthlyTotals?.totals} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 grid lg:grid-cols-4 gap-6">
        {monthlyTotalsByType?.map((paymentType, key) => (
          <div key={key}>
            <PaymentTypeCart {...paymentType} />
          </div>
        ))}
      </div>
    </div>
  );
};
