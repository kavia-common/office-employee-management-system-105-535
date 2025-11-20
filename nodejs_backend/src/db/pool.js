'use strict';

const { Pool } = require('pg');
const dotenv = require('dotenv');

/**
 * Load environment variables from .env if present.
 * Required vars (comment for orchestrator to provide via env):
 * - PGHOST
 * - PGPORT
 * - PGUSER
 * - PGPASSWORD
 * - PGDATABASE
 */
dotenv.config();

/**
 * Create a shared PostgreSQL connection pool using environment variables.
 * SSL is disabled by default but can be enabled via PGSSL=true.
 */
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: process.env.PGPOOL_MAX ? Number(process.env.PGPOOL_MAX) : 10,
  idleTimeoutMillis: process.env.PGPOOL_IDLE_TIMEOUT ? Number(process.env.PGPOOL_IDLE_TIMEOUT) : 30000,
  connectionTimeoutMillis: process.env.PGPOOL_CONN_TIMEOUT ? Number(process.env.PGPOOL_CONN_TIMEOUT) : 5000,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined
});

/**
 * PUBLIC_INTERFACE
 * Initialize database schema: create tables if they don't exist.
 * - offices(id serial PK, name text, domain text, created_at timestamptz, updated_at timestamptz)
 * - employees(id serial PK, name text, empid text, domain text, created_at timestamptz, updated_at timestamptz)
 */
async function initSchema() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS offices (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        domain TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        empid TEXT NOT NULL,
        domain TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    // Ensure updated_at triggers
    await client.query(`
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_offices'
        ) THEN
          CREATE TRIGGER set_updated_at_offices
          BEFORE UPDATE ON offices
          FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
        END IF;
      END;
      $$;
    `);
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_employees'
        ) THEN
          CREATE TRIGGER set_updated_at_employees
          BEFORE UPDATE ON employees
          FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
        END IF;
      END;
      $$;
    `);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database schema initialization failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  initSchema,
};
