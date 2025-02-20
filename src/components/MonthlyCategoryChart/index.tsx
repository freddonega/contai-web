import { graphic } from "echarts";
import { ECharts, ReactEChartsProps } from "../ECharts";
import { MonthlyTotal } from "@/types/dashboard";

interface ChartProps {
  data: MonthlyTotal[];
}

export const MonthlyCategoryChart = ({ data }: ChartProps) => {
  const option: ReactEChartsProps["option"] = {
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },

      formatter: (params: any) => {
        const total = params[0].value;
        const category = params[0].axisValue;

        const color =
          data[params[0].dataIndex].type === "income" ? "#0AD966" : "#D93C0A";
        return `
        <div class="flex flex-col gap-2">
        <div>${category}</div>
        <div class="flex gap-2">
          <div class="flex flex-col gap-1">
          <div class="flex items-center gap-1">
            <span style="display:inline-block;width:10px;height:10px;background-color:${color};border-radius:50%;"></span>
            <span>${
              data[params[0].dataIndex].type === "income"
                ? "Receita"
                : "Despesa"
            }:</span>
          </div>
          </div>
          <div class="flex flex-col gap-1">
          <div> ${
            data[params[0].dataIndex].type === "expense" ? "-" : ""
          } R$ ${total.toLocaleString("pt-BR")}</div>
          </div>
        </div>
        </div>
      `;
      },
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: data.map((item) => item.category_name),
    },
    series: [
      {
        data: data.map((item) => item.total),
        type: "bar",
        barWidth: 10,
        itemStyle: {
          borderRadius: [0, 5, 5, 0],
          color: (params: any) =>
            data[params.dataIndex].type === "income"
              ? new graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: "#4AE88A" },
                  { offset: 1, color: "#0AD966" },
                ])
              : new graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: "#F08060" },
                  { offset: 1, color: "#D93C0A" },
                ]),
        },
      },
    ],
  };

  return <ECharts option={option} style={{ height: "400px" }} />;
};
