import React, { useState } from 'react';
import '../styles/components.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function LeadDetail({ lead, onBack, onUpdate, token }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone || '',
    company: lead.company || '',
    status: lead.status,
    notes: lead.notes || ''
  });
  const [followUpNote, setFollowUpNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/leads/${lead._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update lead');

      setIsEditing(false);
      alert('Lead updated successfully!');
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpNote.trim()) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/leads/${lead._id}/followup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note: followUpNote })
      });

      if (!response.ok) throw new Error('Failed to add follow-up');

      setFollowUpNote('');
      alert('Follow-up added successfully!');
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="lead-detail">
      <button className="back-btn" onClick={onBack}>← Back to Leads</button>

      <div className="detail-container">
        <div className="detail-main">
          <h2>{lead.name}</h2>
          
          {isEditing ? (
            <form onSubmit={handleUpdate} className="detail-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="button-group">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="detail-info">
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Email:</span>
                  <a href={`mailto:${lead.email}`}>{lead.email}</a>
                </div>
                {lead.phone && (
                  <div className="info-item">
                    <span className="label">Phone:</span>
                    <span>{lead.phone}</span>
                  </div>
                )}
                {lead.company && (
                  <div className="info-item">
                    <span className="label">Company:</span>
                    <span>{lead.company}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="label">Status:</span>
                  <span className={`badge badge-${lead.status}`}>{lead.status}</span>
                </div>
                <div className="info-item">
                  <span className="label">Source:</span>
                  <span>{lead.source}</span>
                </div>
                <div className="info-item">
                  <span className="label">Created:</span>
                  <span>{formatDate(lead.createdAt)}</span>
                </div>
              </div>

              {lead.notes && (
                <div className="notes-section">
                  <h3>Notes</h3>
                  <p>{lead.notes}</p>
                </div>
              )}

              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Lead
              </button>
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          <div className="followup-section">
            <h3>📌 Add Follow-Up</h3>
            <form onSubmit={handleAddFollowUp}>
              <textarea
                value={followUpNote}
                onChange={(e) => setFollowUpNote(e.target.value)}
                placeholder="Write a follow-up note..."
                rows="4"
              />
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Adding...' : 'Add Follow-Up'}
              </button>
            </form>

            {lead.followUps && lead.followUps.length > 0 && (
              <div className="followups-list">
                <h3>📋 Follow-Ups</h3>
                {lead.followUps.map((followUp, index) => (
                  <div key={index} className="followup-item">
                    <div className="followup-date">{formatDate(followUp.date)}</div>
                    <div className="followup-note">{followUp.note}</div>
                    <div className="followup-by">By: {followUp.createdBy}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetail;