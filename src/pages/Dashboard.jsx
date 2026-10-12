import React from 'react';
import StatBox from '../components/StatBox';
import BookCard from '../components/BookCard';
import { LOW_STOCK_THRESHOLD } from '../utils/storage';

export default function Dashboard({ books }) {
  const totalCopies = books.reduce((sum, book) => sum + Number(book.quantity), 0);
  const lowStockCount = books.filter((book) => book.quantity < LOW_STOCK_THRESHOLD).length;

  return (
    <section className="page active">
      <header className="page-head">
        <h2>Dashboard</h2>
        <p className="page-sub">Current holdings across the collection</p>
      </header>
      <div className="stat-row">
        <StatBox number={books.length} label="Titles in catalog" />
        <StatBox number={totalCopies} label="Total copies on shelf" />
        <StatBox number={lowStockCount} label="Titles low on stock" warning={lowStockCount > 0} />
      </div>
      <div className="panel">
        <div className="panel-head">
          <h3>Collection overview</h3>
          <span className="tag-hint">Cards flagged in red hold fewer than 2 copies</span>
        </div>
        <div className="card-grid">
          {books.length ? books.map((book) => <BookCard key={book.id} book={book} />) : <p className="empty-note">No books in the catalog yet. Add one from Book Management.</p>}
        </div>
      </div>
    </section>
  );
}
