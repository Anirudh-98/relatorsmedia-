"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import {
  FaQuestionCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaIdCard,
  FaHome,
  FaShieldAlt,
  FaUserCheck,
  FaCheckCircle,
} from "react-icons/fa";

interface FAQItem {
  id: string;
  category: "id-card" | "listings" | "membership" | "legal";
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "id-card",
    question: "How do I receive my physical CR80 ID Card?",
    answer:
      "When you enroll in the Executive Blue or VIP Elite Orange membership tiers, your physical CR80 laminated card is dispatched to your registered postal address via tracked courier within 48 business hours. Digital credentials and QR codes are activated immediately upon approval.",
  },
  {
    id: "faq-2",
    category: "id-card",
    question: "How does the QR Code verification on my card work?",
    answer:
      "Every Realtors Media ID card features a unique dynamic QR code. When scanned with any smartphone camera, it redirects the client to our secure verification engine (https://realtorsmedia.com/verify/...) displaying your active credentials, photograph, operational city, and official license validity.",
  },
  {
    id: "faq-3",
    category: "listings",
    question: "Is posting a property listing on Realtors Media completely FREE?",
    answer:
      "Yes! Individual property owners and registered realtors can post residential and commercial properties for FREE. Verified listings receive exposure across our website, mobile application, and daily broadcast channels.",
  },
  {
    id: "faq-4",
    category: "membership",
    question: "What is the difference between Green, Blue, and Orange membership tiers?",
    answer:
      "Green Associate is a free digital membership offering 15% deal commission support. Executive Blue (₹2,000) includes a physical CR80 laminated ID card, prioritized direct buyer leads, and 30% commission payouts. VIP Elite Orange (₹5,000) includes a gold-accented ID card, top portal ranking, direct builder syndicate pre-launch access, and 50% deal closing commissions.",
  },
  {
    id: "faq-5",
    category: "legal",
    question: "Can I get my property documents verified by the Legal Cell before buying?",
    answer:
      "Yes. Our in-house Legal Cell specializes in 30-year link document scrutiny, title searches, RERA layout sanction verifications, and encumbrance certificate audits. Visit the Legal Cell page to submit your documents for review.",
  },
  {
    id: "faq-6",
    category: "listings",
    question: "How long does it take for a posted property to appear on the portal?",
    answer:
      "Our moderation team reviews layout approvals and title details within 2 to 4 business hours. Once verified, the listing is immediately indexed across search and property category directories.",
  },
];

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketData, setTicketData] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCat = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
  };

  return (
    <PortalLayout
      title="HELP CENTER & MEMBER SUPPORT"
      subtitle="Frequently asked questions, identity card guidelines, listing procedures, and direct support desk"
      badge="24/7 HELPLINE SUPPORT"
      breadcrumbs={[{ label: "Help & Support" }]}
    >
      <div className="space-y-6">
        {/* Support Channels Hero */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-[4px] border border-[#C9D7E3] flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-50 text-[#073F73] rounded-full flex items-center justify-center text-lg flex-shrink-0">
              <FaPhoneAlt />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Helpline Number</span>
              <a href="tel:+919849012345" className="text-[13px] font-black text-[#073F73] hover:underline">
                +91 98490 12345
              </a>
              <span className="text-[10px] text-gray-500 block">Mon - Sat, 9:00 AM - 7:00 PM</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-[4px] border border-[#C9D7E3] flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-50 text-[#168A3A] rounded-full flex items-center justify-center text-lg flex-shrink-0">
              <FaWhatsapp />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block">WhatsApp Support</span>
              <a
                href="https://wa.me/919849012345"
                target="_blank"
                rel="noreferrer"
                className="text-[13px] font-black text-[#168A3A] hover:underline"
              >
                Chat on WhatsApp
              </a>
              <span className="text-[10px] text-gray-500 block">Fast 15-minute response</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-[4px] border border-[#C9D7E3] flex items-center gap-3">
            <div className="w-11 h-11 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center text-lg flex-shrink-0">
              <FaEnvelope />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Email Support</span>
              <a href="mailto:support@realtorsmedia.com" className="text-[13px] font-black text-purple-800 hover:underline">
                support@realtorsmedia.com
              </a>
              <span className="text-[10px] text-gray-500 block">For document reviews & queries</span>
            </div>
          </div>
        </div>

        {/* FAQs and Ticket Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[4px] border border-[#C9D7E3] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <FaQuestionCircle className="text-[#073F73] text-lg" />
              <h3 className="text-[14px] font-black uppercase text-[#073F73] tracking-wide">
                Frequently Asked Questions
              </h3>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-2.5 py-1 rounded-[3px] font-bold cursor-pointer transition-colors ${
                  activeCategory === "all"
                    ? "bg-[#073F73] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("id-card")}
                className={`px-2.5 py-1 rounded-[3px] font-bold cursor-pointer transition-colors ${
                  activeCategory === "id-card"
                    ? "bg-[#073F73] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ID Cards & QR Code
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("listings")}
                className={`px-2.5 py-1 rounded-[3px] font-bold cursor-pointer transition-colors ${
                  activeCategory === "listings"
                    ? "bg-[#073F73] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Property Listings
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("membership")}
                className={`px-2.5 py-1 rounded-[3px] font-bold cursor-pointer transition-colors ${
                  activeCategory === "membership"
                    ? "bg-[#073F73] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tiers & Commissions
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("legal")}
                className={`px-2.5 py-1 rounded-[3px] font-bold cursor-pointer transition-colors ${
                  activeCategory === "legal"
                    ? "bg-[#073F73] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Legal Due Diligence
              </button>
            </div>

            {/* Accordion list */}
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-[4px] overflow-hidden">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div key={faq.id} className="bg-white">
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-[12.5px] text-[#143B5D]">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <FaChevronUp className="text-[11px] text-[#073F73] flex-shrink-0" />
                      ) : (
                        <FaChevronDown className="text-[11px] text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-3 pt-0 text-[12px] text-gray-600 bg-gray-50/50 leading-relaxed border-t border-gray-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Support Ticket Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-[4px] border border-[#C9D7E3] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
                <FaEnvelope className="text-[#E21F2F]" />
                <h3 className="text-[14px] font-black uppercase text-[#073F73] tracking-wide">
                  Submit a Support Ticket
                </h3>
              </div>

              {ticketSubmitted ? (
                <div className="bg-[#E7F6EA] border border-[#A3D9B1] text-[#168A3A] p-5 rounded-[4px] text-center space-y-2">
                  <FaCheckCircle className="text-3xl mx-auto" />
                  <h4 className="font-black text-[14px]">Support Ticket Registered</h4>
                  <p className="text-[12px] leading-relaxed">
                    Ticket #RM-{Math.floor(10000 + Math.random() * 90000)} has been generated. Our technical support executive will contact you shortly.
                  </p>
                  <button
                    onClick={() => setTicketSubmitted(false)}
                    className="mt-3 text-[11px] font-bold underline cursor-pointer text-[#073F73]"
                  >
                    Submit another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3 text-[12px]">
                  <div>
                    <label className="block font-bold text-[#143B5D] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Sharma"
                      value={ticketData.name}
                      onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#143B5D] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98490..."
                      value={ticketData.phone}
                      onChange={(e) => setTicketData({ ...ticketData, phone: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#143B5D] mb-1">Subject / Inquiry Type *</label>
                    <select
                      value={ticketData.subject}
                      onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                      required
                      className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] bg-white focus:outline-none focus:border-[#073F73]"
                    >
                      <option value="">Select subject...</option>
                      <option value="CR80 ID Card Dispatch / Reissue">CR80 ID Card Dispatch / Reissue</option>
                      <option value="Property Listing Verification">Property Listing Verification</option>
                      <option value="Membership Tier Upgrade">Membership Tier Upgrade</option>
                      <option value="Deal Commission Settlement">Deal Commission Settlement</option>
                      <option value="Technical Website Assistance">Technical Website Assistance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#143B5D] mb-1">Describe Your Issue *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Please provide details of your question or issue..."
                      value={ticketData.message}
                      onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#073F73] hover:bg-[#06345F] text-white font-black py-2 rounded-[3px] uppercase tracking-wider text-[12px] shadow-sm transition-colors mt-2"
                  >
                    Send Ticket
                  </button>
                </form>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 text-[10.5px] text-gray-500 text-center">
              Realtors Media Customer Care Desk • Hyderabad, India
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
