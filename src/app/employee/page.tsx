"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaIdCard,
  FaUserTie,
  FaImage,
  FaTrash,
  FaCheck,
  FaDownload,
  FaPrint,
  FaSpinner,
  FaExclamationTriangle,
  FaLock,
  FaPlus,
  FaEdit,
  FaSyncAlt,
} from "react-icons/fa";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { RealtorsMediaIdCard } from "@/components/ui/RealtorsMediaIdCard";
import { RealtorsMediaEmployee } from "@/types";
import {
  CardIssuer,
  getCardIssuerFirebase,
  issuerLoginErrorMessage,
  signInCardIssuer,
  signOutCardIssuer,
  toIssuedBy,
} from "@/lib/firebase/staff";
import {
  getEmployeeIdCards,
  getIdCardRecord,
  getNextEmployeeStaffId,
  peekNextEmployeeStaffId,
  saveIdCardRecord,
  IdCardRecordData,
} from "@/lib/firebase/db";
import { compressImage, toFirestoreSafePhoto, uploadMemberPhoto } from "@/lib/firebase/storage";
import { getSafePhotoUrl } from "@/lib/utils/imageUtils";
import { downloadDataUrl, printIdCardPng, renderIdCardPng } from "@/lib/utils/exportIdCard";
import { employeeCardSchema, validateForm } from "@/lib/validation/idCardSchemas";

const CARD_ELEMENT_ID = "employee-id-card";

type ThemeKey = "blue" | "green" | "orange";

const THEME_OPTIONS: { key: ThemeKey; label: string; dot: string }[] = [
  { key: "blue", label: "Blue", dot: "bg-[#0284C7]" },
  { key: "green", label: "Green", dot: "bg-[#059669]" },
  { key: "orange", label: "Orange", dot: "bg-[#EA580C]" },
];

const DEPARTMENT_OPTIONS = [
  "Operations",
  "Sales & Marketing",
  "Media & Production",
  "Digital Marketing",
  "Customer Support",
  "Accounts & Finance",
  "Human Resources",
  "Administration",
  "Technology",
  "Legal",
];

const OTHER_DEPT = "__other__";

const formatCardDate = (date: Date, addYears = 0) =>
  `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${date.getFullYear() + addYears}`;

const emptyForm = () => ({
  name: "",
  designation: "",
  department: "Operations",
  mobile: "",
  email: "",
  location: "Hyderabad",
  photo: "",
  employeeId: "",
  issuedDate: formatCardDate(new Date()),
});

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-[10.5px] font-bold text-red-600">{message}</p> : null;

const inputClass =
  "w-full px-2.5 py-1.5 text-[12px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent bg-[#FAFBFD]";
const labelClass = "block text-[10.5px] font-black uppercase text-[#334155] mb-1";

export default function EmployeeIdCardPage() {
  // Card issuer signed in on the isolated, memory-only session. The visitor's own login is
  // never touched and nothing is stored in the browser, so reloading asks again.
  const [issuer, setIssuer] = useState<CardIssuer | null>(null);

  // End the issuer session when leaving the page
  useEffect(() => () => { signOutCardIssuer(); }, []);

  return (
    <PortalLayout
      title="Employee ID Card Generator"
      subtitle="Issue, reprint, and verify official Realtors Media staff ID cards"
      badge="Staff Credentials"
      breadcrumbs={[{ label: "Employee ID Cards" }]}
    >
      {issuer ? (
        <EmployeeCardGenerator
          issuer={issuer}
          onSignOut={async () => {
            await signOutCardIssuer();
            setIssuer(null);
          }}
        />
      ) : (
        <IssuerSignIn onSignedIn={setIssuer} />
      )}
    </PortalLayout>
  );
}

