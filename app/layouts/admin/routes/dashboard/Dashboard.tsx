import { useLoaderData } from "react-router";
import db from "~/db.server";
import { getCurrentUser } from "~/auth.server";
import {
  Building02Icon,
  UserGroupIcon,
  DeliveryBox01Icon,
  FlowerIcon,
  DollarCircleIcon,
} from "hugeicons-react";

export async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const teamId = user.teamId;

  const [companies, employees, orders, flowers] = await Promise.all([
    db.company.count({ where: { teamId } }),
    db.employee.count({ where: { teamId } }),
    db.order.count({ where: { teamId } }),
    db.flowerArrangement.count({ where: { teamId } }),
  ]);

  const recentOrders = await db.order.findMany({
    where: { teamId },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      company: { select: { name: true } },
      employee: { select: { firstName: true, lastName: true } },
    },
  });

  const revenue = await db.order.aggregate({
    where: { teamId },
    _sum: { totalAmount: true },
  });

  return {
    stats: { companies, employees, orders, flowers },
    recentOrders,
    totalRevenue: revenue._sum.totalAmount ?? 0,
  };
}

const statCards = [
  { key: "companies", label: "Companies", Icon: Building02Icon, color: "blue" },
  { key: "employees", label: "Employees", Icon: UserGroupIcon, color: "emerald" },
  { key: "orders", label: "Orders", Icon: DeliveryBox01Icon, color: "amber" },
  { key: "flowers", label: "Arrangements", Icon: FlowerIcon, color: "rose" },
] as const;

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-500",
  rose: "bg-rose-50 text-rose-600",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function Dashboard() {
  const { stats, recentOrders, totalRevenue } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const IconComp = card.Icon;
          return (
            <div key={card.key} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colorMap[card.color]}`}>
                  <IconComp size={22} />
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats[card.key]}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <DollarCircleIcon size={20} className="text-gray-400" />
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900">
          ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No orders yet. Orders will appear here once you start placing them.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.orderNumber.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.company.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.employee.firstName} {order.employee.lastName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status] ?? ""}`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">${order.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
