"use client";

import React from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaShieldAlt, FaLock, FaUserSecret, FaEnvelope } from "react-icons/fa";

export default function PrivacyPolicyPage() {
  return (
    <PortalLayout
      title="PRIVACY POLICY & DATA PROTECTION"
      subtitle="How Realtors Media Digital protects member records, listing credentials, and identity card verification data"
      badge="LEGAL COMPLIANCE"
      breadcrumbs={[{ label: "Privacy Policy" }]}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-[4px] border border-[#C9D7E3] p-6 sm:p-8 space-y-6 text-[12.5px] text-[#143B5D] leading-relaxed shadow-xs">
        <div className="border-b border-gray-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#073F73]">
            <FaShieldAlt className="text-xl" />
            <span className="font-black text-sm uppercase">Realtors Media Trust & Security Policy</span>
          </div>
          <span className="text-[11px] text-gray-500 font-semibold">
            Effective Date: January 1, 2026 (Updated for 2026 Regulations)
          </span>
        </div>

        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            1. Introduction & Overview
          </h2>
          <p>
            Realtors Media Digital ("Realtors Media", "We", "Our", or "Us") is committed to safeguarding the privacy and confidential business records of all registered realtors, property developers, buyers, and industry professionals utilizing our portal and media platforms.
          </p>
          <p>
            This Privacy Policy details the types of personal and professional information collected through realtorsmedia.com, our mobile applications, and our official CR80 Identity Card verification engine.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
            <li>
              <strong>Member Identity Credentials:</strong> Full legal name, professional designation, agency name, contact telephone, email address, passport-style photograph, and state RERA registration numbers during enrollment.
            </li>
            <li>
              <strong>Property & Asset Listings:</strong> Title documents, survey numbers, layout sanctions, plot boundaries, high-resolution photographs, pricing, and project approvals submitted for publication.
            </li>
            <li>
              <strong>Public Verification Metadata:</strong> Unique Member ID (e.g., <code>RM-B-1111</code>), card issuance timestamp, validity expiry, and associated operating jurisdiction.
            </li>
            <li>
              <strong>Technical Usage Data:</strong> IP address, device fingerprints, browser types, and access timestamps when visiting our web applications or scanning QR codes.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            3. QR Code & Public Credential Verification Protocol
          </h2>
          <div className="bg-[#EEF6FC] border-l-4 border-[#073F73] p-3 text-[12px] text-[#073F73]">
            <strong>Public Display Notice:</strong> When an official Realtors Media CR80 card QR code is scanned by a prospective client or enforcement authority, only the authorized name, photograph, verified status, department, and company contact details are publicly rendered to establish legitimacy. Private billing details and bank information are never exposed.
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            4. Purpose of Data Processing
          </h2>
          <p>We process collected member information for the following legitimate purposes:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>To print and issue physical CR80 laminated and digital identity cards.</li>
            <li>To verify professional credentials against state RERA public databases.</li>
            <li>To route buyer inquiries and leads directly to authorized listing partners.</li>
            <li>To protect consumers against real estate scams and unauthorized impersonation.</li>
            <li>To dispatch market updates, property alerts, and legal notifications.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            5. Data Protection & Encryption
          </h2>
          <p>
            Realtors Media deploys bank-grade 256-bit SSL encryption across all data transmissions. User passwords are encrypted using one-way cryptographic hashes. All property transaction inquiries and client contact numbers are stored behind hardened virtual private clouds (VPC) with role-based access control.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            6. Your Rights & Data Rectification
          </h2>
          <p>
            Members possess the right to review, update, or request deletion of their profile records at any time through the Member Dashboard or by writing to our Data Grievance Cell. Upon deactivation, public verification of the associated CR80 ID card will immediately reflect a "Revoked / Expired" status.
          </p>
        </section>

        {/* Contact Info */}
        <div className="bg-[#F8FAFC] border border-[#CBD5E1] p-4 rounded-[4px] mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-[#073F73] text-[13px]">
              Grievance Officer & Data Privacy Desk
            </h3>
            <p className="text-[11.5px] text-gray-600">
              Realtors Media Digital India • Legal & Ethics Cell
            </p>
            <p className="text-[11.5px] text-gray-600">
              Email: <strong>privacy@realtorsmedia.com</strong> | Phone: <strong>+91 98490 12345</strong>
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-bold px-4 py-2 rounded-[3px] transition-colors flex-shrink-0"
          >
            Contact Legal Cell
          </Link>
        </div>
      </div>
    </PortalLayout>
  );
}
