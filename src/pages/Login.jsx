import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [membershipId, setMembershipId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    setError('');
    const result = onLogin(membershipId.trim(), password);
    if (!result.success) setError(result.message);
  };

  return (
    <div className="auth-gate">
      <div className="auth-card">
        <div className="auth-icon">TL</div>
        <h2>Thornfield Library</h2>
        <p className="auth-sub">Sign in to manage the collection</p>
        <form className="index-card-form narrow" onSubmit={submit}>
          <div className="form-row">
            <label htmlFor="loginId">Membership ID</label>
            <input id="loginId" value={membershipId} onChange={(e) => setMembershipId(e.target.value)} required />
          </div>
          <div className="form-row">
            <label htmlFor="loginPassword">Password</label>
            <input id="loginPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary auth-submit" type="submit">Sign in</button>
          </div>
          {error && <p className="form-error">{error}</p>}
        </form>
        <p className="auth-hint">Default admin — ID: <strong></strong> · Password: <strong></strong></p>
      </div>
    </div>
  );
}
