import { app } from "../../../firebase/server"; // Adjust the path as needed
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { Timestamp } from "firebase-admin/firestore";

// Initialize Firestore
const db = getFirestore(app);

export async function GET() {
  try {
    // Assuming user authentication is already set up and user ID is available
    const userId = "yourUserId"; // Replace with actual logic for getting authenticated user

    const tasksRef = db.collection("users").doc(userId).collection("tasks");
    const tasksSnapshot = await tasksRef.get();

    const tasks = tasksSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        isComplete: data.isComplete,
        completedAt: data.completedAt instanceof Timestamp ? data.completedAt.toDate().toLocaleDateString() : null, // Formatting the completedAt to a string date
      };
    });

    // Filter out only completed tasks
    const completedDates = tasks
      .filter((task) => task.isComplete && task.completedAt)
      .map((task) => task.completedAt);

    return new Response(
      JSON.stringify({ completedDates }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching completed dates:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch completed dates" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
