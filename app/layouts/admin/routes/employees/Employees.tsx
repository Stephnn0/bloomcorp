import { useLoaderData, useFetcher } from "react-router";
import { useState } from "react";
import db from "~/db.server";
import { getCurrentUser } from "~/auth.server";
import { getEmployees } from "../../models/employee";
import { getCompanies } from "../../models/company";

export async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const url = new URL(request.url);
  const companyId = url.searchParams.get("companyId") ?? undefined;
  const [employees, companies] = await Promise.all([
    getEmployees(db, user.teamId, companyId),
    getCompanies(db, user.teamId),
  ]);
  return { employees, companies, selectedCompanyId: companyId, teamId: user.teamId };
}

export default function Employees() {
  const { employees, companies, selectedCompanyId, teamId } = useLoaderData<typeof loader>();
  const [showForm, setShowForm] = useState(false);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
          <p className="text-gray-500 text-sm mt-1">Manage employee profiles and important dates</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors">
          {showForm ? "Cancel" : "+ Add Employee"}
        </button>
      </div>

      <div className="flex gap-2">
        <fetcher.Form method="get" className="flex gap-2">
          <select name="companyId" defaultValue={selectedCompanyId ?? ""} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none">
            <option value="">All Companies</option>
            {companies.map((c: any) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <button type="submit" className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">Filter</button>
        </fetcher.Form>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">New Employee</h3>
          <fetcher.Form method="post" action="/api/admin/employees" className="space-y-4">
            <input type="hidden" name="intent" value="create" />
            <input type="hidden" name="teamId" value={teamId} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label><input name="firstName" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label><input name="lastName" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input name="phone" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <select name="companyId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm">
                  <option value="">Select company</option>
                  {companies.map((c: any) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><input name="department" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Position</label><input name="position" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label><input name="birthday" type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label><input name="hireDate" type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm" /></div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50">
                {isSubmitting ? "Creating..." : "Create Employee"}
              </button>
            </div>
          </fetcher.Form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {employees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No employees found. Click "Add Employee" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Birthday</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp: any) => (
                  <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.company?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.department ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.birthday ? new Date(emp.birthday).toLocaleDateString() : "—"}</td>
                    <td className="px-6 py-4">
                      <fetcher.Form method="post" action="/api/admin/employees" className="inline">
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="id" value={emp.id} />
                        <button type="submit" className="text-sm text-red-600 hover:text-red-700 font-medium">Delete</button>
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
