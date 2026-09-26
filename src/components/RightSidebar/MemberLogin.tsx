"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { loginMember } from "@/lib/firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { getSafePhotoUrl } from "@/lib/utils/imageUtils";

type LoginTab = "Member" | "Buyer" | "Seller" | "Investor";

export const MemberLogin: React.FC = () => {
  const router = useRouter();
  const { user, memberProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<LoginTab>("Member");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tabs: LoginTab[] = ["Member", "Buyer", "Seller", "Investor"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!userId.trim() || !password) {
      setErrorMessage("Please enter both Email / User ID and Password");
      return;
    }

    setLoading(true);
    try {
      // Firebase auth expects email format. If user typed plain username or emp id, append domain or pass email
      let emailToLogin = userId.trim();
      if (!emailToLogin.includes("@")) {
        // e.g. "rohan" or "RM-B-2026"
        emailToLogin = `${emailToLogin.toLowerCase().replace(/[^a-z0-9]/g, "")}@realtorsmedia.com`;
      }

      await loginMember(emailToLogin, password);
      router.push(`/dashboard?role=${encodeURIComponent(activeTab)}`);
    } catch (err: any) {
      console.error("Firebase Login error:", err);
      let message = "Invalid email or password. Please verify your credentials.";
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        message = "Account not found or password incorrect.";
      } else if (err.code === "auth/wrong-password") {
        message = "Incorrect password. Please try again or reset password.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Please try again later or reset password.";
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, show authenticated state
  if (user) {
    return (
      <div className="w-full bg-white rounded-[6px] border border-[#A5CEE8] shadow-xs overflow-hidden flex flex-col flex-shrink-0">
        <div className="bg-[#073F73] px-3 py-2 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-[#38BDF8] text-[13px]" />
            <h3 className="text-[12.5px] font-black uppercase tracking-wide">
              MEMBER LOGGED IN
            </h3>
          </div>
          <span className="text-[9.5px] bg-[#168A3A] px-2 py-0.5 rounded-full font-bold">
            ONLINE
          </span>
        </div>

        <div className="p-3 text-[12px] space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-[#073F73] overflow-hidden flex-shrink-0">
              <img
                src={getSafePhotoUrl(memberProfile?.photoUrl || user.photoURL)}
                alt={user.displayName || "User"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <p className="font-black text-[#073F73] truncate">
                {memberProfile?.fullName || user.displayName || user.email?.split("@")[0]}
              </p>
              <p className="text-[10.5px] text-gray-500 font-semibold truncate">
                {memberProfile?.employeeId || "Realtors Media Verified"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/dashboard"
              className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-black py-1.5 rounded text-center transition-colors shadow-2xs"
            >
              Dashboard →
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="bg-gray-100 hover:bg-gray-200 text-[#143B5D] text-[11px] font-bold py-1.5 rounded border border-gray-300 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[6px] border border-[#C9D7E3] shadow-xs overflow-hidden flex flex-col flex-shrink-0">
      {/* Yellow Header */}
      <div className="bg-[#F7C900] px-3 py-2 flex items-center gap-2 border-b border-[#e2b800]">
        <FaUser className="text-[#073F73] text-[13px]" />
        <h3 className="text-[13px] sm:text-[13.5px] font-black uppercase text-[#073F73] tracking-wide">
          MEMBER LOGIN
        </h3>
      </div>

      {/* Role Tabs */}
      <div className="grid grid-cols-4 border-b border-[#C9D7E3] bg-[#EEF6FC] text-center text-[11px] font-bold">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setErrorMessage(null);
              }}
              className={`py-1.5 sm:py-2 transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#073F73] text-white font-black"
                  : "text-[#143B5D] hover:bg-[#E0EEFA] hover:text-[#073F73]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="p-2.5 sm:p-3 space-y-2">
        {errorMessage && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-[10.5px] text-red-700 flex items-start gap-1.5">
            <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* User ID / Email Input */}
        <div className="relative flex items-center">
          <span className="absolute left-3 text-[#94A3B8] text-[12px] pointer-events-none">
            <FaUser />
          </span>
          <input
            type="text"
            required
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Email or Member ID"
            className="w-full pl-8 pr-3 py-1 bg-white border border-[#CBD5E1] rounded-[4px] text-[12px] text-[#18324A] placeholder:text-gray-400 focus:outline-hidden focus:border-[#073F73] focus:ring-1 focus:ring-[#073F73] h-[32px] sm:h-[35px]"
          />
        </div>

        {/* Password Input */}
        <div className="relative flex items-center">
          <span className="absolute left-3 text-[#94A3B8] text-[12px] pointer-events-none">
            <FaLock />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-8 pr-8 py-1 bg-white border border-[#CBD5E1] rounded-[4px] text-[12px] text-[#18324A] placeholder:text-gray-400 focus:outline-hidden focus:border-[#073F73] focus:ring-1 focus:ring-[#073F73] h-[32px] sm:h-[35px]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-[#94A3B8] hover:text-[#073F73] text-[12px] cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-[11px] sm:text-[11.5px] text-[#143B5D] pt-0.5">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded-[3px] border-gray-300 text-[#073F73] focus:ring-0 cursor-pointer h-3.5 w-3.5"
            />
            <span className="font-bold">Remember Me</span>
          </label>
          <Link
            href="/forgot-password"
            className="hover:underline font-bold hover:text-[#0B4F8A]"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#073F73] hover:bg-[#06345F] disabled:bg-gray-400 text-white text-[12px] sm:text-[12.5px] font-black py-1 rounded-[4px] transition-colors uppercase tracking-wider cursor-pointer shadow-xs h-[32px] sm:h-[35px] mt-1 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin text-[12px]" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>LOGIN</span>
          )}
        </button>

        {/* Register Prompt — hidden for now; uncomment to show it again */}
        {/* <div className="text-center text-[11px] sm:text-[11.5px] pt-1 text-[#143B5D]">
          <span>New Member? </span>
          <Link href="/register" className="font-black text-[#0B4F8A] hover:underline">
            Register Now
          </Link>
        </div> */}
      </form>
    </div>
  );
};
