import React from 'react';
import '../styles/components.css';

function LeadsTable({ leads, onViewDetail, onDelete, token }) {
  const getStatusBadge = (status) => {
    const statusClass = {
      'new': 'badge-new',
      'contacted': 'badge-contacted',
      'converted': 'badge-converted',
      'lost': 'badge-lost'
    };
    return <span className={`badge ${statusClass[status] || ''}`}>{status}</span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="table-container">
      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Status</th>
            <th>Source</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="lead-row">
              <td className="name-cell">{lead.name}</td>
              <td className="email-cell">
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </td>
              <td className="company-cell">{lead.company || '-'}</td>
              <td className="status-cell">{getStatusBadge(lead.status)}</td>
              <td className="source-cell">{lead.source}</td>
              <td className="date-cell">{formatDate(lead.createdAt)}</td>
              <td className="actions-cell">
                <button 
                  className="action-btn view-btn"
                  onClick={() => onViewDetail(lead)}
                >
                  👁️
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => onDelete(lead._id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadsTable;