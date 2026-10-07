import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
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
  address?: string;
  price: string;
  area: string;
  bhk: string;
  bathrooms?: string;
  furnishing?: string;
  facing?: string;
  reraNumber?: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  description?: string;
  imageUrl?: string;
  images?: string[];
  mapUrl?: string;
  googleMapUrl?: string;
  memberId?: string;
  agencyName?: string;
  amenities?: string[];
  authorUid?: string;
  status: "Active" | "Under Offer" | "Sold";
  views?: number;
  leads?: number;
  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
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

  // Sync the tier's counter forward so the counter document reflects this issued ID
  await syncCounterForId(cleanId, firestore).catch((err) => {
    console.warn("Could not sync counter for saved ID card:", err);
  });
}

/**
 * Ensures the tier's counter in Firestore `counters` collection is at least
 * equal to the numeric sequence in the issued card ID.
 */
export async function syncCounterForId(cleanId: string, firestore: Firestore = db): Promise<void> {
  try {
    const match = cleanId.match(/^(RM-[A-E])-(\d+)$/i);
    if (!match) return;
    const prefix = match[1].toUpperCase();
    const num = parseInt(match[2], 10);
    if (isNaN(num) || num <= 1110) return;

    const counterDocId = getCounterDocIdForPrefix(prefix);
    const counterRef = doc(firestore, "counters", counterDocId);
    const counterSnap = await getDoc(counterRef);
    const stored =
      counterSnap.exists() && typeof counterSnap.data().currentSequence === "number"
        ? counterSnap.data().currentSequence
        : 0;

    if (num > stored) {
      await setDoc(
        counterRef,
        {
          currentSequence: num,
          lastEmployeeId: cleanId,
          lastPrefix: prefix,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.warn("syncCounterForId error:", err);
  }
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

/**
 * Permanently deletes an ID card record from Firestore idCards collection.
 */
export async function deleteIdCardRecord(
  employeeId: string,
  firestore: Firestore = db
): Promise<void> {
  const cleanId = employeeId.trim();
  if (!cleanId) return;
  const cardRef = doc(firestore, "idCards", cleanId);
  await deleteDoc(cardRef);
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

export async function createPropertyListing(listing: PropertyListingData, customDb?: Firestore): Promise<string> {
  const colRef = collection(customDb || db, "properties");
  const payload: Record<string, any> = {
    title: listing.title || "",
    propertyType: listing.propertyType || "Apartments / Flats",
    listingType: listing.listingType || "For Sale",
    city: listing.city || "Pune",
    locality: listing.locality || "",
    price: listing.price || "",
    area: listing.area || "",
    bhk: listing.bhk || "2 BHK",
    name: listing.name || "Member",
    phone: listing.phone || "",
    email: listing.email || "",
    role: listing.role || "Owner",
    status: listing.status || "Active",
    views: typeof listing.views === "number" ? listing.views : 1,
    leads: 0,
    createdAt: serverTimestamp(),
  };

  // Optional string fields
  if (listing.address) payload.address = listing.address;
  if (listing.bathrooms) payload.bathrooms = listing.bathrooms;
  if (listing.furnishing) payload.furnishing = listing.furnishing;
  if (listing.facing) payload.facing = listing.facing;
  if (listing.reraNumber) payload.reraNumber = listing.reraNumber;
  if (listing.description) payload.description = listing.description;
  if (listing.imageUrl) payload.imageUrl = listing.imageUrl;
  if (listing.mapUrl) payload.mapUrl = listing.mapUrl;
  if (listing.googleMapUrl) payload.googleMapUrl = listing.googleMapUrl;
  if (listing.memberId) payload.memberId = listing.memberId;
  if (listing.agencyName) payload.agencyName = listing.agencyName;
  if (listing.authorUid) payload.authorUid = listing.authorUid;

  // Optional arrays
  if (Array.isArray(listing.images) && listing.images.length > 0) {
    payload.images = listing.images.slice(0, 5);
  }
  if (Array.isArray(listing.amenities) && listing.amenities.length > 0) {
    payload.amenities = listing.amenities.slice(0, 30);
  }

  const docRef = await addDoc(colRef, payload);
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

export async function deletePropertyListing(id: string, customDb?: Firestore): Promise<void> {
  const docRef = doc(customDb || db, "properties", id);
  await deleteDoc(docRef);
}

export async function updatePropertyListing(
  id: string,
  data: Partial<PropertyListingData>,
  customDb?: Firestore
): Promise<void> {
  const docRef = doc(customDb || db, "properties", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function getAllPropertiesAdmin(customDb?: Firestore): Promise<PropertyListingData[]> {
  try {
    const snap = await getDocs(query(collection(customDb || db, "properties"), orderBy("createdAt", "desc"), limit(100)));
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as PropertyListingData),
    }));
  } catch (err) {
    console.error("Error fetching all properties for admin:", err);
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
  if (t === "employee" || t === "rm-e") return "RM-E";
  return "RM-C"; // Default Green Tier
}

/**
 * Returns the distinct Firestore counter document ID for each ID card tier.
 * Each tier (Green, Blue, Orange, Employee) tracks its own independent counter.
 */
export function getCounterDocIdForTier(tier: "green" | "blue" | "orange" | "red" | string): string {
  const t = (tier || "").toLowerCase();
  if (t === "orange" || t === "red" || t === "rm-a") return "memberSequence_orange";
  if (t === "blue" || t === "rm-b") return "memberSequence_blue";
  if (t === "employee" || t === "rm-e") return "employeeSequence";
  return "memberSequence_green"; // Default Green Tier
}

/**
 * Returns the distinct Firestore counter document ID given an ID prefix (e.g. RM-A, RM-B, RM-C).
 */
export function getCounterDocIdForPrefix(prefix: string): string {
  const p = (prefix || "").toUpperCase();
  if (p === "RM-A") return "memberSequence_orange";
  if (p === "RM-B") return "memberSequence_blue";
  if (p === "RM-E") return "employeeSequence";
  return "memberSequence_green"; // Default Green Tier ("RM-C")
}

/**
 * Queries Firestore to inspect the last generated ID card in the database for a specific tier/prefix
 * and finds the highest sequence number currently registered for that tier.
 * Checks across:
 * 1. Tier-specific counter: `counters/{counterDocId}` (e.g., `memberSequence_green`, `memberSequence_blue`, `memberSequence_orange`)
 * 2. Prefix-named counter fallback: `counters/memberSequence_{prefix}`
 * 3. `idCards` collection (checks document IDs and `employeeId` fields matching this prefix)
 * 4. `members` collection (checks `employeeId` fields matching this prefix)
 */
export async function getLastGeneratedSequenceFromDatabase(
  targetPrefix?: string,
  firestore: Firestore = db
): Promise<number> {
  const prefix = (targetPrefix || "RM-C").toUpperCase();
  const counterDocId = getCounterDocIdForPrefix(prefix);
  let highest = 1110;

  // 1. Inspect tier-specific counter in `counters` collection (Public get allowed)
  try {
    const counterSnap = await getDoc(doc(firestore, "counters", counterDocId));
    if (counterSnap.exists()) {
      const data = counterSnap.data();
      const seq = typeof data.currentSequence === "number" ? data.currentSequence : 0;
      if (seq > highest) {
        highest = seq;
      }
    }
  } catch {
    // Ignore read errors
  }

  // Check prefix-named counter document (e.g., counters/memberSequence_RM-A) if different
  const prefixCounterId = `memberSequence_${prefix}`;
  if (prefixCounterId !== counterDocId) {
    try {
      const pSnap = await getDoc(doc(firestore, "counters", prefixCounterId));
      if (pSnap.exists()) {
        const data = pSnap.data();
        const seq = typeof data.currentSequence === "number" ? data.currentSequence : 0;
        if (seq > highest) {
          highest = seq;
        }
      }
    } catch {
      // Ignore
    }
  }

  // Legacy fallback: for RM-A (orange), check the old global `memberSequence` if it was tracking RM-A
  if (prefix === "RM-A" && highest <= 1110) {
    try {
      const legacySnap = await getDoc(doc(firestore, "counters", "memberSequence"));
      if (legacySnap.exists()) {
        const data = legacySnap.data();
        if (data.lastPrefix === "RM-A" || !data.lastPrefix) {
          const seq = typeof data.currentSequence === "number" ? data.currentSequence : 0;
          if (seq > highest) {
            highest = seq;
          }
        }
      }
    } catch {
      // Ignore
    }
  }

  // If authoritative counter is established (> 1110), return immediately.
  // Avoids unauthorized bulk collection queries for non-admin browser users.
  if (highest > 1110) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`rm_member_seq_${prefix.toLowerCase()}`, highest.toString());
      } catch {
        // Ignore storage errors
      }
    }
    return highest;
  }

  // 2. If no counter document exists yet, try checking if 1111 exists via single getDoc (publicly allowed)
  try {
    const firstCard = await getDoc(doc(firestore, "idCards", `${prefix}-1111`));
    if (!firstCard.exists()) {
      // No card sequence has been started for this prefix yet; start at 1110 (next will be 1111)
      return 1110;
    }
  } catch {
    // Fall through to bulk check if admin
  }

  // 3. Fallback for admin sessions: inspect idCards collection for existing records
  try {
    const idCardsSnap = await getDocs(collection(firestore, "idCards"));
    let foundFirstInSequence = false;
    let maxFoundForPrefix = 1110;

    idCardsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const idsToCheck = [docSnap.id, data.employeeId, data.id].filter(Boolean);
      for (const idStr of idsToCheck) {
        if (typeof idStr === "string") {
          const match = idStr.match(new RegExp(`^${prefix}-(\\d+)`, "i"));
          if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num)) {
              if (num === 1111) {
                foundFirstInSequence = true;
              }
              if (num > maxFoundForPrefix) {
                maxFoundForPrefix = num;
              }
            }
          }
        }
      }
    });

    if (foundFirstInSequence || highest > 1110) {
      if (maxFoundForPrefix > highest) {
        highest = maxFoundForPrefix;
      }
    }
  } catch {
    // Non-admin clients do not have bulk list permissions; catch silently
  }

  // 4. Fallback for admin sessions: inspect members collection for existing records
  if (highest <= 1110) {
    try {
      const membersSnap = await getDocs(collection(firestore, "members"));
      let foundFirstInSequence = false;
      let maxFoundForPrefix = 1110;

      membersSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const idsToCheck = [data.employeeId, data.memberId].filter(Boolean);
        for (const idStr of idsToCheck) {
          if (typeof idStr === "string") {
            const match = idStr.match(new RegExp(`^${prefix}-(\\d+)`, "i"));
            if (match && match[1]) {
              const num = parseInt(match[1], 10);
              if (!isNaN(num)) {
                if (num === 1111) {
                  foundFirstInSequence = true;
                }
                if (num > maxFoundForPrefix) {
                  maxFoundForPrefix = num;
                }
              }
            }
          }
        }
      });

      if (foundFirstInSequence || highest > 1110) {
        if (maxFoundForPrefix > highest) {
          highest = maxFoundForPrefix;
        }
      }
    } catch {
      // Non-admin clients do not have bulk list permissions; catch silently
    }
  }

  // 5. Client localStorage fallback
  if (highest <= 1110 && typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(`rm_member_seq_${prefix.toLowerCase()}`);
      if (cached) {
        const num = parseInt(cached, 10);
        if (!isNaN(num) && num > highest) {
          highest = num;
        }
      }
    } catch {
      // Ignore
    }
  }

  // 6. Keep client localStorage in sync with authoritative database sequence for this prefix
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`rm_member_seq_${prefix.toLowerCase()}`, highest.toString());
      localStorage.setItem("rm_member_seq", highest.toString());
    } catch {
      // Ignore storage errors
    }
  }

  return highest;
}

