import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import "./Chart.css";

type ChartData = {
  label: string;
  value: number;
};

type ChartProps = {
  title: string;
  data: ChartData[];
};

const Chart = ({ title, data }: ChartProps) => {
  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
