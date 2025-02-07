import type { ServiceAccount } from "firebase-admin";
import { initializeApp, cert, getApps } from "firebase-admin/app";

// Ensure Firebase is only initialized once
const activeApps = getApps();

// Properly format the private key (fixes JSON parsing issues)
const privateKey = import.meta.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

// Define the service account object
const serviceAccount = {
  type: "service_account",
  project_id: import.meta.env.FIREBASE_PROJECT_ID,
  private_key_id: import.meta.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: privateKey,
  client_email: import.meta.env.FIREBASE_CLIENT_EMAIL,
  client_id: import.meta.env.FIREBASE_CLIENT_ID,
  auth_uri: import.meta.env.FIREBASE_AUTH_URI,
  token_uri: import.meta.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: import.meta.env.FIREBASE_AUTH_CERT_URL,
  client_x509_cert_url: import.meta.env.FIREBASE_CLIENT_CERT_URL,
};

// Function to initialize Firebase Admin SDK
const initApp = () => {
  if (activeApps.length > 0) {
    console.info("Firebase Admin is already initialized.");
    return activeApps[0];
  }

  if (import.meta.env.PROD) {
    console.info("PROD environment detected. Using default service account.");
    return initializeApp();
  }

  console.info("Initializing Firebase Admin SDK with service account.");
  return initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });
};

// Initialize Firebase app
export const app = initApp();
