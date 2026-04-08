import { prisma } from '../lib/prisma.js';

export async function getAll() {
  return prisma.campaign.findMany({ orderBy: { created: 'desc' } });
}

export async function getById(id) {
  return prisma.campaign.findUnique({ where: { id: Number(id) } });
}

export async function create(data) {
  return prisma.campaign.create({ data });
}

export async function update(id, data) {
  return prisma.campaign.update({
    where: { id: Number(id) },
    data,
  });
}

export async function remove(id) {
  return prisma.campaign.delete({ where: { id: Number(id) } });
}
