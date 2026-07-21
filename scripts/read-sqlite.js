const Database = require('better-sqlite3');
const db = new Database('./prisma/dev.db', { readonly: true });
try {
  const projects = db.prepare('SELECT * FROM DevelopmentProject').all();
  console.log('Projects in SQLite (prisma/dev.db):', projects);
} catch (e) {
  console.log('Error reading prisma/dev.db:', e.message);
}

try {
  const db2 = new Database('./dev.db', { readonly: true });
  const projects2 = db2.prepare('SELECT * FROM DevelopmentProject').all();
  console.log('Projects in SQLite (./dev.db):', projects2);
} catch (e) {
  console.log('Error reading ./dev.db:', e.message);
}
