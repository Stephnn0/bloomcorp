import db from "~/db.server";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const companyName = (formData.get("companyName") as string) || undefined;
  const message = formData.get("message") as string;

  if (!firstName || !lastName || !email || !message) {
    return Response.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await db.inquiry.create({
      data: { firstName, lastName, email, companyName, message },
    });
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
