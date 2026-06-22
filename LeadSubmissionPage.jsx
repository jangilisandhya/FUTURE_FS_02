import React, { useState } from 'react';
import '../styles/LeadSubmissionPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function LeadSubmissionPage({ onAdminClick }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'website',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to submit lead');

      setSuccess('✅ Lead submitted successfully! We\'ll reach out soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        source: '',
        notes: ''
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submission-wrapper">
      <div className="submission-container">
        <div className="submission-card">
          {/* Logo Section */}
<div className="submission-logo-section">
  <div className="logo-badge">📊</div>
  <div className="logo-text">
    <h1>Mini CRM</h1>
    <p>Lead Submission</p>
  </div>
</div>
          

          {/* Title Section */}
          <div className="submission-title-section">
            <h2>📋 Contact Us</h2>
            <p>Share your details and we'll reach out to you as soon as possible</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="submission-form">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">
                <span className="emoji">👤</span>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="User1"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                <span className="emoji">📧</span>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@gmail.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">
                <span className="emoji">☎️</span>
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Source */}
            <div className="form-group">
              <label htmlFor="source">
                <span className="emoji">🔗</span>
                How did you hear about us?
              </label>
              <select 
                id="source"
                name="source" 
                value={formData.source}
                onChange={handleChange}
              >
                <option value="website">🌐 Website</option>
                <option value="email">📧 Email</option>
                <option value="referral">🤝 Referral</option>
                <option value="social">📱 Social Media</option>
                <option value="google">🔍 Google Search</option>
                <option value="linkedin">💼 LinkedIn</option>
                <option value="facebook">👍 Facebook</option>
                <option value="event">🎤 Event/Conference</option>
                <option value="other">❓ Other</option>
              </select>
            </div>

          

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Success Message */}
            {success && <div className="success-message">{success}</div>}

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '⏳ Submitting...' : '✉️ Submit Lead'}
            </button>
          </form>

          {/* Admin Login Link */}
          <div className="admin-link-section">
            <p>
              Are you an admin?{' '}
              <button 
                onClick={onAdminClick}
                className="admin-link"
              >
                Admin login →
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadSubmissionPage;