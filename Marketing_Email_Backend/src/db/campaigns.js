export const campaigns = [
  {
    id: 1,
    name: 'Summer Sale 2025',
    subject: 'Exclusive summer deals just for you!',
    status: 1,
    content: '<p>Check out our summer deals!</p>',
    emailType: 1,
    CcEmails: [],
    manual_emails: [],
    created: '2025-06-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'Monthly Newsletter — May',
    subject: 'Your May updates & highlights',
    status: 0,
    content: '<p>Here are your May highlights.</p>',
    emailType: 2,
    CcEmails: ['manager@example.com'],
    manual_emails: ['alice@example.com', 'bob@example.com'],
    created: '2025-05-15T09:30:00Z',
  },
  {
    id: 3,
    name: 'Product Launch Announcement',
    subject: 'Introducing our brand new product line!',
    status: 1,
    content: '<p>We are excited to announce our new products.</p>',
    emailType: 1,
    CcEmails: [],
    manual_emails: [],
    created: '2025-04-10T08:00:00Z',
  },
  {
    id: 4,
    name: 'Black Friday Early Access',
    subject: 'Get early access to our biggest sale',
    status: 0,
    content: '',
    emailType: 2,
    CcEmails: [],
    manual_emails: ['vip@example.com'],
    created: '2025-11-01T12:00:00Z',
  },
  {
    id: 5,
    name: 'Welcome Series — Onboarding',
    subject: 'Welcome! Here is how to get started',
    status: 1,
    content: '<p>Welcome aboard! Here is everything you need to get started.</p>',
    emailType: 1,
    CcEmails: ['support@example.com'],
    manual_emails: [],
    created: '2025-03-05T07:00:00Z',
  },
];

let nextId = campaigns.length + 1;

export function getAll() {
  return campaigns;
}

export function getById(id) {
  return campaigns.find((c) => c.id === Number(id)) ?? null;
}

export function create(data) {
  const campaign = {
    ...data,
    id: nextId++,
    created: new Date().toISOString(),
  };
  campaigns.push(campaign);
  return campaign;
}

export function update(id, data) {
  const index = campaigns.findIndex((c) => c.id === Number(id));
  if (index === -1) return null;
  campaigns[index] = { ...campaigns[index], ...data, id: Number(id) };
  return campaigns[index];
}

export function remove(id) {
  const index = campaigns.findIndex((c) => c.id === Number(id));
  if (index === -1) return false;
  campaigns.splice(index, 1);
  return true;
}
