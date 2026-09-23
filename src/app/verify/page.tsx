"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { realtorsEmployees } from "@/data/portalData";
import { FaSearch, FaCheckCircle, FaShieldAlt, FaIdCard, FaArrowRight } from "react-icons/fa";

export default function VerifyIndexPage() {
  const [searchId, setSearchId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      router.push(`/verify/${encodeURIComponent(searchId.trim())}`);
    }
  };

  return (
    <PortalLayout
      title="PUBLIC REALTOR VERIFICATION PORTAL"
      subtitle="Verify official credentials, authorized ID cards, and RERA registration of Realtors Media representatives"
      badge="NATIONAL SECURITY REGISTRY"
      breadcrumbs={[{ label: "Verify" }]}
    >
      <div className="max-w-3xl mx-auto space-y-6 my-4">
        {/* Search Box */}
        <div className="bg-white rounded-[4px] border border-[#C9D7E3] p-6 shadow-sm text-center">
          <div className="w-14 h-14 bg-blue-50 text-[#073F73] rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
            <FaShieldAlt />
          </div>
          <h2 className="text-xl font-black text-[#073F73] uppercase tracking-wide">
            Verify a Realtors Media Associate
          </h2>
          <p className="text-[12.5px] text-gray-600 max-w-lg mx-auto mt-1 mb-5">
            Enter the Employee ID or Member ID printed on the physical CR80 card (e.g. <code>RM-B-1111</code>) to review official verification status and credentials.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Member ID (e.g. RM-B-1111)..."
                className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
            </div>
            <button
              type="submit"
              className="bg-[#073F73] hover:bg-[#06345F] text-white text-[12px] font-black uppercase px-5 py-2 rounded-[3px] transition-colors"
            >
              Verify
            </button>
          </form>
        </div>

        {/* Featured Sample Associates */}
        <div className="bg-white rounded-[4px] border border-[#C9D7E3] overflow-hidden">
          <div className="bg-[#073F73] px-4 py-2.5 text-white flex items-center justify-between">
            <h3 className="text-[12px] font-black uppercase tracking-wider flex items-center gap-2">
              <FaIdCard className="text-[#F7C900]" />
              <span>Recently Verified Associates</span>
            </h3>
            <span className="text-[10px] text-gray-200">100% Active Licensure</span>
          </div>

          <div className="divide-y divide-gray-100">
            {realtorsEmployees.map((emp) => (
              <div
                key={emp.employeeId}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={emp.photo}
                    alt={emp.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#073F73]"
                  />
                  <div>
                    <h4 className="text-[13px] font-black text-[#073F73] flex items-center gap-1.5">
                      <span>{emp.name}</span>
                      <FaCheckCircle className="text-emerald-600 text-xs" />
                    </h4>
                    <p className="text-[11px] text-gray-500 font-semibold">
                      ID: {emp.employeeId} • {emp.designation} • 📍 {emp.location}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/verify/${emp.employeeId}`}
                  className="bg-[#EEF6FC] hover:bg-[#073F73] text-[#073F73] hover:text-white border border-[#A5CEE8] text-[11px] font-bold px-3 py-1.5 rounded-[3px] transition-colors self-start sm:self-auto flex items-center gap-1"
                >
                  <span>View Verification</span>
                  <FaArrowRight className="text-[9px]" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
