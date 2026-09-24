"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { cardTierPlans } from "@/data/portalData";
import { RealtorsMediaIdCard } from "@/components/ui/RealtorsMediaIdCard";
import { RealtorsMediaEmployee } from "@/types";
import {
  FaCheckCircle,
  FaIdCard,
  FaShieldAlt,
  FaUserCheck,
  FaStar,
  FaArrowRight,
  FaLock,
  FaBuilding,
  FaCamera,
  FaImage,
  FaSyncAlt,
  FaTimes,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";

import { registerMember } from "@/lib/firebase/auth";
import { peekNextEmployeeId } from "@/lib/firebase/db";

export default function RegisterPage() {
  const router = useRouter();

  // Tier selection: green, blue, orange
  const [selectedTier, setSelectedTier] = useState<"green" | "blue" | "orange">("green");
  const [previewId, setPreviewId] = useState("RM-C-1111");

  useEffect(() => {
    peekNextEmployeeId(selectedTier).then((id) => setPreviewId(id));
  }, [selectedTier]);

  // User type: realtor, builder, professional
  const [memberType, setMemberType] = useState<"realtor" | "builder" | "professional">("realtor");

  // Form inputs
  const [formData, setFormData] = useState({
    fullName: "Rohan Deshmukh",
    phone: "9876543210",
    email: "rohan.deshmukh@example.com",
    city: "Pune",
    state: "Maharashtra",
    reraNo: "A52100012345",
    experienceYears: "5",
    specialization: "Residential Plots & Apartments",
    companyName: "Deshmukh Realty Associates",
    photo: "/images/rohan_deshmukh.png",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  // Camera state with front/back camera switch
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [generatedEmpId, setGeneratedEmpId] = useState("");

  // Attach stream when camera is active
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraActive]);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async (targetFacing?: "user" | "environment") => {
    const actualFacing: "user" | "environment" =
      targetFacing === "user" || targetFacing === "environment" ? targetFacing : facingMode;

    setCameraError(null);
    setIsSwitchingCamera(true);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1080 },
            height: { ideal: 1080 },
            facingMode: { ideal: actualFacing },
          },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      setFacingMode(actualFacing);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(
        "Camera access was denied or no camera device was detected. Please allow permissions or upload your photo from the gallery."
      );
      setIsCameraActive(true);
    } finally {
      setIsSwitchingCamera(false);
    }
  };

  const toggleCamera = async () => {
    const nextFacing = facingMode === "user" ? "environment" : "user";
    await startCamera(nextFacing);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
    setIsSwitchingCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (facingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      setFormData((prev) => ({ ...prev, photo: dataUrl }));
      stopCamera();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setFormData((prev) => ({ ...prev, photo: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Construct preview employee object
  const previewEmployee: RealtorsMediaEmployee = {
    name: formData.fullName || "Your Full Name",
    designation:
      memberType === "realtor"
        ? selectedTier === "orange"
          ? "VIP ELITE REALTOR"
          : selectedTier === "blue"
          ? "EXECUTIVE REALTOR"
          : "VERIFIED REALTOR"
        : memberType === "builder"
        ? "BUILDER / DEVELOPER"
        : "INDUSTRY PROFESSIONAL",
    employeeId: previewId,
    department:
      memberType === "realtor"
        ? "Property Brokerage Cell"
        : memberType === "builder"
        ? "Developer Projects Wing"
        : "Allied Services Cell",
    location: `${formData.city || "City"}, ${formData.state || "State"}`,
    issuedDate: "24 SEP 2026",
    validTill: "23 SEP 2028",
    photo: formData.photo || "/images/rohan_deshmukh.png",
    verificationUrl: `https://realtorsmedia.com/verify/${previewId}`,
    theme: selectedTier === "orange" ? "red" : selectedTier,
    phone: `+91 ${formData.phone}`,
    email: formData.email,
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter your password.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { profile } = await registerMember({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        reraNo: formData.reraNo,
        experienceYears: formData.experienceYears,
        specialization: formData.specialization,
        companyName: formData.companyName,
        memberType,
        selectedTier,
        photoDataUrlOrFile: formData.photo,
      });

      setGeneratedEmpId(profile.employeeId);
      setRegisteredSuccess(true);
    } catch (err: any) {
      console.error("Registration error:", err);
      let msg = "Registration failed. Please verify your details.";
      if (err.code === "auth/email-already-in-use") {
        msg = "This email address is already registered. Please log in instead.";
      } else if (err.code === "auth/invalid-email") {
        msg = "The email address entered is invalid.";
      } else if (err.code === "auth/weak-password") {
        msg = "The password is too weak. Please use at least 6 characters.";
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalLayout
      title="MEMBER REGISTRATION & VERIFIED ID CARD"
      subtitle="Join India's premier real estate media network, obtain your verified CR80 ID card, and scale your property transactions"
      badge="OFFICIAL PORTAL ENROLLMENT"
      breadcrumbs={[{ label: "Register" }]}
    >
      {registeredSuccess ? (
        <div className="max-w-2xl mx-auto bg-white border border-[#A3D9B1] rounded-[4px] p-6 sm:p-8 text-center shadow-md space-y-4">
          <div className="w-16 h-16 bg-[#E7F6EA] text-[#168A3A] rounded-full flex items-center justify-center mx-auto text-3xl">
            <FaCheckCircle />
          </div>
          <span className="bg-[#E7F6EA] text-[#168A3A] text-[11px] font-black px-3 py-1 rounded-full uppercase">
            Enrollment Completed
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#073F73]">
            Welcome to Realtors Media, {formData.fullName}!
          </h2>
          <p className="text-[13px] text-gray-600 max-w-md mx-auto leading-relaxed">
            Your registration is approved. Your official verified identity credentials have been generated:
          </p>

          <div className="bg-[#F8FAFC] border border-[#CBD5E1] p-4 rounded-[4px] inline-block text-left my-2">
            <div className="text-[12px] text-gray-500 font-semibold">Your Registered Member ID:</div>
            <div className="text-xl font-black text-[#073F73] tracking-widest">{generatedEmpId}</div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">
              ✓ CR80 Digital Identity Card Activated
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
            <Link
              href={`/verify/${generatedEmpId}`}
              className="bg-[#073F73] hover:bg-[#06345F] text-white text-[12px] font-black uppercase px-6 py-2.5 rounded-[3px] transition-colors"
            >
              View Public Verification Profile
            </Link>
            <Link
              href="/dashboard"
              className="bg-[#E21F2F] hover:bg-[#c91826] text-white text-[12px] font-black uppercase px-6 py-2.5 rounded-[3px] transition-colors"
            >
              Access Member Dashboard →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[4px] border border-[#C9D7E3] p-5 shadow-xs">
            {/* Step 1: Member Type */}
            <div className="mb-5 pb-4 border-b border-gray-100">
              <label className="block text-[11.5px] font-black uppercase tracking-wider text-[#073F73] mb-2">
                1. Select Your Professional Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMemberType("realtor")}
                  className={`py-2 px-1 text-center rounded-[3px] border text-[11.5px] font-bold transition-all cursor-pointer ${
                    memberType === "realtor"
                      ? "border-[#073F73] bg-[#073F73] text-white shadow-xs"
                      : "border-[#C9D7E3] bg-gray-50 text-[#143B5D] hover:bg-gray-100"
                  }`}
                >
                  Realtor / Broker
                </button>
                <button
                  type="button"
                  onClick={() => setMemberType("builder")}
                  className={`py-2 px-1 text-center rounded-[3px] border text-[11.5px] font-bold transition-all cursor-pointer ${
                    memberType === "builder"
                      ? "border-[#073F73] bg-[#073F73] text-white shadow-xs"
                      : "border-[#C9D7E3] bg-gray-50 text-[#143B5D] hover:bg-gray-100"
                  }`}
                >
                  Builder / Developer
                </button>
                <button
                  type="button"
                  onClick={() => setMemberType("professional")}
                  className={`py-2 px-1 text-center rounded-[3px] border text-[11.5px] font-bold transition-all cursor-pointer ${
                    memberType === "professional"
                      ? "border-[#073F73] bg-[#073F73] text-white shadow-xs"
                      : "border-[#C9D7E3] bg-gray-50 text-[#143B5D] hover:bg-gray-100"
                  }`}
                >
                  Architect / Allied
                </button>
              </div>
            </div>

            {/* Step 2: Tier Selection */}
            <div className="mb-5 pb-4 border-b border-gray-100">
              <label className="block text-[11.5px] font-black uppercase tracking-wider text-[#073F73] mb-2">
                2. Choose ID Card & Membership Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {cardTierPlans.map((tier) => {
                  const isSelected =
                    (tier.tierTheme === "green" && selectedTier === "green") ||
                    (tier.tierTheme === "blue" && selectedTier === "blue") ||
                    (tier.tierTheme === "orange" && selectedTier === "orange");

                  return (
                    <div
                      key={tier.id}
                      onClick={() =>
                        setSelectedTier(
                          tier.tierTheme === "orange"
                            ? "orange"
                            : tier.tierTheme === "blue"
                            ? "blue"
                            : "green"
                        )
                      }
                      className={`p-3 rounded-[4px] border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? tier.tierTheme === "green"
                            ? "border-[#168A3A] bg-[#E7F6EA]/40"
                            : tier.tierTheme === "blue"
                            ? "border-[#0B4F8A] bg-[#EEF6FC]/60"
                            : "border-[#E21F2F] bg-red-50/40"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-xs uppercase ${
                              tier.tierTheme === "green"
                                ? "bg-[#168A3A] text-white"
                                : tier.tierTheme === "blue"
                                ? "bg-[#0B4F8A] text-white"
                                : "bg-[#E21F2F] text-white"
                            }`}
                          >
                            {tier.tierTheme}
                          </span>
                          <span className="text-[12px] font-black text-[#073F73]">
                            {tier.price}
                          </span>
                        </div>
                        <h4 className="text-[12.5px] font-black text-[#073F73] mt-1.5">
                          {tier.title}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-semibold">{tier.commission}</p>
                      </div>
                      <div className="mt-2 text-right">
                        <span className="text-[10px] font-black text-[#073F73]">
                          {isSelected ? "● Selected" : "○ Select"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Registration Form */}
            <form onSubmit={handleRegister} className="space-y-3.5 text-[12px]">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-[4px] text-[11.5px] text-red-700 flex items-start gap-2">
                  <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <label className="block text-[11.5px] font-black uppercase tracking-wider text-[#073F73] mb-1">
                3. Member Details & Credentials
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    placeholder="As per Aadhaar / PAN"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">Company / Agency Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    placeholder="e.g. Skyline Realty Ltd"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    placeholder="10-digit number"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    placeholder="name@realty.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    placeholder="e.g. Hyderabad"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    placeholder="e.g. Telangana"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">RERA Number (if any)</label>
                  <input
                    type="text"
                    value={formData.reraNo}
                    onChange={(e) => setFormData({ ...formData, reraNo: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    placeholder="State RERA / NA"
                  />
                </div>
              </div>

              {/* ID Card Photograph with Front/Back Camera */}
              <div className="p-3 bg-[#F8FAFC] rounded border border-[#CBD5E1] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] font-black uppercase text-[#073F73] flex items-center gap-1.5">
                    <FaCamera className="text-[#0284C7]" />
                    <span>Member ID Photograph *</span>
                  </label>
                  <span className="text-[9.5px] text-gray-500 font-semibold">Updates live on card preview</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="py-1.5 px-3 bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-bold rounded-[3px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FaCamera className="text-[10px]" />
                    <span>Take Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-1.5 px-3 bg-white hover:bg-gray-50 border border-[#C9D7E3] text-[#143B5D] text-[11px] font-bold rounded-[3px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FaImage className="text-[10px] text-[#073F73]" />
                    <span>Upload Image</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {formData.photo && (
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                    <img
                      src={formData.photo}
                      alt="Selected photo"
                      className="w-10 h-10 rounded-full object-cover border border-[#073F73]"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <FaCheck className="text-[9px]" /> Photo set for ID card
                      </span>
                      <span className="text-[9px] text-gray-500">Live preview updated</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    placeholder="Min. 8 characters"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    placeholder="Repeat password"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  required
                  className="mt-1 accent-[#073F73]"
                />
                <label htmlFor="agreeTerms" className="text-[11px] text-gray-600 leading-tight">
                  I agree to the Realtors Media Code of Ethics,{" "}
                  <Link href="/terms" className="text-[#073F73] font-bold underline">
                    Terms & Conditions
                  </Link>
                  , and verify that all business registration details provided are authentic.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E21F2F] hover:bg-[#c91826] text-white font-black py-2.5 rounded-[3px] uppercase tracking-wider text-[12.5px] shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 mt-3"
              >
                {isSubmitting ? (
                  <span>Generating Official Member ID...</span>
                ) : (
                  <>
                    <span>Complete Enrollment & Get ID Card</span>
                    <FaArrowRight className="text-[11px]" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-gray-500">Already have a registered Login ID?</span>
              <Link href="/dashboard" className="text-[#073F73] font-extrabold hover:underline">
                Sign In to Member Portal →
              </Link>
            </div>
          </div>

          {/* Right Side: Live CR80 ID Card Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full bg-white rounded-[4px] border border-[#C9D7E3] p-4 shadow-xs flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5 text-[#073F73] font-black text-[12px] uppercase">
                  <FaIdCard />
                  <span>CR80 Live ID Preview</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Interactive Preview
                </span>
              </div>

              {/* Render RealtorsMediaIdCard */}
              <div className="my-2">
                <RealtorsMediaIdCard
                  employee={previewEmployee}
                  width={280}
                  className="shadow-lg rounded-[6px]"
                />
              </div>

              <div className="w-full mt-3 bg-[#F8FAFC] border border-[#CBD5E1] p-3 rounded-[4px] text-[11px] text-[#143B5D] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected Tier:</span>
                  <span className="font-black uppercase text-[#073F73]">
                    {selectedTier} Tier ({selectedTier === "orange" ? "₹5,000" : selectedTier === "blue" ? "₹2,000" : "FREE"})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Physical Card Delivery:</span>
                  <span className="font-bold text-gray-800">
                    {selectedTier === "green" ? "Digital Only (Upgrade available)" : "Printed CR80 Dispatch within 48h"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Verification Engine:</span>
                  <span className="font-bold text-emerald-700">Instant QR Code Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Capture Overlay with Front/Back Camera Switch */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-300">
            <div className="bg-[#073F73] text-white px-4 py-3 flex items-center justify-between">
              <span className="text-[13px] font-black uppercase tracking-wide flex items-center gap-2">
                <FaCamera className="text-[#38BDF8]" />
                <span>Take Photo for ID Card</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleCamera}
                  disabled={isSwitchingCamera}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white rounded text-[11px] font-bold transition-all cursor-pointer border border-white/20 disabled:opacity-50"
                  title={`Switch to ${facingMode === "user" ? "Back" : "Front"} Camera`}
                >
                  <FaSyncAlt className={`text-[10px] ${isSwitchingCamera ? "animate-spin" : ""}`} />
                  <span>{facingMode === "user" ? "Back Camera" : "Front Camera"}</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <FaTimes className="text-[12px]" />
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col items-center">
              {cameraError ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-[11px] text-red-700 text-center my-3">
                  <p>{cameraError}</p>
                </div>
              ) : (
                <div className="relative w-full aspect-square max-w-[280px] bg-black rounded-lg overflow-hidden border-2 border-[#073F73] shadow-inner mb-3">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold border border-white/20">
                    {facingMode === "user" ? "🤳 Front Camera" : "📷 Back Camera"}
                  </div>
                  <button
                    type="button"
                    onClick={toggleCamera}
                    disabled={isSwitchingCamera}
                    className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/65 hover:bg-black/85 text-white text-[10px] font-bold border border-white/30 cursor-pointer"
                  >
                    <FaSyncAlt className={`text-[10px] text-[#38BDF8] ${isSwitchingCamera ? "animate-spin" : ""}`} />
                    <span>{facingMode === "user" ? "Switch to Back" : "Switch to Front"}</span>
                  </button>
                  <div className="absolute inset-0 border-2 border-white/20 pointer-events-none flex items-center justify-center">
                    <div className="w-44 h-52 border-2 border-dashed border-white/70 rounded-2xl pointer-events-none" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 w-full mt-1">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="py-2 px-3 rounded border border-gray-300 text-gray-700 font-bold text-[11px] hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                {!cameraError && (
                  <>
                    <button
                      type="button"
                      onClick={toggleCamera}
                      disabled={isSwitchingCamera}
                      className="py-2 px-2.5 rounded bg-[#EEF6FC] hover:bg-[#E0EFFB] text-[#073F73] font-bold text-[11px] flex items-center justify-center gap-1 border border-[#A5CEE8] cursor-pointer"
                    >
                      <FaSyncAlt className={`text-[10px] ${isSwitchingCamera ? "animate-spin" : ""}`} />
                      <span>{facingMode === "user" ? "Back Camera" : "Front Camera"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 py-2 px-3 rounded bg-[#168A3A] hover:bg-[#126f2f] text-white font-black text-[11.5px] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <FaCamera className="text-[11px]" />
                      <span>Snap Photo</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
