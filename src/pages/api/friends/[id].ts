import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const db = getFirestore(app);
const auth = getAuth(app);

export const POST: APIRoute = async ({ params, redirect, request, cookies }) => {
  // Verify user authentication
  let userId;
  if (cookies.has("__session")) {
    const sessionCookie = cookies.get("__session")?.value ?? "";
    const decodedCookie = await auth.verifySessionCookie(sessionCookie);
    userId = decodedCookie.uid;
  }

  if (!userId) {
    return new Response("User not authenticated", { status: 401 });
  }

  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const age = formData.get("age")?.toString();
  const isBestFriend = formData.get("isBestFriend") === "on";

  if (!name || !age) {
    return new Response("Missing required fields", {
      status: 400,
    });
  }

  if (!params.id) {
    return new Response("Cannot find friend", {
      status: 404,
    });
  }

  try {
    // Update the friend's details in the user's specific friends subcollection
    await db
      .collection("users")
      .doc(userId)
      .collection("friends")
      .doc(params.id)
      .update({
        name,
        age: parseInt(age),
        isBestFriend,
      });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return new Response("Something went wrong", {
      status: 500,
    });
  }

  return redirect("/dashboard");
};

export const DELETE: APIRoute = async ({ params, redirect, cookies }) => {
  // Verify user authentication
  let userId;
  if (cookies.has("__session")) {
    const sessionCookie = cookies.get("__session")?.value ?? "";
    const decodedCookie = await auth.verifySessionCookie(sessionCookie);
    userId = decodedCookie.uid;
  }

  if (!userId) {
    return new Response("User not authenticated", { status: 401 });
  }

  if (!params.id) {
    return new Response("Cannot find friend", {
      status: 404,
    });
  }

  try {
    // Delete the friend from the user's specific friends subcollection
    await db.collection("users").doc(userId).collection("friends").doc(params.id).delete();
  } catch (error) {
    console.error(error); // Log the error for debugging
    return new Response("Something went wrong", {
      status: 500,
    });
  }

  return redirect("/dashboard");
};
