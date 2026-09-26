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
  Firestore,
} from "firebase/firestore";
import { db } from "./config";
import type { IssuedBy } from "./staff";

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
  issuedBy?: IssuedBy;
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
  cardType?: "member" | "employee";
  issuedBy?: IssuedBy;
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

// Write helpers take an optional Firestore instance so an isolated session (see isolated.ts)
// writes as its own signed-in user; they default to the main app.
export async function saveMemberProfile(
  uid: string,
  data: Partial<MemberProfileData>,
  firestore: Firestore = db
): Promise<void> {
  const memberRef = doc(firestore, "members", uid);
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

export async function getMemberProfile(
  uid: string,
  email?: string | null,
  firestore: Firestore = db
): Promise<MemberProfileData | null> {
  const memberRef = doc(firestore, "members", uid);
  const snap = await getDoc(memberRef);
  if (snap.exists()) {
    return snap.data() as MemberProfileData;
  }

  // Fallback 1: Query members collection where uid == uid
  try {
    const qUid = query(collection(firestore, "members"), where("uid", "==", uid), limit(1));
    const snapUid = await getDocs(qUid);
    if (!snapUid.empty) {
      return snapUid.docs[0].data() as MemberProfileData;
    }
  } catch {}

  // Fallback 2: Query members collection by email
  if (email) {
    try {
      const qEmail = query(collection(firestore, "members"), where("email", "==", email), limit(1));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        return snapEmail.docs[0].data() as MemberProfileData;
      }
    } catch {}
  }

  // Fallback 3: Query idCards collection by email
  if (email) {
    try {
      const qCard = query(collection(firestore, "idCards"), where("email", "==", email), limit(1));
      const cardSnap = await getDocs(qCard);
      if (!cardSnap.empty) {
        const d = cardSnap.docs[0].data();
        const tier = (d.cardTier || (d.employeeId?.startsWith("RM-C") ? "green" : "blue")) as any;
        return {
          ...d,
          uid,
          fullName: d.fullName || d.name || "",
          selectedTier: tier,
          tier,
        } as unknown as MemberProfileData;
      }
    } catch {}
  }

  return null;
}

/** Registered member with this email (emails may have been saved with different letter case). */
export async function getMemberByEmail(email: string): Promise<MemberProfileData | null> {
  const clean = email.trim();
  const variants = Array.from(new Set([clean, clean.toLowerCase()]));
  const snap = await getDocs(query(collection(db, "members"), where("email", "in", variants), limit(1)));
  return snap.empty ? null : (snap.docs[0].data() as MemberProfileData);
}

export async function getMemberByEmployeeId(employeeId: string): Promise<MemberProfileData | null> {
  const cleanId = employeeId.trim();
  const upperId = cleanId.toUpperCase();
  try {
    const q = query(
      collection(db, "members"),
      where("employeeId", "in", [cleanId, upperId, cleanId.toLowerCase()]),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as MemberProfileData;
    }
  } catch {
    const q = query(collection(db, "members"), where("employeeId", "==", cleanId), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as MemberProfileData;
    }
  }
  return null;
}

// ----------------------------------------------------
// ID Cards Registry (Firestore: `idCards/{employeeId}`)
// ----------------------------------------------------

