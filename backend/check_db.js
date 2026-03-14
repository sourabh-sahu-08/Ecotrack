import Database from 'better-sqlite3';
const db = new Database('ecotrack.db');
try {
  console.log('Tables:', db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all());
  console.log('Users schema:', db.prepare("PRAGMA table_info(users)").all());
  console.log('User count:', db.prepare("SELECT COUNT(*) as count FROM users").get());
} catch (e) {
  console.error('DB Check failed:', e);
} finally {
  db.close();
}
