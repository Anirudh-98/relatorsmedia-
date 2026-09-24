"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { RealtorsMediaIdCard } from "@/components/ui/RealtorsMediaIdCard";
import { realtorsEmployees } from "@/data/portalData";
import { RealtorsMediaEmployee } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  FaIdCard,
  FaHome,
  FaUsers,
  FaCoins,
  FaCheckCircle,
  FaDownload,
  FaPlus,
  FaEye,
  FaPhoneAlt,
  FaEnvelope,
  FaPrint,
  FaShareAlt,
  FaSignOutAlt,
} from "react-icons/fa";

export default function DashboardPage() {
  const { user, memberProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"card" | "listings" | "leads" | "earnings">("card");

  // If member is logged in via Firebase Auth / Firestore, construct their live profile card
  const currentEmployee: RealtorsMediaEmployee = memberProfile
    ? {
        name: memberProfile.fullName,
        designation: memberProfile.designation,
        employeeId: memberProfile.employeeId,
        department: memberProfile.department,
        location: `${memberProfile.city}, ${memberProfile.state}`,
        issuedDate: memberProfile.issuedDate || "24 SEP 2026",
        validTill: memberProfile.validTill || "23 SEP 2028",
        photo: memberProfile.photoUrl || user?.photoURL || "/images/rohan_deshmukh.png",
        verificationUrl: memberProfile.verificationUrl || `https://realtorsmedia.com/verify/${memberProfile.employeeId}`,
        theme: memberProfile.selectedTier === "orange" ? "red" : memberProfile.selectedTier,
        phone: memberProfile.phone ? `+91 ${memberProfile.phone}` : "+91 9876543210",
        email: memberProfile.email || user?.email || "member@realtorsmedia.com",
      }
    : user
    ? {
        name: user.displayName || user.email?.split("@")[0] || "Registered Member",
        designation: "VERIFIED REALTOR",
        employeeId: "RM-B-2026",
        department: "Property Brokerage Cell",
        location: "India",
        issuedDate: "24 SEP 2026",
        validTill: "23 SEP 2028",
        photo: user.photoURL || "/images/rohan_deshmukh.png",
        verificationUrl: "https://realtorsmedia.com/verify/RM-B-2026",
        theme: "blue",
        phone: "+91 9876543210",
        email: user.email || "member@realtorsmedia.com",
      }
    : realtorsEmployees[1]; // Fallback demo member (Rohan Deshmukh)

  // Simulated listings
  const myListings = [
    {
      id: "prop-101",
      title: "4 BHK Luxury Villa with Private Pool",
      location: "Banjara Hills, Hyderabad",
      price: "₹ 4.85 Cr",
      category: "Villas",
      status: "Active",
      views: 342,
      leads: 18,
    },
    {
      id: "prop-102",
      title: "500 Sq. Yds Corner Open Plot - HMDA Approved",
      location: "Mokila, Hyderabad",
      price: "₹ 1.25 Cr",
      category: "Open Plots",
      status: "Active",
      views: 512,
      leads: 29,
    },
    {
      id: "prop-103",
      title: "Commercial Retail Space (Ground Floor)",
      location: "Kondapur High Street, Hyderabad",
      price: "₹ 2.10 Cr",
      category: "Commercial",
      status: "Under Offer",
      views: 180,
      leads: 12,
    },
  ];

  // Simulated leads
  const myLeads = [
    {
      id: "lead-1",
      name: "Venkat Rao",
      phone: "+91 98490 87654",
      property: "4 BHK Luxury Villa",
      budget: "₹ 4.5 - 5 Cr",
      date: "Today, 11:20 AM",
      status: "New",
    },
    {
      id: "lead-2",
      name: "Dr. Ananya Reddy",
      phone: "+91 99890 12389",
      property: "500 Sq. Yds Mokila Plot",
      budget: "₹ 1.2 Cr",
      date: "Yesterday",
      status: "Contacted",
    },
    {
      id: "lead-3",
      name: "Rajeshwar Rao & Sons",
      phone: "+91 94401 56780",
      property: "Commercial Retail Space",
      budget: "₹ 2 Cr",
      date: "20 Sep 2026",
      status: "Site Visit Scheduled",
    },
  ];

  return (
    <PortalLayout
      title="MEMBER PORTAL DASHBOARD"
      subtitle="Manage your Realtors Media verified credentials, active property listings, client inquiries, and transaction commissions"
      badge={memberProfile ? `${memberProfile.selectedTier.toUpperCase()} MEMBER` : "EXECUTIVE MEMBER"}
      breadcrumbs={[{ label: "Dashboard" }]}
      action={
        <div className="flex items-center gap-2">
          <Link
            href="/post-property"
            className="bg-[#E21F2F] hover:bg-[#c91826] text-white text-[11px] font-black uppercase px-3 py-1.5 rounded-[3px] transition-colors flex items-center gap-1.5"
          >
            <FaPlus className="text-[10px]" />
            <span>Post Property</span>
          </Link>
          {user && (
            <button
              onClick={() => logout()}
              className="bg-gray-100 hover:bg-gray-200 text-[#143B5D] text-[11px] font-bold px-2.5 py-1.5 rounded-[3px] border border-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Sign Out of Firebase"
            >
              <FaSignOutAlt className="text-[10px]" />
              <span>Logout</span>
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Member Profile Summary Card */}
        <div className="bg-white rounded-[4px] border border-[#C9D7E3] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#0B4F8A] flex-shrink-0 bg-gray-100">
              <img
                src={currentEmployee.photo}
                alt={currentEmployee.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#073F73]">
                  {currentEmployee.name}
                </h2>
                <span className="bg-[#EEF6FC] text-[#0B4F8A] border border-[#A5CEE8] text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase">
                  {memberProfile?.selectedTier ? `${memberProfile.selectedTier} Tier` : "Verified Executive"}
                </span>
              </div>
              <p className="text-[11.5px] text-gray-600 font-semibold">
                ID: <span className="text-[#073F73] font-bold">{currentEmployee.employeeId}</span> • {currentEmployee.department}
              </p>
              <p className="text-[11px] text-gray-500">
                📍 {currentEmployee.location} • Valid till: {currentEmployee.validTill}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <Link
              href={`/verify/${currentEmployee.employeeId}`}
              className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-bold px-3 py-1.5 rounded-[3px] transition-colors flex items-center gap-1.5"
            >
              <FaEye className="text-[10px]" />
              <span>Public Verification</span>
            </Link>
            <button
              onClick={() => window.print()}
              className="bg-gray-100 hover:bg-gray-200 text-[#143B5D] text-[11px] font-bold px-3 py-1.5 rounded-[3px] border border-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FaPrint className="text-[10px]" />
              <span>Print ID</span>
            </button>
          </div>
        </div>

        {/* 4 Stats counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-[4px] border border-[#C9D7E3] text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Active Listings</span>
            <span className="text-xl font-black text-[#073F73]">3</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">2 Verified HMDA</span>
          </div>

          <div className="bg-white p-3.5 rounded-[4px] border border-[#C9D7E3] text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Total Inquiries</span>
            <span className="text-xl font-black text-[#073F73]">59</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">+18 this month</span>
          </div>

          <div className="bg-white p-3.5 rounded-[4px] border border-[#C9D7E3] text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">Commission Tier</span>
            <span className="text-xl font-black text-[#168A3A]">30%</span>
            <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">Executive Level</span>
          </div>

          <div className="bg-white p-3.5 rounded-[4px] border border-[#C9D7E3] text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase block">ID Card Status</span>
            <span className="text-xl font-black text-emerald-600">ACTIVE</span>
            <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">RERA Compliant</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-[4px] border border-[#C9D7E3] overflow-hidden">
          <div className="flex border-b border-[#C9D7E3] bg-[#F8FAFC] text-[12px] font-black uppercase">
            <button
              onClick={() => setActiveTab("card")}
              className={`px-4 py-2.5 flex items-center gap-2 cursor-pointer transition-colors border-b-2 ${
                activeTab === "card"
                  ? "border-[#073F73] text-[#073F73] bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <FaIdCard />
              <span>Official ID Card</span>
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-4 py-2.5 flex items-center gap-2 cursor-pointer transition-colors border-b-2 ${
                activeTab === "listings"
                  ? "border-[#073F73] text-[#073F73] bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <FaHome />
              <span>My Properties ({myListings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`px-4 py-2.5 flex items-center gap-2 cursor-pointer transition-colors border-b-2 ${
                activeTab === "leads"
                  ? "border-[#073F73] text-[#073F73] bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <FaUsers />
              <span>Direct Leads ({myLeads.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("earnings")}
              className={`px-4 py-2.5 flex items-center gap-2 cursor-pointer transition-colors border-b-2 ${
                activeTab === "earnings"
                  ? "border-[#073F73] text-[#073F73] bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <FaCoins />
              <span>Commission & Payouts</span>
            </button>
          </div>

          <div className="p-5">
            {/* Tab 1: Official ID Card */}
            {activeTab === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 flex justify-center">
                  <RealtorsMediaIdCard
                    employee={currentEmployee}
                    width={300}
                    className="shadow-xl rounded-[6px]"
                  />
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div>
                    <span className="bg-[#E7F6EA] text-[#168A3A] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      CR80 Standard Physical & Digital Card
                    </span>
                    <h3 className="text-lg font-black text-[#073F73] mt-1">
                      {currentEmployee.name} - Official Identity Card
                    </h3>
                    <p className="text-[12px] text-gray-600 leading-relaxed mt-1">
                      Your identity card is linked with the national Realtors Media database. Clients and prospective buyers can scan the QR code to verify your credentials, license status, and company ties.
                    </p>
                  </div>

                  <div className="bg-[#F8FAFC] p-3.5 rounded-[4px] border border-[#CBD5E1] space-y-2 text-[12px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Employee / Member ID:</span>
                      <strong className="text-[#073F73]">{currentEmployee.employeeId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Department / Wing:</span>
                      <strong className="text-gray-800">{currentEmployee.department}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Issuance Date:</span>
                      <strong className="text-gray-800">{currentEmployee.issuedDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Valid Through:</span>
                      <strong className="text-emerald-700">{currentEmployee.validTill}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Verification URL:</span>
                      <Link
                        href={`/verify/${currentEmployee.employeeId}`}
                        className="text-[#073F73] font-bold underline truncate max-w-[200px]"
                      >
                        {currentEmployee.verificationUrl}
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <Link
                      href={`/verify/${currentEmployee.employeeId}`}
                      className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11.5px] font-bold px-4 py-2 rounded-[3px] transition-colors flex items-center gap-1.5"
                    >
                      <FaEye />
                      <span>Test QR Verification Page</span>
                    </Link>
                    <button
                      onClick={() => alert("Digital ID card downloaded successfully as PNG!")}
                      className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-[11.5px] font-bold px-4 py-2 rounded-[3px] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FaDownload />
                      <span>Download HD PNG</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: My Listings */}
            {activeTab === "listings" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[13px] font-black uppercase text-[#073F73]">
                    Your Published Properties
                  </h4>
                  <Link
                    href="/post-property"
                    className="bg-[#E21F2F] hover:bg-[#c91826] text-white text-[11px] font-bold px-3 py-1.5 rounded-[3px] transition-colors flex items-center gap-1"
                  >
                    <FaPlus className="text-[9px]" />
                    <span>Add New Listing</span>
                  </Link>
                </div>

                <div className="divide-y divide-gray-100 border border-gray-200 rounded-[4px] overflow-hidden">
                  {myListings.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px]"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#EEF6FC] text-[#073F73] text-[9.5px] font-black px-1.5 py-0.2 rounded-xs uppercase">
                            {item.category}
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 text-[9.5px] font-bold px-1.5 py-0.2 rounded-xs">
                            ● {item.status}
                          </span>
                        </div>
                        <h5 className="font-bold text-[#143B5D] text-[13px]">{item.title}</h5>
                        <p className="text-gray-500 text-[11px] mt-0.5">
                          📍 {item.location} • <strong className="text-[#073F73]">{item.price}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-gray-500 text-[11.5px]">
                        <span>
                          👁️ <strong>{item.views}</strong> views
                        </span>
                        <span>
                          📩 <strong>{item.leads}</strong> leads
                        </span>
                        <Link
                          href="/properties"
                          className="bg-[#073F73] text-white px-2.5 py-1 rounded-[3px] text-[11px] font-bold hover:bg-[#06345F]"
                        >
                          View Live
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Direct Leads */}
            {activeTab === "leads" && (
              <div className="space-y-4">
                <h4 className="text-[13px] font-black uppercase text-[#073F73]">
                  Direct Buyer & Tenant Inquiries
                </h4>
                <div className="overflow-x-auto border border-gray-200 rounded-[4px]">
                  <table className="w-full text-left text-[12px] text-[#143B5D]">
                    <thead className="bg-[#EEF6FC] text-[#073F73] text-[11px] font-black uppercase border-b border-gray-200">
                      <tr>
                        <th className="py-2 px-3">Lead Name</th>
                        <th className="py-2 px-3">Phone</th>
                        <th className="py-2 px-3">Inquired Property</th>
                        <th className="py-2 px-3">Budget</th>
                        <th className="py-2 px-3">Time</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {myLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3 font-bold text-[#073F73]">{lead.name}</td>
                          <td className="py-2.5 px-3">{lead.phone}</td>
                          <td className="py-2.5 px-3">{lead.property}</td>
                          <td className="py-2.5 px-3 font-semibold text-emerald-700">{lead.budget}</td>
                          <td className="py-2.5 px-3 text-gray-400 text-[11px]">{lead.date}</td>
                          <td className="py-2.5 px-3">
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                              {lead.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: Earnings */}
            {activeTab === "earnings" && (
              <div className="space-y-4 max-w-xl text-[12px]">
                <h4 className="text-[13px] font-black uppercase text-[#073F73]">
                  Commission Tier & Payout Statement
                </h4>
                <div className="bg-[#F8FAFC] border border-[#CBD5E1] p-4 rounded-[4px] space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-bold text-gray-600">Current Plan:</span>
                    <span className="text-[#073F73] font-black uppercase">Executive Blue Tier (₹ 2,000)</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-bold text-gray-600">Commission Rate:</span>
                    <span className="text-[#168A3A] font-black text-[14px]">30% on Closings*</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-bold text-gray-600">Total Closings to Date:</span>
                    <span className="font-bold text-gray-800">4 Deals (₹ 6.20 Cr GMV)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-600">Paid Out Commissions:</span>
                    <span className="text-[#073F73] font-black text-[14px]">₹ 3,72,000</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-[4px] text-[11px] text-amber-900 flex items-center justify-between">
                  <span>Upgrade to <strong>VIP Elite Orange Tier</strong> to unlock 50% deal commission payout.</span>
                  <Link
                    href="/register"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1 rounded-[3px] uppercase ml-2 flex-shrink-0"
                  >
                    Upgrade Tier
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
