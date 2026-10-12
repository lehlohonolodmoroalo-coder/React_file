export const STORAGE_KEYS = {
  books: 'thornfield_books',
  transactions: 'thornfield_transactions',
  users: 'thornfield_users',
  session: 'thornfield_session'
};

export const LOW_STOCK_THRESHOLD = 2;

export function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function seedBooks() {
  return [
    { id: makeId(), title: 'The Bone Ships', author: 'R.J. Barker', genre: 'Fantasy', isbn: '978-0-316-46431-5', quantity: 3 },
    { id: makeId(), title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-fiction', isbn: '978-0-06-231609-7', quantity: 1 },
    { id: makeId(), title: 'The Housemaid', author: 'Freida McFadden', genre: 'Thriller', isbn: '978-1-83790-062-7', quantity: 0 },
    { id: makeId(), title: 'A Grain of Wheat', author: "Ngũgĩ wa Thiong'o", genre: 'Literary Fiction', isbn: '978-0-14-118699-9', quantity: 5 }
  ];
}

export function seedUsers() {
  return [
    { id: makeId(), name: 'System Admin', membershipId: 'admin001', role: 'admin', password: 'admin123' }
  ];
}

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.session);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(user) {
  if (user) sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
  else sessionStorage.removeItem(STORAGE_KEYS.session);
}
