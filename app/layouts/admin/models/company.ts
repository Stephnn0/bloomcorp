import type { PrismaClient } from "generated/prisma/client";

export async function getCompanies(db: PrismaClient, teamId: string) {
  return db.company.findMany({
    where: { teamId },
    include: { _count: { select: { employees: true, orders: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCompanyById(id: string, teamId: string, db: PrismaClient) {
  return db.company.findFirst({
    where: { id, teamId },
    include: { employees: true, orders: true },
  });
}

export async function createCompany(
  data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    website?: string;
    teamId: string;
  },
  db: PrismaClient
) {
  return db.company.create({ data });
}

export async function updateCompany(
  id: string,
  teamId: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    website?: string;
    isActive?: boolean;
  },
  db: PrismaClient
) {
  return db.company.updateMany({ where: { id, teamId }, data });
}

export async function deleteCompany(id: string, teamId: string, db: PrismaClient) {
  return db.company.deleteMany({ where: { id, teamId } });
}
