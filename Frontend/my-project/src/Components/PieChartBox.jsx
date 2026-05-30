import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

function PieChartBox({
  data,
  title,
  subtitle,
  dataKey,
  nameKey,
  badge = "Insights",
  admin = false,
}) {
  const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#14B8A6", "#F59E0B"];

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-7 h-full">
      {/* ================= HEADER ================= */}

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

      {/* ================= EMPTY STATE ================= */}

      {data?.length === 0 ? (
        <div className="h-[350px] flex items-center justify-center text-gray-500 text-sm">
          No analytics data available
        </div>
      ) : (
        /* ================= PIE CHART ================= */

        <div className={`w-full ${admin ? "h-[420px]" : "h-[350px]"}`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                innerRadius={admin ? 90 : 70}
                outerRadius={admin ? 130 : 90}
                paddingAngle={3}
                stroke="none"
                labelLine={false}
                label={
                  admin
                    ? ({ percent }) => `${(percent * 100).toFixed(0)}%`
                    : ({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data?.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              {/* ================= TOOLTIP ================= */}

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  border: "1px solid #374151",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />

              {/* ================= LEGEND ================= */}

              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{
                  color: "#9CA3AF",
                  paddingTop: "20px",
                  fontSize: "13px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default PieChartBox;
