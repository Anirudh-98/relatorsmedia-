import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "./config";

export interface MemberProfileData {
  uid: string;
  fullName: string;
  name?: string;
  phone: string;
  mobile?: string;
  email: string;
  city: string;
  state: string;
  location?: string;
  agencyName?: string;
  companyName?: string;
  licenseNumber?: string;
  reraNo?: string;
  experience?: string;
  experienceYears?: string;
  specialization?: string;
  photoUrl?: string;
  photo?: string;
  memberType: "realtor" | "builder" | "professional";
  selectedTier: "green" | "blue" | "orange";
  tier?: string;
  employeeId: string;
  department: string;
  designation: string;
  verificationUrl: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  issuedDate: string;
  validTill: string;
  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
}

export interface IdCardRecordData {
  employeeId: string;
  fullName: string;
  name?: string;
  phone: string;
  mobile?: string;
  email: string;
  location: string;
  agencyName?: string;
  licenseNumber?: string;
  experience?: string;
  specialization?: string;
  photoUrl: string;
  photo?: string;
  cardTier: string;
  department: string;
  designation: string;
  issuedDate: string;
  validTill: string;
  status: string;
  verificationUrl: string;
  uid?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface PropertyListingData {
  id?: string;
  title: string;
  propertyType: string;
  listingType: string;
  city: string;
  locality: string;
  price: string;
  area: string;
  bhk: string;
  reraNumber?: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  description?: string;
  imageUrl?: string;
  authorUid?: string;
  status: "Active" | "Under Offer" | "Sold";
  views?: number;
  leads?: number;
  createdAt?: Timestamp | any;
}

export interface LeadInquiryData {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  propertyId?: string;
  propertyName: string;
  budget?: string;
  message?: string;
  memberUid?: string;
  status: "New" | "Contacted" | "Site Visit Scheduled" | "Closed";
  createdAt?: Timestamp | any;
}

// ----------------------------------------------------
// Member Profiles (Firestore: `members/{uid}`)
// ----------------------------------------------------

export async function saveMemberProfile(uid: string, data: Partial<MemberProfileData>): Promise<void> {
  const memberRef = doc(db, "members", uid);
  await setDoc(
    memberRef,
    {
      ...data,
      uid,
      updatedAt: serverTimestamp(),
      createdAt: data.createdAt || serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getMemberProfile(uid: string): Promise<MemberProfileData | null> {
  const memberRef = doc(db, "members", uid);
  const snap = await getDoc(memberRef);
  if (snap.exists()) {
    return snap.data() as MemberProfileData;
  }
  return null;
}

export async function getMemberByEmployeeId(employeeId: string): Promise<MemberProfileData | null> {
  const q = query(collection(db, "members"), where("employeeId", "==", employeeId), limit(1));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return snap.docs[0].data() as MemberProfileData;
  }
  return null;
}

// ----------------------------------------------------
// ID Cards Registry (Firestore: `idCards/{employeeId}`)
// ----------------------------------------------------

export async function saveIdCardRecord(cardData: IdCardRecordData): Promise<void> {
  const cardRef = doc(db, "idCards", cardData.employeeId);
  await setDoc(
    cardRef,
    {
      ...cardData,
      updatedAt: serverTimestamp(),
      createdAt: cardData.createdAt || serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getIdCardRecord(employeeId: string): Promise<IdCardRecordData | null> {
  const cardRef = doc(db, "idCards", employeeId);
  const snap = await getDoc(cardRef);
  if (snap.exists()) {
    return snap.data() as IdCardRecordData;
  }
  return null;
}

// ----------------------------------------------------
// Property Listings (Firestore: `properties/{id}`)
// ----------------------------------------------------

export async function createPropertyListing(listing: PropertyListingData): Promise<string> {
  const colRef = collection(db, "properties");
  const docRef = await addDoc(colRef, {
    ...listing,
    status: listing.status || "Active",
    views: listing.views || 1,
    leads: listing.leads || 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getProperties(filterCategory?: string): Promise<PropertyListingData[]> {
  try {
    let q = query(collection(db, "properties"), orderBy("createdAt", "desc"), limit(50));
    if (filterCategory && filterCategory !== "All") {
      q = query(
        collection(db, "properties"),
        where("propertyType", "==", filterCategory),
        orderBy("createdAt", "desc"),
        limit(50)
      );
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PropertyListingData));
  } catch (error) {
    console.warn("Firestore getProperties query fallback:", error);
    // Fallback if index is not ready yet
    const snap = await getDocs(collection(db, "properties"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PropertyListingData));
  }
}

export async function getMemberListings(authorUid: string): Promise<PropertyListingData[]> {
  try {
    const q = query(
      collection(db, "properties"),
      where("authorUid", "==", authorUid),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PropertyListingData));
  } catch (error) {
    console.warn("Firestore getMemberListings error:", error);
    return [];
  }
}

// ----------------------------------------------------
// Direct Leads & Inquiries (Firestore: `leads/{id}`)
// ----------------------------------------------------

export async function createLeadInquiry(lead: LeadInquiryData): Promise<string> {
  const colRef = collection(db, "leads");
  const docRef = await addDoc(colRef, {
    ...lead,
    status: lead.status || "New",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getMemberLeads(memberUid: string): Promise<LeadInquiryData[]> {
  try {
    const q = query(
      collection(db, "leads"),
      where("memberUid", "==", memberUid),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeadInquiryData));
  } catch (error) {
    console.warn("Firestore getMemberLeads error:", error);
    return [];
  }
}

// ----------------------------------------------------
// Sequential ID Counter (Starts from 1111 -> 1112 -> 1113...)
// ----------------------------------------------------

export async function getNextEmployeeId(tier: "green" | "blue" | "orange" | "red" | string): Promise<string> {
  const prefix = tier === "orange" || tier === "red" ? "RM-A" : tier === "blue" ? "RM-B" : "RM-C";
  const counterRef = doc(db, "counters", "memberSequence");

  try {
    const nextSeq = await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      let current = 1110;
      if (counterSnap.exists()) {
        const data = counterSnap.data();
        current = typeof data.currentSequence === "number" ? data.currentSequence : 1110;
      }
      const next = current + 1;
      transaction.set(counterRef, { currentSequence: next, updatedAt: serverTimestamp() }, { merge: true });
      return next;
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("rm_member_seq", nextSeq.toString());
    }
    return `${prefix}-${nextSeq}`;
  } catch (err) {
    console.warn("Transaction counter fallback:", err);
    let next = 1111;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rm_member_seq");
      if (stored) {
        next = parseInt(stored, 10) + 1;
      }
      localStorage.setItem("rm_member_seq", next.toString());
    }
    return `${prefix}-${next}`;
  }
}

export async function peekNextEmployeeId(tier: "green" | "blue" | "orange" | "red" | string): Promise<string> {
  const prefix = tier === "orange" || tier === "red" ? "RM-A" : tier === "blue" ? "RM-B" : "RM-C";
  const counterRef = doc(db, "counters", "memberSequence");

  try {
    const snap = await getDoc(counterRef);
    let current = 1110;
    if (snap.exists()) {
      const data = snap.data();
      current = typeof data.currentSequence === "number" ? data.currentSequence : 1110;
    }
    return `${prefix}-${current + 1}`;
  } catch {
    let next = 1111;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rm_member_seq");
      if (stored) {
        next = parseInt(stored, 10) + 1;
      }
    }
    return `${prefix}-${next}`;
  }
}
