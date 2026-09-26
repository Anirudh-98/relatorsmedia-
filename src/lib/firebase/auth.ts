import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged,
  NextOrObserver,
} from "firebase/auth";
import { auth, db } from "./config";
import { getIsolatedFirebase } from "./isolated";
import type { IssuedBy } from "./staff";
import {
  saveMemberProfile,
  getMemberProfile,
  getMemberByEmail,
  getMemberByEmployeeId,
  MemberProfileData,
  getNextEmployeeId,
  getPrefixForTier,
  saveIdCardRecord,
  retireIdCardRecord,
} from "./db";
import { uploadMemberPhoto, toFirestoreSafePhoto } from "./storage";

export interface RegisterMemberParams {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  location?: string;
  agencyName?: string;
  licenseNumber?: string;
  experience?: string;
  reraNo?: string;
  experienceYears?: string;
  specialization?: string;
  companyName?: string;
  memberType: "realtor" | "builder" | "professional";
  selectedTier: "green" | "blue" | "orange";
  photoDataUrlOrFile?: File | string;
  employeeId?: string;
  department?: string;
  designation?: string;
  /**
   * Create the member's account without touching the current browser session
   * (used when an admin issues a card for someone else).
   */
  keepCurrentSession?: boolean;
  /** The card issuer who generated this card, recorded for the admin dashboard. */
  issuedBy?: IssuedBy;
}

/**
 * Register a new member in Firebase Auth, upload their ID photograph to Firebase Storage,
 * and save their complete profile and ID card record in Firestore.
 */
