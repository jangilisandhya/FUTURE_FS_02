import React from 'react';
import '../styles/components.css';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Analytics({ analytics, leads }) {
  if (!analytics) return <p style={{ color: 'white' }}>Loading analytics...</p>;

  // Prepare chart data
  const chartData = [
    { name: 'Week 1', leads: Math.floor(analytics.totalLeads * 0.2), converted: Math.floor(analytics.converted * 0.2) },
    { name: 'Week 2', leads: Math.floor(analytics.totalLeads * 0.3), converted: Math.floor(analytics.converted * 0.3) },
    { name: 'Week 3', leads: Math.floor(analytics.totalLeads * 0.5), converted: Math.floor(analytics.converted * 0.5) },
    { name: 'Week 4', leads: analytics.totalLeads, converted: analytics.converted },
  ];

  const statusData = [
    { name: 'New', value: analytics.newLeads, fill: '#86efac' },
    { name: 'Contacted', value: analytics.contacted, fill: '#fcd34d' },
    { name: 'Converted', value: analytics.converted, fill: '#93c5fd' },
    { name: 'Lost', value: analytics.lost, fill: '#fca5a5' },
  ];

  return (
    <div className="analytics-container">
      {/* Metric Cards */}
      <div className="analytics-grid">
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>TOTAL LEADS</h3>
            <p className="metric-value">{analytics.totalLeads}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✨</div>
          <div className="metric-content">
            <h3>NEW LEADS</h3>
            <p className="metric-value">{analytics.newLeads}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📞</div>
          <div className="metric-content">
            <h3>CONTACTED</h3>
            <p className="metric-value">{analytics.contacted}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h3>CONVERTED</h3>
            <p className="metric-value">{analytics.converted}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">❌</div>
          <div className="metric-content">
            <h3>LOST</h3>
            <p className="metric-value">{analytics.lost}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <h3>CONVERSION RATE</h3>
            <p className="metric-value">{analytics.conversionRate}%</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Line Chart */}
        <div className="chart-card">
          <h3>📈 CRM Traffic Details</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="name" stroke="#a0aec0" />
              <YAxis stroke="#a0aec0" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2d3748' }}
                labelStyle={{ color: 'white' }}
              />
              <Legend />
              <Line type="monotone" dataKey="leads" stroke="#4f46e5" strokeWidth={2} />
              <Line type="monotone" dataKey="converted" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <h3>🍰 Lead Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #2d3748' }}
                labelStyle={{ color: 'white' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;