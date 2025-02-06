import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app);
  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];

  let userId;

  // Ensure user has provided a token for authentication
  if (!idToken) {
    return new Response("No token found", { status: 401 });
  }

  try {
    // Verify the token and extract the user ID
    const decodedToken = await auth.verifyIdToken(idToken);
    userId = decodedToken.uid;
  } catch (error) {
    return new Response("Invalid token", { status: 401 });
  }

  const formData = await request.formData();

  // Extract other form data fields
  const name = formData.get("name") as string;
  

  

  

  try {
    const db = getFirestore(app);
    const tasksRef = db.collection("users").doc(userId).collection("tasks");


    await tasksRef.add({
      name
    });
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong", { status: 500 });
  }

  // Redirect to the dashboard after successful operation
  return redirect("/dashboard");
};
