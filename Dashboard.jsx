import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import LeadsTable from '../components/LeadsTable';
import LeadForm from '../components/LeadForm';
import Analytics from '../components/Analytics';
import LeadDetail from '../components/LeadDetail';
import DashboardCharts from '../components/DashboardCharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Dashboard({ user, token, onLogout }) {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('dashboard');
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.append('status', statusFilter);
      if (sourceFilter !== 'all') query.append('source', sourceFilter);
      if (searchTerm) query.append('search', searchTerm);

      const response = await fetch(`${API_URL}/api/leads?${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data);
      setFilteredLeads(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchAnalytics();
  }, [statusFilter, sourceFilter, searchTerm, refreshKey]);

  const handleLeadCreated = () => {
    setView('list');
    setRefreshKey(prev => prev + 1);
  };

  const handleLeadUpdated = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedLead(null);
    setView('list');
  };

  const handleViewDetail = (lead) => {
    setSelectedLead(lead);
    setView('detail');
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Are you sure?')) {
      try {
        const response = await fetch(`${API_URL}/api/leads/${leadId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete lead');
        setRefreshKey(prev => prev + 1);
        alert('Lead deleted');
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>📊 Mini CRM</h2>
          <p><b>Lead Management System</b> </p>
        </div>

        <p style={{ color: '#a0aec0', fontSize: '14px', marginBottom: '30px' }}>
          Welcome, <strong style={{ color: 'white' }}>{user}</strong>
        </p>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            📋 All Leads
          </button>
          <button
            className={`nav-item ${view === 'form' ? 'active' : ''}`}
            onClick={() => setView('form')}
          >
            ➕ New Lead
          </button>
          <button
            className="nav-item"
            onClick={onLogout}
            style={{ marginTop: '20px', borderTop: '1px solid #2d3748', paddingTop: '20px' }}
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <h1>
            {view === 'dashboard' && '📊 Dashboard'}
            {view === 'list' && '📋 All Leads'}
            {view === 'form' && '➕ New Lead'}
            {view === 'detail' && '👤 Lead Details'}
          </h1>
          <div className="header-right">
            <span className="user-badge">👤 {user}</span>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          {view === 'dashboard' && (
            <div className="dashboard-view">
              <Analytics analytics={analytics} leads={leads} />

              <DashboardCharts leads={leads} />

              <div className="tables-section">
                <div className="table-card">
                  <h3>📊 Leads by Source</h3>
                  <table className="simple-table">
                    <tbody>
                      {leads.reduce((acc, lead) => {
                        const existing = acc.find(item => item.source === lead.source);
                        if (existing) {
                          existing.count += 1;
                        } else {
                          acc.push({ source: lead.source, count: 1 });
                        }
                        return acc;
                      }, []).map((item, index) => (
                        <tr key={index}>
                          <td>{item.source}</td>
                          <td className="text-right">{item.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="table-card">
                  <h3>📅 Recent Leads</h3>
                  <table className="simple-table">
                    <tbody>
                      {leads.slice(0, 5).map((lead) => (
                        <tr key={lead._id}>
                          <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                          <td className="text-right">{lead.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {view === 'list' && (
            <div className="list-view">
              <div className="list-header">
                <h2>All Leads</h2>
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filters-bar">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
                <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                  <option value="all">All Sources</option>
                  <option value="website">Website</option>
                  <option value="email">Email</option>
                  <option value="referral">Referral</option>
                  <option value="social">Social</option>
                </select>
              </div>

              {filteredLeads.length > 0 ? (
                <LeadsTable
                  leads={filteredLeads}
                  onViewDetail={handleViewDetail}
                  onDelete={handleDeleteLead}
                  token={token}
                />
              ) : (
                <p className="no-data">No leads found</p>
              )}
            </div>
          )}

          {view === 'form' && <LeadForm onSuccess={handleLeadCreated} token={token} />}

          {view === 'detail' && selectedLead && (
            <LeadDetail
              lead={selectedLead}
              onBack={() => setView('list')}
              onUpdate={handleLeadUpdated}
              token={token}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;