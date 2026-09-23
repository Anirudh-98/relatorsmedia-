"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle, FaWhatsapp } from "react-icons/fa";

interface OfficeLocation {
  city: string;
  type: string;
  address: string;
  phone: string;
  email: string;
}

const offices: OfficeLocation[] = [
  {
    city: "Pune (HQ)",
    type: "Corporate Headquarters",
    address: "Level 4, Business Bay, Senapati Bapat Road, Shivajinagar, Pune, Maharashtra - 411016",
    phone: "+91 20 4567 8900 / +91 97654 32109",
    email: "pune@realtorsmedia.world",
  },
  {
    city: "Hyderabad",
    type: "Regional Media & Operations Hub",
    address: "Plot 12, Financial District, Gachibowli, Hyderabad, Telangana - 500032",
    phone: "+91 40 6789 1234 / +91 99887 76655",
    email: "hyderabad@realtorsmedia.world",
  },
  {
    city: "Mumbai",
    type: "Commercial Liaison & Legal Cell",
    address: "Tower 2, Platina Business Park, BKC, Bandra East, Mumbai, Maharashtra - 400051",
    phone: "+91 22 2890 5678 / +91 98201 99887",
    email: "mumbai@realtorsmedia.world",
  },
  {
    city: "Bengaluru",
    type: "Southern Zonal Office",
    address: "Brigade Gateway Campus, Malleshwaram West, Bengaluru, Karnataka - 560055",
    phone: "+91 80 4123 4567 / +91 97400 44556",
    email: "bengaluru@realtorsmedia.world",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PortalLayout
      title="Contact Realtors Media"
      subtitle="Reach Our Headquarters, Regional Broadcast Studios, Member Welfare Cells and Customer Support"
      badge="Get In Touch"
    >
      <div className="space-y-6">
        {/* Contact Form and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Message Form */}
          <div className="lg:col-span-2 bg-white border border-[#CBD5E1] rounded-xl p-6 shadow-2xs">
            <h2 className="text-[18px] font-black text-[#073F73] mb-1 uppercase tracking-tight">
              Send Us a Message
            </h2>
            <p className="text-[12.5px] text-[#475569] mb-4">
              Have questions regarding verified listings, member ID cards, builder promotions, or legal cell consultation? Fill out the form below.
            </p>

            {submitted ? (
              <div className="bg-[#E7F6EA] border border-[#A3D9B1] p-6 rounded-lg text-center">
                <FaCheckCircle className="text-[#168A3A] text-[32px] mx-auto mb-2" />
                <h3 className="text-[16px] font-black text-[#168A3A]">
                  Message Successfully Dispatched!
                </h3>
                <p className="text-[12.5px] text-[#2D3748] mt-1 max-w-md mx-auto">
                  Thank you, <span className="font-bold">{formData.name}</span>. Our representative will contact you via {formData.phone || formData.email} within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-[#073F73] text-white text-[11px] font-bold px-4 py-2 rounded-md hover:bg-[#06345F] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Anand Deshmukh"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. anand@domain.com"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Inquiry Department *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    >
                      <option>General Inquiry</option>
                      <option>Realtor ID Card & Registration</option>
                      <option>Property Listing / Advertising</option>
                      <option>Legal Cell Consultation</option>
                      <option>TV Studio Broadcast Booking</option>
                      <option>Franchise & Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">
                    Your Message / Requirement *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your query, property location, or partnership proposal..."
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#073F73] hover:bg-[#06345F] text-white font-extrabold text-[12px] px-6 py-2.5 rounded-md uppercase tracking-wider transition-colors shadow-xs"
                >
                  Send Inquiry Now
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Quick Contact Info & WhatsApp */}
          <div className="space-y-4">
            <div className="bg-[#073F73] text-white p-5 rounded-xl shadow-2xs">
              <h3 className="text-[14px] font-black uppercase text-[#F7C900] mb-2 tracking-wide">
                Direct Connect
              </h3>
              <div className="space-y-3 text-[12px]">
                <div className="flex items-start gap-2.5">
                  <FaPhoneAlt className="text-[#38BDF8] text-[13px] mt-0.5" />
                  <div>
                    <span className="font-bold block">Toll-Free Helpline:</span>
                    <span className="text-[#BAE6FD]">1800 234 5678 (Toll Free)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <FaEnvelope className="text-[#38BDF8] text-[13px] mt-0.5" />
                  <div>
                    <span className="font-bold block">Central Support Email:</span>
                    <span className="text-[#BAE6FD]">support@realtorsmedia.world</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <FaClock className="text-[#38BDF8] text-[13px] mt-0.5" />
                  <div>
                    <span className="font-bold block">Operating Hours:</span>
                    <span className="text-[#BAE6FD]">Monday – Saturday: 9:30 AM – 7:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/20">
                <a
                  href="https://wa.me/919765432109"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-[11.5px] py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <FaWhatsapp className="text-[14px]" />
                  <span>WhatsApp Chat Support</span>
                </a>
              </div>
            </div>

            <div className="bg-white border border-[#CBD5E1] p-4 rounded-xl shadow-2xs">
              <h4 className="text-[13px] font-black text-[#073F73] uppercase mb-1">
                Media & Broadcast Studio
              </h4>
              <p className="text-[11.5px] text-[#475569] leading-relaxed">
                For studio interview bookings, live project showcases, or press releases, email our editorial desk at <strong className="text-[#073F73]">press@realtorsmedia.world</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Regional Offices Grid */}
        <div>
          <h3 className="text-[16px] font-black text-[#073F73] mb-3 uppercase tracking-tight">
            Our Regional Presence
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {offices.map((office, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-[#E21F2F] text-[14px]" />
                    <h4 className="text-[14px] font-black text-[#073F73]">
                      {office.city}
                    </h4>
                  </div>
                  <div className="text-[10.5px] font-bold text-[#0B4F8A] bg-[#EEF6FC] px-2 py-0.5 rounded-full inline-block mb-2">
                    {office.type}
                  </div>
                  <p className="text-[11.5px] text-[#475569] leading-relaxed mb-3">
                    {office.address}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-2 text-[11px] font-semibold text-[#1E293B] space-y-0.5">
                  <div className="truncate">{office.phone}</div>
                  <div className="text-[#0B4F8A] truncate">{office.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
