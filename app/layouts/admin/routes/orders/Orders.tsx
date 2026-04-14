import { useLoaderData, useFetcher } from "react-router";
import { useState } from "react";
import db from "~/db.server";
import { getCurrentUser } from "~/auth.server";
import { getOrders } from "../../models/order";
import { getCompanies } from "../../models/company";
import { getEmployees } from "../../models/employee";
import { getFlowers } from "../../models/flower";

export async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const [orders, companies, employees, flowers] = await Promise.all([
    getOrders(db, user.teamId),
    getCompanies(db, user.teamId),
    getEmployees(db, user.teamId),
    getFlowers(db, user.teamId),
  ]);
  return { orders, companies, employees, flowers, teamId: user.teamId };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};
const statusOptions = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function Orders() {
  const { orders, companies, employees, flowers, teamId } = useLoaderData<typeof loader>();
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";
  const filteredEmployees = selectedCompany ? employees.filter((e: any) => e.companyId === selectedCompany) : employees;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-500 text-sm mt-1">View, process, and track all flower orders</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors">
          {showForm ? "Cancel" : "+ New Order"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Order</h3>
          <fetcher.Form method="post" action="/api/admin/orders" className="space-y-4">
            <input type="hidden" name="intent" value="create" />
            <input type="hidden" name="teamId" value={teamId} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <select name="companyId" required value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm">
                  <option value="">Select company</option>{companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
                <select name="employeeId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm">
                  <option value="">Select employee</option>{filteredEmployees.map((e: any) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Flower Arrangement *</label>
                <select name="arrangementId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm">
                  <option value="">Select arrangement</option>{flowers.filter((f: any) => f.isActive).map((f: any) => <option key={f.id} value={f.id}>{f.name} — ${f.price.toFixed(2)}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label><input name="quantity" type="number" min="1" defaultValue="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label><input name="occasion" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" placeholder="e.g., Birthday" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date *</label><input name="deliveryDate" type="date" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label><input name="deliveryAddress" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" placeholder="123 Main St, City, State" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Personal Message</label><textarea name="message" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm resize-none" placeholder="Happy Birthday! We appreciate everything you do..." /></div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50">
                {isSubmitting ? "Creating..." : "Create Order"}
              </button>
            </div>
          </fetcher.Form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders yet. Click "New Order" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order #</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Occasion</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Delivery</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.orderNumber.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.company.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.employee.firstName} {order.employee.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.occasion ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status] ?? ""}`}>{order.status.replace(/_/g, " ")}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <fetcher.Form method="post" action="/api/admin/orders" className="inline">
                        <input type="hidden" name="intent" value="updateStatus" />
                        <input type="hidden" name="id" value={order.id} />
                        <select name="status" defaultValue={order.status} onChange={e => { const form = e.target.closest("form"); if (form) form.requestSubmit(); }} className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 outline-none">
                          {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                        </select>
                      </fetcher.Form>
                    </td>
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
