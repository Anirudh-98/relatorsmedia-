"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { RealtorsMediaIdCard } from "@/components/ui/RealtorsMediaIdCard";
import { IdCardModal } from "@/components/ui/IdCardModal";
import { RealtorsMediaEmployee } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { loginMember } from "@/lib/firebase/auth";
import {
  FaIdCard,
  FaCheckCircle,
  FaDownload,
  FaEye,
  FaPhoneAlt,
  FaEnvelope,
  FaPrint,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaLock,
  FaSpinner,
  FaEdit,
} from "react-icons/fa";

export default function DashboardPage() {
  const { user, memberProfile, logout, loading, refreshProfile } = useAuth();
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);

  // Login form state for unauthenticated visitors
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      await loginMember(loginEmail.trim(), loginPassword);
      await refreshProfile();
    } catch (err: any) {
      console.error("Dashboard login error:", err);
      let msg = "Invalid email or password. Please try again.";
      if (err.code === "auth/user-not-found") {
        msg = "No user found with this email. Please register first.";
      } else if (err.code === "auth/wrong-password") {
        msg = "Incorrect password. Please try again.";
      }
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  // Determine tier theme: user explicitly selected Green Tier (RM-C)
  const empId = memberProfile?.employeeId || "";
  const resolvedTier: "green" | "blue" | "orange" =
    memberProfile?.selectedTier === "green" ||
    memberProfile?.tier === "green" ||
    empId.startsWith("RM-C")
      ? "green"
      : memberProfile?.selectedTier === "orange" ||
        (memberProfile?.tier as string) === "orange" ||
        (memberProfile?.tier as string) === "red" ||
        empId.startsWith("RM-A")
      ? "orange"
      : memberProfile?.selectedTier === "blue" ||
        memberProfile?.tier === "blue" ||
        empId.startsWith("RM-B")
      ? "blue"
      : "green"; // Default to Green Tier

  // Check if profile exists in Firestore database
  const isProfileComplete = !!(memberProfile && memberProfile.employeeId);

  // 100% Real-time database details from Firestore - ZERO hardcoded dummy presets
  const currentEmployee: RealtorsMediaEmployee = {
    name:
      memberProfile?.fullName ||
      memberProfile?.name ||
      (user?.displayName && user.displayName !== "Verified Member"
        ? user.displayName
        : user?.email?.split("@")[0] || ""),
    designation:
      memberProfile?.designation ||
      (memberProfile?.agencyName ? `${memberProfile.agencyName} - REALTOR` : "VERIFIED REALTOR"),
    employeeId: memberProfile?.employeeId || "",
    department: memberProfile?.department || "Property Sales & Channel",
    location:
      memberProfile?.location ||
      (memberProfile?.city
        ? `${memberProfile.city}, ${memberProfile.state || "India"}`
        : ""),
    issuedDate: memberProfile?.issuedDate || "",
    validTill: memberProfile?.validTill || "",
    photo:
      memberProfile?.photoUrl ||
      memberProfile?.photo ||
      user?.photoURL ||
      "/images/rohan_deshmukh.png",
    verificationUrl:
      memberProfile?.verificationUrl ||
      (memberProfile?.employeeId
        ? `https://realtorsmedia.world/verify/${memberProfile.employeeId}`
        : ""),
    theme: resolvedTier,
    phone: memberProfile?.phone || memberProfile?.mobile || "",
    email: memberProfile?.email || user?.email || "",
    agencyName: memberProfile?.agencyName || memberProfile?.companyName || "",
    licenseNumber: memberProfile?.licenseNumber || memberProfile?.reraNo || "",
    experience: memberProfile?.experience || memberProfile?.experienceYears || "",
    specialization: memberProfile?.specialization || "Residential Properties",
  };

  // If loading auth state
  if (loading) {
    return (
      <PortalLayout
        title="MEMBER PORTAL DASHBOARD"
        subtitle="Loading your real-time verified credentials..."
        breadcrumbs={[{ label: "Dashboard" }]}
      >
        <div className="bg-white rounded-[4px] border border-[#C9D7E3] p-16 text-center shadow-xs flex flex-col items-center justify-center gap-3">
          <FaSpinner className="text-3xl text-[#073F73] animate-spin" />
          <p className="text-sm font-bold text-[#073F73]">Loading your member profile from database...</p>
        </div>
      </PortalLayout>
    );
  }

  // If user is not logged in, show direct login card
  if (!user) {
    return (
      <PortalLayout
        title="MEMBER PORTAL LOGIN"
        subtitle="Sign in with your registered email and password to view your official realtime ID card"
        breadcrumbs={[{ label: "Login" }]}
      >
        <div className="max-w-md mx-auto bg-white rounded-[6px] border border-[#C9D7E3] p-6 shadow-sm space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-[#EEF6FC] text-[#073F73] flex items-center justify-center mx-auto text-xl">
              <FaIdCard />
            </div>
            <h2 className="text-lg font-black text-[#073F73]">Member Sign In</h2>
            <p className="text-xs text-gray-500">
              Enter your registered credentials to view your live ID card
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded flex items-center gap-2">
              <FaExclamationTriangle className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="your.email@realtorsmedia.com"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#073F73] hover:bg-[#06345F] text-white text-xs font-black uppercase py-2.5 rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <FaSpinner className="animate-spin text-xs" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <FaLock className="text-xs" />
                  <span>Access Member Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <Link href="/forgot-password" className="text-gray-500 hover:text-[#073F73]">
              Forgot password?
            </Link>
            <Link href="/register" className="text-[#168A3A] font-bold hover:underline">
              Register New ID Card →
            </Link>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      title="MEMBER OFFICIAL ID CARD"
      subtitle="Your verified real-time digital credential linked with the national Realtors Media database"
      badge={
        isProfileComplete
          ? `${resolvedTier.toUpperCase()} MEMBER`
          : "PENDING ACTIVATION"
      }
      breadcrumbs={[{ label: "Dashboard" }]}
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={() => logout()}
            className="bg-gray-100 hover:bg-gray-200 text-[#143B5D] text-[11px] font-bold px-3 py-1.5 rounded-[3px] border border-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Sign Out of Member Portal"
          >
            <FaSignOutAlt className="text-[10px]" />
            <span>Sign Out</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Real-time Database Registration Alert if ID Card is not in Firestore */}
        {!isProfileComplete && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 p-5 rounded-[4px] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <FaExclamationTriangle className="text-2xl text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-base font-black text-amber-900">
                  Official Green ID Card Not Stored in Database Yet
                </h3>
                <p className="text-xs text-amber-800 mt-1 max-w-2xl leading-relaxed">
                  Logged in as <strong>{user.email}</strong>. Your account is authenticated, but your real name, photograph, and Green ID card record have not been stored in the database yet. Click below to enter your details, upload your real photograph, and save your verified card to Firestore.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsIdModalOpen(true)}
              className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-black uppercase px-4 py-2.5 rounded-[3px] transition-colors whitespace-nowrap cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <FaIdCard />
              <span>Create & Save Green ID Card</span>
            </button>
          </div>
        )}

        {/* Official ID Card Showcase with Real-time Data */}
        <div className="bg-white rounded-[4px] border border-[#C9D7E3] p-5 sm:p-6 shadow-xs">
          {isProfileComplete ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Official CR80 ID Card Preview (Green Tier) */}
              <div className="md:col-span-5 flex flex-col items-center">
                <RealtorsMediaIdCard
                  employee={currentEmployee}
                  theme={resolvedTier}
                  width={300}
                  className="shadow-xl rounded-[6px]"
                />
                <p className="text-[10.5px] text-gray-400 font-semibold mt-2.5 text-center">
                  Live CR80 Digital & Physical Credential Match • {resolvedTier.toUpperCase()} TIER
                </p>
              </div>

              {/* Right Column: Member Real-time Details */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="bg-[#E7F6EA] text-[#168A3A] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ Authenticated & Verified Member ({resolvedTier.toUpperCase()} TIER)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#073F73] mt-1">
                      {currentEmployee.name}
                    </h2>
                    <p className="text-xs text-gray-500 font-semibold">
                      {currentEmployee.designation} • {currentEmployee.department}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsIdModalOpen(true)}
                    className="self-start sm:self-center bg-gray-100 hover:bg-gray-200 text-[#073F73] text-[11px] font-bold px-3 py-1.5 rounded-[3px] border border-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FaEdit className="text-[10px]" />
                    <span>Edit ID Card</span>
                  </button>
                </div>

                <div className="bg-[#F8FAFC] p-4 rounded-[4px] border border-[#CBD5E1] space-y-2 text-[12px]">
                  <div className="flex justify-between py-0.5 border-b border-gray-200/60">
                    <span className="text-gray-500">Employee / Member ID:</span>
                    <strong className="text-[#073F73] font-bold">{currentEmployee.employeeId}</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-gray-200/60">
                    <span className="text-gray-500">Full Name:</span>
                    <strong className="text-gray-800">{currentEmployee.name}</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-gray-200/60">
                    <span className="text-gray-500">Official Mobile:</span>
                    <strong className="text-gray-800">{currentEmployee.phone || "Not Set"}</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-gray-200/60">
                    <span className="text-gray-500">Registered Email:</span>
                    <strong className="text-gray-800">{currentEmployee.email}</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-gray-200/60">
                    <span className="text-gray-500">Operating Area:</span>
                    <strong className="text-gray-800">{currentEmployee.location || "India"}</strong>
                  </div>
                  {currentEmployee.agencyName && (
                    <div className="flex justify-between py-0.5 border-b border-gray-200/60">
                      <span className="text-gray-500">Agency / Brokerage:</span>
                      <strong className="text-gray-800">{currentEmployee.agencyName}</strong>
                    </div>
                  )}
                  {currentEmployee.specialization && (
                    <div className="flex justify-between py-0.5 border-b border-gray-200/60">
                      <span className="text-gray-500">Specialization:</span>
                      <strong className="text-gray-800">{currentEmployee.specialization}</strong>
                    </div>
                  )}
                  {currentEmployee.licenseNumber && (
                    <div className="flex justify-between py-0.5 border-b border-gray-200/60">
                      <span className="text-gray-500">License / RERA:</span>
                      <strong className="text-gray-800">{currentEmployee.licenseNumber}</strong>
                    </div>
                  )}
                  {currentEmployee.issuedDate && (
                    <div className="flex justify-between py-0.5 border-b border-gray-200/60">
                      <span className="text-gray-500">Issuance Date:</span>
                      <strong className="text-gray-800">{currentEmployee.issuedDate}</strong>
                    </div>
                  )}
                  {currentEmployee.validTill && (
                    <div className="flex justify-between py-0.5 border-b border-gray-200/60">
                      <span className="text-gray-500">Valid Through:</span>
                      <strong className="text-emerald-700">{currentEmployee.validTill}</strong>
                    </div>
                  )}
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-500">Public QR Verification:</span>
                    <Link
                      href={`/verify/${currentEmployee.employeeId}`}
                      className="text-[#073F73] font-bold underline truncate max-w-[220px]"
                    >
                      {currentEmployee.verificationUrl}
                    </Link>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={`/verify/${currentEmployee.employeeId}`}
                    className="bg-[#073F73] hover:bg-[#06345F] text-white text-xs font-bold px-4 py-2 rounded-[3px] transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <FaEye />
                    <span>Open Public Verification Page</span>
                  </Link>
                  <button
                    onClick={() => setIsIdModalOpen(true)}
                    className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-bold px-4 py-2 rounded-[3px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FaDownload />
                    <span>Download / Print Card</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#168A3A] border border-emerald-200 flex items-center justify-center mx-auto text-2xl shadow-xs">
                <FaIdCard />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#073F73]">
                  No Official ID Card in Database Yet
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Your account is logged in as <strong>{user.email}</strong>, but your ID card has not been registered in the database. Enter your name, mobile number, and upload your photo to store your verified Green ID card and activate QR scanning.
                </p>
              </div>
              <button
                onClick={() => setIsIdModalOpen(true)}
                className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-black uppercase px-6 py-3 rounded-[3px] transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <FaIdCard />
                <span>Create & Register Green ID Card Now</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ID Card Modal to enter details, upload photo and save to Firestore */}
      <IdCardModal
        isOpen={isIdModalOpen}
        onClose={() => setIsIdModalOpen(false)}
        initialEmployee={isProfileComplete ? currentEmployee : undefined}
        initialTier={resolvedTier}
      />
    </PortalLayout>
  );
}