export async function saveIdCardRecord(cardData: IdCardRecordData, firestore: Firestore = db): Promise<void> {
  const cleanId = cardData.employeeId.trim();
  const cardRef = doc(firestore, "idCards", cleanId);
  await setDoc(
    cardRef,
    {
      ...cardData,
      employeeId: cleanId,
      updatedAt: serverTimestamp(),
      createdAt: cardData.createdAt || serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Marks a previously issued card as replaced so its QR code no longer verifies
 * (used when a member moves to a different tier and receives a new Member ID).
 */
export async function retireIdCardRecord(
  employeeId: string,
  replacedBy: string,
  firestore: Firestore = db
): Promise<void> {
  const cleanId = employeeId.trim();
  if (!cleanId || cleanId === replacedBy) return;
  const cardRef = doc(firestore, "idCards", cleanId);
  const snap = await getDoc(cardRef);
  if (!snap.exists()) return;
  await updateDoc(cardRef, {
    status: "SUPERSEDED",
    replacedBy,
    updatedAt: serverTimestamp(),
  });
}

export async function getIdCardRecord(employeeId: string): Promise<IdCardRecordData | null> {
  const cleanId = employeeId.trim();
  const cardRef = doc(db, "idCards", cleanId);
  const snap = await getDoc(cardRef);
  if (snap.exists()) {
    return snap.data() as IdCardRecordData;
  }

  // Also try uppercase if employeeId was lowercase
  const upperId = cleanId.toUpperCase();
  if (upperId !== cleanId) {
    const upperRef = doc(db, "idCards", upperId);
    const upperSnap = await getDoc(upperRef);
    if (upperSnap.exists()) {
      return upperSnap.data() as IdCardRecordData;
    }
  }

  // Also query where employeeId == cleanId or upperId or lowerId
  try {
    const q = query(
      collection(db, "idCards"),
      where("employeeId", "in", [cleanId, upperId, cleanId.toLowerCase()]),
      limit(1)
    );
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return querySnap.docs[0].data() as IdCardRecordData;
    }
  } catch {}

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
// Database-Driven Sequential Employee ID Generator
// Checks Firestore `idCards`, `members`, and `counters`
// Starts from 1111 -> 1112 -> 1113... without duplicates
// ----------------------------------------------------

export function getPrefixForTier(tier: "green" | "blue" | "orange" | "red" | string): string {
  const t = (tier || "").toLowerCase();
  if (t === "orange" || t === "red" || t === "rm-a") return "RM-A";
  if (t === "blue" || t === "rm-b") return "RM-B";
  return "RM-C"; // Default Green Tier
}

/**
 * Queries Firestore to inspect the last generated ID card in the database
 * and finds the highest sequence number currently registered.
 * Checks across:
 * 1. `idCards` collection (checks document IDs and `employeeId` fields)
 * 2. `members` collection (checks `employeeId` fields)
 * 3. `counters/memberSequence`
 */
export async function getLastGeneratedSequenceFromDatabase(targetPrefix?: string): Promise<number> {
  let highest = 1110;

  try {
    // 1. Inspect all records in `idCards` collection
    const idCardsSnap = await getDocs(collection(db, "idCards"));
    idCardsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const idsToCheck = [docSnap.id, data.employeeId, data.id].filter(Boolean);
      for (const idStr of idsToCheck) {
        if (typeof idStr === "string") {
          // Extract numeric suffix from patterns like RM-C-1111 or raw numbers
          const match = targetPrefix
            ? idStr.match(new RegExp(`^${targetPrefix}-(\\d+)`, "i"))
            : idStr.match(/RM-[A-C]-(\d+)/i) || idStr.match(/(\d{4,})$/);
          if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num) && num > highest) {
              highest = num;
            }
          }
        }
      }
    });
  } catch (err) {
    console.warn("Could not inspect idCards collection for sequence:", err);
  }

  try {
    // 2. Inspect all records in `members` collection
    const membersSnap = await getDocs(collection(db, "members"));
    membersSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const idsToCheck = [data.employeeId, data.memberId].filter(Boolean);
      for (const idStr of idsToCheck) {
        if (typeof idStr === "string") {
          const match = targetPrefix
            ? idStr.match(new RegExp(`^${targetPrefix}-(\\d+)`, "i"))
            : idStr.match(/RM-[A-C]-(\d+)/i) || idStr.match(/(\d{4,})$/);
          if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num) && num > highest) {
              highest = num;
            }
          }
        }
      }
    });
  } catch (err) {
    console.warn("Could not inspect members collection for sequence:", err);
  }

  try {
    // 3. Inspect global and prefix-specific counters in `counters`
    const counterSnap = await getDoc(doc(db, "counters", "memberSequence"));
    if (counterSnap.exists()) {
      const data = counterSnap.data();
      const seq = typeof data.currentSequence === "number" ? data.currentSequence : 0;
      if (seq > highest) {
        highest = seq;
      }
    }
  } catch (err) {
    console.warn("Could not inspect counters document:", err);
  }

  // 4. Keep client localStorage in sync with authoritative database sequence
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("rm_member_seq", highest.toString());
    } catch {
      // Ignore storage errors
    }
  }

  return highest;
}

/**
 * Generates the next sequential employee ID for a new ID card.
 * Queries the database for the last generated ID, increments the sequence,
 * verifies that the candidate ID does not exist in `idCards` or `members`,
 * updates the counter atomically, and returns the unique ID.
 */
