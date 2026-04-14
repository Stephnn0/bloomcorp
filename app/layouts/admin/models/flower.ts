import type { PrismaClient } from "generated/prisma/client";

export async function getFlowers(db: PrismaClient, teamId: string) {
  return db.flowerArrangement.findMany({
    where: { teamId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFlowerById(id: string, teamId: string, db: PrismaClient) {
  return db.flowerArrangement.findFirst({ where: { id, teamId } });
}

export async function createFlower(
  data: {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    category?: string;
    occasion?: string;
    teamId: string;
  },
  db: PrismaClient
) {
  return db.flowerArrangement.create({ data });
}

export async function updateFlower(
  id: string,
  teamId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    category?: string;
    occasion?: string;
    isActive?: boolean;
  },
  db: PrismaClient
) {
  return db.flowerArrangement.updateMany({ where: { id, teamId }, data });
}

export async function deleteFlower(id: string, teamId: string, db: PrismaClient) {
  return db.flowerArrangement.deleteMany({ where: { id, teamId } });
}
