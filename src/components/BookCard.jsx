import React from 'react';
import { LOW_STOCK_THRESHOLD } from '../utils/storage';

export default function BookCard({ book }) {
  const low = book.quantity < LOW_STOCK_THRESHOLD;
  return (
    <article className={`book-card ${low ? 'low-stock' : ''}`}>
      <div className="call-number">ISBN {book.isbn}</div>
      <h4>{book.title}</h4>
      <div className="author">{book.author}</div>
      <div className="card-foot">
        <span className="genre-chip">{book.genre}</span>
        <span className="stock-count">{book.quantity} {book.quantity === 1 ? 'copy' : 'copies'}</span>
      </div>
    </article>
  );
}
