import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect, cookies }) => {
  // Delete the session cookie
  cookies.delete("__session", {
    path: "/",
  });

  // Optionally, you can also clear any other cookies related to authentication here

  // Redirect the user to the homepage or sign-in page after sign out
  return redirect("/");
};
