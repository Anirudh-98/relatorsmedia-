"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle, FaWhatsapp, FaGlobe } from "react-icons/fa";
import { FormError } from "@/components/ui/FormError";
import { firstFormError, contactSchema } from "@/lib/validation/formSchemas";
import { CONTACT, SITE_URL, telHref } from "@/lib/site";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = firstFormError(contactSchema, formData);
    setFormError(validationError);
    if (validationError) return;
    setSubmitted(true);
  };

  return (
    <PortalLayout
      title="Contact Realtors Media"
      subtitle="Call, email or visit the Realtors Media office"
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

                <FormError message={formError} />
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
                    <span className="font-bold block">Phone:</span>
                    {CONTACT.phones.map((phone) => (
                      <a key={phone} href={telHref(phone)} className="text-[#BAE6FD] hover:text-white block">
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <FaEnvelope className="text-[#38BDF8] text-[13px] mt-0.5" />
                  <div>
                    <span className="font-bold block">Email:</span>
                    <a href={`mailto:${CONTACT.email}`} className="text-[#BAE6FD] hover:text-white break-all">
                      {CONTACT.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <FaGlobe className="text-[#38BDF8] text-[13px] mt-0.5" />
                  <div>
                    <span className="font-bold block">Website:</span>
                    <a href={SITE_URL} className="text-[#BAE6FD] hover:text-white">
                      {CONTACT.website}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <FaMapMarkerAlt className="text-[#38BDF8] text-[13px] mt-0.5" />
                  <div>
                    <span className="font-bold block">Office Address:</span>
                    {CONTACT.addressLines.map((line) => (
                      <span key={line} className="text-[#BAE6FD] block">
                        {line}
                      </span>
                    ))}
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
                  href={`https://wa.me/${CONTACT.phones[0].replace(/\D/g, "")}`}
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
                For studio interview bookings, live project showcases, or press releases, email us at{" "}
                <a href={`mailto:${CONTACT.email}`} className="font-bold text-[#073F73] hover:underline break-all">
                  {CONTACT.email}
                </a>{" "}
                or call{" "}
                <a href={telHref(CONTACT.phones[0])} className="font-bold text-[#073F73] hover:underline">
                  {CONTACT.phones[0]}
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Office */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <FaMapMarkerAlt className="text-[#E21F2F] text-[16px]" />
            <h3 className="text-[16px] font-black text-[#073F73] uppercase tracking-tight">Our Office</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[12px] text-[#1E293B]">
            <div>
              <span className="block text-[10.5px] font-bold uppercase text-[#64748B] mb-0.5">Address</span>
              {CONTACT.addressLines.map((line) => (
                <span key={line} className="block font-semibold">
                  {line}
                </span>
              ))}
            </div>
            <div>
              <span className="block text-[10.5px] font-bold uppercase text-[#64748B] mb-0.5">Phone</span>
              {CONTACT.phones.map((phone) => (
                <a key={phone} href={telHref(phone)} className="block font-semibold hover:text-[#0B4F8A]">
                  {phone}
                </a>
              ))}
            </div>
            <div>
              <span className="block text-[10.5px] font-bold uppercase text-[#64748B] mb-0.5">Email &amp; Website</span>
              <a href={`mailto:${CONTACT.email}`} className="block font-semibold text-[#0B4F8A] hover:underline break-all">
                {CONTACT.email}
              </a>
              <a href={SITE_URL} className="block font-semibold text-[#0B4F8A] hover:underline">
                {CONTACT.website}
              </a>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
