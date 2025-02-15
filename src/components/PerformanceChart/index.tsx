import { ECharts, ReactEChartsProps } from "../ECharts";

interface PerformanceChartProps {
  data: {
    month: string;
    income: number;
    expense: number;
  }[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const option: ReactEChartsProps["option"] = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params) => {
        const income = params[0].value;
        const expense = params[1].value;
        const month = params[0].axisValue;

        return `
          <div class="flex flex-col gap-2">
            <div>${month}</div>
            <div class="flex gap-2">
              <div class="flex flex-col gap-1">
          <div class="flex items-center gap-1">
            <span style="display:inline-block;width:10px;height:10px;background-color:#21264A;border-radius:50%;"></span>
            <span>Receita:</span>
          </div>
          <div class="flex items-center gap-1">
            <span style="display:inline-block;width:10px;height:10px;background-color:#D93C0A;border-radius:50%;"></span>
            <span>Despesa:</span>
          </div>
              </div>
              <div class="flex flex-col gap-1">
          <div>R$ ${income.toLocaleString("pt-BR")}</div>
          <div>- R$ ${expense.toLocaleString("pt-BR")}</div>
              </div>
            </div>
          </div>
        `;
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
        zoomOnMouseWheel: "ctrl",
        zoomLock: true,
      },
    ],

    legend: {
      top: "bottom",
      data: ["Intention"],
    },

    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      containLabel: true,
    },

    xAxis: {
      data: data.map((item) => item.month),
      label: {
        show: true,

        backgroundColor: "#7581BD",
      },
      axisPointer: {
        value: "2016-10-7",
        snap: true,
        lineStyle: {
          color: "#7581BD",
          width: 2,
        },
        label: {
          show: true,

          backgroundColor: "#7581BD",
        },
        handle: {
          show: false,
          color: "#7581BD",
        },
      },
    },
    yAxis: {},
    series: [
      {
        name: "Receita",
        type: "bar",
        data: data.map((item) => item.income),

        color: "#21264A",

        large: true,
        label: {
          show: true,
          position: "top",
          fontSize: 9,
          fontWeight: "normal",
          color: "#fff",
          formatter: (params) => {
            return `R$ ${params.value.toLocaleString("pt-BR")}`;
          },
        },
      },
      {
        name: "Despesa",
        type: "bar",
        barGap: "-100%",
        data: data.map((item) => item.expense),

        color: "#8F96CC",
        label: {
          show: true,
          position: "insideBottom",
          width: 50,
          distance: 10,
          overflow: "truncate",
          rich: {
            percentage_green: {
              fontSize: 14,
              color: "#0AD966",
              fontWeight: "bold",
            },
            percentage_red: {
              fontSize: 14,
              color: "#FF5C5C",
              fontWeight: "bold",
            },
            value: {
              fontSize: 9,
              color: "#fff",
            },
          },
          formatter: (params) => {
            const incomeValue = option.series[0].data[params.dataIndex];
            const percentage = (
              incomeValue !== 0
                ? (Number(params.value) / Number(incomeValue)) * 100
                : 0
            ).toFixed(0);

            if (Number(percentage) < 70) {
              return `{percentage_green|${percentage}%}\n{value|- R$ ${params.value.toLocaleString(
                "pt-BR"
              )}}`;
            } else {
              return `{percentage_red|${percentage}%}\n{value|- R$ ${params.value.toLocaleString(
                "pt-BR"
              )}}`;
            }
          },
        },
      },
    ],
  };

  return <ECharts option={option} style={{ height: "400px" }} />;
};
