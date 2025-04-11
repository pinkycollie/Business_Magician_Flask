import pg from 'pg';
const { Pool } = pg;

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('Connected to database:', result.rows[0].current_time);
    client.release();
    await pool.end();
    
    console.log('Database connection test successful!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

testDatabaseConnection();