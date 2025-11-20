'use strict';

const express = require('express');
const officesController = require('../controllers/offices');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Offices
 *     description: CRUD for office records
 */

/**
 * @swagger
 * /offices:
 *   get:
 *     summary: List offices
 *     tags: [Offices]
 *     responses:
 *       200:
 *         description: List of offices
 */
router.get('/', officesController.list.bind(officesController));

/**
 * @swagger
 * /offices/{id}:
 *   get:
 *     summary: Get office by id
 *     tags: [Offices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Office data }
 *       404: { description: Not found }
 */
router.get('/:id', officesController.getById.bind(officesController));

/**
 * @swagger
 * /offices:
 *   post:
 *     summary: Create office
 *     tags: [Offices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, domain]
 *             properties:
 *               name: { type: string }
 *               domain: { type: string }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 */
router.post('/', officesController.create.bind(officesController));

/**
 * @swagger
 * /offices/{id}:
 *   put:
 *     summary: Update office
 *     tags: [Offices]
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
 *               domain: { type: string }
 *     responses:
 *       200: { description: Updated }
 *       400: { description: Bad request }
 *       404: { description: Not found }
 */
router.put('/:id', officesController.update.bind(officesController));

/**
 * @swagger
 * /offices/{id}:
 *   delete:
 *     summary: Delete office
 *     tags: [Offices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
router.delete('/:id', officesController.remove.bind(officesController));

module.exports = router;
