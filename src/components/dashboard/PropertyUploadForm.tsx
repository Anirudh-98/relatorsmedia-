"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  FaPlusCircle,
  FaCheckCircle,
  FaUpload,
  FaImages,
  FaSpinner,
  FaTrash,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaDirections,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaBuilding,
  FaHome,
  FaCity,
  FaRupeeSign,
  FaRulerCombined,
  FaBed,
  FaBath,
  FaCompass,
  FaInfoCircle,
} from "react-icons/fa";
import { Firestore } from "firebase/firestore";
import { FirebaseStorage } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import { uploadPropertyImages, compressImage } from "@/lib/firebase/storage";
import { createPropertyListing, PropertyListingData } from "@/lib/firebase/db";
import { submitPropertyCloudFunction } from "@/lib/firebase/functions";
import { firstFormError, postPropertySchema } from "@/lib/validation/formSchemas";

interface PropertyUploadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  customDb?: Firestore;
  customStorage?: FirebaseStorage;
  isAdminMode?: boolean;
}

const COMMON_AMENITIES = [
  "24/7 Security & CCTV",
  "Gated Community",
  "Car Parking",
  "Power Backup",
  "Elevator / Lift",
  "Swimming Pool",
  "Gymnasium",
  "Children's Play Area",
  "Clubhouse",
  "Park / Landscaped Garden",
  "Water Storage & Borewell",
  "Vastu Compliant",
  "Clear Title / RERA Approved",
  "Wide Asphalt Road",
];

const TOP_CITIES = [
  "Pune",
  "Hyderabad",
  "Bengaluru",
  "Mumbai",
  "Thane",
  "Navi Mumbai",
  "Nagpur",
  "Nashik",
  "Delhi-NCR",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Other",
];

