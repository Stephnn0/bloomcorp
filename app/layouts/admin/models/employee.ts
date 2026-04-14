import type { PrismaClient } from "generated/prisma/client";

export async function getEmployees(db: PrismaClient, teamId: string, companyId?: string) {
  return db.employee.findMany({
    where: { teamId, ...(companyId ? { companyId } : {}) },
    include: { company: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEmployeeById(id: string, teamId: string, db: PrismaClient) {
  return db.employee.findFirst({
    where: { id, teamId },
    include: { company: true },
  });
}

export async function createEmployee(
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    birthday?: string;
    hireDate?: string;
    department?: string;
    position?: string;
    companyId: string;
    teamId: string;
  },
  db: PrismaClient
) {
  return db.employee.create({
    data: {
      ...data,
      birthday: data.birthday ? new Date(data.birthday) : null,
      hireDate: data.hireDate ? new Date(data.hireDate) : null,
    },
  });
}

export async function updateEmployee(
  id: string,
  teamId: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    birthday?: string;
    hireDate?: string;
    department?: string;
    position?: string;
  },
  db: PrismaClient
) {
  const record = await db.employee.findFirst({ where: { id, teamId } });
  if (!record) return null;
  return db.employee.update({
    where: { id },
    data: {
      ...data,
      birthday: data.birthday ? new Date(data.birthday) : undefined,
      hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
    },
  });
}

export async function deleteEmployee(id: string, teamId: string, db: PrismaClient) {
  return db.employee.deleteMany({ where: { id, teamId } });
}
