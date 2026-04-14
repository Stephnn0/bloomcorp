import { getCurrentUser } from "~/auth.server";
import db from "~/db.server";
import { createEmployee, updateEmployee, deleteEmployee } from "../../../models/employee";

export default async function action({ request }: { request: Request }) {
  const user = await getCurrentUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      birthday: (formData.get("birthday") as string) || undefined,
      hireDate: (formData.get("hireDate") as string) || undefined,
      department: (formData.get("department") as string) || undefined,
      position: (formData.get("position") as string) || undefined,
      companyId: formData.get("companyId") as string,
      teamId: user.teamId,
    };
    try {
      const employee = await createEmployee(data, db);
      return { success: true, employee };
    } catch (error: any) {
      return { errors: error.message };
    }
  }

  if (intent === "update") {
    const id = formData.get("id") as string;
    const data = {
      firstName: (formData.get("firstName") as string) || undefined,
      lastName: (formData.get("lastName") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      birthday: (formData.get("birthday") as string) || undefined,
      hireDate: (formData.get("hireDate") as string) || undefined,
      department: (formData.get("department") as string) || undefined,
      position: (formData.get("position") as string) || undefined,
    };
    try {
      const employee = await updateEmployee(id, user.teamId, data, db);
      return { success: true, employee };
    } catch (error: any) {
      return { errors: error.message };
    }
  }

  if (intent === "delete") {
    const id = formData.get("id") as string;
    try {
      await deleteEmployee(id, user.teamId, db);
      return { success: true };
    } catch (error: any) {
      return { errors: error.message };
    }
  }

  return { errors: "Invalid intent" };
}
