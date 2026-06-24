import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase";

export const auth = getAuth(app);

export async function initializeAuth() {
  try {
    if (!auth.currentUser) {
      const result = await signInAnonymously(auth);
      console.log("Anonymous user signed in:", result.user.uid);
      return result.user;
    }

    return auth.currentUser;
  } catch (error) {
    console.error("Anonymous auth failed:", error);
    throw error;
  }
}

export function listenToAuthChanges(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth).catch((err) =>
        console.error("Auto anonymous sign-in failed:", err)
      );
    }

    callback?.(user);
  });
}