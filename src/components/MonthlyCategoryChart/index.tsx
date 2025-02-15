import React, { useEffect, useRef } from "react";
import { ECharts, ReactEChartsProps } from "../ECharts";
import { MonthlyTotal } from "@/types/dashboard";

interface ChartProps {
  data: MonthlyTotal[];
}

export const MonthlyCategoryChart: React.FC<ChartProps> = ({ data }) => {
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
          data[params[0].dataIndex].type === "income" ? "green" : "red";
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
            data[params[0].dataIndex].type === "expense" && "-"
          } R$ ${total.toLocaleString("pt-BR")}</div>
          </div>
        </div>
        </div>
      `;
      },
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.category_name),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: data.map((item) => item.total),
        type: "bar",
        itemStyle: {
          color: (params: any) =>
            data[params.dataIndex].type === "income" ? "green" : "red",
        },
      },
    ],
  };

  return <ECharts option={option} style={{ height: "400px" }} />;
};
