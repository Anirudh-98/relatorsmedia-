"use client";

import React from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaGraduationCap, FaLandmark, FaBuilding, FaBalanceScale } from "react-icons/fa";

interface Advisor {
  name: string;
  designation: string;
  domain: string;
  bio: string;
  icon: React.ReactNode;
}

const advisorsList: Advisor[] = [
  {
    name: "Justice (Retd.) M. K. Kulkarni",
    designation: "Former High Court Judge & RERA Arbitrator",
    domain: "Judicial & Land Title Advisory",
    bio: "Advising on property adjudication, disputed title clearances, arbitration frameworks, and consumer compliance under RERA regulations.",
    icon: <FaBalanceScale className="text-[#073F73]" />,
  },
  {
    name: "Ar. Shrikant Deshpande (FIIA)",
    designation: "Senior Urban Planner & Fellow of Indian Institute of Architects",
    domain: "Master Planning & Smart Townships",
    bio: "Pioneering guidance on eco-friendly urban zoning, sustainable gated communities, building bylaws, and infrastructure density optimization.",
    icon: <FaBuilding className="text-[#168A3A]" />,
  },
  {
    name: "Dr. Arvind Subramanian",
    designation: "Former Director - Real Estate Finance Research Institute",
    domain: "Capital Markets & REIT Feasibility",
    bio: "Expert evaluation of fractional ownership models, real estate investment trusts, risk mitigation, and commercial capital structuring.",
    icon: <FaLandmark className="text-[#6637A8]" />,
  },
  {
    name: "Prof. Hemalatha Iyer",
    designation: "Professor of Property Valuation & Civil Engineering",
    domain: "Valuation, Quality Auditing & Geo-Surveys",
    bio: "Guidance on automated property valuation metrics, soil and seismic safety parameters, and construction quality benchmarks.",
    icon: <FaGraduationCap className="text-[#D97706]" />,
  },
];

export default function AdvisorsPage() {
  return (
    <PortalLayout
      title="Advisory Board"
      subtitle="Distinguished Experts Providing Strategic Oversight in Law, Architecture, Finance and Planning"
      badge="Advisors"
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#073F73] to-[#0B4F8A] rounded-xl text-white p-6 shadow-md">
          <h2 className="text-[20px] sm:text-[24px] font-black mb-2">
            Institutional Guidance & Ethical Standards
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#BAE6FD] max-w-3xl leading-relaxed">
            The Advisory Board at Realtors Media ensures that our portal operations, market forecasts, broadcast editorial standards, and member programs adhere to strict legal, urban planning, and financial best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {advisorsList.map((adv, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs flex flex-col justify-between hover:border-[#0B4F8A] transition-colors"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F7F9] border border-[#CBD5E1] flex items-center justify-center text-[22px] flex-shrink-0">
                    {adv.icon}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-black text-[#073F73] leading-tight">
                      {adv.name}
                    </h3>
                    <div className="text-[11.5px] font-bold text-[#E21F2F] mt-0.5">
                      {adv.designation}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide bg-[#EEF6FC] text-[#073F73] px-2 py-0.5 rounded-full inline-block mt-1">
                      {adv.domain}
                    </span>
                  </div>
                </div>

                <p className="text-[12.5px] text-[#475569] leading-relaxed mt-2">
                  {adv.bio}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#168A3A] flex items-center gap-1">
                  ● Senior Advisor Panel
                </span>
                <Link
                  href="/contact"
                  className="text-[11px] font-bold text-[#0B4F8A] hover:underline"
                >
                  Request Consultation →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