export async function getNextEmployeeId(tier: "green" | "blue" | "orange" | "red" | string): Promise<string> {
  const prefix = getPrefixForTier(tier);
  const counterRef = doc(db, "counters", "memberSequence");

  try {
    // 1. Query Firestore database for highest existing sequence
    const highestInDb = await getLastGeneratedSequenceFromDatabase(prefix);

    // 2. Atomically update counter in Firestore
    const nextSeq = await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      let current = highestInDb;

      if (counterSnap.exists()) {
        const data = counterSnap.data();
        const stored = typeof data.currentSequence === "number" ? data.currentSequence : 0;
        if (stored > current) {
          current = stored;
        }
      }

      const incremented = current + 1;
      transaction.set(
        counterRef,
        {
          currentSequence: incremented,
          lastEmployeeId: `${prefix}-${incremented}`,
          lastPrefix: prefix,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      return incremented;
    });

    // 3. Guarantee absolutely no duplicates in Firestore `idCards`
    let candidateSeq = nextSeq;
    let candidateId = `${prefix}-${candidateSeq}`;
    let attempts = 0;

    while (attempts < 50) {
      const existingCard = await getDoc(doc(db, "idCards", candidateId));
      if (!existingCard.exists()) {
        break;
      }
      candidateSeq++;
      candidateId = `${prefix}-${candidateSeq}`;
      attempts++;
    }

    // Update counter if duplicate resolution advanced the sequence
    if (candidateSeq !== nextSeq) {
      try {
        await setDoc(
          counterRef,
          {
            currentSequence: candidateSeq,
            lastEmployeeId: candidateId,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn("Counter advance sync warning:", e);
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("rm_member_seq", candidateSeq.toString());
    }

    return candidateId;
  } catch (err) {
    console.warn("Database sequential ID fallback:", err);
    const fallbackBase = await getLastGeneratedSequenceFromDatabase(prefix).catch(() => 1110);
    const fallbackSeq = fallbackBase + 1;
    if (typeof window !== "undefined") {
      localStorage.setItem("rm_member_seq", fallbackSeq.toString());
    }
    return `${prefix}-${fallbackSeq}`;
  }
}

/**
 * Previews the next sequential employee ID without consuming/incrementing the counter.
 * Inspects existing database records to predict the next ID to be assigned.
 */
export async function peekNextEmployeeId(tier: "green" | "blue" | "orange" | "red" | string): Promise<string> {
  const prefix = getPrefixForTier(tier);

  try {
    const highestInDb = await getLastGeneratedSequenceFromDatabase(prefix);
    let candidateSeq = highestInDb + 1;
    let candidateId = `${prefix}-${candidateSeq}`;

    // Verify candidate ID doesn't already exist
    let attempts = 0;
    while (attempts < 50) {
      const snap = await getDoc(doc(db, "idCards", candidateId));
      if (!snap.exists()) {
        break;
      }
      candidateSeq++;
      candidateId = `${prefix}-${candidateSeq}`;
      attempts++;
    }

    return candidateId;
  } catch (err) {
    console.warn("peekNextEmployeeId fallback:", err);
    return `${prefix}-1111`;
  }
}

// ----------------------------------------------------
// Employee ID Cards (RM-E-1111, RM-E-1112...)
// Staff IDs use their own counter so they never consume member sequence numbers
// ----------------------------------------------------

export const EMPLOYEE_ID_PREFIX = "RM-E";

async function getHighestEmployeeSequence(): Promise<number> {
  let highest = 1110;
  const snap = await getDocs(query(collection(db, "idCards"), where("cardType", "==", "employee")));
  snap.forEach((docSnap) => {
    const match = docSnap.id.match(new RegExp(`^${EMPLOYEE_ID_PREFIX}-(\d+)$`, "i"));
    if (match) highest = Math.max(highest, parseInt(match[1], 10));
  });
  return highest;
}

/** Previews the next employee ID without consuming it. */
export async function peekNextEmployeeStaffId(): Promise<string> {
  try {
    let seq = (await getHighestEmployeeSequence()) + 1;
    const counterSnap = await getDoc(doc(db, "counters", "employeeSequence"));
    const stored = counterSnap.exists() ? counterSnap.data().currentSequence : 0;
    if (typeof stored === "number" && stored >= seq) seq = stored + 1;
    return `${EMPLOYEE_ID_PREFIX}-${seq}`;
  } catch (err) {
    console.warn("peekNextEmployeeStaffId fallback:", err);
    return `${EMPLOYEE_ID_PREFIX}-1111`;
  }
}

/** Atomically reserves the next employee ID. */
export async function getNextEmployeeStaffId(): Promise<string> {
  const counterRef = doc(db, "counters", "employeeSequence");
  const highestInDb = await getHighestEmployeeSequence().catch(() => 1110);

  let seq = await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef);
    const stored = counterSnap.exists() ? counterSnap.data().currentSequence : 0;
    const next = Math.max(highestInDb, typeof stored === "number" ? stored : 0) + 1;
    transaction.set(counterRef, { currentSequence: next, updatedAt: serverTimestamp() }, { merge: true });
    return next;
  });

  // Skip any ID that was typed in manually and already exists
  for (let attempts = 0; attempts < 50; attempts++) {
    const existing = await getDoc(doc(db, "idCards", `${EMPLOYEE_ID_PREFIX}-${seq}`));
    if (!existing.exists()) break;
    seq++;
  }
  await setDoc(counterRef, { currentSequence: seq, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});

  return `${EMPLOYEE_ID_PREFIX}-${seq}`;
}

/** All employee ID cards, newest ID first. */
export async function getEmployeeIdCards(): Promise<IdCardRecordData[]> {
  const snap = await getDocs(query(collection(db, "idCards"), where("cardType", "==", "employee")));
  return snap.docs
    .map((d) => d.data() as IdCardRecordData)
    .sort((a, b) => b.employeeId.localeCompare(a.employeeId, undefined, { numeric: true }));
}