// Employee cards are official credentials: only issuer logins created by the admin can generate them.
function IssuerSignIn({ onSignedIn }: { onSignedIn: (issuer: CardIssuer) => void }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const signedIn = await signInCardIssuer(loginId, password);
      setPassword("");
      onSignedIn(signedIn);
    } catch (err) {
      setError(issuerLoginErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl border border-[#CBD5E1] shadow-xs overflow-hidden">
      <div className="bg-[#073F73] px-4 py-3 text-white flex items-center gap-2">
        <FaLock className="text-[#38BDF8]" />
        <h2 className="text-[14px] font-black uppercase tracking-wide">ID Card Issuer Login</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <p className="text-[11.5px] text-[#475569] font-medium">
          Sign in with the issuer Login ID and password provided by the administrator.
        </p>
        <div>
          <label className={labelClass}>Login ID</label>
          <input type="text" required autoComplete="username" autoCapitalize="none" value={loginId} onChange={(e) => setLoginId(e.target.value)} className={inputClass} />
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

function EmployeeCardGenerator({ issuer, onSignOut }: { issuer: CardIssuer; onSignOut: () => void }) {
  const [form, setForm] = useState(emptyForm);
  const [theme, setTheme] = useState<ThemeKey>("blue");
  // Set once the card exists in the database (saved now, or loaded from the list)
  const [savedId, setSavedId] = useState<string | null>(null);
  // Photo stored with the saved card; exports require the preview to still show it
  const [savedPhoto, setSavedPhoto] = useState("");
  const [previewId, setPreviewId] = useState("");
  // True when "Other" is chosen: department is typed instead of picked
  const [customDept, setCustomDept] = useState(false);
  const [cards, setCards] = useState<IdCardRecordData[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  // Field errors are shown after the first save attempt and then update as the admin types
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isExporting, setIsExporting] = useState<"png" | "print" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshCards = useCallback(async () => {
    try {
      setCards(await getEmployeeIdCards());
    } catch (err) {
      console.warn("Could not load employee ID cards:", err);
    } finally {
      setCardsLoading(false);
    }
  }, []);

  const loadPreviewId = useCallback(async () => {
    const id = await peekNextEmployeeStaffId();
    setPreviewId(id);
    setForm((prev) => ({ ...prev, employeeId: id }));
  }, []);

  // Initial load: state is only set from the async callbacks
  useEffect(() => {
    getEmployeeIdCards()
      .then(setCards)
      .catch((err) => console.warn("Could not load employee ID cards:", err))
      .finally(() => setCardsLoading(false));
    peekNextEmployeeStaffId().then((id) => {
      setPreviewId(id);
      setForm((prev) => ({ ...prev, employeeId: prev.employeeId || id }));
    });
  }, []);

  const update = (field: keyof ReturnType<typeof emptyForm>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setSuccess(null);
    };

  const startNew = () => {
    setCustomDept(false);
    setForm(emptyForm());
    setTheme("blue");
    setSavedId(null);
    setSavedPhoto("");
    setSubmitAttempted(false);
    setError(null);
    setSuccess(null);
    loadPreviewId();
  };

  const loadCard = (card: IdCardRecordData) => {
    setCustomDept(!!card.department && !DEPARTMENT_OPTIONS.includes(card.department));
    setForm({
      name: card.fullName || card.name || "",
      designation: card.designation || "",
      department: card.department || "",
      mobile: card.phone || card.mobile || "",
      email: card.email || "",
      location: card.location || "",
      photo: card.photoUrl || card.photo || "",
      employeeId: card.employeeId,
      issuedDate: card.issuedDate || "",
    });
    setTheme(card.cardTier === "green" || card.cardTier === "orange" ? card.cardTier : "blue");
    setSavedId(card.employeeId);
    setSubmitAttempted(false);
    setSavedPhoto(card.photoUrl || card.photo || "");
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG or JPG).");
      return;
    }
    try {
      const compressed = await compressImage(file, 1200, 1200, 0.88);
      if (!compressed) throw new Error("empty");
      setForm((prev) => ({ ...prev, photo: compressed }));
      setError(null);
      setSuccess(null);
    } catch {
      setError("Could not read this image. Please try a different photo.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const errors = validateForm(employeeCardSchema, form);
    if (errors) {
      setSubmitAttempted(true);
      setError(errors.photo || "Please correct the highlighted fields and try again.");
      return;
    }

    setIsSaving(true);
    try {
      const typedId = form.employeeId.trim().toUpperCase();
      let employeeId: string;
      if (savedId) {
        employeeId = savedId;
      } else if (typedId && typedId !== previewId) {
        // A manually entered ID must not overwrite another card
        if (await getIdCardRecord(typedId)) {
          throw new Error(`ID ${typedId} is already in use. Choose a different Employee ID.`);
        }
        employeeId = typedId;
      } else {
        employeeId = await getNextEmployeeStaffId();
      }

      let photoUrl = form.photo;
      try {
        photoUrl = await uploadMemberPhoto(form.photo, `employee_${employeeId}`);
      } catch (uploadErr) {
        console.warn("Storage upload warning, storing photo inline:", uploadErr);
        photoUrl = await toFirestoreSafePhoto(form.photo);
      }

      await saveIdCardRecord({
        employeeId,
        fullName: form.name.trim(),
        name: form.name.trim(),
        phone: form.mobile.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        location: form.location.trim(),
        agencyName: "Realtors Media",
        photoUrl,
        photo: photoUrl,
        cardTier: theme,
        cardType: "employee",
        department: form.department.trim(),
        designation: form.designation.trim(),
        issuedDate: form.issuedDate.trim(),
        validTill: "",
        status: "ACTIVE",
        verificationUrl: `https://www.realtorsmedia.world/verify/${employeeId}`,
        uid: issuer.uid,
        issuedBy: toIssuedBy(issuer),
      }, getCardIssuerFirebase().db);

      setForm((prev) => ({ ...prev, employeeId, photo: photoUrl }));
      setSuccess(
        savedId
          ? `✓ Employee ID card ${employeeId} updated.`
          : `✓ Employee ID card ${employeeId} issued. You can now download or print it.`
      );
      setSavedId(employeeId);
      setSavedPhoto(photoUrl);
      refreshCards();
    } catch (err) {
      console.error("Employee ID card save error:", err);
      setError((err as Error)?.message || "Could not save the employee ID card. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const isUpToDate = !!savedId && form.photo === savedPhoto;
  const fieldErrors = submitAttempted ? validateForm(employeeCardSchema, form) ?? {} : {};

  // Only saved cards can be exported: an unsaved ID would print a QR code that fails verification,
  // and a photo changed after saving would not match the database record
  const ensureExportable = () => {
    if (!isUpToDate) {
      setError('Please click "' + (savedId ? "Update ID Card" : "Save & Issue ID Card") + '" first — the card must be saved with its current photo.');
      return false;
    }
    return true;
  };

  const renderCard = () => {
    const cardElement = document.getElementById(CARD_ELEMENT_ID);
    if (!cardElement) throw new Error("ID card preview not found");
    return renderIdCardPng(cardElement, form.photo);
  };

  const handleDownload = async () => {
    if (!ensureExportable()) return;
    setIsExporting("png");
    try {
      downloadDataUrl(await renderCard(), `realtors_media_employee_id_${savedId}.png`);
    } catch (err) {
      console.error("Employee ID card export error:", err);
      setError("Failed to export the ID card. Please try again.");
    } finally {
      setIsExporting(null);
    }
  };

  const handlePrint = async () => {
    if (!ensureExportable()) return;
    setIsExporting("print");
    try {
      printIdCardPng(await renderCard(), `Print Employee ID Card - ${savedId}`);
    } catch (err) {
      console.error("Employee ID card print error:", err);
      setError("Failed to prepare the ID card for printing. Please try again.");
    } finally {
      setIsExporting(null);
    }
  };

  const previewEmployee: RealtorsMediaEmployee = {
    name: form.name || "Employee Name",
    designation: form.designation || "Position",
    employeeId: form.employeeId,
    department: form.department || "Department",
    location: form.location,
    issuedDate: form.issuedDate,
    validTill: "",
    photo: form.photo,
    theme,
    phone: form.mobile,
    email: form.email,
    cardType: "employee",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* FORM */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2 mb-3">
            <h3 className="text-[13px] font-black uppercase text-[#073F73] tracking-wide flex items-center gap-1.5">
              <FaUserTie className="text-[#0284C7]" />
              <span>{savedId ? `Editing ${savedId}` : "New Employee Details"}</span>
            </h3>
            <div className="flex items-center gap-3">
              {savedId && (
                <button
                  type="button"
                  onClick={startNew}
                  className="text-[10.5px] font-black text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FaPlus className="text-[9px]" /> New Employee
                </button>
              )}
              <button
                type="button"
                onClick={onSignOut}
                className="text-[10.5px] font-bold text-[#64748B] hover:text-[#073F73] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FaLock className="text-[9px]" /> Sign Out ({issuer.loginId})
              </button>
            </div>
          </div>

          <form noValidate onSubmit={handleSave} className="space-y-3">
            <div>
              <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
              <input type="text" required value={form.name} onChange={update("name")} placeholder="Employee name" className={inputClass} />
                <FieldError message={fieldErrors.name} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Position / Designation <span className="text-red-500">*</span></label>
                <input type="text" required value={form.designation} onChange={update("designation")} placeholder="e.g. Marketing Executive" className={inputClass} />
                <FieldError message={fieldErrors.designation} />
              </div>
              <div>
                <label className={labelClass}>Department <span className="text-red-500">*</span></label>
                <select
                  required
                  value={customDept ? OTHER_DEPT : form.department}
                  onChange={(e) => {
                    const value = e.target.value;
                    const isOther = value === OTHER_DEPT;
                    setCustomDept(isOther);
                    setForm((prev) => ({ ...prev, department: isOther ? "" : value }));
                    setSuccess(null);
                  }}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="" disabled>Select department</option>
                  {DEPARTMENT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  <option value={OTHER_DEPT}>Other (type below)</option>
                </select>
                {customDept && (
                  <input
                    type="text"
                    required
                    autoFocus
                    value={form.department}
                    onChange={update("department")}
                    placeholder="Enter department name"
                    className={`${inputClass} mt-1.5`}
                  />
                )}
                <FieldError message={fieldErrors.department} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Mobile No. <span className="text-red-500">*</span></label>
                <input type="tel" required value={form.mobile} onChange={update("mobile")} placeholder="+91 00000 00000" className={inputClass} />
                <FieldError message={fieldErrors.mobile} />
              </div>
              <div>
                <label className={labelClass}>Email ID</label>
                <input type="email" value={form.email} onChange={update("email")} placeholder="name@realtorsmedia.world" className={inputClass} />
                <FieldError message={fieldErrors.email} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Branch / Location</label>
                <input type="text" value={form.location} onChange={update("location")} className={inputClass} />
                <FieldError message={fieldErrors.location} />
              </div>
              <div>
                <label className={labelClass}>Issued On</label>
                <input type="text" required value={form.issuedDate} onChange={update("issuedDate")} className={inputClass} />
                <FieldError message={fieldErrors.issuedDate} />
              </div>
            </div>

            {/* Card colour */}
            <div>
              <label className={labelClass}>Card Colour</label>
              <div className="flex gap-2">
                {THEME_OPTIONS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTheme(t.key)}
                    className={`px-3 py-1.5 rounded-md text-[11px] font-black flex items-center gap-1.5 border cursor-pointer ${theme === t.key ? "bg-[#073F73] text-white border-[#073F73]" : "bg-white text-[#334155] border-[#CBD5E1] hover:bg-gray-50"
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${t.dot}`} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo */}
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-black uppercase text-[#334155]">
                  Photo <span className="text-red-500">*</span>
                </span>
                <span className="text-[9px] font-medium text-[#64748B]">PNG/JPG • auto-compressed</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-white hover:bg-[#F0F9FF] border border-[#CBD5E1] text-[#073F73] text-[11px] font-black rounded-md flex items-center gap-2 cursor-pointer"
                >
                  <FaImage className="text-[#0284C7]" /> {form.photo ? "Change Photo" : "Upload Photo"}
                </button>
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                {form.photo && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getSafePhotoUrl(form.photo)} alt="Employee preview" className="w-10 h-10 rounded-md object-cover border-2 border-[#0284C7]" />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, photo: "" }))}
                      className="text-[9.5px] font-bold text-red-600 flex items-center gap-1 cursor-pointer bg-red-50 hover:bg-red-100 px-2 py-1 rounded border border-red-200"
                    >
                      <FaTrash className="text-[8.5px]" /> Remove
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Employee ID */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-black uppercase text-[#475569]">
                  Employee ID {savedId ? "(issued)" : "(auto-generated)"}
                </label>
                {!savedId && (
                  <button
                    type="button"
                    onClick={loadPreviewId}
                    className="text-[9px] font-extrabold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FaSyncAlt className="text-[8px]" /> Regenerate
                  </button>
                )}
              </div>
              <input
                type="text"
                value={form.employeeId}
                disabled={!!savedId}
                onChange={update("employeeId")}
                placeholder="RM-E-1111"
                className={`${inputClass} font-mono text-[#073F73] disabled:opacity-70`}
              />
                <FieldError message={fieldErrors.employeeId} />
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-md text-[11px] font-bold text-red-700 flex items-start gap-2">
                <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-2.5 bg-[#ECFDF5] border border-[#10B981] rounded-md text-[11px] font-bold text-[#065F46] flex items-center gap-2">
                <FaCheck className="text-[#059669]" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 rounded-md bg-[#073F73] hover:bg-[#052E54] disabled:bg-gray-400 text-white text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaving ? (
                <><FaSpinner className="animate-spin" /> Saving...</>
              ) : savedId ? (
                "Update ID Card"
              ) : (
                "Save & Issue ID Card"
              )}
            </button>
          </form>
        </div>

        {/* LIVE PREVIEW */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-xs flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-[#E2E8F0] pb-2 mb-3">
              <span className="text-[11.5px] font-black uppercase text-[#0F172A] flex items-center gap-1.5">
                <FaIdCard className="text-[#0284C7]" /> Live CR80 Card Preview
              </span>
              <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${isUpToDate ? "text-[#065F46] bg-[#D1FAE5]" : "text-[#92400E] bg-[#FEF3C7]"}`}>
                {isUpToDate ? "Issued" : savedId ? "Unsaved changes" : "Not saved"}
              </span>
            </div>

            <div className="w-full max-w-[310px] drop-shadow-xl">
              <RealtorsMediaIdCard id={CARD_ELEMENT_ID} employee={previewEmployee} theme={theme} />
            </div>

            <div className="w-full grid grid-cols-2 gap-2 mt-4">
              <button
                type="button"
                onClick={handlePrint}
                disabled={!!isExporting}
                className="py-2 rounded-md border border-[#073F73] text-[#073F73] hover:bg-[#EEF6FC] font-extrabold text-[11.5px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <FaPrint /> {isExporting === "print" ? "Preparing..." : "Print Card"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!!isExporting}
                className="py-2 rounded-md bg-[#073F73] hover:bg-[#06335C] text-white font-black text-[11.5px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <FaDownload /> {isExporting === "png" ? "Rendering..." : "Download PNG"}
              </button>
            </div>
            <p className="w-full text-center text-[10px] text-[#64748B] font-medium mt-2">
              CR80 Card Standard: 54mm × 85.6mm • 300 DPI Export Ready
            </p>
          </div>
        </div>
      </div>

      {/* ISSUED EMPLOYEE CARDS */}
      <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-xs overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-[13px] font-black uppercase text-[#073F73] tracking-wide">
            Issued Employee ID Cards {!cardsLoading && `(${cards.length})`}
          </h3>
        </div>
        {cardsLoading ? (
          <div className="p-6 text-center text-[12px] text-[#64748B] font-bold flex items-center justify-center gap-2">
            <FaSpinner className="animate-spin" /> Loading...
          </div>
        ) : cards.length === 0 ? (
          <div className="p-6 text-center text-[12px] text-[#64748B] font-medium">
            No employee ID cards issued yet.
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {cards.map((card) => (
              <div key={card.employeeId} className="px-4 py-2.5 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getSafePhotoUrl(card.photoUrl || card.photo)}
                  alt={card.fullName}
                  className="w-10 h-10 rounded-md object-cover border border-[#CBD5E1] flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-black text-[#073F73] truncate">{card.fullName || card.name}</div>
                  <div className="text-[11px] text-[#64748B] font-semibold truncate">
                    {card.designation} • {card.department}
                  </div>
                </div>
                <span className="hidden sm:inline font-mono text-[11.5px] font-extrabold text-[#073F73]">{card.employeeId}</span>
                <button
                  type="button"
                  onClick={() => loadCard(card)}
                  className="px-2.5 py-1.5 bg-white border border-[#CBD5E1] hover:bg-gray-50 text-[#073F73] text-[10.5px] font-bold rounded-md flex items-center gap-1 cursor-pointer"
                >
                  <FaEdit className="text-[9px]" /> Open
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
