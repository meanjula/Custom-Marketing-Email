import { prisma } from '../lib/prisma.js';

export async function getAll(userId) {
  return prisma.campaign.findMany({
    where: { userId },
    orderBy: { created: 'desc' },
  });
}

export async function getById(id, userId) {
  return prisma.campaign.findFirst({
    where: { id: Number(id), userId },
  });
}

export async function create(data) {
  return prisma.campaign.create({ data });
}

export async function update(id, userId, data) {
  const campaign = await prisma.campaign.findFirst({ where: { id: Number(id), userId } });
  if (!campaign) throw new Error('Campaign not found');
  return prisma.campaign.update({ where: { id: Number(id) }, data });
}

export async function remove(id, userId) {
  const campaign = await prisma.campaign.findFirst({ where: { id: Number(id), userId } });
  if (!campaign) throw new Error('Campaign not found');
  return prisma.campaign.delete({ where: { id: Number(id) } });
}
