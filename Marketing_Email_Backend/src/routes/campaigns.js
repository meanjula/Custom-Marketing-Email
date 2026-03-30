import { Router } from 'express';
import * as db from '../db/campaigns.js';

const router = Router();

// GET /api/campaigns
router.get('/', (req, res) => {
  res.json(db.getAll());
});

// GET /api/campaigns/:id
router.get('/:id', (req, res) => {
  const campaign = db.getById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
  res.json(campaign);
});

// POST /api/campaigns
router.post('/', (req, res) => {
  const { name, subject, content, emailType, CcEmails, manual_emails, status } = req.body;
  if (!name || !subject) {
    return res.status(400).json({ message: 'name and subject are required' });
  }
  const campaign = db.create({ name, subject, content, emailType, CcEmails, manual_emails, status: status ?? 1 });
  res.status(201).json(campaign);
});

// PUT /api/campaigns/:id
router.put('/:id', (req, res) => {
  const updated = db.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Campaign not found' });
  res.json(updated);
});

// DELETE /api/campaigns/:id
router.delete('/:id', (req, res) => {
  const deleted = db.remove(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Campaign not found' });
  res.status(204).send();
});

export default router;
