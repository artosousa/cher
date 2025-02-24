import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "../../../firebase/server";

export const POST: APIRoute = async ({ request, redirect }) => {
  const auth = getAuth(app);

  /* Get form data */
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();

  if (!email || !password || !name) {
    return new Response("Missing form data", { status: 400 });
  }

  try {
    console.log("Attempting to create user with email:", email);
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });
    console.log("User created:", userRecord);
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response("Something went wrong", { status: 400 });
  }
  
  return redirect("/");
};