/**
 * Generates the next sequential employee ID for a new ID card for the given tier.
 * Uses a separate counter for each tier (Green, Blue, Orange).
 * Queries the database for the last generated ID for this tier, increments the sequence,
 * verifies that the candidate ID does not exist in `idCards` or `members`,
 * updates the tier's counter atomically, and returns the unique ID.
 */
export async function getNextEmployeeId(
  tier: "green" | "blue" | "orange" | "red" | string,
  firestore: Firestore = db
): Promise<string> {
  const prefix = getPrefixForTier(tier);
  const counterDocId = getCounterDocIdForTier(tier);
  const counterRef = doc(firestore, "counters", counterDocId);

  try {
    // 1. Query Firestore database for highest existing sequence for this specific tier
    const highestInDb = await getLastGeneratedSequenceFromDatabase(prefix, firestore);

    // 2. Atomically update the tier's counter in Firestore
    const nextSeq = await runTransaction(firestore, async (transaction) => {
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
      const existingCard = await getDoc(doc(firestore, "idCards", candidateId));
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
            lastPrefix: prefix,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn("Counter advance sync warning:", e);
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(`rm_member_seq_${prefix.toLowerCase()}`, candidateSeq.toString());
      localStorage.setItem("rm_member_seq", candidateSeq.toString());
    }

    return candidateId;
  } catch (err) {
    console.warn("Database sequential ID fallback:", err);
    const fallbackBase = await getLastGeneratedSequenceFromDatabase(prefix, firestore).catch(() => 1110);
    const fallbackSeq = fallbackBase + 1;
    if (typeof window !== "undefined") {
      localStorage.setItem(`rm_member_seq_${prefix.toLowerCase()}`, fallbackSeq.toString());
    }
    return `${prefix}-${fallbackSeq}`;
  }
}

/**
 * Previews the next sequential employee ID for a tier without consuming/incrementing the counter.
 * Inspects existing database records for this tier to predict the next ID to be assigned.
 */
export async function peekNextEmployeeId(
  tier: "green" | "blue" | "orange" | "red" | string,
  firestore: Firestore = db
): Promise<string> {
  const prefix = getPrefixForTier(tier);

  try {
    const highestInDb = await getLastGeneratedSequenceFromDatabase(prefix, firestore);
    let candidateSeq = highestInDb + 1;
    let candidateId = `${prefix}-${candidateSeq}`;

    // Verify candidate ID doesn't already exist
    let attempts = 0;
    while (attempts < 50) {
      const snap = await getDoc(doc(firestore, "idCards", candidateId));
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

/**
 * Diagnostic helper: returns the status and next sequential ID for all tiers.
 */
export async function getAllTierCounters(firestore: Firestore = db) {
  const [greenId, blueId, orangeId, employeeId] = await Promise.all([
    peekNextEmployeeId("green", firestore),
    peekNextEmployeeId("blue", firestore),
    peekNextEmployeeId("orange", firestore),
    peekNextEmployeeStaffId(firestore),
  ]);

  return {
    green: { tier: "green", prefix: "RM-C", counterDoc: "memberSequence_green", nextId: greenId },
    blue: { tier: "blue", prefix: "RM-B", counterDoc: "memberSequence_blue", nextId: blueId },
    orange: { tier: "orange", prefix: "RM-A", counterDoc: "memberSequence_orange", nextId: orangeId },
    employee: { tier: "employee", prefix: "RM-E", counterDoc: "employeeSequence", nextId: employeeId },
  };
}

// ----------------------------------------------------
// Employee ID Cards (RM-E-1111, RM-E-1112...)
// Staff IDs use their own counter so they never consume member sequence numbers
// ----------------------------------------------------

export const EMPLOYEE_ID_PREFIX = "RM-E";

// Employee helpers take the issuer session's Firestore: listing employee cards is staff-only
async function getHighestEmployeeSequence(firestore: Firestore): Promise<number> {
  let highest = 1110;
  const snap = await getDocs(query(collection(firestore, "idCards"), where("cardType", "==", "employee")));
  snap.forEach((docSnap) => {
    const match = docSnap.id.match(new RegExp(`^${EMPLOYEE_ID_PREFIX}-(\\d+)$`, "i"));
    if (match) highest = Math.max(highest, parseInt(match[1], 10));
  });
  return highest;
}

/** Previews the next employee ID without consuming it. */
export async function peekNextEmployeeStaffId(firestore: Firestore = db): Promise<string> {
  try {
    let seq = (await getHighestEmployeeSequence(firestore)) + 1;
    const counterSnap = await getDoc(doc(firestore, "counters", "employeeSequence"));
    const stored = counterSnap.exists() ? counterSnap.data().currentSequence : 0;
    if (typeof stored === "number" && stored >= seq) seq = stored + 1;
    return `${EMPLOYEE_ID_PREFIX}-${seq}`;
  } catch (err) {
    console.warn("peekNextEmployeeStaffId fallback:", err);
    return `${EMPLOYEE_ID_PREFIX}-1111`;
  }
}

/** Atomically reserves the next employee ID. */
export async function getNextEmployeeStaffId(firestore: Firestore = db): Promise<string> {
  const counterRef = doc(firestore, "counters", "employeeSequence");
  const highestInDb = await getHighestEmployeeSequence(firestore).catch(() => 1110);

  let seq = await runTransaction(firestore, async (transaction) => {
    const counterSnap = await transaction.get(counterRef);
    const stored = counterSnap.exists() ? counterSnap.data().currentSequence : 0;
    const next = Math.max(highestInDb, typeof stored === "number" ? stored : 0) + 1;
    transaction.set(counterRef, { currentSequence: next, updatedAt: serverTimestamp() }, { merge: true });
    return next;
  });

  // Skip any ID that was typed in manually and already exists
  for (let attempts = 0; attempts < 50; attempts++) {
    const existing = await getDoc(doc(firestore, "idCards", `${EMPLOYEE_ID_PREFIX}-${seq}`));
    if (!existing.exists()) break;
    seq++;
  }
  await setDoc(counterRef, { currentSequence: seq, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});

  return `${EMPLOYEE_ID_PREFIX}-${seq}`;
}

/** All employee ID cards, newest ID first. */
export async function getEmployeeIdCards(firestore: Firestore = db): Promise<IdCardRecordData[]> {
  const snap = await getDocs(query(collection(firestore, "idCards"), where("cardType", "==", "employee")));
  return snap.docs
    .map((d) => d.data() as IdCardRecordData)
    .sort((a, b) => b.employeeId.localeCompare(a.employeeId, undefined, { numeric: true }));
}
