import React, { useEffect, useState } from 'react';

export default function Transactions({ books, transactions, onTransaction }) {
  const [bookId, setBookId] = useState(books[0]?.id || '');
  const [type, setType] = useState('add');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!books.some((book) => book.id === bookId)) setBookId(books[0]?.id || '');
  }, [books, bookId]);

  const submit = (event) => {
    event.preventDefault();
    setError('');
    const qty = Number(quantity);
    const book = books.find((item) => item.id === bookId);
    if (!book || !Number.isInteger(qty) || qty < 1) { setError('Choose a book and enter a valid quantity of at least 1.'); return; }
    if (type === 'borrow' && qty > book.quantity) { setError(`Only ${book.quantity} ${book.quantity === 1 ? 'copy is' : 'copies are'} in stock. You cannot borrow ${qty}.`); return; }
    onTransaction(book.id, type, qty);
    setQuantity(1);
  };

  return (
    <section className="page active">
      <header className="page-head"><h2>Transactions</h2><p className="page-sub">Record incoming stock and borrowed copies</p></header>
      <div className="panel">
        <div className="panel-head"><h3>Log a transaction</h3></div>
        <form className="index-card-form" onSubmit={submit}>
          <div className="form-row"><label htmlFor="txnBook">Book</label><select id="txnBook" value={bookId} onChange={(e) => setBookId(e.target.value)} required disabled={!books.length}><option value="">Select a book</option>{books.map((book) => <option key={book.id} value={book.id}>{book.title} ({book.quantity} in stock)</option>)}</select></div>
          <div className="form-row two-col"><div><label htmlFor="txnType">Action</label><select id="txnType" value={type} onChange={(e) => setType(e.target.value)}><option value="add">Add stock (new arrival)</option><option value="borrow">Deduct stock (borrowed)</option></select></div><div><label htmlFor="txnQty">Quantity</label><input id="txnQty" type="number" min="1" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required /></div></div>
          <div className="form-actions"><button className="btn btn-primary" type="submit" disabled={!books.length}>Record transaction</button></div>
          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
      <div className="panel">
        <div className="panel-head"><h3>Transaction history</h3></div>
        <div className="table-wrap"><table className="ledger"><thead><tr><th>Date</th><th>Book</th><th>Action</th><th>Quantity</th><th>Balance after</th></tr></thead><tbody>
          {transactions.length ? transactions.map((txn) => <tr key={txn.id}><td>{new Date(txn.date).toLocaleString()}</td><td>{txn.bookTitle}</td><td>{txn.type === 'add' ? 'Stock added' : 'Borrowed'}</td><td>{txn.type === 'add' ? '+' : '-'}{txn.qty}</td><td>{txn.balanceAfter}</td></tr>) : <tr><td colSpan="5"><p className="empty-note">No transactions recorded yet.</p></td></tr>}
        </tbody></table></div>
      </div>
    </section>
  );
}
