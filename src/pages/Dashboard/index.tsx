import { PerformanceChart } from "@/components/PerformanceChart";
import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardData,
  fetchMonthlyTotals,
} from "@/requests/dashboardRequests";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Select } from "@/components/Select";
import { useState } from "react";
import { Input } from "@/components/Input";
import { MonthlyCategoryChart } from "@/components/MonthlyCategoryChart";

export const Dashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [monthYear, setMonthYear] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", year],
    queryFn: () => fetchDashboardData(Number(year)),
  });

  const { data: monthlyTotals, isLoading: montlyIsLoading } = useQuery({
    queryKey: ["monthlyTotals", monthYear],
    queryFn: () => fetchMonthlyTotals(monthYear),
  });

  const formattedData = data?.map((item) => ({
    month: new Date(item.month + "-02").toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
    }),
    income: item.income,
    expense: item.expense,
  }));

  return (
    <>
      <div className="p-4 border-t border-gray-100 dark:border-contai-darkBlue sm:p-6">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="px-4 pt-4 sm:px-6">
              <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between ">
                <div className="flex-grow sm:w-auto">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Balanço Anual - {year}
                  </h3>
                </div>
                <div className="flex gap-2 sm:flex-grow sm:w-auto">
                  <Select
                    options={Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return { label: year.toString(), value: year.toString() };
                    })}
                    onChange={(e) => setYear(e.target.value)}
                  />
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
      <div className="p-4 border-t border-gray-100 dark:border-contai-darkBlue sm:p-6">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="px-4 pt-4 sm:px-6">
              <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-grow sm:w-auto">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Balanço Mensal por Categoria
                  </h3>
                </div>
                <div className="flex gap-2  sm:flex-grow sm:w-auto">
                  <Input
                    defaultValue={monthYear}
                    type="month"
                    onChange={(e) => setMonthYear(e.target.value)}
                  />
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
    </>
  );
};
