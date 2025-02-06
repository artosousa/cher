// /src/pages/api/tasks/completed-dates.ts
import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const db = getFirestore(app);
const auth = getAuth(app);

export const GET: APIRoute = async ({ request, cookies }) => {
  let userId: string | undefined;

  // Authenticate user via session cookie
  if (cookies.has("__session")) {
    const sessionCookie = cookies.get("__session")?.value ?? "";
    try {
      const decodedCookie = await auth.verifySessionCookie(sessionCookie);
      userId = decodedCookie.uid;
    } catch (error) {
      return new Response("Failed to verify session", { status: 401 });
    }
  }

  if (!userId) {
    return new Response("User not authenticated", { status: 401 });
  }

  try {
    // Fetch tasks from Firestore
    const tasksSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("tasks")
      .where("isComplete", "==", true)
      .get();

    const completedDates = tasksSnapshot.docs.map((doc) => {
      const data = doc.data();
      return data.completedAt ? data.completedAt.toDate().toLocaleDateString() : '';
    });

    // Return completed dates as JSON
    return new Response(JSON.stringify(completedDates), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching completed task dates:", error);
    return new Response("Error fetching task data", { status: 500 });
  }
};
