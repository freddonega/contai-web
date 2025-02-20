import { CategoryComparisonResponse } from '@/types/dashboard';
import { useEffect, useState } from 'react';
import {
  FaArrowDown,
  FaArrowTrendUp,
  FaArrowUp,
  FaEquals,
} from 'react-icons/fa6';

interface CurrentMonthCategoryBalanceProps {
  data: CategoryComparisonResponse;
}

export const CurrentMonthCategoryBalance = ({
  data,
}: CurrentMonthCategoryBalanceProps) => {
  const [result, setResult] = useState({
    highestIncome: {
      category: '-',
      amount: 0,
      percentageChange: 0,
    },
    highestExpense: {
      category: '-',
      amount: 0,
      percentageChange: 0,
    },
  });

  useEffect(() => {
    if (data?.highestExpense?.category && data?.highestIncome?.category) {
      setResult(data);
    }
  }, [data]);
  return (
    <div className="grid col-span-1 gap-4 sm:grid-cols-2 md:gap-6">
      <BalanceWidget result={result.highestIncome} type={'income'} />
      <BalanceWidget result={result.highestExpense} type={'expense'} />
    </div>
  );
};

interface CurrentMonthCategoryBalanceProps {}

const BalanceWidget = ({ result, type }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      {type === 'income' ? (
        <FaArrowUp className="text-3xl" />
      ) : (
        <FaArrowDown className="text-3xl" />
      )}
      <div className="flex  justify-between mt-5 flex-wrap">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {result.category}
          </span>
          <h4
            className={`mt-2 font-bold  text-md ${
              type === 'income' ? 'text-contai-green' : 'text-contai-red'
            } `}
          >
            {type === 'expense' ? '- ' : ''}
            {result.amount.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </h4>
        </div>
        <span className="inline-flex items-center py-0.5 justify-center gap-1 rounded-full font-medium text-sm bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
          {result.percentageChange > 0 ? (
            <FaArrowUp className="text-sm text-contai-green" />
          ) : result.percentageChange < 0 ? (
            <FaArrowDown className="text-sm text-contai-red" />
          ) : (
            <FaEquals className="text-sm text-contai-lightBlue" />
          )}
          {result.percentageChange.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};
