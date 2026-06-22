import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

function DashboardCharts({ leads = [] }) {
  // Status Chart Data
  const statusData = [
    {
      name: "New",
      value: leads.filter((l) => l.status === "new").length,
    },
    {
      name: "Contacted",
      value: leads.filter((l) => l.status === "contacted").length,
    },
    {
      name: "Converted",
      value: leads.filter((l) => l.status === "converted").length,
    },
    {
      name: "Lost",
      value: leads.filter((l) => l.status === "lost").length,
    },
  ];

  // Source Pie Data
  const sourceMap = {};
  leads.forEach((lead) => {
    const source = lead.source || "Other";
    sourceMap[source] = (sourceMap[source] || 0) + 1;
  });

  const sourceData = Object.keys(sourceMap).map((key) => ({
    name: key,
    value: sourceMap[key],
  }));

  // Monthly Data
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyCounts = new Array(12).fill(0);
  leads.forEach((lead) => {
    if (lead.createdAt) {
      const month = new Date(lead.createdAt).getMonth();
      monthlyCounts[month]++;
    }
  });

  const monthlyData = months.map((month, index) => ({
    month,
    leads: monthlyCounts[index],
  }));

  return (
    <div className="dashboard-charts">
      {/* Bar Chart */}
      <div className="chart-card">
        <h3>📊 Lead Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="name" stroke="#a0aec0" />
            <YAxis stroke="#a0aec0" />
            <Tooltip contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2d3748' }} />
            <Legend />
            <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="chart-card">
        <h3>🥧 Lead Sources</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sourceData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {sourceData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2d3748' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="chart-card">
        <h3>📈 Monthly Leads</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="month" stroke="#a0aec0" />
            <YAxis stroke="#a0aec0" />
            <Tooltip contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2d3748' }} />
            <Legend />
            <Line type="monotone" dataKey="leads" stroke="#10B981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart */}
      <div className="chart-card">
        <h3>📉 Lead Growth Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorLead" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="month" stroke="#a0aec0" />
            <YAxis stroke="#a0aec0" />
            <Tooltip contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2d3748' }} />
            <Legend />
            <Area type="monotone" dataKey="leads" stroke="#3B82F6" fill="url(#colorLead)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardCharts;