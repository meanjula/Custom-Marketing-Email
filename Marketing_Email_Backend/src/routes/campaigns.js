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

function validateRecipients(status, emailType, manual_emails, from_customers_email) {
  if (Number(status) !== 1) return null;
  const type = Number(emailType);
  if (type === 2 && !manual_emails?.length) return 'At least one recipient email is required';
  if (type === 0 && !from_customers_email?.length) return 'At least one recipient must be selected';
  return null;
}

// POST /api/campaigns
router.post('/', async (req, res) => {
  const { name, subject, content, emailType, CcEmails, manual_emails, from_customers_email, status } = req.body;

  if (!name?.trim()) return res.status(422).json({ message: 'Campaign name is required' });
  if (!subject?.trim()) return res.status(422).json({ message: 'Email subject is required' });
  const recipientError = validateRecipients(status, emailType, manual_emails, from_customers_email);
  if (recipientError) return res.status(422).json({ message: recipientError });

  const campaign = await db.create({
    name,
    subject,
    content: content || '',
    emailType: Number(emailType ?? 1),
    ccEmails: CcEmails ?? [],
    manualEmails: manual_emails ?? [],
    status: Number(status ?? 1),
  });
  res.status(201).json(campaign);
});

// PUT /api/campaigns/:id
router.put('/:id', async (req, res) => {
  const { name, subject, content, emailType, CcEmails, manual_emails, from_customers_email, status } = req.body;

  if (!name?.trim()) return res.status(422).json({ message: 'Campaign name is required' });
  if (!subject?.trim()) return res.status(422).json({ message: 'Email subject is required' });
  const recipientError = validateRecipients(status, emailType, manual_emails, from_customers_email);
  if (recipientError) return res.status(422).json({ message: recipientError });

  try {
    const updated = await db.update(req.params.id, {
      ...(name !== undefined && { name }),
      ...(subject !== undefined && { subject }),
      ...(content !== undefined && { content }),
      ...(emailType !== undefined && { emailType: Number(emailType) }),
      ...(CcEmails !== undefined && { ccEmails: CcEmails }),
      ...(manual_emails !== undefined && { manualEmails: manual_emails }),
      ...(status !== undefined && { status: Number(status) }),
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
