const db = require('./db');

try {
  db.init();
  console.log('Database initialized at', db.DB_FILE || 'verai_store.json');
} catch (err) {
  console.error('Failed to initialize DB', err);
  process.exit(1);
}
