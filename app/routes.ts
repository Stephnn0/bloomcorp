import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  // -------------------------
  // Public routes (with layout)
  // -------------------------
  layout("./layouts/public/PublicLayout.tsx", [
    route("/", "./layouts/public/routes/home/Home.tsx"),
    route("/contact", "./layouts/public/routes/contact/Contact.tsx"),
  ]),

  // -------------------------
  // Auth routes (no layout)
  // -------------------------
  route("/login", "./pages/Login.tsx"),
  route("/register", "./pages/Register.tsx"),

  // -------------------------
  // Admin routes (with layout)
  // -------------------------
  layout("./layouts/admin/AdminLayout.tsx", [
    route("/admin", "./layouts/admin/routes/dashboard/Dashboard.tsx"),
    route("/admin/companies", "./layouts/admin/routes/companies/Companies.tsx"),
    route("/admin/employees", "./layouts/admin/routes/employees/Employees.tsx"),
    route("/admin/flowers", "./layouts/admin/routes/flowers/Flowers.tsx"),
    route("/admin/orders", "./layouts/admin/routes/orders/Orders.tsx"),
    route("/admin/team", "./layouts/admin/routes/team/Team.tsx"),
    route("/admin/inquiries", "./layouts/admin/routes/inquiries/Inquiries.tsx"),
  ]),

  // -------------------------
  // Auth API
  // -------------------------
  route("/api/auth/session", "./routes/api.auth.session.ts"),
  route("/api/auth/register", "./routes/api.auth.register.ts"),

  // -------------------------
  // API routes
  // -------------------------
  route("/api/admin/companies", "./layouts/admin/routes/api.admin.companies/route.ts"),
  route("/api/admin/employees", "./layouts/admin/routes/api.admin.employees/route.ts"),
  route("/api/admin/flowers", "./layouts/admin/routes/api.admin.flowers/route.ts"),
  route("/api/admin/orders", "./layouts/admin/routes/api.admin.orders/route.ts"),
  route("/api/admin/team", "./layouts/admin/routes/api.admin.team/route.ts"),
  route("/api/admin/inquiries", "./layouts/admin/routes/api.admin.inquiries/route.ts"),
  route("/api/contact", "./routes/api.contact.ts"),
  route("/api/upload", "./routes/api.upload.ts"),
] satisfies RouteConfig;
