import React, { useState } from 'react';
import '../styles/LoginPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { username, password }
        : { username, email, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isLogin) {
        onLogin(data.token, data.username);
      } else {
        setError('');
        setIsLogin(true);
        setUsername('');
        setEmail('');
        setPassword('');
        alert('✅ Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          {/* Header with Logo */}
<div className="login-logo-section">
  <div className="logo-badge">📊</div>
  <div className="logo-text">
    <h1>Mini CRM</h1>
    <p>Client Lead Management System</p>
  </div>
</div>

          {/* Title Section */}
          <div className="login-title-section">
            <h2>{isLogin ? '👤 Admin Login' : '📝 Create Account'}</h2>
            <p>{isLogin ? 'Access your CRM dashboard' : 'Register as admin to manage leads'}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username">👤 Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Email Field (only for register) */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="email">📧 Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  required
                />
              </div>
            )}

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">🔐 Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Error Message */}
            {error && <div className="error-message">⚠️ {error}</div>}

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span>⏳ Processing...</span>
              ) : isLogin ? (
                <span>🔓 Login Now</span>
              ) : (
                <span>✅ Create Account</span>
              )}
            </button>
          </form>

          {/* Toggle Auth Link */}
          <div className="login-toggle">
            <p>
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setIsLogin(false)}
                    className="toggle-btn"
                  >
                    Register here →
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => setIsLogin(true)}
                    className="toggle-btn"
                  >
                    Login here →
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;