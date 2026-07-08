import mysql from 'mysql2/promise';

const host = 'bypl9cekpnftzdhicmpb-mysql.services.clever-cloud.com';
const port = 3306;
const database = 'bypl9cekpnftzdhicmpb';
const user = 'uvzcalvyrqkphyy4';
const password = 'kYTtO6nLnZzesK3aWUhx';

async function checkTables() {
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database
  });

  const [rows] = await connection.execute('SHOW TABLES');
  console.log('Tables in database:', rows);
  
  try {
      const [count] = await connection.execute('SELECT COUNT(*) as count FROM wp_posts');
      console.log('Number of rows in wp_posts:', count);
  } catch(e) {
      console.log('wp_posts table does not exist or empty yet.');
  }

  await connection.end();
}

checkTables().catch(console.error);
