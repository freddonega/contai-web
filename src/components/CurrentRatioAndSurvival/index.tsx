import {
  IncomeExpenseRatioResponse,
  SurvivalTimeResponse,
} from '@/types/dashboard';
import { useState, useEffect } from 'react';
import { FaBalanceScale } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa6';

interface CurrentRatioAndSurvivalProps {
  survivalTime: SurvivalTimeResponse;
  incomeExpenseRatio: IncomeExpenseRatioResponse;
}

export const CurrentRatioAndSurvival = ({
  survivalTime,
  incomeExpenseRatio,
}: CurrentRatioAndSurvivalProps) => {
  const [result, setResult] = useState({
    survivalTime: 0,
    textColorSurvivalTime: '',
    incomeExpenseRatio: 0,
    textColorIncomeExpenseRatio: '',
  });

  useEffect(() => {
    if (typeof survivalTime?.survivalTime === 'number') {
      setResult(prevState => ({
        ...prevState,
        survivalTime: survivalTime.survivalTime,
        textColorSurvivalTime:
          survivalTime.survivalTime > 6
            ? 'text-green-500'
            : survivalTime.survivalTime > 3
            ? 'text-yellow-500'
            : survivalTime.survivalTime > 1
            ? 'text-orange-500'
            : 'text-red-500',
      }));
    }

    if (typeof incomeExpenseRatio?.ratio === 'number') {
      setResult(prevState => ({
        ...prevState,
        incomeExpenseRatio: incomeExpenseRatio.ratio,
        textColorIncomeExpenseRatio:
          incomeExpenseRatio.ratio > 1.0
            ? 'text-green-500'
            : incomeExpenseRatio.ratio === 1.0
            ? 'text-yellow-500'
            : 'text-red-500',
      }));
    }
  }, [survivalTime, incomeExpenseRatio]);
  return (
    <div className="grid col-span-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <FaClock className="text-3xl" />
        <div className="flex  justify-between mt-5 flex-wrap">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sobrevivência
            </span>
            <h4
              className={`mt-2 font-bold  text-title-sm ${result.textColorSurvivalTime} `}
            >
              {result.survivalTime.toFixed(0)} meses
            </h4>
            <p className="text-xs mt-2">
              {result.survivalTime === Infinity
                ? 'Sem Gastos (ou não calculável) ⚪'
                : result.survivalTime > 6
                ? 'Financeiramente Seguro 🟢'
                : result.survivalTime > 3
                ? 'Confortável 🟡'
                : result.survivalTime > 1
                ? 'Atenção 🟠'
                : 'Crítico 🔴'}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <FaBalanceScale className="text-3xl" />
        <div className="flex  justify-between mt-5 flex-wrap">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Razão de Receitas e Despesas
            </span>
            <h4
              className={`mt-2 font-bold  text-title-sm ${result.textColorIncomeExpenseRatio} `}
            >
              {result.incomeExpenseRatio.toFixed(2)}{' '}
            </h4>
            <p
              className={`mt-2 text-xs ${result.textColorIncomeExpenseRatio} `}
            >
              {result.incomeExpenseRatio > 1.0
                ? 'Superavitário (Receitas cobrem as despesas)'
                : result.incomeExpenseRatio === 1.0
                ? 'Equilibrado (Receitas e despesas são iguais)'
                : 'Deficitário (Gastos maiores que receitas)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
