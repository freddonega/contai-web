import {
  CurrentMonthBalanceResponse,
  TotalBalanceResponse,
} from '@/types/dashboard';
import { useEffect, useState } from 'react';
import {
  FaArrowDown,
  FaArrowTrendUp,
  FaArrowUp,
  FaEquals,
  FaMoneyBillTrendUp,
} from 'react-icons/fa6';

interface BalanceProps {
  month_balance: CurrentMonthBalanceResponse;
  total_balance: TotalBalanceResponse;
}

export const CurrentBalances = ({
  month_balance,
  total_balance,
}: BalanceProps) => {
  const [resultMonth, setResultMonth] = useState({
    currentMonthBalance: 0,
    percentageChange: 0,
  });

  const [resultTotal, setResultTotal] = useState({
    totalBalance: 0,
  });

  useEffect(() => {
    if (month_balance) {
      setResultMonth(month_balance);
    }
  }, [month_balance]);

  useEffect(() => {
    if (total_balance) {
      setResultTotal(total_balance);
    }
  }, [total_balance]);
  return (
    <div className="grid col-span-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <FaMoneyBillTrendUp className="text-3xl" />
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Balanço Total
            </span>
            <h4
              className={`mt-2 font-bold  ${
                resultTotal.totalBalance >= 0
                  ? 'text-contai-green'
                  : 'text-contai-red'
              } 
            }`}
            >
              {resultTotal.totalBalance.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </h4>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <FaArrowTrendUp className="text-3xl" />
        <div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Balanço de {new Date().toLocaleString('pt-BR', { month: 'long' })}
            </span>
            <h4
              className={`mt-2 font-bold text-md  ${
                resultMonth.currentMonthBalance >= 0
                  ? 'text-contai-green'
                  : 'text-contai-red'
              } 
            }`}
            >
              {resultMonth.currentMonthBalance.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </h4>
          </div>
          <span className="inline-flex items-center py-0.5 justify-center gap-1 rounded-full font-medium text-sm bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
            {resultMonth.percentageChange > 0 ? (
              <FaArrowUp className="text-sm text-contai-green" />
            ) : resultMonth.percentageChange < 0 ? (
              <FaArrowDown className="text-sm text-contai-red" />
            ) : (
              <FaEquals className="text-sm text-contai-lightBlue" />
            )}
            {resultMonth.percentageChange.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};
