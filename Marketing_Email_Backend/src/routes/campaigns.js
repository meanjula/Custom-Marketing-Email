import { Router } from 'express';
import * as db from '../db/campaigns.js';
import { authenticate } from '../middleware/auth.js';
import { sendCampaignEmail } from '../services/email.js';

const router = Router();
router.use(authenticate);

// GET /api/campaigns
router.get('/', async (req, res) => {
  const campaigns = await db.getAll(req.userId);
  res.json(campaigns);
});

// GET /api/campaigns/:id
router.get('/:id', async (req, res) => {
  const campaign = await db.getById(req.params.id, req.userId);
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

async function trySendEmail(campaign) {
  if (campaign.status !== 1) return;
  if (!campaign.manualEmails?.length) return;
  try {
    await sendCampaignEmail({
      to: campaign.manualEmails,
      cc: campaign.ccEmails,
      subject: campaign.subject,
      html: campaign.content,
    });
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
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
    userId: req.userId,
  });

  await trySendEmail(campaign);
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
    const existing = await db.getById(req.params.id, req.userId);
    if (!existing) return res.status(404).json({ message: 'Campaign not found' });

    const updated = await db.update(req.params.id, req.userId, {
      ...(name !== undefined && { name }),
      ...(subject !== undefined && { subject }),
      ...(content !== undefined && { content }),
      ...(emailType !== undefined && { emailType: Number(emailType) }),
      ...(CcEmails !== undefined && { ccEmails: CcEmails }),
      ...(manual_emails !== undefined && { manualEmails: manual_emails }),
      ...(status !== undefined && { status: Number(status) }),
    });

    // only send if transitioning from draft (0) → sent (1)
    if (existing.status === 0 && updated.status === 1) {
      await trySendEmail(updated);
    }

    res.json(updated);
  } catch {
    res.status(404).json({ message: 'Campaign not found' });
  }
});

// DELETE /api/campaigns/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.remove(req.params.id, req.userId);
    res.status(204).send();
  } catch {
    res.status(404).json({ message: 'Campaign not found' });
  }
});

export default router;
