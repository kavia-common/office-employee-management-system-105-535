'use strict';

const officesRepo = require('../repositories/offices');

/**
 * PUBLIC_INTERFACE
 * OfficesController: CRUD handlers for offices.
 */
class OfficesController {
  /**
   * List all offices.
   */
  async list(req, res) {
    try {
      const data = await officesRepo.listOffices();
      return res.status(200).json({ status: 'success', data });
    } catch (err) {
      console.error('List offices error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to list offices' });
    }
  }

  /**
   * Get office by id.
   */
  async getById(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid id' });
      }
      const item = await officesRepo.getOfficeById(id);
      if (!item) {
        return res.status(404).json({ status: 'error', message: 'Office not found' });
      }
      return res.status(200).json({ status: 'success', data: item });
    } catch (err) {
      console.error('Get office error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to get office' });
    }
  }

  /**
   * Create office.
   */
  async create(req, res) {
    try {
      const { name, domain } = req.body || {};
      if (!name || !domain) {
        return res.status(400).json({ status: 'error', message: 'name and domain are required' });
      }
      const created = await officesRepo.createOffice({ name, domain });
      return res.status(201).json({ status: 'success', data: created });
    } catch (err) {
      console.error('Create office error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to create office' });
    }
  }

  /**
   * Update office.
   */
  async update(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid id' });
      }
      const { name, domain } = req.body || {};
      if (name === undefined && domain === undefined) {
        return res.status(400).json({ status: 'error', message: 'Nothing to update' });
      }
      const updated = await officesRepo.updateOffice(id, { name, domain });
      if (!updated) {
        return res.status(404).json({ status: 'error', message: 'Office not found' });
      }
      return res.status(200).json({ status: 'success', data: updated });
    } catch (err) {
      console.error('Update office error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to update office' });
    }
  }

  /**
   * Delete office.
   */
  async remove(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid id' });
      }
      const ok = await officesRepo.deleteOffice(id);
      if (!ok) {
        return res.status(404).json({ status: 'error', message: 'Office not found' });
      }
      return res.status(200).json({ status: 'success', message: 'Office deleted' });
    } catch (err) {
      console.error('Delete office error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to delete office' });
    }
  }
}

module.exports = new OfficesController();
