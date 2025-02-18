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
        if (params.length === 0) return ""; // Check if the tooltip is triggered by a click event
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
      left: 10,
      right: 0,
      bottom: 0,
      top: 0,
      containLabel: true,
      lineStyle: {
        color: "#7581BD",
      },
    },

    xAxis: {
      splitLine: {
        lineStyle: {
          color: "#7581BD",
        },
      },
      type: "value",
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
    yAxis: {
      type: "category",
      data: data.map((item) => item.month),
      lineStyle: {
        color: "#7581BD",
      },
    },
    series: [
      {
        name: "Receita",
        type: "bar",
        data: data.map((item) => item.income),

        color: "#21264A",

        large: true,
        label: {
          show: true,
          position: "insideRight",
          fontSize: 12,
          fontWeight: "bold",
          color: "#fff",
          formatter: (params) => {
            if (window.innerWidth < 1024) {
              return "";
            }
            const incomeValue = option.series[0].data[params.dataIndex];
            const percentage = (
              incomeValue !== 0
                ? (Number(params.value) / Number(incomeValue)) * 100
                : 0
            ).toFixed(0);

            if (Number(percentage) < 70) {
              return `{value|- R$ ${params.value.toLocaleString(
                "pt-BR"
              )}} {percentage_green|${percentage}%} `;
            } else {
              return ` {value|- R$ ${params.value.toLocaleString(
                "pt-BR"
              )}} {percentage_red|${percentage}%}`;
            }
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
          position: "insideLeft",
          distance: 10,
          overflow: "truncate",

          rich: {
            percentage_green: {
              fontSize: 10,
              color: "#171C36",
              fontWeight: "bold",
            },
            percentage_red: {
              fontSize: 10,
              color: "#FF5C5C",
              fontWeight: "bold",
            },
            value: {
              fontSize: 12,
              fontWeight: "bold",
              color: "#fff",
            },
          },
          formatter: (params) => {
            if (window.innerWidth < 1024) {
              return "";
            }

            const incomeValue = option.series[0].data[params.dataIndex];
            const percentage = (
              incomeValue !== 0
                ? (Number(params.value) / Number(incomeValue)) * 100
                : 0
            ).toFixed(0);

            if (Number(percentage) < 70) {
              return `{value|- R$ ${params.value.toLocaleString(
                "pt-BR"
              )}} {percentage_green|${percentage}%} `;
            } else {
              return ` {value|- R$ ${params.value.toLocaleString(
                "pt-BR"
              )}} {percentage_red|${percentage}%}`;
            }
          },
        },
      },
    ],
    media: [
      {
        query: {
          maxWidth: 600,
        },
        option: {
          series: [
            {
              label: {
                show: false,
              },
            },
            {
              label: {
                show: false,
              },
            },
          ],
        },
      },
    ],
  };

  return <ECharts option={option} style={{ height: "400px" }} />;
};