export const PropertyUploadForm: React.FC<PropertyUploadFormProps> = ({
  onSuccess,
  onCancel,
  customDb,
  customStorage,
  isAdminMode = false,
}) => {
  const { user, memberProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "Apartments / Flats",
    listingType: "For Sale",
    city: memberProfile?.city || "Pune",
    customCity: "",
    locality: "",
    address: "",
    price: "",
    isPriceNegotiable: false,
    area: "",
    bhk: "2 BHK",
    bathrooms: "2",
    furnishing: "Semi-Furnished",
    facing: "East",
    reraNumber: "",
    googleMapUrl: "",
    name: memberProfile?.fullName || user?.displayName || "",
    phone: memberProfile?.phone || "",
    email: user?.email || "",
    role: "Verified Member Realtor",
    agencyName: memberProfile?.agencyName || "",
    description: "",
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "24/7 Security & CCTV",
    "Car Parking",
    "Gated Community",
  ]);

  // Image Upload State
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [generatedRefId, setGeneratedRefId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle multi-image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Maximum 5 images total
    const remainingSlots = 5 - selectedImageFiles.length;
    if (remainingSlots <= 0) {
      setErrorMessage("You can upload a maximum of 5 property images.");
      return;
    }

    const validFiles = files.slice(0, remainingSlots).filter((file) => {
      const isRaster = file.type.startsWith("image/") && !file.type.includes("svg");
      const isUnderLimit = file.size <= 5 * 1024 * 1024;
      return isRaster && isUnderLimit;
    });

    if (validFiles.length < files.length) {
      setErrorMessage("Some files were skipped: ensure images are JPG, PNG or WEBP, under 5MB each, and up to 5 photos total.");
    }

    const updatedFiles = [...selectedImageFiles, ...validFiles];
    setSelectedImageFiles(updatedFiles);

    // Read previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreviews((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const setAsCoverImage = (index: number) => {
    if (index === 0) return;
    const newFiles = [...selectedImageFiles];
    const [movedFile] = newFiles.splice(index, 1);
    newFiles.unshift(movedFile);
    setSelectedImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    const [movedPreview] = newPreviews.splice(index, 1);
    newPreviews.unshift(movedPreview);
    setImagePreviews(newPreviews);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Google Maps link validation & normalization
  const isValidGoogleMapUrl = (url: string) => {
    if (!url) return false;
    const clean = url.trim().toLowerCase();
    return (
      clean.startsWith("http://") ||
      clean.startsWith("https://") ||
      clean.includes("maps.app.goo.gl") ||
      clean.includes("google.com/maps") ||
      clean.includes("goo.gl/maps") ||
      clean.includes("maps.google.com")
    );
  };

  const getCleanMapUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const effectiveCity =
      formData.city === "Other" && formData.customCity.trim()
        ? formData.customCity.trim()
        : formData.city;

    const mapUrlFormatted = formData.googleMapUrl ? getCleanMapUrl(formData.googleMapUrl) : "";

    const payloadToValidate = {
      title: formData.title,
      city: effectiveCity,
      locality: formData.locality,
      address: formData.address || "",
      price: formData.isPriceNegotiable ? `${formData.price} (Negotiable)` : formData.price,
      area: formData.area,
      propertyType: formData.propertyType,
      listingType: formData.listingType,
      bhk: formData.bhk,
      bathrooms: formData.bathrooms,
      furnishing: formData.furnishing,
      facing: formData.facing,
      reraNumber: formData.reraNumber || "",
      googleMapUrl: mapUrlFormatted,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      agencyName: formData.agencyName || "",
      description: formData.description || "",
    };

    const validationError = firstFormError(postPropertySchema, payloadToValidate);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmitStep("Compressing and preparing property photos...");

    try {
      const tempPropId = `prop_${Date.now()}`;
      let uploadedImageUrls: string[] = [];

      // 1. Upload Images to Firebase Storage
      if (selectedImageFiles.length > 0) {
        setSubmitStep(`Uploading ${selectedImageFiles.length} photo(s) to secure storage...`);
        try {
          uploadedImageUrls = await uploadPropertyImages(selectedImageFiles, tempPropId, customStorage);
        } catch (storageErr) {
          console.warn("Storage upload notice:", storageErr);
        }
      }

      // 2. Prepare Firestore Listing
      setSubmitStep("Saving verified property listing to database...");
      const primaryImageUrl = uploadedImageUrls[0] || "";

      const listingData: PropertyListingData = {
        title: formData.title.trim(),
        propertyType: formData.propertyType,
        listingType: formData.listingType,
        city: effectiveCity,
        locality: formData.locality.trim(),
        address: formData.address.trim(),
        price: formData.isPriceNegotiable ? `${formData.price} (Negotiable)` : formData.price.trim(),
        area: formData.area.trim(),
        bhk: formData.bhk,
        bathrooms: formData.bathrooms,
        furnishing: formData.furnishing,
        facing: formData.facing,
        reraNumber: formData.reraNumber.trim(),
        googleMapUrl: mapUrlFormatted,
        mapUrl: mapUrlFormatted,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        role: isAdminMode ? "Authorized Administrator" : formData.role,
        agencyName: formData.agencyName.trim(),
        description: formData.description.trim(),
        amenities: selectedAmenities,
        imageUrl: primaryImageUrl,
        images: uploadedImageUrls,
        memberId: memberProfile?.employeeId || (isAdminMode ? "ADMIN" : ""),
        authorUid: isAdminMode ? "admin@realtorsmedia.com" : (user?.uid || "guest"),
        status: "Active",
        views: 1,
        leads: 0,
      };

      const firestoreDocId = await createPropertyListing(listingData, customDb);

      // 3. Trigger cloud notification
      try {
        const cloudResult = await submitPropertyCloudFunction({
          ...listingData,
          firestoreId: firestoreDocId,
        });
        setGeneratedRefId(cloudResult.referenceId || `PROP-2026-${Math.floor(10000 + Math.random() * 90000)}`);
      } catch {
        setGeneratedRefId(`PROP-2026-${Math.floor(10000 + Math.random() * 90000)}`);
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Property upload error:", err);
      setErrorMessage(
        err?.code === "permission-denied"
          ? "Permission denied: Please ensure you are signed in and form details meet verified criteria."
          : "Failed to upload property. Please check your network connection and try again."
      );
    } finally {
      setIsSubmitting(false);
      setSubmitStep("");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      propertyType: "Apartments / Flats",
      listingType: "For Sale",
      city: memberProfile?.city || "Pune",
      customCity: "",
      locality: "",
      address: "",
      price: "",
      isPriceNegotiable: false,
      area: "",
      bhk: "2 BHK",
      bathrooms: "2",
      furnishing: "Semi-Furnished",
      facing: "East",
      reraNumber: "",
      googleMapUrl: "",
      name: memberProfile?.fullName || user?.displayName || "",
      phone: memberProfile?.phone || "",
      email: user?.email || "",
      role: "Verified Member Realtor",
      agencyName: memberProfile?.agencyName || "",
      description: "",
    });
    setSelectedImageFiles([]);
    setImagePreviews([]);
    setSubmitted(false);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ----------------------------------------------------
  // Success Confirmation Screen
  // ----------------------------------------------------
  if (submitted) {
    return (
      <div className="bg-white rounded-[6px] border border-[#A3D9B1] p-6 sm:p-10 shadow-sm text-center space-y-5 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#E7F6EA] text-[#168A3A] flex items-center justify-center mx-auto text-3xl border border-[#A3D9B1] shadow-2xs">
          <FaCheckCircle />
        </div>

        <div>
          <span className="bg-[#E7F6EA] text-[#168A3A] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
            Live in Realtors Media Database
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#073F73] mt-2">
            Property Successfully Uploaded!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-md mx-auto">
            Your property &ldquo;<strong>{formData.title}</strong>&rdquo; is now active in the verified marketplace and linked to your member profile.
          </p>
        </div>

        <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-[6px] p-4 text-xs text-left space-y-2 max-w-md mx-auto">
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="text-gray-500">Listing Reference ID:</span>
            <strong className="font-mono text-[#073F73] font-black">{generatedRefId}</strong>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="text-gray-500">Member ID / Author:</span>
            <strong className="text-gray-800">{memberProfile?.employeeId || "Verified Member"}</strong>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="text-gray-500">Location:</span>
            <strong className="text-gray-800">
              {formData.locality}, {formData.city === "Other" ? formData.customCity : formData.city}
            </strong>
          </div>
          {formData.googleMapUrl && (
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500">Google Maps Navigation:</span>
              <a
                href={getCleanMapUrl(formData.googleMapUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#168A3A] font-bold flex items-center gap-1 hover:underline"
              >
                <FaDirections />
                <span>Test Live Route ↗</span>
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onSuccess && (
            <button
              type="button"
              onClick={onSuccess}
              className="bg-[#073F73] hover:bg-[#06345F] text-white text-xs font-black uppercase px-5 py-2.5 rounded-[3px] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FaBuilding />
              <span>Go to My Properties</span>
            </button>
          )}

          <Link
            href="/properties"
            className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-black uppercase px-5 py-2.5 rounded-[3px] transition-colors shadow-xs flex items-center gap-1.5"
          >
            <FaExternalLinkAlt />
            <span>View in Marketplace</span>
          </Link>

          <button
            type="button"
            onClick={resetForm}
            className="bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold px-4 py-2 rounded-[3px] border border-gray-300 transition-colors cursor-pointer"
          >
            + Upload Another Property
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Main Upload Form
  // ----------------------------------------------------
  return (
    <div className="bg-white rounded-[6px] border border-[#C9D7E3] p-5 sm:p-7 shadow-xs space-y-6">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#EEF6FC] text-[#073F73] flex items-center justify-center text-sm font-black">
              <FaPlusCircle />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#073F73] uppercase tracking-tight">
                Upload New Property Listing
              </h2>
              <p className="text-xs text-gray-500">
                Post your verified plots, flats, villas, or commercial spaces with photos and Google Maps navigation
              </p>
            </div>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="self-start sm:self-center text-xs font-bold text-gray-500 hover:text-gray-800 px-3 py-1.5 border border-gray-200 rounded-[3px] transition-colors"
          >
            Cancel & Return
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-[4px] flex items-start gap-2.5">
          <FaExclamationTriangle className="text-red-500 text-sm shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ==================================================== */}
        {/* Section 1: Basic Property Information */}
        {/* ==================================================== */}
        <div>
          <h3 className="text-xs font-black text-[#073F73] uppercase tracking-wider mb-3 flex items-center gap-1.5 pb-1 border-b border-gray-100">
            <FaBuilding className="text-[#168A3A]" />
            <span>1. Basic Property Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-3.5">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Listing Purpose *
              </label>
              <select
                value={formData.listingType}
                onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73] bg-[#F8FAFC]"
              >
                <option value="For Sale">For Sale</option>
                <option value="For Rent / Lease">For Rent / Lease</option>
                <option value="Joint Venture (JV)">Joint Venture (JV)</option>
                <option value="Pre-Launch / Investment">Pre-Launch / Investment</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Property Category *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73] bg-[#F8FAFC]"
              >
                <option value="Apartments / Flats">Apartments / Flats</option>
                <option value="Open Plots">Open Plots</option>
                <option value="Gated Villa Plots">Gated Villa Plots</option>
                <option value="Luxury Villas">Luxury Villas</option>
                <option value="Independent Houses">Independent Houses</option>
                <option value="Commercial Plots / Offices">Commercial Plots / Offices</option>
                <option value="Farm Houses / Agriculture">Farm Houses / Agriculture</option>
                <option value="Industrial / Warehouses">Industrial / Warehouses</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Configuration / BHK
              </label>
              <select
                value={formData.bhk}
                onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73] bg-[#F8FAFC]"
              >
                <option value="Plot / Land (NA)">Plot / Land (NA)</option>
                <option value="1 RK">1 RK</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="2.5 BHK">2.5 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
                <option value="5+ BHK / Penthouse">5+ BHK / Penthouse</option>
                <option value="Commercial Space">Commercial Space</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
              Property Title / Catchy Headline *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Luxury East-Facing 3 BHK Flat with 2 Balconies & Covered Parking in Baner"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73]"
            />
          </div>
        </div>

        {/* ==================================================== */}
        {/* Section 2: Pricing & Dimension Details */}
        {/* ==================================================== */}
        <div>
          <h3 className="text-xs font-black text-[#073F73] uppercase tracking-wider mb-3 flex items-center gap-1.5 pb-1 border-b border-gray-100">
            <FaRupeeSign className="text-[#168A3A]" />
            <span>2. Pricing & Dimension Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 mb-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Expected Price *
              </label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. ₹ 85 Lakhs or ₹ 1.25 Cr"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73]"
              />
              <label className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPriceNegotiable}
                  onChange={(e) => setFormData({ ...formData, isPriceNegotiable: e.target.checked })}
                  className="rounded text-[#073F73]"
                />
                <span>Price is Negotiable</span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Total Area *
              </label>
              <input
                type="text"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g. 1450 Sq.Ft. or 200 Sq.Yd"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Furnishing Status
              </label>
              <select
                value={formData.furnishing}
                onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73] bg-[#F8FAFC]"
              >
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully Furnished">Fully Furnished</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Facing Direction
              </label>
              <select
                value={formData.facing}
                onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73] bg-[#F8FAFC]"
              >
                <option value="East">East Facing</option>
                <option value="North">North Facing</option>
                <option value="North-East">North-East (Ishan)</option>
                <option value="West">West Facing</option>
                <option value="South">South Facing</option>
              </select>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* Section 3: Location & Google Maps Navigation Link */}
        {/* ==================================================== */}
        <div className="bg-[#F0F7FD] border border-[#BAE0FD] p-4 sm:p-5 rounded-[6px] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[#073F73] uppercase tracking-wider flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-[#E21F2F]" />
              <span>3. Location & Google Maps Navigation Link</span>
            </h3>
            <span className="bg-[#E7F6EA] text-[#168A3A] border border-[#A3D9B1] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              GPS Navigation Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                City / Region *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73] bg-white"
              >
                {TOP_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {formData.city === "Other" && (
                <input
                  type="text"
                  required
                  value={formData.customCity}
                  onChange={(e) => setFormData({ ...formData, customCity: e.target.value })}
                  placeholder="Enter custom city"
                  className="w-full mt-2 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73] bg-white"
                />
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Locality / Society / Area Name *
              </label>
              <input
                type="text"
                required
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                placeholder="e.g. Baner Pashan Link Road, Near High Street"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73] bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
              Full Address / Landmarks
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Flat 604, Tower B, Emerald Heights, Opp. Metro Station"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73] bg-white"
            />
          </div>

          {/* GOOGLE MAPS NAVIGATION URL INPUT (CORE PROMINENT FEATURE) */}
          <div className="bg-white border-2 border-[#38BDF8]/60 p-3.5 rounded-[5px] space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-[11px] font-black text-[#073F73] uppercase flex items-center gap-1.5">
                <FaDirections className="text-[#073F73] text-sm" />
                <span>Google Maps Link to Navigate (URL)</span>
              </label>
              <span className="text-[10px] text-gray-500 font-semibold">
                Buyers & clients click this to navigate directly to the property
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={formData.googleMapUrl}
                onChange={(e) => setFormData({ ...formData, googleMapUrl: e.target.value })}
                placeholder="https://maps.app.goo.gl/... or https://maps.google.com/?q=..."
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73] font-mono"
              />

              {isValidGoogleMapUrl(formData.googleMapUrl) && (
                <a
                  href={getCleanMapUrl(formData.googleMapUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-1 whitespace-nowrap transition-colors"
                  title="Test location in Google Maps"
                >
                  <FaExternalLinkAlt className="text-[10px]" />
                  <span>Test Route</span>
                </a>
              )}
            </div>

            <div className="text-[10.5px] text-gray-500 flex items-center gap-1.5">
              <FaInfoCircle className="text-[#0B4F8A] shrink-0" />
              <span>
                Tip: Open Google Maps on phone or desktop, search the plot or building, tap <strong>Share</strong>, and copy the link.
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* Section 4: Property Images Upload (CORE REQUIREMENT) */}
        {/* ==================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-gray-100">
            <h3 className="text-xs font-black text-[#073F73] uppercase tracking-wider flex items-center gap-1.5">
              <FaImages className="text-[#168A3A]" />
              <span>4. Property Images & Photographs (Up to 5 Photos)</span>
            </h3>
            <span className="text-[10.5px] text-gray-500 font-semibold">
              {selectedImageFiles.length} / 5 Selected
            </span>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-[#073F73] rounded-[6px] p-6 text-center cursor-pointer transition-colors bg-[#F8FAFC] hover:bg-[#F0F7FD] group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs border border-gray-200 flex items-center justify-center mx-auto text-[#073F73] group-hover:scale-105 transition-transform text-lg">
              <FaUpload />
            </div>
            <p className="text-xs font-bold text-[#073F73] mt-2">
              Click to select or drag & drop property photos
            </p>
            <p className="text-[10.5px] text-gray-500 mt-0.5">
              High resolution JPG, PNG, or WEBP photos (Up to 5MB each • Maximum 5 photos • Auto-compressed for rapid loading)
            </p>
          </div>

          {/* Previews Grid */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {imagePreviews.map((preview, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-[5px] overflow-hidden border border-gray-200 aspect-4/3 bg-gray-100"
                >
                  <img
                    src={preview}
                    alt={`Property photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-[#073F73] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                      Cover Photo
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAsCoverImage(idx);
                        }}
                        className="bg-white hover:bg-gray-100 text-[#073F73] text-[9.5px] font-bold px-2 py-1 rounded shadow-xs cursor-pointer"
                        title="Set as main cover photo"
                      >
                        Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-xs cursor-pointer"
                      title="Remove this photo"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* Section 5: Key Amenities & Features */}
        {/* ==================================================== */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[#073F73] uppercase tracking-wider pb-1 border-b border-gray-100">
            5. Key Amenities & Project Approvals
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            {COMMON_AMENITIES.map((amenity) => {
              const isChecked = selectedAmenities.includes(amenity);
              return (
                <label
                  key={amenity}
                  className={`flex items-center gap-2 p-2 rounded-[4px] border cursor-pointer transition-colors text-[11px] font-semibold ${
                    isChecked
                      ? "bg-[#EEF6FC] border-[#073F73] text-[#073F73]"
                      : "bg-[#F8FAFC] border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAmenity(amenity)}
                    className="rounded text-[#073F73]"
                  />
                  <span>{amenity}</span>
                </label>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                RERA Registration Number (If applicable)
              </label>
              <input
                type="text"
                value={formData.reraNumber}
                onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                placeholder="e.g. P52100012345"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Detailed Property Description / Key Selling Points
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe key highlights, proximity to highway/metro, possession timeline, title clearance, water supply, etc."
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73]"
              />
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* Section 6: Verified Realtor Contact Info */}
        {/* ==================================================== */}
        <div className="bg-[#F8FAFC] border border-[#CBD5E1] p-4 rounded-[6px] space-y-3">
          <h3 className="text-xs font-black text-[#073F73] uppercase tracking-wider flex items-center justify-between">
            <span>6. Verified Realtor / Contact Details</span>
            <span className="text-[10px] text-[#168A3A] font-bold">
              Linked to Member ID: {memberProfile?.employeeId || "Authenticated Member"}
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10.5px] font-bold text-gray-600 uppercase mb-0.5">
                Contact Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#073F73]"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-gray-600 uppercase mb-0.5">
                Direct Phone / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#073F73]"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-gray-600 uppercase mb-0.5">
                Agency / Company Name
              </label>
              <input
                type="text"
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                placeholder="Brokerage or Agency"
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#073F73]"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <FaShieldAlt className="text-[#168A3A]" />
            <span>Listing will be verified and made accessible to over 50,000+ genuine buyers.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-300 rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-black uppercase px-6 py-2.5 rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>{submitStep || "Publishing Property..."}</span>
                </>
              ) : (
                <>
                  <FaPlusCircle className="text-sm" />
                  <span>Publish Property Listing</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
