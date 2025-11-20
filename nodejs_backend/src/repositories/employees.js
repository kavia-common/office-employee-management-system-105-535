'use strict';

const { pool } = require('../db/pool');

/**
 * PUBLIC_INTERFACE
 * List all employees.
 */
async function listEmployees() {
  const { rows } = await pool.query('SELECT id, name, empid, domain, created_at, updated_at FROM employees ORDER BY id DESC');
  return rows;
}

/**
 * PUBLIC_INTERFACE
 * Get an employee by ID.
 */
async function getEmployeeById(id) {
  const { rows } = await pool.query('SELECT id, name, empid, domain, created_at, updated_at FROM employees WHERE id = $1', [id]);
  return rows[0] || null;
}

/**
 * PUBLIC_INTERFACE
 * Create a new employee.
 */
async function createEmployee({ name, empid, domain }) {
  const { rows } = await pool.query(
    'INSERT INTO employees (name, empid, domain) VALUES ($1, $2, $3) RETURNING id, name, empid, domain, created_at, updated_at',
    [name, empid, domain]
  );
  return rows[0];
}

/**
 * PUBLIC_INTERFACE
 * Update an employee by ID.
 */
async function updateEmployee(id, { name, empid, domain }) {
  const { rows } = await pool.query(
    `UPDATE employees
     SET name = COALESCE($2, name),
         empid = COALESCE($3, empid),
         domain = COALESCE($4, domain)
     WHERE id = $1
     RETURNING id, name, empid, domain, created_at, updated_at`,
    [id, name ?? null, empid ?? null, domain ?? null]
  );
  return rows[0] || null;
}

/**
 * PUBLIC_INTERFACE
 * Delete an employee by ID.
 */
async function deleteEmployee(id) {
  const { rowCount } = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
