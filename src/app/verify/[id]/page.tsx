"use client";

import React, { use } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { realtorsEmployees } from "@/data/portalData";
import { RealtorsMediaIdCard } from "@/components/ui/RealtorsMediaIdCard";
import { RealtorsMediaEmployee } from "@/types";
import {
  FaCheckCircle,
  FaShieldAlt,
  FaIdCard,
  FaBuilding,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLock,
  FaArrowLeft,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function VerifyPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "RM-B-1111";
  const decodedId = decodeURIComponent(rawId);

  // Look up employee or synthesize verified profile
  const matched = realtorsEmployees.find(
    (e) => e.employeeId.toLowerCase() === decodedId.toLowerCase()
  );

  const employee: RealtorsMediaEmployee = matched || {
    name: "Rohan Deshmukh",
    designation: "MEDIA EXECUTIVE & CHANNEL ASSOCIATE",
    employeeId: decodedId,
    department: "Media & Channel Operations",
    location: "Pune, Maharashtra",
    issuedDate: "01 AUG 2026",
    validTill: "31 JUL 2028",
    photo: "/images/rohan_deshmukh.png",
    verificationUrl: `https://realtorsmedia.com/verify/${decodedId}`,
    theme: decodedId.includes("A") ? "red" : decodedId.includes("C") ? "green" : "blue",
    phone: "+91 97654 32109",
    email: "rohan.d@realtorsmedia.com",
    specialization: "Corporate Media & Real Estate Advisory",
  };

  return (
    <PortalLayout
      title="IDENTITY & CREDENTIAL VERIFICATION PORTAL"
      subtitle="Official real-time authentication registry for Realtors Media authorized associates, executives, and channel partners"
      badge="NATIONAL REALTOR REGISTRY"
      breadcrumbs={[{ label: "Verify", href: "/verify" }, { label: decodedId }]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Verification Status Banner */}
        <div className="bg-gradient-to-r from-[#0E5A35] via-[#168A3A] to-[#1F7A44] text-white p-5 rounded-[4px] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
              <FaCheckCircle className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-[#168A3A] text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Authentic & Verified
                </span>
                <span className="text-[11px] text-emerald-100 font-semibold">
                  Timestamp: {new Date().toLocaleDateString("en-IN")}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight mt-0.5">
                Official Credential Verified
              </h2>
              <p className="text-[12px] text-emerald-100">
                Member ID: <strong className="text-white underline">{employee.employeeId}</strong> is an authorized active associate of Realtors Media Digital.
              </p>
            </div>
          </div>

          <div className="bg-white/10 px-3 py-2 rounded border border-white/20 text-center flex-shrink-0">
            <span className="text-[10px] text-emerald-200 uppercase font-bold block">Security Hash</span>
            <span className="text-[12px] font-mono font-bold tracking-wider">SEC-9984-OK</span>
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
              Scan-verified CR80 Physical & Digital Card
            </p>
          </div>

          {/* Right: Full Credential Details (7 cols) */}
          <div className="md:col-span-7 space-y-4 text-[12px]">
            <div>
              <span className="text-[10px] bg-[#EEF6FC] text-[#073F73] font-black px-2 py-0.5 rounded-xs uppercase">
                {(employee.theme || "blue").toUpperCase()} TIER REALTOR
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
                <span className="text-gray-500 font-bold">Authorized ID:</span>
                <span className="font-black text-[#073F73]">{employee.employeeId}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-gray-500 font-bold">Operating Location:</span>
                <span className="font-semibold text-gray-800">📍 {employee.location}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-gray-500 font-bold">Registration / Issue Date:</span>
                <span className="font-semibold text-gray-800">{employee.issuedDate}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-gray-500 font-bold">Validity Status:</span>
                <span className="font-bold text-emerald-700">✓ Active until {employee.validTill}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-gray-500 font-bold">Official Contact:</span>
                <span className="font-semibold text-gray-800">{employee.phone}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-gray-500 font-bold">Portal Registered Email:</span>
                <span className="font-semibold text-[#073F73]">{employee.email}</span>
              </div>
            </div>

            {/* Anti Fraud Warning */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-[3px] text-[11px] text-amber-900 flex items-start gap-2">
              <FaShieldAlt className="text-amber-600 text-base flex-shrink-0 mt-0.5" />
              <div>
                <strong>Notice to Buyers & Clients:</strong> All real estate property closings and token payments must strictly be executed through escrow accounts or registered builder contracts. Realtors Media representatives do not collect cash on behalf of sellers.
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
              <Link
                href="/contact"
                className="bg-gray-100 hover:bg-gray-200 text-[#143B5D] text-[11px] font-bold px-4 py-2 rounded-[3px] border border-gray-300 transition-colors flex items-center gap-1.5"
              >
                <FaExclamationTriangle className="text-gray-500 text-[10px]" />
                <span>Report Credential Issue</span>
              </Link>
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
      </div>
    </PortalLayout>
  );
}
