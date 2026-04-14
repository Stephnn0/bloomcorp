import { useLoaderData, useFetcher, useRouteLoaderData } from "react-router";
import { useState } from "react";
import db from "~/db.server";
import { getCurrentUser } from "~/auth.server";
import { redirect } from "react-router";
import { UserRole } from "generated/prisma/client";
import type { FirebaseConfig } from "~/firebase.client";

export async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);

  if (user.role !== UserRole.ADMIN) {
    throw redirect("/admin");
  }

  const teamMembers = await db.user.findMany({
    where: { teamId: user.teamId },
    orderBy: { createdAt: "desc" },
  });

  return {
    teamMembers,
    currentUserId: user.id,
    teamId: user.teamId,
  };
}

const roleBadge: Record<string, string> = {
  ADMIN: "bg-rose-100 text-rose-700",
  MANAGER: "bg-blue-100 text-blue-700",
};

export default function Team() {
  const { teamMembers, currentUserId, teamId } =
    useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData("root") as { firebaseConfig: FirebaseConfig };
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);
  const fetcher = useFetcher();

  async function handleAddMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setCreating(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const role = fd.get("role") as string;

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      setCreating(false);
      return;
    }

    try {
      // Create Firebase user via REST API (doesn't affect admin's session)
      const fbRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${rootData.firebaseConfig.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const fbData = await fbRes.json();

      if (fbData.error) {
        const msg = fbData.error.message;
        if (msg === "EMAIL_EXISTS") {
          setFormError("A Firebase account with this email already exists.");
        } else if (msg === "WEAK_PASSWORD") {
          setFormError("Password is too weak.");
        } else {
          setFormError(msg ?? "Failed to create Firebase account.");
        }
        setCreating(false);
        return;
      }

      const firebaseUid = fbData.localId;

      // Now create the DB record with the Firebase UID
      const body = new FormData();
      body.append("intent", "create");
      body.append("name", name);
      body.append("email", email);
      body.append("role", role);
      body.append("teamId", teamId);
      body.append("firebaseUid", firebaseUid);

      const apiRes = await fetch("/api/admin/team", {
        method: "POST",
        body,
      });

      const apiData = await apiRes.json();

      if (!apiRes.ok || apiData.error) {
        setFormError(apiData.error ?? "Failed to create user record.");
        setCreating(false);
        return;
      }

      // Success — reload the page to refresh the table
      setCreating(false);
      setShowForm(false);
      window.location.reload();
    } catch (err: any) {
      setFormError(err.message ?? "An unexpected error occurred.");
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-500 text-sm mt-1">
            Add team members with login credentials. They can sign in
            immediately after being created.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormError("");
          }}
          className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Member"}
        </button>
      </div>

      {/* Add Member Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add Team Member
          </h3>

          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {formError}
            </div>
          )}

          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                  placeholder="Jane Smith"
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
                  placeholder="jane@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  name="role"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none text-sm"
                >
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              This will create a login account. Share the credentials with the
              team member so they can sign in at{" "}
              <span className="font-mono text-gray-700">/login</span>.
            </p>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {creating ? "Creating account..." : "Create Member"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {teamMembers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No team members yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member: any) => {
                  const isSelf = member.id === currentUserId;
                  return (
                    <tr
                      key={member.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {member.name}
                        {isSelf && (
                          <span className="ml-2 text-xs text-gray-400">
                            (you)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {member.email}
                      </td>
                      <td className="px-6 py-4">
                        {isSelf ? (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleBadge[member.role]}`}
                          >
                            {member.role}
                          </span>
                        ) : (
                          <fetcher.Form
                            method="post"
                            action="/api/admin/team"
                            className="inline"
                          >
                            <input
                              type="hidden"
                              name="intent"
                              value="updateRole"
                            />
                            <input
                              type="hidden"
                              name="id"
                              value={member.id}
                            />
                            <select
                              name="role"
                              defaultValue={member.role}
                              onChange={(e) => {
                                const form = e.target.closest("form");
                                if (form) form.requestSubmit();
                              }}
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-rose-500 outline-none"
                            >
                              <option value="MANAGER">Manager</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </fetcher.Form>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            member.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!isSelf && (
                          <div className="flex items-center gap-3">
                            <fetcher.Form
                              method="post"
                              action="/api/admin/team"
                              className="inline"
                            >
                              <input
                                type="hidden"
                                name="intent"
                                value="toggle"
                              />
                              <input
                                type="hidden"
                                name="id"
                                value={member.id}
                              />
                              <input
                                type="hidden"
                                name="isActive"
                                value={member.isActive ? "false" : "true"}
                              />
                              <button
                                type="submit"
                                className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                              >
                                {member.isActive ? "Deactivate" : "Activate"}
                              </button>
                            </fetcher.Form>
                            <fetcher.Form
                              method="post"
                              action="/api/admin/team"
                              className="inline"
                              onSubmit={(e) => {
                                if (
                                  !confirm(
                                    `Remove ${member.name} from the team?`
                                  )
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <input
                                type="hidden"
                                name="intent"
                                value="delete"
                              />
                              <input
                                type="hidden"
                                name="id"
                                value={member.id}
                              />
                              <button
                                type="submit"
                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                              >
                                Remove
                              </button>
                            </fetcher.Form>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
