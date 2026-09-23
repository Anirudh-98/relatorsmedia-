"use client";

import React from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaGooglePlay, FaApple, FaDownload, FaIdCard, FaBell, FaTv, FaBolt, FaCheckCircle, FaMobileAlt } from "react-icons/fa";

export default function MobileAppPage() {
  return (
    <PortalLayout
      title="Realtors Media Mobile App"
      subtitle="Access Verified Real Estate Classifieds, Smart ID Card & 24x7 Broadcasts Anytime, Anywhere"
      badge="iOS & Android"
    >
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#073F73] via-[#0B4F8A] to-[#0284C7] rounded-xl text-white p-6 sm:p-10 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-[#F7C900] text-[11px] font-black uppercase tracking-widest block mb-2">
              Next-Gen Property Networking
            </span>
            <h2 className="text-[26px] sm:text-[34px] font-black leading-tight mb-3">
              Carry India&apos;s Entire Real Estate Network in Your Pocket
            </h2>
            <p className="text-[14px] text-[#BAE6FD] leading-relaxed mb-6">
              Instant notification on new RERA approvals, verified member accreditation badge, real-time lead inquiries, and uninterrupted 24x7 TV broadcasting right on your smartphone.
            </p>

            {/* Store Download Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#download-android"
                className="bg-black hover:bg-gray-900 text-white px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors shadow-sm"
              >
                <FaGooglePlay className="text-[24px] text-[#3DDC84]" />
                <div className="text-left">
                  <span className="text-[9px] text-gray-300 block leading-none">GET IT ON</span>
                  <span className="text-[14px] font-black tracking-wide leading-none">Google Play</span>
                </div>
              </a>

              <a
                href="#download-ios"
                className="bg-black hover:bg-gray-900 text-white px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors shadow-sm"
              >
                <FaApple className="text-[28px] text-white" />
                <div className="text-left">
                  <span className="text-[9px] text-gray-300 block leading-none">DOWNLOAD ON THE</span>
                  <span className="text-[14px] font-black tracking-wide leading-none">App Store</span>
                </div>
              </a>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#BAE6FD]">
              <FaCheckCircle className="text-[#4ADE80]" />
              <span>Version 3.4.1 • Free Download • 4.8★ Rated (15,000+ Reviews)</span>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
            <div className="bg-white p-3 rounded-xl shadow-md">
              <QRCodeSVG
                value="https://realtorsmedia.world/mobile-app?download=direct"
                size={130}
                level="M"
              />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-[#F7C900] tracking-wide block mb-1">
                Scan With Camera
              </span>
              <h3 className="text-[16px] font-black text-white leading-tight">
                Scan to Install Directly
              </h3>
              <p className="text-[11.5px] text-[#BAE6FD] mt-1 max-w-[200px]">
                Point your phone camera to download the Android APK or iOS app directly.
              </p>
              <button
                type="button"
                onClick={() => alert("Downloading Realtors Media Android APK (v3.4.1)...")}
                className="mt-3 bg-[#E21F2F] hover:bg-[#F11D32] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FaDownload />
                <span>Direct APK Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Key App Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#CBD5E1] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#E7F6EA] text-[#168A3A] flex items-center justify-center text-[20px] mb-3">
              <FaIdCard />
            </div>
            <h3 className="text-[15px] font-black text-[#073F73] mb-1">
              Digital CR80 ID Card
            </h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Show client prospects your official verified Realtor ID card on your phone with live tamper-proof QR verification.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#CBD5E1] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#EEF6FC] text-[#0B4F8A] flex items-center justify-center text-[20px] mb-3">
              <FaBell />
            </div>
            <h3 className="text-[15px] font-black text-[#073F73] mb-1">
              Instant Lead Alerts
            </h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Receive direct push notifications the moment a genuine buyer inquires about your listed plots, apartments, or villas.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#CBD5E1] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#F1E7FA] text-[#6637A8] flex items-center justify-center text-[20px] mb-3">
              <FaTv />
            </div>
            <h3 className="text-[15px] font-black text-[#073F73] mb-1">
              Live TV on the Go
            </h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Never miss a market movement. Stream Realtors Media TV 24x7 in crystal clear HD with background audio support.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#CBD5E1] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#FFF4B8] text-[#D97706] flex items-center justify-center text-[20px] mb-3">
              <FaBolt />
            </div>
            <h3 className="text-[15px] font-black text-[#073F73] mb-1">
              Fast Property Posting
            </h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Snap photos with your phone camera, set price, and publish classified ads across 15 categories in under 60 seconds.
            </p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
