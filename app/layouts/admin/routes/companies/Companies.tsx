import { useLoaderData, useFetcher } from "react-router";
import { useState } from "react";
import db from "~/db.server";
import { getCurrentUser } from "~/auth.server";
import { getCompanies } from "../../models/company";
import {
  Building02Icon,
  Mail01Icon,
  CallIcon,
  Location01Icon,
  Link01Icon,
  UserGroupIcon,
  DeliveryBox01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "hugeicons-react";

export async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const companies = await getCompanies(db, user.teamId);
  return { companies, teamId: user.teamId };
}

export default function Companies() {
  const { companies, teamId } = useLoaderData<typeof loader>();
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage registered companies and their accounts
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Company"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            New Company
          </h3>
          <fetcher.Form
            method="post"
            action="/api/admin/companies"
            className="space-y-4"
            onSubmit={() => setTimeout(() => setShowForm(false), 100)}
          >
            <input type="hidden" name="intent" value="create" />
            <input type="hidden" name="teamId" value={teamId} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  name="website"
                  type="url"
                  placeholder="https://"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  name="address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  name="city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  name="state"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  name="country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Company"}
              </button>
            </div>
          </fetcher.Form>
        </div>
      )}

      {/* Companies Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {companies.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Building02Icon size={40} className="mx-auto mb-3 text-gray-300" />
            <p>No companies registered yet. Click "Add Company" to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Company
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Website
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Employees
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Orders
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company: any) => {
                  const locationParts = [company.city, company.state, company.country].filter(Boolean);
                  return (
                    <tr
                      key={company.id}
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelected(company)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {company.name}
                          </p>
                          <p className="text-xs text-gray-500">{company.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {locationParts.length > 0
                          ? locationParts.join(", ")
                          : <span className="text-gray-400">--</span>}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {company.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-rose-600 hover:text-rose-700 hover:underline truncate block max-w-[180px]"
                          >
                            {company.website.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {company._count.employees}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {company._count.orders}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${company.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {company.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <fetcher.Form
                            method="post"
                            action="/api/admin/companies"
                            className="inline"
                          >
                            <input type="hidden" name="intent" value="toggle" />
                            <input type="hidden" name="id" value={company.id} />
                            <input
                              type="hidden"
                              name="isActive"
                              value={company.isActive ? "false" : "true"}
                            />
                            <button
                              type="submit"
                              className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                            >
                              {company.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </fetcher.Form>
                          <fetcher.Form
                            method="post"
                            action="/api/admin/companies"
                            className="inline"
                            onSubmit={(e) => {
                              if (
                                !confirm(
                                  `Delete "${company.name}"? This cannot be undone.`
                                )
                              )
                                e.preventDefault();
                            }}
                          >
                            <input type="hidden" name="intent" value="delete" />
                            <input type="hidden" name="id" value={company.id} />
                            <button
                              type="submit"
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Delete02Icon size={15} />
                            </button>
                          </fetcher.Form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-rose-50 text-rose-600">
                  <Building02Icon size={22} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selected.name}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${selected.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {selected.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Cancel01Icon size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <DetailRow
                icon={<Mail01Icon size={18} />}
                label="Email"
                value={selected.email}
              />
              <DetailRow
                icon={<CallIcon size={18} />}
                label="Phone"
                value={selected.phone}
              />
              <DetailRow
                icon={<Link01Icon size={18} />}
                label="Website"
                value={
                  selected.website ? (
                    <a
                      href={selected.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 hover:underline"
                    >
                      {selected.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : null
                }
              />
              <DetailRow
                icon={<Location01Icon size={18} />}
                label="Address"
                value={
                  [selected.address, selected.city, selected.state, selected.country]
                    .filter(Boolean)
                    .join(", ") || null
                }
              />

              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserGroupIcon size={18} className="text-gray-400" />
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {selected._count.employees}
                    </p>
                    <p className="text-xs text-gray-500">Employees</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <DeliveryBox01Icon size={18} className="text-gray-400" />
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {selected._count.orders}
                    </p>
                    <p className="text-xs text-gray-500">Orders</p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-400 pt-2">
                Added{" "}
                {new Date(selected.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gray-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm text-gray-900">
          {value || <span className="text-gray-300">Not provided</span>}
        </p>
      </div>
    </div>
  );
}
