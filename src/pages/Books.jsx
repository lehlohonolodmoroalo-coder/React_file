import React, { useEffect, useMemo, useState } from 'react';

const emptyForm = { title: '', author: '', genre: '', isbn: '', quantity: 0 };

export default function Books({ books, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingId) setError('');
  }, [editingId]);

  const filteredBooks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return books;
    return books.filter((book) => [book.title, book.author, book.isbn].some((value) => value.toLowerCase().includes(term)));
  }, [books, search]);

  const updateField = (field, value) => setForm((old) => ({ ...old, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    setError('');
    const quantity = Number(form.quantity);
    if (!form.title.trim() || !form.author.trim() || !form.genre.trim() || !form.isbn.trim() || !Number.isInteger(quantity) || quantity < 0) {
      setError('Please complete every field. Quantity must be a whole number of 0 or more.');
      return;
    }
    if (editingId) onUpdate(editingId, { ...form, title: form.title.trim(), author: form.author.trim(), genre: form.genre.trim(), isbn: form.isbn.trim(), quantity });
    else onAdd({ ...form, title: form.title.trim(), author: form.author.trim(), genre: form.genre.trim(), isbn: form.isbn.trim(), quantity });
    reset();
  };

  const startEdit = (book) => {
    setEditingId(book.id);
    setForm({ title: book.title, author: book.author, genre: book.genre, isbn: book.isbn, quantity: book.quantity });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => { setEditingId(null); setForm(emptyForm); setError(''); };

  const remove = (book) => {
    if (window.confirm(`Delete "${book.title}" from the catalog?`)) onDelete(book.id);
  };

  return (
    <section className="page active">
      <header className="page-head"><h2>Book Management</h2><p className="page-sub">Add, update, search and remove books in the catalog</p></header>
      <div className="panel">
        <div className="panel-head"><h3>{editingId ? 'Update book details' : 'Add a new book'}</h3></div>
        <form className="index-card-form" onSubmit={submit}>
          <div className="form-row"><label htmlFor="bookTitle">Title</label><input id="bookTitle" value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. The Bone Ships" required /></div>
          <div className="form-row"><label htmlFor="bookAuthor">Author</label><input id="bookAuthor" value={form.author} onChange={(e) => updateField('author', e.target.value)} placeholder="e.g. R.J. Barker" required /></div>
          <div className="form-row two-col">
            <div><label htmlFor="bookGenre">Genre</label><input id="bookGenre" value={form.genre} onChange={(e) => updateField('genre', e.target.value)} placeholder="e.g. Fantasy" required /></div>
            <div><label htmlFor="bookIsbn">ISBN</label><input id="bookIsbn" value={form.isbn} onChange={(e) => updateField('isbn', e.target.value)} placeholder="e.g. 978-0-316-46431-5" required /></div>
          </div>
          <div className="form-row"><label htmlFor="bookQty">Initial Quantity</label><input id="bookQty" type="number" min="0" step="1" value={form.quantity} onChange={(e) => updateField('quantity', e.target.value)} required /></div>
          <div className="form-actions"><button className="btn btn-primary" type="submit">{editingId ? 'Update book' : 'Add book'}</button>{editingId && <button className="btn btn-ghost" type="button" onClick={reset}>Cancel edit</button>}</div>
          {error && <p className="form-error">{error}</p>}
        </form>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>Catalog</h3><span className="tag-hint">{books.length} title{books.length === 1 ? '' : 's'}</span></div>
        <div className="search-box"><label htmlFor="bookSearch">Search</label><input id="bookSearch" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title, author or ISBN" /></div>
        <div className="table-wrap">
          <table className="ledger"><thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Quantity</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredBooks.length ? filteredBooks.map((book) => <tr key={book.id}>
                <td><strong>{book.title}</strong></td><td>{book.author}</td><td>{book.genre}</td><td>{book.isbn}</td>
                <td className={book.quantity < 2 ? 'qty-low' : 'qty-ok'}>{book.quantity}</td>
                <td className="actions"><button className="btn-small" type="button" onClick={() => startEdit(book)}>Update</button><button className="btn-small danger" type="button" onClick={() => remove(book)}>Delete</button></td>
              </tr>) : <tr><td colSpan="6"><p className="empty-note">No matching books found.</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
