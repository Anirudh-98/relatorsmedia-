"use client";

import React, { useState } from "react";
import { FaIdCard, FaCheckCircle, FaStar, FaShieldAlt } from "react-icons/fa";
import { RealtorsMediaIdCard } from "@/components/ui/RealtorsMediaIdCard";
import { IdCardModal } from "@/components/ui/IdCardModal";
import { CardIssuerLoginModal } from "@/components/ui/CardIssuerLoginModal";
import { realtorsEmployees } from "@/data/portalData";
import { RealtorsMediaEmployee } from "@/types";
import { CardIssuer } from "@/lib/firebase/staff";

export const UniqueIdCards: React.FC = () => {
  // Issuer signed in on the memory-only session for this page view; cleared on reload
  const [issuer, setIssuer] = useState<CardIssuer | null>(null);

  const [selectedTier, setSelectedTier] = useState<"green" | "blue" | "orange">("blue");
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const empGreen =
    realtorsEmployees.find((e) => e.theme === "green") || realtorsEmployees[0];
  const empBlue =
    realtorsEmployees.find((e) => e.theme === "blue") || realtorsEmployees[1];
  const empOrange =
    realtorsEmployees.find((e) => e.theme === "orange") || realtorsEmployees[2];

  const getEmpForTier = (tier: "green" | "blue" | "orange") => {
    if (tier === "green") return empGreen;
    if (tier === "orange") return empOrange;
    return empBlue;
  };

  const [selectedEmployee, setSelectedEmployee] = useState<RealtorsMediaEmployee>(
    empBlue
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // When user clicks any of the three cards: verify admin login before opening ID generator
  const handleSelectCardTier = (tierTheme: "green" | "blue" | "orange") => {
    setSelectedTier(tierTheme);
    setSelectedEmployee(getEmpForTier(tierTheme));
    if (issuer) {
      setIsModalOpen(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleOpenGenerator = () => {
    if (issuer) {
      setIsModalOpen(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  return (
    <div className="w-full bg-white rounded-[4px] border border-[#C9D7E3] shadow-xs overflow-hidden flex flex-col flex-shrink-0">
      {/* Yellow Header */}
      <div className="bg-[#F7C900] px-2.5 py-1 border-b border-[#e2b800] text-center">
        <div className="flex items-center justify-center gap-1.5">
          <FaIdCard className="text-[#073F73] text-[13px]" />
          <h3 className="text-[12px] sm:text-[12.5px] font-black uppercase text-[#073F73] tracking-wide">
            GET YOUR UNIQUE ID CARD
          </h3>
        </div>
        <p className="text-[9px] sm:text-[9.5px] font-bold text-[#143B5D] leading-tight">
          Select any of the 3 cards below to fill details & generate your ID
        </p>
      </div>

      {/* Main Container */}
      <div className="p-1.5 flex flex-col items-center">
        {/* ========================================================
            THREE ID CARDS DISPLAY (GREEN, BLUE, ORANGE)
           ======================================================== */}
        <div className="w-full mb-1">
          <div className="flex items-center justify-between px-0.5 mb-1">
            <span className="text-[8.5px] font-black uppercase text-[#475569] tracking-wider flex items-center gap-1">
              <FaShieldAlt className="text-[#0284C7] text-[9px]" />
              <span>3 Verified Card Tiers:</span>
            </span>
            <span className="text-[7.5px] font-bold text-[#0284C7]">
              Click any card to apply
            </span>
          </div>

          {/* 3 Columns: Three distinct colored ID cards */}
          <div className="grid grid-cols-3 gap-1 w-full items-stretch">
            {/* 1. GREEN CARD */}
            <div
              onClick={() => handleSelectCardTier("green")}
              className={`relative flex flex-col items-center p-0.5 rounded-[4px] border cursor-pointer transition-all duration-200 hover:scale-[1.02] group ${
                selectedTier === "green"
                  ? "bg-[#ECFDF5] border-[#059669] shadow-xs ring-1.5 ring-[#059669]"
                  : "bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#059669] hover:bg-[#F0FDF4]"
              }`}
              title="Click to apply for Green Realtor ID (FREE)"
            >
              {/* Selected Checkmark */}
              {selectedTier === "green" && (
                <div className="absolute -top-1 -right-0.5 text-[10px] text-[#059669] bg-white rounded-full z-20 shadow-xs">
                  <FaCheckCircle />
                </div>
              )}

              {/* Price Banner */}
              <div className="w-full bg-[#059669] text-white text-[7.5px] font-black py-0.2 rounded-[2px] text-center mb-0.5 uppercase tracking-wider shadow-xs">
                FREE • ₹0
              </div>

              {/* The Actual Scaled Green ID Card */}
              <div className="w-full max-w-[74px] mx-auto drop-shadow-xs rounded-[2px] overflow-hidden">
                <RealtorsMediaIdCard
                  id="main-card-green"
                  employee={empGreen}
                  theme="green"
                  interactive={false}
                />
              </div>

              {/* Labels & CTA */}
              <span className="text-[8px] font-extrabold text-[#065F46] mt-0.5 leading-tight text-center">
                Green Card
              </span>
              <span className="text-[7px] font-bold text-[#64748B] leading-none">
                15% Closings
              </span>
              <span className="text-[7px] font-black text-[#059669] mt-0.5 uppercase tracking-wide group-hover:underline">
                Apply →
              </span>
            </div>

            {/* 2. BLUE CARD */}
            <div
              onClick={() => handleSelectCardTier("blue")}
              className={`relative flex flex-col items-center p-0.5 rounded-[4px] border cursor-pointer transition-all duration-200 hover:scale-[1.02] group ${
                selectedTier === "blue"
                  ? "bg-[#EFF6FF] border-[#0284C7] shadow-xs ring-1.5 ring-[#0284C7]"
                  : "bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#0284C7] hover:bg-[#EFF6FF]"
              }`}
              title="Click to apply for Executive Blue Realtor ID (₹2,000)"
            >
              {/* Selected Checkmark */}
              {selectedTier === "blue" && (
                <div className="absolute -top-1 -right-0.5 text-[10px] text-[#0284C7] bg-white rounded-full z-20 shadow-xs">
                  <FaCheckCircle />
                </div>
              )}

              {/* Price Banner */}
              <div className="w-full bg-[#0284C7] text-white text-[7.5px] font-black py-0.2 rounded-[2px] text-center mb-0.5 uppercase tracking-wider shadow-xs">
                ₹2,000
              </div>

              {/* The Actual Scaled Blue ID Card */}
              <div className="w-full max-w-[74px] mx-auto drop-shadow-xs rounded-[2px] overflow-hidden">
                <RealtorsMediaIdCard
                  id="main-card-blue"
                  employee={empBlue}
                  theme="blue"
                  interactive={false}
                />
              </div>

              {/* Labels & CTA */}
              <span className="text-[8px] font-extrabold text-[#073F73] mt-0.5 leading-tight text-center">
                Blue Card
              </span>
              <span className="text-[7px] font-bold text-[#64748B] leading-none">
                30% Closings
              </span>
              <span className="text-[7px] font-black text-[#0284C7] mt-0.5 uppercase tracking-wide group-hover:underline">
                Apply →
              </span>
            </div>

            {/* 3. ORANGE CARD */}
            <div
              onClick={() => handleSelectCardTier("orange")}
              className={`relative flex flex-col items-center p-0.5 rounded-[4px] border cursor-pointer transition-all duration-200 hover:scale-[1.02] group ${
                selectedTier === "orange"
                  ? "bg-[#FFF7ED] border-[#EA580C] shadow-xs ring-1.5 ring-[#EA580C]"
                  : "bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#EA580C] hover:bg-[#FFF7ED]"
              }`}
              title="Click to apply for VIP Elite Orange ID (₹5,000)"
            >
              {/* Selected Checkmark */}
              {selectedTier === "orange" && (
                <div className="absolute -top-1 -right-0.5 text-[10px] text-[#EA580C] bg-white rounded-full z-20 shadow-xs">
                  <FaCheckCircle />
                </div>
              )}

              {/* Price Banner */}
              <div className="w-full bg-[#EA580C] text-white text-[7.5px] font-black py-0.2 rounded-[2px] text-center mb-0.5 uppercase tracking-wider shadow-xs">
                ₹5,000
              </div>

              {/* The Actual Scaled Orange ID Card */}
              <div className="w-full max-w-[74px] mx-auto drop-shadow-xs rounded-[2px] overflow-hidden">
                <RealtorsMediaIdCard
                  id="main-card-orange"
                  employee={empOrange}
                  theme="orange"
                  interactive={false}
                />
              </div>

              {/* Labels & CTA */}
              <span className="text-[8px] font-extrabold text-[#C2410C] mt-0.5 leading-tight text-center">
                Orange Card
              </span>
              <span className="text-[7px] font-bold text-[#64748B] leading-none">
                50% Closings
              </span>
              <span className="text-[7px] font-black text-[#EA580C] mt-0.5 uppercase tracking-wide group-hover:underline">
                Apply →
              </span>
            </div>
          </div>
        </div>

        {/* Full-width CTA Button */}
        <button
          type="button"
          onClick={handleOpenGenerator}
          className="w-full mt-1 bg-[#EA580C] hover:bg-[#D94F04] text-white text-[9px] sm:text-[9.5px] font-black py-1 px-1.5 rounded-[3px] transition-colors flex items-center justify-center gap-1 uppercase tracking-wider cursor-pointer shadow-xs"
        >
          <FaStar className="text-[8.5px] text-yellow-300" />
          <span>CLICK ANY CARD TO GENERATE ID</span>
          <span className="text-[9.5px]">→</span>
        </button>
      </div>

      {/* Admin Login Verification Modal */}
      <CardIssuerLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={(signedIn) => {
          setIssuer(signedIn);
          setIsAdminModalOpen(false);
          setIsModalOpen(true);
        }}
      />

      {/* High-Resolution Modal Preview & Details Registration Dialog */}
      <IdCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTier={selectedTier}
        issuer={issuer ?? undefined}
      />
    </div>
  );
};
