import React, { useEffect, useState } from 'react';

const emptyForm = { name: '', membershipId: '', role: 'member', password: '' };

export default function Users({ users, currentUser, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const isAdmin = currentUser?.role === 'admin';
  useEffect(() => { if (!isAdmin) { setEditingId(null); setForm(emptyForm); } }, [isAdmin]);

  const update = (field, value) => setForm((old) => ({ ...old, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (!form.name.trim() || !form.membershipId.trim() || !form.role || !form.password) { setError('Please complete all user fields.'); return; }
    const duplicate = users.some((user) => user.membershipId.toLowerCase() === form.membershipId.trim().toLowerCase() && user.id !== editingId);
    if (duplicate) { setError('That membership ID is already registered.'); return; }
    if (editingId) onUpdate(editingId, { ...form, name: form.name.trim(), membershipId: form.membershipId.trim() });
    else onAdd({ ...form, name: form.name.trim(), membershipId: form.membershipId.trim() });
    reset();
  };

  const edit = (user) => { setEditingId(user.id); setForm({ name: user.name, membershipId: user.membershipId, role: user.role, password: user.password }); };
  const reset = () => { setEditingId(null); setForm(emptyForm); setError(''); };
  const remove = (user) => { if (user.id === currentUser.id) { setError('You cannot delete the account currently signed in.'); return; } if (window.confirm(`Delete ${user.name}?`)) onDelete(user.id); };

  return (
    <section className="page active">
      <header className="page-head"><h2>User Accounts</h2><p className="page-sub">Sign in to manage librarian and member accounts</p></header>
      {!isAdmin ? <div className="panel access-panel"><h3>Administrator access required</h3><p className="empty-note">Only admins can add, update, or delete user accounts. You are signed in as <strong>{currentUser?.role}</strong>.</p></div> : <>
        <div className="panel"><div className="panel-head"><h3>{editingId ? 'Update user details' : 'Add a new user'}</h3></div>
          <form className="index-card-form" onSubmit={submit}>
            <div className="form-row"><label htmlFor="userName">Full name</label><input id="userName" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Naledi Mokoena" required /></div>
            <div className="form-row two-col"><div><label htmlFor="userMembershipId">Membership ID</label><input id="userMembershipId" value={form.membershipId} onChange={(e) => update('membershipId', e.target.value)} placeholder="e.g. mem014" required /></div><div><label htmlFor="userRole">Role</label><select id="userRole" value={form.role} onChange={(e) => update('role', e.target.value)}><option value="member">Member</option><option value="librarian">Librarian</option><option value="admin">Admin</option></select></div></div>
            <div className="form-row"><label htmlFor="userPassword">Password</label><input id="userPassword" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Set a password" required /></div>
            <div className="form-actions"><button className="btn btn-primary" type="submit">{editingId ? 'Update user' : 'Add user'}</button>{editingId && <button className="btn btn-ghost" type="button" onClick={reset}>Cancel edit</button>}</div>
            {error && <p className="form-error">{error}</p>}
          </form>
        </div>
        <div className="panel"><div className="panel-head"><h3>Registered users</h3><span className="tag-hint">Admin view</span></div>
          <div className="table-wrap"><table className="ledger"><thead><tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Actions</th></tr></thead><tbody>
            {users.map((user) => <tr key={user.id}><td><strong>{user.name}</strong></td><td>{user.membershipId}</td><td><span className="role-badge">{user.role}</span></td><td className="actions"><button className="btn-small" type="button" onClick={() => edit(user)}>Update</button><button className="btn-small danger" type="button" onClick={() => remove(user)}>Delete</button></td></tr>)}
          </tbody></table></div>
        </div>
      </>}
    </section>
  );
}
