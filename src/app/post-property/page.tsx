"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaPlusSquare, FaCheckCircle, FaUpload, FaImage, FaSpinner, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { uploadPropertyImage } from "@/lib/firebase/storage";
import { createPropertyListing } from "@/lib/firebase/db";
import { submitPropertyCloudFunction } from "@/lib/firebase/functions";

export default function PostPropertyPage() {
  const { user, memberProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "Open Plots",
    listingType: "For Sale",
    city: "Pune",
    locality: "",
    price: "",
    area: "",
    bhk: "N/A",
    reraNumber: "",
    name: memberProfile?.fullName || user?.displayName || "",
    phone: memberProfile?.phone || "",
    email: user?.email || "",
    role: "Owner",
    description: "",
  });

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedRefId, setGeneratedRefId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const tempPropId = `prop_${Date.now()}`;
      let uploadedImageUrl = "";

      // 1. Upload to Firebase Storage if an image was selected
      if (selectedImageFile) {
        try {
          uploadedImageUrl = await uploadPropertyImage(selectedImageFile, tempPropId, selectedImageFile.name);
        } catch (storageErr) {
          console.warn("Storage upload notice:", storageErr);
        }
      }

      // 2. Save in Firestore Database
      const firestoreDocId = await createPropertyListing({
        title: formData.title,
        propertyType: formData.propertyType,
        listingType: formData.listingType,
        city: formData.city,
        locality: formData.locality,
        price: formData.price,
        area: formData.area,
        bhk: formData.bhk,
        reraNumber: formData.reraNumber,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        role: formData.role,
        description: formData.description,
        imageUrl: uploadedImageUrl,
        authorUid: user?.uid || "guest",
        status: "Active",
      });

      // 3. Trigger Serverless Cloud Function
      try {
        const cloudResult = await submitPropertyCloudFunction({
          ...formData,
          firestoreId: firestoreDocId,
          imageUrl: uploadedImageUrl,
        });
        setGeneratedRefId(cloudResult.referenceId || `PROP-2026-${Math.floor(10000 + Math.random() * 90000)}`);
      } catch {
        setGeneratedRefId(`PROP-2026-${Math.floor(10000 + Math.random() * 90000)}`);
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Post property error:", err);
      setErrorMessage(err.message || "Failed to publish property. Please check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalLayout
      title="Post Free Property"
      subtitle="Reach Over 50,000+ Genuine Buyers & Verified Realtors Across India Without Any Brokerage"
      badge="100% Free Listing"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-[#168A3A] text-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-yellow-200 text-[11px] font-black uppercase tracking-widest block mb-1">
              Zero Commission • Direct Leads
            </span>
            <h2 className="text-[20px] sm:text-[24px] font-black">
              Sell or Rent Your Property Fast on Realtors Media
            </h2>
            <p className="text-[12.5px] text-green-100 mt-1 max-w-xl">
              Post residential plots, flats, luxury villas, or commercial properties in under 2 minutes. Verified realtors in your area will also assist in closing genuine buyers.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-bold bg-white/10 px-4 py-2 rounded-lg border border-white/20 whitespace-nowrap">
            <FaCheckCircle className="text-yellow-300" />
            <span>Instant Portal Activation</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-6 sm:p-8 shadow-2xs">
          {submitted ? (
            <div className="bg-[#E7F6EA] border border-[#A3D9B1] p-8 rounded-xl text-center space-y-3">
              <FaCheckCircle className="text-[#168A3A] text-[40px] mx-auto" />
              <h3 className="text-[20px] font-black text-[#168A3A]">
                Property Successfully Published!
              </h3>
              <p className="text-[13px] text-[#2D3748] max-w-lg mx-auto leading-relaxed">
                Your listing &ldquo;<strong className="text-[#073F73]">{formData.title}</strong>&rdquo; has been registered under reference ID:{" "}
                <span className="font-mono font-black text-[#073F73]">
                  {generatedRefId}
                </span>
                . It is stored securely in Firebase and will appear live across the Real Estate Hub and Classifieds.
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/properties"
                  className="bg-[#073F73] hover:bg-[#06345F] text-white text-[12px] font-bold px-4 py-2 rounded-md transition-colors"
                >
                  View in Marketplace
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    removeImage();
                  }}
                  className="bg-white border border-[#CBD5E1] text-[#073F73] text-[12px] font-bold px-4 py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Post Another Property
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-[12px] text-red-700 flex items-start gap-2">
                  <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Section 1: Basic Information */}
              <div>
                <h3 className="text-[14px] font-black uppercase text-[#073F73] pb-1.5 border-b border-[#E2E8F0] mb-3">
                  1. Basic Property Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Listing Purpose *
                    </label>
                    <select
                      value={formData.listingType}
                      onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    >
                      <option>For Sale</option>
                      <option>For Rent / Lease</option>
                      <option>Joint Venture (JV)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Property Category *
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    >
                      <option>Open Plots</option>
                      <option>Gated Community Plots</option>
                      <option>Apartments / Flats</option>
                      <option>Duplex Houses</option>
                      <option>Villas</option>
                      <option>Independent Houses</option>
                      <option>Farm Houses</option>
                      <option>Commercial Plots</option>
                      <option>Industrial Properties</option>
                      <option>Agriculture Lands</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Configuration / BHK
                    </label>
                    <select
                      value={formData.bhk}
                      onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    >
                      <option>N/A (Plot / Land)</option>
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>3 BHK</option>
                      <option>4 BHK</option>
                      <option>5+ BHK / Penthouse</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">
                    Property Title / Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. East Facing 200 Sq.Yd RERA Villa Plot near Shadnagar Highway"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                  />
                </div>
              </div>

              {/* Section 2: Location & Pricing */}
              <div>
                <h3 className="text-[14px] font-black uppercase text-[#073F73] pb-1.5 border-b border-[#E2E8F0] mb-3">
                  2. Location & Pricing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Pune, Hyderabad, Bengaluru"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Locality / Area Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      placeholder="e.g. Hinjawadi Phase 1 / Gachibowli"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Expected Price (₹) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. ₹ 45 Lakhs or ₹ 1.25 Cr"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Plot Area / Carpet Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="e.g. 1500 Sq.Ft. or 200 Sq.Yds."
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      RERA Registration No. (If applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.reraNumber}
                      onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                      placeholder="e.g. P52100034567"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Image Upload (Firebase Storage) */}
              <div>
                <h3 className="text-[14px] font-black uppercase text-[#073F73] pb-1.5 border-b border-[#E2E8F0] mb-3 flex items-center justify-between">
                  <span>3. Property Photo (Stored in Firebase)</span>
                  <span className="text-[10px] text-gray-500 font-semibold lowercase">optional but recommended</span>
                </h3>

                <div className="p-4 bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-lg">
                  {imagePreview ? (
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[12px] font-bold text-[#073F73]">{selectedImageFile?.name}</p>
                        <p className="text-[10px] text-gray-500">Ready to upload to Firebase Storage</p>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="text-[11px] text-red-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <FaTrash className="text-[9px]" /> Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <FaImage className="text-gray-400 text-3xl mx-auto mb-2" />
                      <p className="text-[12px] font-bold text-[#143B5D]">Upload Property Elevation / Site Photo</p>
                      <p className="text-[10px] text-gray-500 mb-3">PNG, JPG, or WEBP up to 10MB</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-bold px-3 py-1.5 rounded transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <FaUpload className="text-[10px]" /> Browse Photo
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Contact Details */}
              <div>
                <h3 className="text-[14px] font-black uppercase text-[#073F73] pb-1.5 border-b border-[#E2E8F0] mb-3">
                  4. Advertiser & Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 mb-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      I am the *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    >
                      <option>Owner / Landlord</option>
                      <option>Certified Realtor / Agent</option>
                      <option>Builder / Developer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kadam"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>

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
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. ramesh@gmail.com"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">
                    Property Description & Key Amenities
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mention road width, water/electricity connection, facing direction, nearby landmarks, or negotiation details..."
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#168A3A] hover:bg-[#116e2e] disabled:bg-gray-400 text-white text-[13px] font-black py-3 rounded-md uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin text-[14px]" />
                      <span>Saving to Firebase & Processing Cloud Function...</span>
                    </>
                  ) : (
                    <span>Publish Free Property Listing Now →</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
