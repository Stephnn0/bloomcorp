import type { PrismaClient } from "generated/prisma/client";

export async function getOrders(db: PrismaClient, teamId: string, companyId?: string) {
  return db.order.findMany({
    where: { teamId, ...(companyId ? { companyId } : {}) },
    include: {
      company: { select: { name: true } },
      employee: { select: { firstName: true, lastName: true } },
      items: { include: { arrangement: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string, teamId: string, db: PrismaClient) {
  return db.order.findFirst({
    where: { id, teamId },
    include: {
      company: true,
      employee: true,
      items: { include: { arrangement: true } },
    },
  });
}

export async function createOrder(
  data: {
    companyId: string;
    employeeId: string;
    occasion?: string;
    message?: string;
    deliveryDate: string;
    deliveryAddress?: string;
    teamId: string;
    items: { arrangementId: string; quantity: number; price: number }[];
  },
  db: PrismaClient
) {
  const totalAmount = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return db.order.create({
    data: {
      companyId: data.companyId,
      employeeId: data.employeeId,
      occasion: data.occasion,
      message: data.message,
      deliveryDate: new Date(data.deliveryDate),
      deliveryAddress: data.deliveryAddress,
      totalAmount,
      teamId: data.teamId,
      items: {
        create: data.items.map((item) => ({
          arrangementId: item.arrangementId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });
}

export async function updateOrderStatus(
  id: string,
  teamId: string,
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED",
  db: PrismaClient
) {
  return db.order.updateMany({ where: { id, teamId }, data: { status } });
}
