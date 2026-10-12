import React,{ useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Transactions from './pages/Transactions';
import Users from './pages/Users';
import { LOW_STOCK_THRESHOLD, STORAGE_KEYS, makeId, readSession, readStorage, seedBooks, seedUsers, writeSession, writeStorage } from './utils/storage';

function ProtectedRoute({ currentUser, children }) {
  return currentUser ? children : <Navigate to="/login" replace />;
}

function AppRoutes({ currentUser, books, transactions, users, handlers, toast }) {
  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Login onLogin={handlers.login} />} />
      <Route path="/" element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />} />
      <Route path="/*" element={<ProtectedRoute currentUser={currentUser}><Layout currentUser={currentUser} onLogout={handlers.logout} toast={toast} /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard books={books} />} />
        <Route path="books" element={<Books books={books} onAdd={handlers.addBook} onUpdate={handlers.updateBook} onDelete={handlers.deleteBook} />} />
        <Route path="transactions" element={<Transactions books={books} transactions={transactions} onTransaction={handlers.recordTransaction} />} />
        <Route path="users" element={<Users users={users} currentUser={currentUser} onAdd={handlers.addUser} onUpdate={handlers.updateUser} onDelete={handlers.deleteUser} />} />
      </Route>
      <Route path="*" element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  const [books, setBooks] = useState(() => readStorage(STORAGE_KEYS.books, null) || seedBooks());
  const [transactions, setTransactions] = useState(() => readStorage(STORAGE_KEYS.transactions, []));
  const [users, setUsers] = useState(() => readStorage(STORAGE_KEYS.users, null) || seedUsers());
  const [currentUser, setCurrentUser] = useState(readSession);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { writeStorage(STORAGE_KEYS.books, books); }, [books]);
  useEffect(() => { writeStorage(STORAGE_KEYS.transactions, transactions); }, [transactions]);
  useEffect(() => { writeStorage(STORAGE_KEYS.users, users); }, [users]);
  useEffect(() => { if (currentUser) writeSession(currentUser); else writeSession(null); }, [currentUser]);

  useEffect(() => {
    if (location.pathname === '/login' && currentUser) navigate('/dashboard', { replace: true });
  }, [currentUser, location.pathname, navigate]);

  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  }, []);

  const login = useCallback((membershipId, password) => {
    const user = users.find((item) => item.membershipId === membershipId && item.password === password);
    if (!user) return { success: false, message: 'Membership ID or password is incorrect.' };
    setCurrentUser(user);
    notify('Signed in successfully');
    navigate('/dashboard', { replace: true });
    return { success: true };
  }, [users, navigate, notify]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    notify('Signed out');
  }, [notify]);

  const addBook = useCallback((book) => {
    setBooks((old) => [...old, { ...book, id: makeId(), quantity: Number(book.quantity) }]);
    notify('Book added to catalog');
  }, [notify]);

  const updateBook = useCallback((id, data) => {
    setBooks((old) => old.map((book) => book.id === id ? { ...book, ...data, quantity: Number(data.quantity) } : book));
    notify('Book updated');
  }, [notify]);

  const deleteBook = useCallback((id) => {
    setBooks((old) => old.filter((book) => book.id !== id));
    notify('Book deleted');
  }, [notify]);

  const recordTransaction = useCallback((bookId, type, qty) => {
    const book = books.find((item) => item.id === bookId);
    if (!book) return;
    const newBalance = book.quantity + (type === 'add' ? qty : -qty);
    setBooks((old) => old.map((item) => item.id === bookId ? { ...item, quantity: newBalance } : item));
    setTransactions((old) => [{ id: makeId(), bookId, bookTitle: book.title, type, qty, balanceAfter: newBalance, date: new Date().toISOString() }, ...old]);
    notify(type === 'add' ? 'Stock added' : 'Stock deducted');
  }, [books, notify]);

  const addUser = useCallback((user) => {
    setUsers((old) => [...old, { ...user, id: makeId() }]);
    notify('User account added');
  }, [notify]);

  const updateUser = useCallback((id, data) => {
    setUsers((old) => old.map((user) => user.id === id ? { ...user, ...data } : user));
    setCurrentUser((current) => current?.id === id ? { ...current, ...data } : current);
    notify('User account updated');
  }, [notify]);

  const deleteUser = useCallback((id) => {
    if (currentUser?.id === id) return;
    setUsers((old) => old.filter((user) => user.id !== id));
    notify('User account deleted');
  }, [currentUser, notify]);

  const handlers = { login, logout, addBook, updateBook, deleteBook, recordTransaction, addUser, updateUser, deleteUser };

  return <AppRoutes currentUser={currentUser} books={books} transactions={transactions} users={users} handlers={handlers} toast={toast} />;
}
