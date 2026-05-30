import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function AnalyticsChart({
  data,
  title,
  subtitle,
  dataKey,
  xKey,
  badge = "Analytics",
}) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-7 h-full">
      {/* HEADER */}

      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            {title}
          </h2>

          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        </div>

        <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
          {badge}
        </div>
      </div>

      {/* EMPTY STATE */}

      {data?.length === 0 ? (
        <div className="h-[350px] flex items-center justify-center text-gray-500 text-sm">
          No analytics data available
        </div>
      ) : (
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              {/* GRID */}

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1F2937"
                vertical={false}
              />

              {/* X AXIS */}

              <XAxis
                dataKey={xKey}
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                interval={0}
                tickMargin={12}
                padding={{ left: 20, right: 20 }}
              />

              {/* Y AXIS */}

              <YAxis
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />

              {/* TOOLTIP */}

              <Tooltip
                cursor={{
                  fill: "rgba(99,102,241,0.08)",
                }}
                contentStyle={{
                  backgroundColor: "#0F172A",
                  border: "1px solid #374151",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />

              {/* BAR */}

              <Bar
                dataKey={dataKey}
                fill="#6366F1"
                radius={[12, 12, 0, 0]}
                barSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default AnalyticsChart;
