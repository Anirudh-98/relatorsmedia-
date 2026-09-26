"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FaExclamationTriangle,
  FaIdCard,
  FaKey,
  FaLock,
  FaSearch,
  FaSignOutAlt,
  FaSpinner,
  FaSyncAlt,
  FaTimes,
  FaUsers,
  FaUserShield,
  FaUserTie,
} from "react-icons/fa";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { getAdminFirebase, signInAdmin, signOutAdmin } from "@/lib/firebase/isolated";
import {
  createIssuerAccount,
  listAllIdCards,
  listAllMembers,
  listIssuers,
  setIssuerActive,
  StaffRecord,
} from "@/lib/firebase/staff";
import { IdCardRecordData, MemberProfileData } from "@/lib/firebase/db";
import { getSafePhotoUrl } from "@/lib/utils/imageUtils";
import { PASSWORD_HINT, PASSWORD_MAX_LENGTH } from "@/lib/validation/idCardSchemas";

const inputClass =
  "w-full px-2.5 py-1.5 text-[12px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent bg-[#FAFBFD]";
const labelClass = "block text-[10.5px] font-black uppercase text-[#334155] mb-1";

export default function AdminDashboardPage() {
  // Admin signed in on the isolated, memory-only admin session (nothing stored in the browser)
  const [adminSignedIn, setAdminSignedIn] = useState(false);

  useEffect(() => () => { signOutAdmin(); }, []);

  return (
    <PortalLayout
      title="Admin Dashboard"
      subtitle="All generated ID cards, member details, and the ID card issuer login"
      badge="Administrator"
      breadcrumbs={[{ label: "Admin Dashboard" }]}
    >
      {adminSignedIn ? (
        <AdminDashboard
          onSignOut={async () => {
            await signOutAdmin();
            setAdminSignedIn(false);
          }}
        />
      ) : (
        <AdminSignIn onSignedIn={() => setAdminSignedIn(true)} />
      )}
    </PortalLayout>
  );
}

function AdminSignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInAdmin(email, password);
      setPassword("");
      onSignedIn();
    } catch (caught) {
      const err = caught as { code?: string; message?: string };
      setError(
        err?.code === "auth/invalid-credential" || err?.code === "auth/wrong-password" || err?.code === "auth/user-not-found"
          ? "Incorrect email or password."
          : err?.code === "auth/too-many-requests"
            ? "Too many failed attempts. Please wait a moment and try again."
            : err?.message || "Sign in failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl border border-[#CBD5E1] shadow-xs overflow-hidden">
      <div className="bg-[#073F73] px-4 py-3 text-white flex items-center gap-2">
        <FaUserShield className="text-[#38BDF8]" />
        <h2 className="text-[14px] font-black uppercase tracking-wide">Administrator Sign In</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <div>
          <label className={labelClass}>Admin Email</label>
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Password</label>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </div>
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-md text-[11px] font-bold text-red-700 flex items-center gap-1.5">
            <FaExclamationTriangle className="flex-shrink-0" /> {error}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-md bg-[#073F73] hover:bg-[#052E54] disabled:bg-gray-400 text-white text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? <FaSpinner className="animate-spin" /> : <FaLock />} Sign In
        </button>
      </form>
    </div>
  );
}

type Tab = "cards" | "members";
type DetailRecord = { title: string; photo?: string; data: Record<string, unknown> };

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [cards, setCards] = useState<IdCardRecordData[]>([]);
  const [members, setMembers] = useState<MemberProfileData[]>([]);
  const [issuers, setIssuers] = useState<StaffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("cards");
  const [search, setSearch] = useState("");
  const [cardTypeFilter, setCardTypeFilter] = useState<"all" | "member" | "employee">("all");
  const [detail, setDetail] = useState<DetailRecord | null>(null);

  const load = useCallback(async () => {
    const { db } = getAdminFirebase();
    try {
      const [c, m, i] = await Promise.all([listAllIdCards(db), listAllMembers(db), listIssuers(db)]);
      setCards(c);
      setMembers(m);
      setIssuers(i);
      setLoadError(null);
    } catch (err) {
      console.error("Admin dashboard load error:", err);
      setLoadError("Could not load dashboard data. Make sure the latest Firestore rules are deployed, then refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load; state is only set from the async callback
    const { db } = getAdminFirebase();
    Promise.all([listAllIdCards(db), listAllMembers(db), listIssuers(db)])
      .then(([c, m, i]) => {
        setCards(c);
        setMembers(m);
        setIssuers(i);
      })
      .catch((err) => {
        console.error("Admin dashboard load error:", err);
        setLoadError("Could not load dashboard data. Make sure the latest Firestore rules are deployed, then refresh.");
      })
      .finally(() => setLoading(false));
  }, []);

  const q = search.trim().toLowerCase();
  const matches = (...values: (string | undefined)[]) => !q || values.some((v) => v?.toLowerCase().includes(q));

  const filteredCards = cards.filter(
    (c) =>
      (cardTypeFilter === "all" || (c.cardType || "member") === cardTypeFilter) &&
      matches(c.fullName, c.name, c.employeeId, c.phone, c.email, c.designation, c.department, c.location, c.issuedBy?.loginId)
  );
  const filteredMembers = members.filter((m) =>
    matches(m.fullName, m.name, m.employeeId, m.phone, m.email, m.location, m.city, m.agencyName)
  );

  const employeeCount = cards.filter((c) => c.cardType === "employee").length;
  const activeIssuer = issuers.find((i) => i.active) || null;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            href="/employee"
            className="px-3 py-1.5 bg-white border border-[#CBD5E1] hover:bg-gray-50 text-[#073F73] text-[11px] font-bold rounded-md flex items-center gap-1.5"
          >
            <FaUserTie /> Employee ID Generator
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setLoading(true); load(); }}
            disabled={loading}
            className="px-3 py-1.5 bg-white border border-[#CBD5E1] hover:bg-gray-50 text-[#073F73] text-[11px] font-bold rounded-md flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="px-3 py-1.5 bg-[#073F73] hover:bg-[#052E54] text-white text-[11px] font-bold rounded-md flex items-center gap-1.5 cursor-pointer"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      {loadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-[12px] font-bold text-red-700 flex items-center gap-2">
          <FaExclamationTriangle /> {loadError}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile icon={<FaIdCard />} label="Total ID Cards" value={cards.length} loading={loading} />
        <StatTile icon={<FaIdCard />} label="Member Cards" value={cards.length - employeeCount} loading={loading} />
        <StatTile icon={<FaUserTie />} label="Employee Cards" value={employeeCount} loading={loading} />
        <StatTile icon={<FaUsers />} label="Registered Members" value={members.length} loading={loading} />
      </div>

      <IssuerLoginPanel activeIssuer={activeIssuer} loading={loading} onChanged={load} />

      {/* Records */}
      <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-xs overflow-hidden">
        <div className="px-3 sm:px-4 py-2.5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <TabButton active={tab === "cards"} onClick={() => setTab("cards")}>
              ID Cards ({cards.length})
            </TabButton>
            <TabButton active={tab === "members"} onClick={() => setTab("members")}>
              Members ({members.length})
            </TabButton>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {tab === "cards" && (
              <select
                value={cardTypeFilter}
                onChange={(e) => setCardTypeFilter(e.target.value as typeof cardTypeFilter)}
                className="px-2 py-1.5 text-[11px] font-semibold border border-[#CBD5E1] rounded-md bg-[#F8FAFC] text-[#073F73] cursor-pointer"
              >
                <option value="all">All card types</option>
                <option value="member">Member cards</option>
                <option value="employee">Employee cards</option>
              </select>
            )}
            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[11px]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, ID, phone, email..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[12px] focus:outline-none focus:border-[#073F73]"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[12px] text-[#64748B] font-bold flex items-center justify-center gap-2">
            <FaSpinner className="animate-spin" /> Loading...
          </div>
        ) : tab === "cards" ? (
          <RecordTable
            empty="No ID cards found."
            headers={["", "Name", "ID", "Type", "Position / Tier", "Phone", "Email", "Issued", "Status", "Issued By"]}
            rows={filteredCards.map((c) => ({
              key: c.employeeId,
              photo: c.photoUrl || c.photo,
              cells: [
                c.fullName || c.name || "—",
                <Link key="id" href={`/verify/${c.employeeId}`} target="_blank" onClick={(e) => e.stopPropagation()} className="font-mono font-bold text-[#0284C7] hover:underline">
                  {c.employeeId}
                </Link>,
                <TypeBadge key="type" type={c.cardType === "employee" ? "employee" : "member"} />,
                c.designation || c.cardTier || "—",
                c.phone || c.mobile || "—",
                c.email || "—",
                c.issuedDate || "—",
                <StatusBadge key="status" status={c.status} />,
                c.issuedBy ? `${c.issuedBy.loginId}` : "—",
              ],
              onClick: () =>
                setDetail({ title: `${c.fullName || c.name} — ${c.employeeId}`, photo: c.photoUrl || c.photo, data: c as unknown as Record<string, unknown> }),
            }))}
          />
        ) : (
          <RecordTable
            empty="No members found."
            headers={["", "Name", "Member ID", "Phone", "Email", "Location", "Tier", "Agency", "Status"]}
            rows={filteredMembers.map((m) => ({
              key: m.uid,
              photo: m.photoUrl || m.photo,
              cells: [
                m.fullName || m.name || "—",
                m.employeeId ? (
                  <Link key="id" href={`/verify/${m.employeeId}`} target="_blank" onClick={(e) => e.stopPropagation()} className="font-mono font-bold text-[#0284C7] hover:underline">
                    {m.employeeId}
                  </Link>
                ) : "—",
                m.phone || m.mobile || "—",
                m.email || "—",
                m.location || [m.city, m.state].filter(Boolean).join(", ") || "—",
                (m.selectedTier || m.tier || "—").toString().toUpperCase(),
                m.agencyName || m.companyName || "—",
                <StatusBadge key="status" status={m.status} />,
              ],
              onClick: () =>
                setDetail({ title: m.fullName || m.name || m.email, photo: m.photoUrl || m.photo, data: m as unknown as Record<string, unknown> }),
            }))}
          />
        )}
      </div>

      {detail && <DetailsDialog record={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

// Creates, deactivates, or replaces the single ID card issuer login
function IssuerLoginPanel({
  activeIssuer,
  loading,
  onChanged,
}: {
  activeIssuer: StaffRecord | null;
  loading: boolean;
  onChanged: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("ID Card Issuer");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      const { db } = getAdminFirebase();
      const created = await createIssuerAccount(db, { name, loginId, password });
      // Only one issuer login is active at a time: the new one replaces the old
      if (activeIssuer && activeIssuer.uid !== created.uid) {
        await setIssuerActive(db, activeIssuer.uid, false);
      }
      setSuccess(`Issuer login "${created.loginId}" is ready. Share the Login ID and password with the person generating ID cards.`);
      setShowForm(false);
      setLoginId("");
      setPassword("");
      onChanged();
    } catch (err) {
      setError((err as Error)?.message || "Could not create the issuer login.");
    } finally {
      setBusy(false);
    }
  };

  const handleDeactivate = async () => {
    if (!activeIssuer) return;
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      await setIssuerActive(getAdminFirebase().db, activeIssuer.uid, false);
      setSuccess(`Issuer login "${activeIssuer.loginId}" has been deactivated. It can no longer generate ID cards.`);
      onChanged();
    } catch (err) {
      setError((err as Error)?.message || "Could not deactivate the issuer login.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-xs p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#EEF6FC] border border-[#BFDBFE] text-[#073F73] flex items-center justify-center">
            <FaKey />
          </div>
          <div>
            <h3 className="text-[13px] font-black uppercase text-[#073F73] tracking-wide">ID Card Issuer Login</h3>
            {loading ? (
              <p className="text-[11.5px] text-[#64748B] font-semibold">Loading...</p>
            ) : activeIssuer ? (
              <p className="text-[11.5px] text-[#334155] font-semibold">
                Login ID: <span className="font-mono font-black text-[#073F73]">{activeIssuer.loginId}</span>
                <span className="ml-2 text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46]">Active</span>
              </p>
            ) : (
              <p className="text-[11.5px] text-[#92400E] font-semibold">
                No active issuer login. Create one so ID cards can be generated.
              </p>
            )}
          </div>
        </div>
        {!loading && (
          <div className="flex items-center gap-2">
            {activeIssuer && (
              <button
                type="button"
                onClick={handleDeactivate}
                disabled={busy}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[11px] font-bold rounded-md cursor-pointer disabled:opacity-60"
              >
                Deactivate
              </button>
            )}
            <button
              type="button"
              onClick={() => { setShowForm((v) => !v); setError(null); setSuccess(null); }}
              disabled={busy}
              className="px-3 py-1.5 bg-[#073F73] hover:bg-[#052E54] text-white text-[11px] font-bold rounded-md cursor-pointer disabled:opacity-60"
            >
              {showForm ? "Cancel" : activeIssuer ? "Replace Login" : "Create Login"}
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mt-4 pt-4 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Login ID</label>
            <input
              type="text"
              required
              autoCapitalize="none"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="e.g. idcards"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="text"
              required
              maxLength={PASSWORD_MAX_LENGTH}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={PASSWORD_HINT}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-[10.5px] text-[#64748B] font-medium">
              {activeIssuer
                ? `The current login "${activeIssuer.loginId}" will be deactivated when the new one is created.`
                : "Login ID: 3-30 characters (letters, numbers, dot, dash, underscore)."}
            </p>
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 bg-[#059669] hover:bg-[#047857] disabled:bg-gray-400 text-white text-[11.5px] font-black uppercase rounded-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {busy && <FaSpinner className="animate-spin" />} Save Issuer Login
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md text-[11px] font-bold text-red-700 flex items-center gap-1.5">
          <FaExclamationTriangle className="flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="mt-3 p-2 bg-[#ECFDF5] border border-[#10B981] rounded-md text-[11px] font-bold text-[#065F46]">{success}</div>
      )}
    </div>
  );
}

function StatTile({ icon, label, value, loading }: { icon: React.ReactNode; label: string; value: number; loading: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-xs p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#EEF6FC] text-[#0284C7] flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-[20px] font-black text-[#073F73] leading-none">{loading ? "…" : value}</div>
        <div className="text-[10.5px] font-bold uppercase text-[#64748B] mt-1">{label}</div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-[11.5px] font-black cursor-pointer border ${active ? "bg-[#073F73] text-white border-[#073F73]" : "bg-white text-[#334155] border-[#CBD5E1] hover:bg-gray-50"
        }`}
    >
      {children}
    </button>
  );
}

function TypeBadge({ type }: { type: "member" | "employee" }) {
  return (
    <span
      className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full ${type === "employee" ? "bg-[#EDE9FE] text-[#5B21B6]" : "bg-[#E0F2FE] text-[#0369A1]"}`}
    >
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const s = (status || "ACTIVE").toUpperCase();
  return (
    <span
      className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full ${s === "ACTIVE" ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"}`}
    >
      {s}
    </span>
  );
}

function RecordTable({
  headers,
  rows,
  empty,
}: {
  headers: string[];
  rows: { key: string; photo?: string; cells: React.ReactNode[]; onClick: () => void }[];
  empty: string;
}) {
  if (rows.length === 0) {
    return <div className="p-8 text-center text-[12px] text-[#64748B] font-medium">{empty}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[11.5px]">
        <thead className="bg-[#F8FAFC] text-[10px] uppercase text-[#475569] font-black">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8F0]">
          {rows.map((row) => (
            <tr key={row.key} onClick={row.onClick} className="hover:bg-[#F0F9FF] cursor-pointer">
              <td className="px-3 py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getSafePhotoUrl(row.photo)} alt="" className="w-8 h-8 rounded-md object-cover border border-[#CBD5E1]" />
              </td>
              {row.cells.map((cell, i) => (
                <td key={i} className={`px-3 py-2 whitespace-nowrap ${i === 0 ? "font-black text-[#073F73]" : "text-[#334155] font-semibold"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Field names shown in the details dialog; everything else is labelled from its key
const FIELD_LABELS: Record<string, string> = {
  employeeId: "ID",
  fullName: "Full Name",
  cardType: "Card Type",
  cardTier: "Card Tier",
  selectedTier: "Tier",
  reraNo: "RERA No.",
  uid: "Account UID",
  issuedBy: "Issued By",
  verificationUrl: "Verification URL",
};
// Duplicates of other fields, or raw photo data
const HIDDEN_FIELDS = new Set(["photo", "photoUrl", "name", "mobile", "companyName", "experienceYears", "tier"]);

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") {
    if (typeof (value as { toDate?: unknown }).toDate === "function") {
      return (value as { toDate: () => Date }).toDate().toLocaleString("en-IN");
    }
    const v = value as { name?: string; loginId?: string };
    if (v.loginId) return `${v.name || ""} (${v.loginId})`.trim();
    return JSON.stringify(value);
  }
  return String(value);
}

const labelFor = (key: string) =>
  FIELD_LABELS[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

function DetailsDialog({ record, onClose }: { record: DetailRecord; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const entries = Object.entries(record.data)
    .filter(([key]) => !HIDDEN_FIELDS.has(key))
    .sort(([a], [b]) => labelFor(a).localeCompare(labelFor(b)));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071E36]/70 p-3"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#CBD5E1] overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-[#073F73] px-4 py-3 text-white flex items-center justify-between gap-2">
          <h3 className="text-[13px] font-black uppercase tracking-wide truncate">{record.title}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer">
            <FaTimes className="text-xs" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getSafePhotoUrl(record.photo)} alt="" className="w-24 h-28 rounded-lg object-cover border-2 border-[#073F73] mb-3" />
          <dl className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-md text-[12px]">
            {entries.map(([key, value]) => (
              <div key={key} className="px-3 py-1.5 grid grid-cols-[140px_1fr] gap-2">
                <dt className="font-bold text-[#64748B]">{labelFor(key)}</dt>
                <dd className="font-semibold text-[#0F172A] break-all">{formatValue(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
