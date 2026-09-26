import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { collection, doc, Firestore, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { ADMIN_EMAIL, getIsolatedFirebase } from "./isolated";
import type { IdCardRecordData, MemberProfileData } from "./db";
import { getPasswordError } from "../validation/idCardSchemas";

// Issuer login IDs are mapped to Firebase Auth emails on this domain (never shown to users)
const ISSUER_EMAIL_DOMAIN = "issuer.realtorsmedia.world";

/** Someone allowed to generate ID cards: an issuer account, or the admin. */
export interface CardIssuer {
  uid: string;
  loginId: string;
  name: string;
  role: "admin" | "issuer";
}

/** Recorded on every card and member profile issued through an issuer login. */
export type IssuedBy = Pick<CardIssuer, "uid" | "loginId" | "name">;

/** Firestore `staff/{uid}`: issuer accounts, managed only by the admin. */
export interface StaffRecord {
  uid: string;
  loginId: string;
  name: string;
  email: string;
  role: "issuer";
  active: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export function normalizeLoginId(loginId: string): string {
  return loginId.trim().toLowerCase();
}

export function isValidLoginId(loginId: string): boolean {
  return /^[a-z0-9._-]{3,30}$/.test(normalizeLoginId(loginId));
}

function loginIdToEmail(loginId: string): string {
  const id = normalizeLoginId(loginId);
  return id.includes("@") ? id : `${id}@${ISSUER_EMAIL_DOMAIN}`;
}

/** Memory-only session used while generating ID cards. */
export const getCardIssuerFirebase = () => getIsolatedFirebase("card-issuer-session");

/**
 * Signs in with an issuer login ID (or the admin email) on the memory-only card-issuer session.
 * Throws if the credentials are wrong or the account is not an active issuer.
 */
export async function signInCardIssuer(loginId: string, password: string): Promise<CardIssuer> {
  const { auth, db } = getCardIssuerFirebase();
  const email = loginIdToEmail(loginId);
  const cred = await signInWithEmailAndPassword(auth, email, password);

  if (email === ADMIN_EMAIL) {
    return { uid: cred.user.uid, loginId: "admin", name: "Administrator", role: "admin" };
  }

  const snap = await getDoc(doc(db, "staff", cred.user.uid)).catch(() => null);
  const staff = snap?.exists() ? (snap.data() as StaffRecord) : null;
  if (!staff || staff.role !== "issuer" || staff.active !== true) {
    await signOut(auth).catch(() => { });
    throw Object.assign(
      new Error(staff ? "This login has been deactivated. Please contact the administrator." : "This account is not authorized to generate ID cards."),
      { code: "app/not-issuer" }
    );
  }
  return { uid: cred.user.uid, loginId: staff.loginId, name: staff.name, role: "issuer" };
}

export function issuerLoginErrorMessage(err: unknown): string {
  const { code, message } = (err || {}) as { code?: string; message?: string };
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found" || code === "auth/invalid-email") {
    return "Incorrect Login ID or password.";
  }
  if (code === "auth/too-many-requests") return "Too many failed attempts. Please wait a moment and try again.";
  if (code === "auth/network-request-failed") return "Network error. Please check your connection and try again.";
  return message || "Sign in failed. Please try again.";
}

export async function signOutCardIssuer() {
  await signOut(getCardIssuerFirebase().auth).catch(() => { });
}

export const toIssuedBy = (issuer: CardIssuer): IssuedBy => ({
  uid: issuer.uid,
  loginId: issuer.loginId,
  name: issuer.name,
});

// ----------------------------------------------------
// Admin-only operations (pass the admin session's Firestore)
// ----------------------------------------------------

/**
 * Creates an issuer login. The Auth account is created on a throwaway memory-only session so
 * the admin stays signed in; the `staff` record is written as the admin.
 */
export async function createIssuerAccount(
  adminDb: Firestore,
  params: { name: string; loginId: string; password: string }
): Promise<StaffRecord> {
  const loginId = normalizeLoginId(params.loginId);
  if (!isValidLoginId(loginId)) {
    throw new Error("Login ID must be 3-30 characters: letters, numbers, dot, dash or underscore.");
  }
  const passwordError = getPasswordError(params.password);
  if (passwordError) throw new Error(passwordError);

  const email = loginIdToEmail(loginId);
  const { auth } = getIsolatedFirebase("issuer-provisioning");
  let uid: string;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, params.password);
    uid = cred.user.uid;
    await updateProfile(cred.user, { displayName: params.name.trim() }).catch(() => { });
  } catch (err) {
    if ((err as { code?: string })?.code === "auth/email-already-in-use") {
      throw new Error(`Login ID "${loginId}" is already taken.`);
    }
    throw err;
  } finally {
    await signOut(auth).catch(() => { });
  }

  const record: StaffRecord = {
    uid,
    loginId,
    name: params.name.trim(),
    email,
    role: "issuer",
    active: true,
  };
  await setDoc(doc(adminDb, "staff", uid), { ...record, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return record;
}

export async function setIssuerActive(adminDb: Firestore, uid: string, active: boolean): Promise<void> {
  await updateDoc(doc(adminDb, "staff", uid), { active, updatedAt: serverTimestamp() });
}

export async function listIssuers(adminDb: Firestore): Promise<StaffRecord[]> {
  const snap = await getDocs(collection(adminDb, "staff"));
  return snap.docs.map((d) => d.data() as StaffRecord).sort((a, b) => a.loginId.localeCompare(b.loginId));
}

export async function listAllIdCards(firestore: Firestore): Promise<IdCardRecordData[]> {
  const snap = await getDocs(collection(firestore, "idCards"));
  return snap.docs
    .map((d) => ({ ...(d.data() as IdCardRecordData), employeeId: (d.data().employeeId as string) || d.id }))
    .sort((a, b) => b.employeeId.localeCompare(a.employeeId, undefined, { numeric: true }));
}

export async function listAllMembers(firestore: Firestore): Promise<MemberProfileData[]> {
  const snap = await getDocs(collection(firestore, "members"));
  return snap.docs
    .map((d) => ({ ...(d.data() as MemberProfileData), uid: (d.data().uid as string) || d.id }))
    .sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
}
