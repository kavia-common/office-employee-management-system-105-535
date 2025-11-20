'use strict';

const express = require('express');
const employeesController = require('../controllers/employees');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Employees
 *     description: CRUD for employee records
 */

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: List employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: List of employees
 */
router.get('/', employeesController.list.bind(employeesController));

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get employee by id
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Employee data }
 *       404: { description: Not found }
 */
router.get('/:id', employeesController.getById.bind(employeesController));

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, empid, domain]
 *             properties:
 *               name: { type: string }
 *               empid: { type: string }
 *               domain: { type: string }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 */
router.post('/', employeesController.create.bind(employeesController));

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               empid: { type: string }
 *               domain: { type: string }
 *     responses:
 *       200: { description: Updated }
 *       400: { description: Bad request }
 *       404: { description: Not found }
 */
router.put('/:id', employeesController.update.bind(employeesController));

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router.delete('/:id', employeesController.remove.bind(employeesController));

module.exports = router;
