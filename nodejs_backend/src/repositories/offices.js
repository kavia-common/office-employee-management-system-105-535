'use strict';

const { pool } = require('../db/pool');

/**
 * PUBLIC_INTERFACE
 * List all offices.
 */
async function listOffices() {
  const { rows } = await pool.query('SELECT id, name, domain, created_at, updated_at FROM offices ORDER BY id DESC');
  return rows;
}

/**
 * PUBLIC_INTERFACE
 * Get an office by ID.
 */
async function getOfficeById(id) {
  const { rows } = await pool.query('SELECT id, name, domain, created_at, updated_at FROM offices WHERE id = $1', [id]);
  return rows[0] || null;
}

/**
 * PUBLIC_INTERFACE
 * Create a new office.
 */
async function createOffice({ name, domain }) {
  const { rows } = await pool.query(
    'INSERT INTO offices (name, domain) VALUES ($1, $2) RETURNING id, name, domain, created_at, updated_at',
    [name, domain]
  );
  return rows[0];
}

/**
 * PUBLIC_INTERFACE
 * Update an office by ID.
 */
async function updateOffice(id, { name, domain }) {
  const { rows } = await pool.query(
    `UPDATE offices
     SET name = COALESCE($2, name),
         domain = COALESCE($3, domain)
     WHERE id = $1
     RETURNING id, name, domain, created_at, updated_at`,
    [id, name ?? null, domain ?? null]
  );
  return rows[0] || null;
}

/**
 * PUBLIC_INTERFACE
 * Delete an office by ID.
 */
async function deleteOffice(id) {
  const { rowCount } = await pool.query('DELETE FROM offices WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = {
  listOffices,
  getOfficeById,
  createOffice,
  updateOffice,
  deleteOffice,
};
