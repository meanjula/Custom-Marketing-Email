import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/index.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.campaign.deleteMany();

  await prisma.campaign.createMany({
    data: [
      {
        name: 'Summer Sale 2025',
        subject: 'Exclusive summer deals just for you!',
        status: 1,
        content: '<p>Check out our summer deals!</p>',
        emailType: 1,
        ccEmails: [],
        manualEmails: [],
      },
      {
        name: 'Monthly Newsletter — May',
        subject: 'Your May updates & highlights',
        status: 0,
        content: '<p>Here are your May highlights.</p>',
        emailType: 2,
        ccEmails: ['manager@example.com'],
        manualEmails: ['alice@example.com', 'bob@example.com'],
      },
      {
        name: 'Product Launch Announcement',
        subject: 'Introducing our brand new product line!',
        status: 1,
        content: '<p>We are excited to announce our new products.</p>',
        emailType: 1,
        ccEmails: [],
        manualEmails: [],
      },
      {
        name: 'Black Friday Early Access',
        subject: 'Get early access to our biggest sale',
        status: 0,
        content: '',
        emailType: 2,
        ccEmails: [],
        manualEmails: ['vip@example.com'],
      },
      {
        name: 'Welcome Series — Onboarding',
        subject: 'Welcome! Here is how to get started',
        status: 1,
        content: '<p>Welcome aboard! Here is everything you need to get started.</p>',
        emailType: 1,
        ccEmails: ['support@example.com'],
        manualEmails: [],
      },
    ],
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
