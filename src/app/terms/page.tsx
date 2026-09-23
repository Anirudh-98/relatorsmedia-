"use client";

import React from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaFileContract, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function TermsPage() {
  return (
    <PortalLayout
      title="TERMS OF USE & CODE OF ETHICS"
      subtitle="Standard operating rules, membership tier commitments, ID card usage guidelines, and platform code of conduct"
      badge="PORTAL REGULATIONS"
      breadcrumbs={[{ label: "Terms & Conditions" }]}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-[4px] border border-[#C9D7E3] p-6 sm:p-8 space-y-6 text-[12.5px] text-[#143B5D] leading-relaxed shadow-xs">
        <div className="border-b border-gray-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#073F73]">
            <FaFileContract className="text-xl" />
            <span className="font-black text-sm uppercase">Realtors Media Operating Terms</span>
          </div>
          <span className="text-[11px] text-gray-500 font-semibold">
            Last Updated: January 2026
          </span>
        </div>

        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            1. Acceptance & Scope
          </h2>
          <p>
            By accessing, browsing, registering an account, or applying for an official Realtors Media ID card, you agree to be bound by these Terms and Conditions. These terms apply to all visitors, registered real estate agents, developers, architects, and institutional investors.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            2. Professional Verification & Eligibility
          </h2>
          <p>
            Membership in Realtors Media is restricted to bona fide real estate practitioners, registered channel partners, building contractors, and allied professionals. Members affirm that all legal documents, government identity proofs, and RERA registration credentials provided during onboarding are authentic and valid.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            3. Official CR80 Identification Card Policy
          </h2>
          <div className="bg-amber-50 border-l-4 border-amber-600 p-3 text-[12px] text-amber-950 space-y-1">
            <strong>CR80 Identity Card Protocol:</strong>
            <p>
              The physical and digital CR80 Identity Card issued to an associate remains the intellectual property of Realtors Media Digital. The card is non-transferable and can only be used by the authorized person whose photo and name appear on the card.
            </p>
            <p>
              Allowing third-party agents or sub-brokers to use your credentials, or altering the embedded verification QR code, will result in immediate termination of membership, de-indexing of all property listings, and blacklisting in the national registry.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            4. Membership Tiers & Fee Structure
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
            <li>
              <strong>Green Associate (Free Tier):</strong> Digital verified card, directory listing, and 15% deal commission support.
            </li>
            <li>
              <strong>Executive Blue (₹ 2,000 Tier):</strong> Physical laminated CR80 card dispatch, featured priority listings, direct buyer leads, and 30% deal closing commission.
            </li>
            <li>
              <strong>VIP Elite Orange (₹ 5,000 Tier):</strong> Gold-accented VIP CR80 card, top-tier portal ranking, builder syndicate pre-launch access, and 50% deal closing payout.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            5. Listing Accuracy & Mandatory RERA Compliance
          </h2>
          <p>
            All properties posted on the portal (including Open Plots, Apartments, Villas, and Farmlands) must contain accurate measurements, exact locations, clear title declarations, and approved layout numbers (HMDA / DTCP / BMRDA / PMRDA / RERA). Posting fictitious properties, bait-and-switch pricing, or encroached lands is strictly forbidden.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            6. Code of Conduct & Client Representation
          </h2>
          <p>
            Every Realtors Media member must adhere to fair dealing, complete disclosure of property encumbrances, and transparent transaction fees. Members are forbidden from receiving token advance payments on personal accounts without registered builder agreements or escrow protocols.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="text-[14.5px] font-black text-[#073F73] uppercase tracking-wide">
            7. Limitation of Liability & Dispute Jurisdiction
          </h2>
          <p>
            Realtors Media Digital acts as an informational, media, and verification platform. While we conduct rigorous due diligence, buyers and sellers are advised to independently verify link documents through our Legal Cell before executing registration deeds. All legal disputes are subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
          </p>
        </section>

        {/* Bottom CTA */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-gray-500">
            Have questions regarding portal compliance or membership agreements?
          </span>
          <div className="flex gap-2">
            <Link
              href="/legal-cell"
              className="bg-[#073F73] text-white px-3 py-1.5 rounded-[3px] text-[11px] font-bold hover:bg-[#06345F]"
            >
              Consult Legal Cell
            </Link>
            <Link
              href="/contact"
              className="bg-gray-100 text-[#143B5D] px-3 py-1.5 rounded-[3px] text-[11px] font-bold border border-gray-300 hover:bg-gray-200"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
