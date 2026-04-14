import { useLoaderData, useFetcher } from "react-router";
import db from "~/db.server";
import { getCurrentUser } from "~/auth.server";
import {
  Mail01Icon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  CheckListIcon,
} from "hugeicons-react";

export async function loader({ request }: { request: Request }) {
  await getCurrentUser(request);

  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return { inquiries };
}

export default function Inquiries() {
  const { inquiries } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inquiries</h2>
          <p className="text-gray-500 text-sm mt-1">
            Messages from the contact form on your website.
          </p>
        </div>
        {inquiries.some((i: any) => !i.isRead) && (
          <fetcher.Form method="post" action="/api/admin/inquiries">
            <input type="hidden" name="intent" value="markAllRead" />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <CheckListIcon size={16} />
              Mark all read
            </button>
          </fetcher.Form>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Mail01Icon size={40} className="mx-auto mb-3 text-gray-300" />
            <p>No inquiries yet. They will appear here when visitors submit the contact form.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {inquiries.map((inquiry: any) => (
              <div
                key={inquiry.id}
                className={`p-6 ${!inquiry.isRead ? "bg-rose-50/40" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {inquiry.firstName} {inquiry.lastName}
                      </h3>
                      {!inquiry.isRead && (
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-rose-100 text-rose-700">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-0.5">
                      {inquiry.email}
                      {inquiry.companyName && (
                        <span className="text-gray-400">
                          {" "}
                          &middot; {inquiry.companyName}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                      {inquiry.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!inquiry.isRead && (
                      <fetcher.Form
                        method="post"
                        action="/api/admin/inquiries"
                      >
                        <input type="hidden" name="intent" value="markRead" />
                        <input type="hidden" name="id" value={inquiry.id} />
                        <button
                          type="submit"
                          title="Mark as read"
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <CheckmarkCircle02Icon size={18} />
                        </button>
                      </fetcher.Form>
                    )}
                    <fetcher.Form
                      method="post"
                      action="/api/admin/inquiries"
                      onSubmit={(e) => {
                        if (!confirm("Delete this inquiry?")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="id" value={inquiry.id} />
                      <button
                        type="submit"
                        title="Delete"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Delete02Icon size={18} />
                      </button>
                    </fetcher.Form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