export async function registerMember(params: RegisterMemberParams): Promise<{ user: User; profile: MemberProfileData }> {
  // 1. Create Firebase Auth user or sign in if already exists
  // keepCurrentSession: create and write as the new member on a memory-only session, so the
  // browser's own login (or lack of one) is untouched and Firestore rules see the member's uid
  const isolated = params.keepCurrentSession ? getIsolatedFirebase("member-registration") : null;
  const targetAuth = isolated?.auth ?? auth;
  const targetDb = isolated?.db ?? db;
  let user: User;
  let existingProfile: MemberProfileData | null = null;
  try {
    const userCredential = await createUserWithEmailAndPassword(targetAuth, params.email, params.password);
    user = userCredential.user;
  } catch (authErr: any) {
    if (authErr?.code === "auth/email-already-in-use") {
      try {
        const signInCredential = await signInWithEmailAndPassword(targetAuth, params.email, params.password);
        user = signInCredential.user;
        existingProfile = await getMemberProfile(user.uid, user.email, targetDb).catch(() => null);
      } catch (signInErr: any) {
        throw new Error(
          "An account with this email already exists. Please enter your existing password to update your ID card, or sign in first."
        );
      }
    } else {
      throw authErr;
    }
  }

  // 2. Reuse the existing account's Member ID when the tier is unchanged,
  //    otherwise generate the next sequential ID (starting from 1111)
  const existingEmpId = existingProfile?.employeeId || "";
  const reuseExistingId =
    !params.employeeId && !!existingEmpId && existingEmpId.startsWith(`${getPrefixForTier(params.selectedTier)}-`);
  const generatedEmpId = params.employeeId
    ? params.employeeId.trim()
    : reuseExistingId
    ? existingEmpId
    : await getNextEmployeeId(params.selectedTier);

  // 3. Upload photo to Firebase Storage if provided
  let photoUrl = "";
  if (params.photoDataUrlOrFile) {
    try {
      photoUrl = await uploadMemberPhoto(params.photoDataUrlOrFile, user.uid);
    } catch (err) {
      console.warn("Storage photo upload warning:", err);
      if (typeof params.photoDataUrlOrFile === "string") {
        photoUrl = await toFirestoreSafePhoto(params.photoDataUrlOrFile);
      }
    }
  }

  // 4. Update Firebase Auth Profile
  // Firebase Auth photoURL has a strict limit (under 2048 chars, HTTP/HTTPS only).
  // Base64 data URLs trigger 'auth/invalid-profile-attribute (Photo URL too long)'.
  const safeAuthPhotoUrl =
    photoUrl && !photoUrl.startsWith("data:") && photoUrl.length < 2048
      ? photoUrl
      : undefined;

  try {
    await updateProfile(user, {
      displayName: params.fullName,
      ...(safeAuthPhotoUrl ? { photoURL: safeAuthPhotoUrl } : {}),
    });
  } catch (profileErr) {
    console.warn("Auth updateProfile warning:", profileErr);
  }

  // 5. Construct full member profile
  const department =
    params.department ||
    (params.memberType === "realtor"
      ? "Property Brokerage Cell"
      : params.memberType === "builder"
      ? "Developer Projects Wing"
      : "Allied Services Cell");

  const designation =
    params.designation ||
    (params.memberType === "realtor"
      ? params.selectedTier === "orange"
        ? "VIP ELITE REALTOR"
        : params.selectedTier === "blue"
        ? "EXECUTIVE REALTOR"
        : "VERIFIED REALTOR"
      : params.memberType === "builder"
      ? "BUILDER / DEVELOPER"
      : "INDUSTRY PROFESSIONAL");

  const currentDate = new Date();
  const monthLabel = currentDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
  // Re-registering an existing card keeps its original issue/expiry dates
  const issuedDate =
    (reuseExistingId && existingProfile?.issuedDate) ||
    `${currentDate.getDate()} ${monthLabel} ${currentDate.getFullYear()}`;
  const validTill =
    (reuseExistingId && existingProfile?.validTill) ||
    `${currentDate.getDate()} ${monthLabel} ${currentDate.getFullYear() + 2}`;

  const resolvedLocation = params.location || (params.city && params.state ? `${params.city}, ${params.state}` : params.city || "Hyderabad, Telangana");
  const resolvedAgency = params.agencyName || params.companyName || "";
  const resolvedLicense = params.licenseNumber || params.reraNo || "";
  const resolvedExperience = params.experience || params.experienceYears || "";

  const profileData: MemberProfileData = {
    uid: user.uid,
    fullName: params.fullName,
    name: params.fullName,
    email: params.email,
    phone: params.phone,
    mobile: params.phone,
    city: params.city,
    state: params.state,
    location: resolvedLocation,
    agencyName: resolvedAgency,
    companyName: resolvedAgency,
    licenseNumber: resolvedLicense,
    reraNo: resolvedLicense,
    experience: resolvedExperience,
    experienceYears: resolvedExperience,
    specialization: params.specialization || "Residential Properties",
    photoUrl,
    photo: photoUrl,
    memberType: params.memberType,
    selectedTier: params.selectedTier,
    tier: params.selectedTier,
    employeeId: generatedEmpId,
    department,
    designation,
    verificationUrl: `https://www.realtorsmedia.world/verify/${generatedEmpId}`,
    status: "ACTIVE",
    issuedDate,
    validTill,
    ...(params.issuedBy ? { issuedBy: params.issuedBy } : {}),
  };

  // 6. Save in Firestore members and idCards collections
  await saveMemberProfile(user.uid, profileData, targetDb);
  await saveIdCardRecord({
    employeeId: generatedEmpId,
    fullName: params.fullName,
    name: params.fullName,
    phone: params.phone,
    mobile: params.phone,
    email: params.email,
    location: resolvedLocation,
    agencyName: resolvedAgency,
    licenseNumber: resolvedLicense,
    experience: resolvedExperience,
    specialization: params.specialization || "Residential Properties",
    photoUrl,
    photo: photoUrl,
    cardTier: params.selectedTier,
    department,
    designation,
    issuedDate,
    validTill,
    status: "ACTIVE",
    verificationUrl: `https://www.realtorsmedia.world/verify/${generatedEmpId}`,
    uid: user.uid,
    ...(params.issuedBy ? { issuedBy: params.issuedBy } : {}),
  }, targetDb);

  // Moving to a different tier issues a new ID: the old card must stop verifying
  if (existingEmpId && !reuseExistingId) {
    await retireIdCardRecord(existingEmpId, generatedEmpId, targetDb).catch((err) =>
      console.warn("Could not retire previous ID card:", err)
    );
  }

  if (params.keepCurrentSession) {
    await signOut(targetAuth).catch(() => {});
  }

  return { user, profile: profileData };
}

/**
 * Sign in an existing member with email and password
 */
export async function loginMember(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Sign out current member
 */
export async function logoutMember(): Promise<void> {
  await signOut(auth);
}

/**
 * Sends a password reset link to a registered member's email.
 * `identifier` is the member's registered email or Member ID; it is looked up in the database
 * first, and the link always goes to the email on record. Returns that email.
 * Throws with code "app/member-not-found" if no registered member matches.
 */
export async function resetMemberPassword(identifier: string): Promise<string> {
  const value = identifier.trim();
  const member = value.includes("@") ? await getMemberByEmail(value) : await getMemberByEmployeeId(value);
  const email = member?.email?.trim();
  if (!email) {
    throw Object.assign(new Error("No registered member was found with this email or Member ID."), {
      code: "app/member-not-found",
    });
  }
  await sendPasswordResetEmail(auth, email);
  return email;
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
