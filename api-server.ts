import express from 'express';
import pg from 'pg';

const { Pool } = pg;
const app = express();
app.use(express.json());

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    
    return res.json({
      status: 'ok',
      database: 'connected',
      timestamp: result.rows[0].current_time
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error?.message || 'Unknown database error'
    });
  }
});

// Example API endpoint 
app.get('/api/lifecycle-phases', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM lifecycle_phases ORDER BY "order"');
    client.release();
    
    return res.json({
      status: 'ok',
      data: result.rows
    });
  } catch (error: any) {
    console.error('Error fetching lifecycle phases:', error);
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Unknown error fetching lifecycle phases'
    });
  }
});

// Start the server
const port = 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});