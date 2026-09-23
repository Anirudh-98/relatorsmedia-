"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

type LoginTab = "Member" | "Buyer" | "Seller" | "Investor";

export const MemberLogin: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LoginTab>("Member");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const tabs: LoginTab[] = ["Member", "Buyer", "Seller", "Investor"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      alert("Please enter both User ID / Email and Password");
      return;
    }
    // Navigate directly to member dashboard
    router.push(`/dashboard?user=${encodeURIComponent(userId)}&role=${encodeURIComponent(activeTab)}`);
  };

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
              onClick={() => setActiveTab(tab)}
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
        {/* User ID / Email Input */}
        <div className="relative flex items-center">
          <span className="absolute left-3 text-[#94A3B8] text-[12px] pointer-events-none">
            <FaUser />
          </span>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID / Email"
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
          className="w-full bg-[#073F73] hover:bg-[#06345F] text-white text-[12px] sm:text-[12.5px] font-black py-1 rounded-[4px] transition-colors uppercase tracking-wider cursor-pointer shadow-xs h-[32px] sm:h-[35px] mt-1"
        >
          LOGIN
        </button>

        {/* Register Prompt */}
        <div className="text-center text-[11px] sm:text-[11.5px] pt-1 text-[#143B5D]">
          <span>New Member? </span>
          <Link href="/register" className="font-black text-[#0B4F8A] hover:underline">
            Register Now
          </Link>
        </div>
      </form>
    </div>
  );
};
