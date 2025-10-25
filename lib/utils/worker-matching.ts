// lib/utils/worker-matching.ts
import prisma from '@/lib/db';
import { getServiceById } from './constant';

export async function findAvailableWorkers(serviceSlug: string) {
  const service = getServiceById(serviceSlug);
  if (!service) {
    throw new Error(`Service ${serviceSlug} not found`);
  }

  return await prisma.worker.findMany({
    where: {
      services: {
        has: service.category // Workers who have this category
      },
      isActive: true,
      isVerified: true
    },
    select: {
      id: true,
      name: true,
      phone: true,
      rating: true,
      services: true
    }
  });
}

export async function isWorkerEligibleForService(workerId: string, serviceSlug: string) {
  const worker = await prisma.worker.findUnique({
    where: { id: workerId },
    select: { services: true }
  });

  if (!worker) return false;

  const service = getServiceById(serviceSlug);
  if (!service) return false;

  return worker.services.includes(service.category);
}