"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { RealtorsMediaIdCard } from "@/components/ui/RealtorsMediaIdCard";
import { RealtorsMediaEmployee } from "@/types";
import { getIdCardRecord, getMemberByEmployeeId } from "@/lib/firebase/db";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaIdCard,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowLeft,
  FaExclamationTriangle,
  FaSpinner,
  FaSearch,
} from "react-icons/fa";

export default function VerifyPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "";
  const decodedId = rawId ? decodeURIComponent(rawId).trim() : "";

  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [employee, setEmployee] = useState<RealtorsMediaEmployee | null>(null);

  useEffect(() => {
    async function verifyCredential() {
      if (!decodedId) {
        setIsLoading(false);
        setIsVerified(false);
        setEmployee(null);
        return;
      }

      setIsLoading(true);

      try {
        // 1. Check Firestore `idCards` collection (Real-time live database)
        const idCardDoc = await getIdCardRecord(decodedId);
        if (idCardDoc) {
          setEmployee({
            name: idCardDoc.fullName || idCardDoc.name || "",
            designation: idCardDoc.designation || "VERIFIED REALTOR",
            employeeId: idCardDoc.employeeId,
            department: idCardDoc.department || "Property Sales & Channel",
            location: idCardDoc.location || "India",
            issuedDate: idCardDoc.issuedDate || "",
            validTill: idCardDoc.validTill || "",
            photo: idCardDoc.photoUrl || idCardDoc.photo || "/images/rohan_deshmukh.png",
            verificationUrl: idCardDoc.verificationUrl || `https://realtorsmedia.world/verify/${idCardDoc.employeeId}`,
            theme: (idCardDoc.cardTier === "orange" || idCardDoc.cardTier === "red" ? "orange" : idCardDoc.cardTier === "green" ? "green" : "blue") as any,
            phone: idCardDoc.phone || idCardDoc.mobile || "",
            email: idCardDoc.email || "",
            agencyName: idCardDoc.agencyName || "",
            licenseNumber: idCardDoc.licenseNumber || "",
            specialization: idCardDoc.specialization || "Residential Properties",
            experience: idCardDoc.experience || "",
          });
          setIsVerified(true);
          setIsLoading(false);
          return;
        }

        // 2. Check Firestore `members` collection (Real-time live database)
        const memberDoc = await getMemberByEmployeeId(decodedId);
        if (memberDoc) {
          setEmployee({
            name: memberDoc.fullName || memberDoc.name || "",
            designation: memberDoc.designation || "VERIFIED REALTOR",
            employeeId: memberDoc.employeeId,
            department: memberDoc.department || "Property Sales & Channel",
            location: memberDoc.location || (memberDoc.city ? `${memberDoc.city}, ${memberDoc.state || "India"}` : "India"),
            issuedDate: memberDoc.issuedDate || "",
            validTill: memberDoc.validTill || "",
            photo: memberDoc.photoUrl || memberDoc.photo || "/images/rohan_deshmukh.png",
            verificationUrl: memberDoc.verificationUrl || `https://realtorsmedia.world/verify/${memberDoc.employeeId}`,
            theme: (((memberDoc.selectedTier as string) === "orange" || (memberDoc.selectedTier as string) === "red") ? "orange" : memberDoc.selectedTier === "green" ? "green" : "blue") as any,
            phone: memberDoc.phone || memberDoc.mobile || "",
            email: memberDoc.email || "",
            agencyName: memberDoc.agencyName || memberDoc.companyName || "",
            licenseNumber: memberDoc.licenseNumber || memberDoc.reraNo || "",
            specialization: memberDoc.specialization || "Residential Properties",
            experience: memberDoc.experience || memberDoc.experienceYears || "",
          });
          setIsVerified(true);
          setIsLoading(false);
          return;
        }

        // If not in Firestore database -> NOT VERIFIED (No hardcoded fallback data)
        setEmployee(null);
        setIsVerified(false);
      } catch (err) {
        console.error("Verification lookup error:", err);
        setEmployee(null);
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    }

    verifyCredential();
  }, [decodedId]);

  return (
    <PortalLayout
      title="IDENTITY & CREDENTIAL VERIFICATION PORTAL"
      subtitle="Official real-time authentication registry for Realtors Media authorized associates, executives, and channel partners"
      badge="NATIONAL REALTOR REGISTRY"
      breadcrumbs={[{ label: "Verify", href: "/verify" }, { label: decodedId }]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {isLoading ? (
          <div className="bg-white rounded-[4px] border border-[#C9D7E3] p-12 text-center shadow-xs flex flex-col items-center justify-center gap-3">
            <FaSpinner className="text-3xl text-[#073F73] animate-spin" />
            <h3 className="text-base font-black text-[#073F73]">
              Querying National Realtors Media Database...
            </h3>
            <p className="text-xs text-gray-500">
              Validating credential authenticity for ID: <strong>{decodedId}</strong>
            </p>
          </div>
        ) : isVerified && employee ? (
          <>
            {/* VERIFIED GREEN BANNER */}
            <div className="bg-gradient-to-r from-[#0E5A35] via-[#168A3A] to-[#1F7A44] text-white p-5 rounded-[4px] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                  <FaCheckCircle className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-white text-[#168A3A] text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ Authenticated & Verified Member
                    </span>
                    <span className="text-[11px] text-emerald-100 font-semibold">
                      Live Timestamp: {new Date().toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight mt-0.5">
                    Official Realtors Media Credential Active
                  </h2>
                  <p className="text-[12px] text-emerald-100">
                    Member ID: <strong className="text-white underline">{employee.employeeId}</strong> is an authorized, active member registered in the Realtors Media Network.
                  </p>
                </div>
              </div>

              <div className="bg-white/10 px-3 py-2 rounded border border-white/20 text-center flex-shrink-0">
                <span className="text-[10px] text-emerald-200 uppercase font-bold block">Registry Status</span>
                <span className="text-[12px] font-mono font-bold tracking-wider text-white">ACTIVE / VALID</span>
              </div>
            </div>

            {/* Verification Details Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-[4px] border border-[#C9D7E3] p-5 shadow-xs items-center">
              {/* Left: CR80 Card Preview (5 cols) */}
              <div className="md:col-span-5 flex flex-col items-center">
                <RealtorsMediaIdCard
                  employee={employee}
                  width={290}
                  className="shadow-lg rounded-[6px]"
                />
                <p className="text-[10.5px] text-gray-400 font-semibold mt-2 text-center">
                  Live CR80 Digital & Physical Credential Match
                </p>
              </div>

              {/* Right: Full Credential Details (7 cols) */}
              <div className="md:col-span-7 space-y-4 text-[12px]">
                <div>
                  <span className="text-[10px] bg-[#EEF6FC] text-[#073F73] font-black px-2 py-0.5 rounded-xs uppercase">
                    {(employee.theme || "blue").toUpperCase()} TIER VERIFIED REALTOR
                  </span>
                  <h3 className="text-xl font-black text-[#073F73] mt-1">
                    {employee.name}
                  </h3>
                  <p className="text-[12px] text-gray-500 font-semibold">
                    {employee.designation} • {employee.department}
                  </p>
                </div>

                <div className="divide-y divide-gray-100 border border-gray-200 rounded-[4px] overflow-hidden bg-[#F8FAFC]">
                  <div className="p-2.5 flex justify-between">
                    <span className="text-gray-500 font-bold">Member ID:</span>
                    <span className="font-black text-[#073F73]">{employee.employeeId}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-gray-500 font-bold">Operating Location:</span>
                    <span className="font-semibold text-gray-800">📍 {employee.location}</span>
                  </div>
                  {employee.agencyName && (
                    <div className="p-2.5 flex justify-between">
                      <span className="text-gray-500 font-bold">Agency / Brokerage:</span>
                      <span className="font-semibold text-gray-800">{employee.agencyName}</span>
                    </div>
                  )}
                  {employee.licenseNumber && (
                    <div className="p-2.5 flex justify-between">
                      <span className="text-gray-500 font-bold">RERA / License No.:</span>
                      <span className="font-semibold text-gray-800">{employee.licenseNumber}</span>
                    </div>
                  )}
                  {employee.specialization && (
                    <div className="p-2.5 flex justify-between">
                      <span className="text-gray-500 font-bold">Specialization:</span>
                      <span className="font-semibold text-gray-800">{employee.specialization}</span>
                    </div>
                  )}
                  <div className="p-2.5 flex justify-between">
                    <span className="text-gray-500 font-bold">Registration / Issue Date:</span>
                    <span className="font-semibold text-gray-800">{employee.issuedDate}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-gray-500 font-bold">Validity Status:</span>
                    <span className="font-bold text-emerald-700">✓ Active until {employee.validTill}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-gray-500 font-bold">Official Contact Phone:</span>
                    <span className="font-semibold text-gray-800">{employee.phone}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-gray-500 font-bold">Registered Email:</span>
                    <span className="font-semibold text-[#073F73]">{employee.email}</span>
                  </div>
                </div>

                {/* Anti Fraud Warning */}
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-[3px] text-[11px] text-amber-900 flex items-start gap-2">
                  <FaShieldAlt className="text-amber-600 text-base flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Notice to Buyers & Clients:</strong> Always confirm verified credentials through this official page before signing contracts or transferring tokens. Realtors Media representatives do not collect cash payments on behalf of developers or sellers.
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <a
                    href={`tel:${employee.phone}`}
                    className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-bold px-4 py-2 rounded-[3px] transition-colors flex items-center gap-1.5"
                  >
                    <FaPhoneAlt className="text-[10px]" />
                    <span>Call {employee.name.split(" ")[0]}</span>
                  </a>
                  <a
                    href={`mailto:${employee.email}`}
                    className="bg-gray-100 hover:bg-gray-200 text-[#143B5D] text-[11px] font-bold px-4 py-2 rounded-[3px] border border-gray-300 transition-colors flex items-center gap-1.5"
                  >
                    <FaEnvelope className="text-[10px]" />
                    <span>Email Member</span>
                  </a>
                  <Link
                    href="/"
                    className="text-[#073F73] text-[11px] font-bold px-3 py-2 hover:underline ml-auto flex items-center gap-1"
                  >
                    <FaArrowLeft className="text-[9px]" />
                    <span>Return to Portal</span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* UNVERIFIED RED BANNER & ALERT */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#991B1B] via-[#DC2626] to-[#EF4444] text-white p-5 rounded-[4px] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                  <FaTimesCircle className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-white text-red-700 text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      ✕ Unverified / Invalid ID
                    </span>
                    <span className="text-[11px] text-red-100 font-semibold">
                      Timestamp: {new Date().toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight mt-0.5">
                    No Official Record Found in National Database
                  </h2>
                  <p className="text-[12px] text-red-100">
                    The Member ID <strong className="text-white underline">{decodedId}</strong> could not be authenticated as an active Realtors Media member.
                  </p>
                </div>
              </div>

              <div className="bg-white/10 px-3 py-2 rounded border border-white/20 text-center flex-shrink-0">
                <span className="text-[10px] text-red-200 uppercase font-bold block">Status</span>
                <span className="text-[12px] font-mono font-bold tracking-wider text-white">INVALID / UNISSUED</span>
              </div>
            </div>

            <div className="bg-white rounded-[4px] border border-red-200 p-6 space-y-4">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-2xl text-red-600 mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="text-base font-black text-red-700">
                    Caution: This Credential Could Not Be Verified
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    The ID card with number <strong>{decodedId}</strong> is either not registered, has been suspended, or the QR code scanned points to an unissued identifier.
                  </p>
                  <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                    <li>Do not make any real estate booking payments or cash handovers to unverified parties.</li>
                    <li>Ensure you are scanning the official QR code printed directly on an authorized Realtors Media physical ID card.</li>
                    <li>If you are a member and your card is recently generated, please verify your email and check your member portal dashboard.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center gap-3">
                <Link
                  href="/verify"
                  className="bg-[#073F73] hover:bg-[#06345F] text-white text-xs font-bold px-4 py-2 rounded-[3px] flex items-center gap-1.5"
                >
                  <FaSearch className="text-[11px]" />
                  <span>Search Registered Members</span>
                </Link>
                <Link
                  href="/contact"
                  className="bg-gray-100 hover:bg-gray-200 text-[#143B5D] text-xs font-bold px-4 py-2 rounded-[3px] border border-gray-300 flex items-center gap-1.5"
                >
                  <FaShieldAlt className="text-[11px] text-red-600" />
                  <span>Report Fraudulent or Fake ID</span>
                </Link>
                <Link
                  href="/"
                  className="text-xs text-[#073F73] font-bold hover:underline ml-auto"
                >
                  ← Return to Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
