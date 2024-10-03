import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app);
  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];

  // Initialize userId variable
  let userId;

  // Verify the ID token to authenticate the user
  if (!idToken) {
    return new Response("No token found", { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    userId = decodedToken.uid; // Extract the user ID from the token
  } catch (error) {
    return new Response("Invalid token", { status: 401 });
  }

  // Handle JSON data
  const friendData = await request.json(); // Read the JSON body directly
  const name = friendData.name;
  const age = friendData.age;
  const isBestFriend = friendData.isBestFriend;

  // Validate input
  if (!name || !age) {
    return new Response("Missing required fields", {
      status: 400,
    });
  }

  try {
    const db = getFirestore(app);
    const friendsRef = db.collection("users").doc(userId).collection("friends"); // Create a subcollection for the user's friends
    await friendsRef.add({
      name,
      age: parseInt(age, 10),
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
