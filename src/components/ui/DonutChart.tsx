import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  value: number;
  total: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ value, total }) => {
  const data = [
    { name: "Completed", value: value },
    { name: "Remaining", value: total - value },
  ];
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            cornerRadius={10}
          >
            <Cell fill="#5C4033" />
            <Cell fill="#D5BFA8" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-brand-text-primary">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default DonutChart;
