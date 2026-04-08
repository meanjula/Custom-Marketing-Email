import { Router } from 'express';
import * as db from '../db/campaigns.js';

const router = Router();

// GET /api/campaigns
router.get('/', async (req, res) => {
  const campaigns = await db.getAll();
  res.json(campaigns);
});

// GET /api/campaigns/:id
router.get('/:id', async (req, res) => {
  const campaign = await db.getById(req.params.id);
  if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
  res.json(campaign);
});

// POST /api/campaigns
router.post('/', async (req, res) => {
  const { name, subject, content, emailType, CcEmails, manual_emails, status } = req.body;
  if (!name || !subject) {
    return res.status(400).json({ message: 'name and subject are required' });
  }
  const campaign = await db.create({
    name,
    subject,
    content: content || '',
    emailType: emailType ?? 1,
    ccEmails: CcEmails ?? [],
    manualEmails: manual_emails ?? [],
    status: status ?? 1,
  });
  res.status(201).json(campaign);
});

// PUT /api/campaigns/:id
router.put('/:id', async (req, res) => {
  const { name, subject, content, emailType, CcEmails, manual_emails, status } = req.body;
  try {
    const updated = await db.update(req.params.id, {
      ...(name !== undefined && { name }),
      ...(subject !== undefined && { subject }),
      ...(content !== undefined && { content }),
      ...(emailType !== undefined && { emailType }),
      ...(CcEmails !== undefined && { ccEmails: CcEmails }),
      ...(manual_emails !== undefined && { manualEmails: manual_emails }),
      ...(status !== undefined && { status }),
    });
    res.json(updated);
  } catch {
    res.status(404).json({ message: 'Campaign not found' });
  }
});

// DELETE /api/campaigns/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.remove(req.params.id);
    res.status(204).send();
  } catch {
    res.status(404).json({ message: 'Campaign not found' });
  }
});

export default router;
