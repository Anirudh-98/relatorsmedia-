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
import { saveMemberProfile, getMemberProfile, MemberProfileData, getNextEmployeeId, saveIdCardRecord } from "./db";
import { uploadMemberPhoto } from "./storage";

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
}

/**
 * Register a new member in Firebase Auth, upload their ID photograph to Firebase Storage,
 * and save their complete profile and ID card record in Firestore.
 */
export async function registerMember(params: RegisterMemberParams): Promise<{ user: User; profile: MemberProfileData }> {
  // 1. Create Firebase Auth user or sign in if already exists
  let user: User;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, params.email, params.password);
    user = userCredential.user;
  } catch (authErr: any) {
    if (authErr?.code === "auth/email-already-in-use") {
      try {
        const signInCredential = await signInWithEmailAndPassword(auth, params.email, params.password);
        user = signInCredential.user;
      } catch (signInErr: any) {
        throw new Error(
          "An account with this email already exists. Please enter your existing password to update your ID card, or sign in first."
        );
      }
    } else {
      throw authErr;
    }
  }

  // 2. Generate Member Employee ID sequentially starting from 1111
  const generatedEmpId = params.employeeId || (await getNextEmployeeId(params.selectedTier));

  // 3. Upload photo to Firebase Storage if provided
  let photoUrl = "/images/realtor_ramnath.jpg";
  if (params.photoDataUrlOrFile) {
    try {
      photoUrl = await uploadMemberPhoto(params.photoDataUrlOrFile, user.uid);
    } catch (err) {
      console.warn("Storage photo upload warning:", err);
      if (typeof params.photoDataUrlOrFile === "string") {
        photoUrl = params.photoDataUrlOrFile;
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

  const resolvedLocation = params.location || (params.city && params.state ? `${params.city}, ${params.state}` : params.city || "Hyderabad, Telangana");
  const resolvedAgency = params.agencyName || params.companyName || "";
  const resolvedLicense = params.licenseNumber || params.reraNo || "N/A";
  const resolvedExperience = params.experience || params.experienceYears || "1";

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
    companyName: resolvedAgency || `${params.fullName} Realty`,
    licenseNumber: resolvedLicense,
    reraNo: resolvedLicense,
    experience: resolvedExperience,
    experienceYears: resolvedExperience,
    specialization: params.specialization || "Residential & Commercial",
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
  };

  // 6. Save in Firestore members and idCards collections
  await saveMemberProfile(user.uid, profileData);
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
    specialization: params.specialization || "Residential & Commercial",
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
  });

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
