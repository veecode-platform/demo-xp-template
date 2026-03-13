const express = require('express');
{%- if values.needsDatabase %}
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '25060'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});
{%- endif %}

const app = express();
const port = process.env.PORT || ${{ values.port }};

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Hello from ${{ values.name }}' });
});
{%- if values.needsDatabase %}

app.get('/db/tables', async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    res.json({ tables: result.rows.map(r => r.table_name) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/db/status', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time, current_database() as database, current_user as user');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
{%- endif %}

app.listen(port, () => {
  console.log(`${{ values.name }} listening on port ${port}`);
});
