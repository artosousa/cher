import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const db = getFirestore(app);
const auth = getAuth(app);

// POST: Create New Task (Form Submission)
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
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
  const isComplete = formData.get("isComplete") === "on";

  if (!name) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    // Create new task document in Firestore
    const newTaskRef = db.collection("users").doc(userId).collection("tasks").doc();
    await newTaskRef.set({
      name,
      isComplete,
      createdAt: new Date(), // Store the creation date of the task
      completedAt: isComplete ? new Date() : null, // If the task is complete, set completedAt
    });

    return redirect("/dashboard"); // Redirect to dashboard after task creation
  } catch (error) {
    console.error("Error creating task:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// PATCH: Update Task Completion Status
export const PATCH: APIRoute = async ({ request, params, cookies }) => {
  const { id } = params; // Get task ID from URL params
  let userId: string | undefined;

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
    // Get task data from the request body
    const { isComplete } = await request.json();
    if (!id) {
      return new Response("Task ID is missing", { status: 400 });
    }

    const taskRef = db.collection("users").doc(userId).collection("tasks").doc(id);

    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return new Response("Task not found", { status: 404 });
    }

    // Update the task document with the new completion status
    await taskRef.update({
      isComplete,
      completedAt: isComplete ? new Date() : null, // Set completedAt to current date if complete
    });

    return new Response("Task updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return new Response("Failed to update task", { status: 500 });
  }
};
