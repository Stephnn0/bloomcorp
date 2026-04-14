import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useLoaderData,
  useFetcher,
} from "react-router";
import logoImg from "~/assets/logo.png";
import { getCurrentUser } from "~/auth.server";
import db from "~/db.server";
import {
  DashboardSquare01Icon,
  Building02Icon,
  UserGroupIcon,
  FlowerIcon,
  DeliveryBox01Icon,
  Key01Icon,
  Mail01Icon,
  Notification03Icon,
  Logout01Icon,
  ArrowLeft01Icon,
} from "hugeicons-react";

export async function loader({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const unreadInquiries = await db.inquiry.count({
    where: { isRead: false },
  });
  return { user, unreadInquiries };
}

const navItems = [
  { to: "/admin", label: "Dashboard", Icon: DashboardSquare01Icon, roles: ["ADMIN", "MANAGER"] },
  { to: "/admin/companies", label: "Companies", Icon: Building02Icon, roles: ["ADMIN", "MANAGER"] },
  { to: "/admin/employees", label: "Employees", Icon: UserGroupIcon, roles: ["ADMIN", "MANAGER"] },
  { to: "/admin/flowers", label: "Flowers", Icon: FlowerIcon, roles: ["ADMIN", "MANAGER"] },
  { to: "/admin/orders", label: "Orders", Icon: DeliveryBox01Icon, roles: ["ADMIN", "MANAGER"] },
  { to: "/admin/inquiries", label: "Inquiries", Icon: Mail01Icon, roles: ["ADMIN", "MANAGER"] },
  { to: "/admin/team", label: "Team", Icon: Key01Icon, roles: ["ADMIN"] },
];

const roleBadge: Record<string, string> = {
  ADMIN: "bg-rose-100 text-rose-700",
  MANAGER: "bg-blue-100 text-blue-700",
};

export default function AdminLayout() {
  const location = useLocation();
  const { user, unreadInquiries } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const visibleNav = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={logoImg} alt="Roses" className="h-8 w-auto" />
            <span className="text-xl font-bold text-rose-600">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {visibleNav.map((item) => {
            const isActive =
              item.to === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.to);
            const IconComp = item.Icon;
            const isInquiries = item.to === "/admin/inquiries";
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-rose-50 text-rose-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <IconComp size={20} />
                <span className="flex-1">{item.label}</span>
                {isInquiries && unreadInquiries > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                    {unreadInquiries}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="px-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${roleBadge[user.role] ?? ""}`}
              >
                {user.role}
              </span>
              <span className="text-xs text-gray-400 truncate">
                {user.teamName}
              </span>
            </div>
          </div>
          <fetcher.Form method="post" action="/api/auth/session">
            <input type="hidden" name="intent" value="logout" />
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium w-full"
            >
              <Logout01Icon size={16} />
              Logout
            </button>
          </fetcher.Form>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft01Icon size={16} />
            Back to website
          </Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            {visibleNav.find((item) =>
              item.to === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.to)
            )?.label ?? "Admin"}
          </h1>
          <Link
            to="/admin/inquiries"
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Notification03Icon size={22} />
            {unreadInquiries > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                {unreadInquiries}
              </span>
            )}
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
