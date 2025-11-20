'use strict';

const employeesRepo = require('../repositories/employees');

/**
 * PUBLIC_INTERFACE
 * EmployeesController: CRUD handlers for employees.
 */
class EmployeesController {
  async list(req, res) {
    try {
      const data = await employeesRepo.listEmployees();
      return res.status(200).json({ status: 'success', data });
    } catch (err) {
      console.error('List employees error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to list employees' });
    }
  }

  async getById(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid id' });
      }
      const item = await employeesRepo.getEmployeeById(id);
      if (!item) {
        return res.status(404).json({ status: 'error', message: 'Employee not found' });
      }
      return res.status(200).json({ status: 'success', data: item });
    } catch (err) {
      console.error('Get employee error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to get employee' });
    }
  }

  async create(req, res) {
    try {
      const { name, empid, domain } = req.body || {};
      if (!name || !empid || !domain) {
        return res.status(400).json({ status: 'error', message: 'name, empid and domain are required' });
      }
      const created = await employeesRepo.createEmployee({ name, empid, domain });
      return res.status(201).json({ status: 'success', data: created });
    } catch (err) {
      console.error('Create employee error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to create employee' });
    }
  }

  async update(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid id' });
      }
      const { name, empid, domain } = req.body || {};
      if (name === undefined && empid === undefined && domain === undefined) {
        return res.status(400).json({ status: 'error', message: 'Nothing to update' });
      }
      const updated = await employeesRepo.updateEmployee(id, { name, empid, domain });
      if (!updated) {
        return res.status(404).json({ status: 'error', message: 'Employee not found' });
      }
      return res.status(200).json({ status: 'success', data: updated });
    } catch (err) {
      console.error('Update employee error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to update employee' });
    }
  }

  async remove(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid id' });
      }
      const ok = await employeesRepo.deleteEmployee(id);
      if (!ok) {
        return res.status(404).json({ status: 'error', message: 'Employee not found' });
      }
      return res.status(200).json({ status: 'success', message: 'Employee deleted' });
    } catch (err) {
      console.error('Delete employee error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to delete employee' });
    }
  }
}

module.exports = new EmployeesController();
