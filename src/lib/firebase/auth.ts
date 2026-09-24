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
import { auth } from "./config";
import { saveMemberProfile, getMemberProfile, MemberProfileData, getNextEmployeeId } from "./db";
import { uploadMemberPhoto } from "./storage";

export interface RegisterMemberParams {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  reraNo?: string;
  experienceYears?: string;
  specialization?: string;
  companyName?: string;
  memberType: "realtor" | "builder" | "professional";
  selectedTier: "green" | "blue" | "orange";
  photoDataUrlOrFile?: File | string;
  employeeId?: string;
}

/**
 * Register a new member in Firebase Auth, upload their ID photograph to Firebase Storage,
 * and save their complete profile in Firestore.
 */
export async function registerMember(params: RegisterMemberParams): Promise<{ user: User; profile: MemberProfileData }> {
  // 1. Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, params.email, params.password);
  const user = userCredential.user;

  // 2. Generate Member Employee ID sequentially starting from 1111
  const generatedEmpId = params.employeeId || (await getNextEmployeeId(params.selectedTier));

  // 3. Upload photo to Firebase Storage if provided
  let photoUrl = "/images/rohan_deshmukh.png";
  if (params.photoDataUrlOrFile) {
    try {
      photoUrl = await uploadMemberPhoto(params.photoDataUrlOrFile, user.uid);
    } catch (err) {
      console.warn("Storage photo upload warning:", err);
      if (typeof params.photoDataUrlOrFile === "string" && !params.photoDataUrlOrFile.startsWith("data:")) {
        photoUrl = params.photoDataUrlOrFile;
      }
    }
  }

  // 4. Update Firebase Auth Profile
  await updateProfile(user, {
    displayName: params.fullName,
    photoURL: photoUrl,
  });

  // 5. Construct full member profile
  const department =
    params.memberType === "realtor"
      ? "Property Brokerage Cell"
      : params.memberType === "builder"
      ? "Developer Projects Wing"
      : "Allied Services Cell";

  const designation =
    params.memberType === "realtor"
      ? params.selectedTier === "orange"
        ? "VIP ELITE REALTOR"
        : params.selectedTier === "blue"
        ? "EXECUTIVE REALTOR"
        : "VERIFIED REALTOR"
      : params.memberType === "builder"
      ? "BUILDER / DEVELOPER"
      : "INDUSTRY PROFESSIONAL";

  const currentDate = new Date();
  const issuedDate = `${currentDate.getDate()} ${currentDate.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${currentDate.getFullYear()}`;
  const validTill = `${currentDate.getDate()} ${currentDate.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${currentDate.getFullYear() + 2}`;

  const profileData: MemberProfileData = {
    uid: user.uid,
    fullName: params.fullName,
    email: params.email,
    phone: params.phone,
    city: params.city,
    state: params.state,
    reraNo: params.reraNo || "N/A",
    experienceYears: params.experienceYears || "1",
    specialization: params.specialization || "Residential & Commercial",
    companyName: params.companyName || `${params.fullName} Realty`,
    photoUrl,
    memberType: params.memberType,
    selectedTier: params.selectedTier,
    employeeId: generatedEmpId,
    department,
    designation,
    verificationUrl: `https://realtorsmedia.com/verify/${generatedEmpId}`,
    status: "ACTIVE",
    issuedDate,
    validTill,
  };

  // 6. Save in Firestore
  await saveMemberProfile(user.uid, profileData);

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
 * Send password reset email via Firebase Auth
 */
export async function resetMemberPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
