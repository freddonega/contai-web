import { ECharts, ReactEChartsProps } from '../ECharts';
import { format, graphic } from 'echarts';

interface PerformanceChartProps {
  data: {
    month: string;
    income: number;
    expense: number;
  }[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
        Nenhum dado disponível para o período selecionado
      </div>
    );
  }

  let category = [];
  let lineData = [];
  let barData = [];

  for (let i = 0; i < data.length; i++) {
    category.push(data[i].month);
    lineData.push(data[i].income);
    barData.push(data[i].expense);
  }

  // option
  const option: ReactEChartsProps['option'] = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: params => {
        if (params.length === 0) return ''; // Check if the tooltip is triggered by a click event
        const income = params[0].value;
        const expense = params[1].value;
        const month = params[0].axisValue;

        return `
           <div class="flex flex-col gap-2">
            <div>${month}</div>
            <div class="flex gap-2">
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-1">
                  <span style="display:inline-block;width:10px;height:10px;background-color:#8F96CC;border-radius:50%;"></span>
                  <span>Receita:</span>
                </div>
                <div class="flex items-center gap-1">
                  <span style="display:inline-block;width:10px;height:10px;background-color:#F08060;border-radius:50%;"></span>
                  <span>Despesa:</span>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <div>R$ ${income.toLocaleString('pt-BR')}</div>
                <div>- R$ ${expense.toLocaleString('pt-BR')}</div>
              </div>
            </div>
          </div>
        `;
      },
    },

    xAxis: {
      data: category,
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
    },
    yAxis: {
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
    },

    series: [
      {
        name: 'Receita',
        type: 'line',
        smooth: true,
        showAllSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 5,
        data: lineData,
        color: '#8F96CC',
      },
      {
        name: 'Despesa',
        type: 'bar',
        barWidth: 12,
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: new graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#F08060' },
            { offset: 1, color: '#D93C0A' },
          ]),
        },
        data: barData,
      },
      {
        name: 'Receita',
        type: 'bar',
        barGap: '-100%',
        barWidth: 10,
        itemStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(20,200,212,0)' },
            { offset: 0.2, color: 'rgba(20,200,212,0)' },
            { offset: 1, color: 'rgba(20,200,212,0)' },
          ]),
        },
        z: -12,
        data: lineData,
      },
      {
        name: 'dotted',
        type: 'pictorialBar',
        symbol: 'rect',
        itemStyle: {
          color: '#8F96CC',
        },
        symbolRepeat: true,
        symbolSize: [10, 4],
        symbolMargin: 1,
        z: -10,
        data: lineData,
      },
    ],
  };

  return <ECharts option={option} style={{ height: '400px' }} />;
};
