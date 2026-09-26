import { initializeApp, getApps } from "firebase/app";
import { Auth, getAuth, initializeAuth, inMemoryPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

export const ADMIN_EMAIL = "admin@realtorsmedia.com";

export interface IsolatedFirebase {
  auth: Auth;
  db: Firestore;
}

const instances = new Map<string, IsolatedFirebase>();

/**
 * A separate Firebase app whose auth lives only in memory. Signing in here never replaces
 * (or persists over) the visitor's own session on the main `auth` instance, and Firestore
 * calls made through its `db` are authenticated as the user signed in on this instance.
 */
export function getIsolatedFirebase(name: string): IsolatedFirebase {
  const cached = instances.get(name);
  if (cached) return cached;

  const app = getApps().find((a) => a.name === name) || initializeApp(firebaseConfig, name);
  let auth: Auth;
  try {
    auth = initializeAuth(app, { persistence: inMemoryPersistence });
  } catch {
    // Already initialized (e.g. after hot reload)
    auth = getAuth(app);
  }
  const instance = { auth, db: getFirestore(app) };
  instances.set(name, instance);
  return instance;
}

/** Admin session used for issuing ID cards; memory-only, so it ends when the page is closed or reloaded. */
export const getAdminFirebase = () => getIsolatedFirebase("admin-session");

/**
 * Signs the admin in on the isolated admin session. Throws if the credentials are wrong
 * or belong to a non-admin account.
 */
export async function signInAdmin(email: string, password: string) {
  const { auth } = getAdminFirebase();
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  if (cred.user.email?.toLowerCase().trim() !== ADMIN_EMAIL) {
    await signOut(auth).catch(() => { });
    throw Object.assign(new Error("Access denied: only the authorized administrator account can do this."), {
      code: "app/not-admin",
    });
  }
  return cred.user;
}

export async function signOutAdmin() {
  await signOut(getAdminFirebase().auth).catch(() => { });
}
