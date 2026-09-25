"use client";

import React, { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import Image from "next/image";
import Link from "next/link";
import {
  FaTimes,
  FaDownload,
  FaPrint,
  FaCheck,
  FaIdCard,
  FaCamera,
  FaImage,
  FaUserCheck,
  FaShieldAlt,
  FaQrcode,
  FaSyncAlt,
  FaExclamationTriangle,
  FaTrash,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaArrowRight,
} from "react-icons/fa";
import { RealtorsMediaIdCard } from "./RealtorsMediaIdCard";
import { RealtorsMediaEmployee } from "@/types";
import { realtorsEmployees, cardTierPlans } from "@/data/portalData";
import { useAuth } from "@/context/AuthContext";
import { registerMember } from "@/lib/firebase/auth";
import { updateProfile } from "firebase/auth";
import {
  getNextEmployeeId,
  getPrefixForTier,
  peekNextEmployeeId,
  saveMemberProfile,
  saveIdCardRecord,
  getIdCardRecord,
  retireIdCardRecord,
  MemberProfileData,
} from "@/lib/firebase/db";
import { uploadMemberPhoto, compressImage, toFirestoreSafePhoto } from "@/lib/firebase/storage";
import { getSafePhotoUrl, convertUrlToDataUrl } from "@/lib/utils/imageUtils";

export interface IdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmployee?: RealtorsMediaEmployee;
  initialTier?: "green" | "blue" | "orange" | "red";
  onProfileUpdated?: (profile: MemberProfileData) => void;
  /**
   * "self": the logged-in member edits their own card (dashboard).
   * "issue" (default): a fresh generator that issues a new card for someone else and never
   * reads from or writes to the logged-in account (e.g. an admin generating cards).
   */
  mode?: "self" | "issue";
}

const EXPERIENCE_OPTIONS = [
  "Fresher / < 1 Year",
  "1 - 3 Years",
  "3 - 5 Years",
  "5 - 10 Years",
  "10+ Years",
  "15+ Years",
];

const SPECIALIZATION_OPTIONS = [
  "All Properties",
  "Residential Properties",
  "Commercial & Retail",
  "Open Plots & Layouts",
  "Villas & Luxury Homes",
  "Farm Houses & Lands",
  "Industrial & Warehousing",
  "Property Sales & Channel Partner",
];

const PRESET_PHOTOS = [
  { label: "Rohan D.", path: "/images/rohan_deshmukh.png" },
  { label: "Ramnath K.", path: "/images/realtor_ramnath.jpg" },
  { label: "Priya S.", path: "/images/realtor_priya.jpg" },
];

type TierKey = "green" | "blue" | "orange";

// "red" is a legacy alias of the orange (RM-A) tier
const normalizeTier = (tier?: string | null): TierKey =>
  tier === "orange" || tier === "red" ? "orange" : tier === "blue" ? "blue" : "green";

const TIER_DESIGNATION: Record<TierKey, string> = {
  green: "VERIFIED REALTOR",
  blue: "EXECUTIVE REALTOR",
  orange: "VIP ELITE REALTOR",
};

const formatCardDate = (date: Date, addYears = 0) =>
  `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${date.getFullYear() + addYears}`;

export const IdCardModal: React.FC<IdCardModalProps> = ({
  isOpen,
  onClose,
  initialEmployee,
  initialTier = "green",
  onProfileUpdated,
  mode = "issue",
}) => {
  const { user, memberProfile: authProfile, setMemberProfile, refreshProfile } = useAuth();
  const isSelfMode = mode === "self" && !!user;
  // In issue mode the generator starts blank: the logged-in account's card must never leak into it
  const memberProfile = isSelfMode ? authProfile : null;
  const selfUser = isSelfMode ? user : null;
  const [selectedTier, setSelectedTier] = useState<TierKey>(normalizeTier(initialTier));

  const buildInitialForm = () => ({
    name:
      initialEmployee?.name ||
      (isSelfMode ? memberProfile?.fullName || (selfUser?.displayName && selfUser.displayName !== "Verified Member" ? selfUser.displayName : "") : "") ||
      "",
    mobile: initialEmployee?.phone || (isSelfMode ? memberProfile?.phone || memberProfile?.mobile : "") || "",
    email: initialEmployee?.email || (isSelfMode ? memberProfile?.email || selfUser?.email : "") || "",
    location:
      initialEmployee?.location ||
      (isSelfMode ? memberProfile?.location || (memberProfile?.city ? `${memberProfile.city}, ${memberProfile.state || "India"}` : "") : "") ||
      "",
    agencyName:
      initialEmployee?.agencyName ||
      (isSelfMode ? memberProfile?.agencyName || memberProfile?.companyName : "") ||
      "",
    licenseNumber:
      initialEmployee?.licenseNumber ||
      initialEmployee?.reraNumber ||
      (isSelfMode ? memberProfile?.licenseNumber || memberProfile?.reraNo : "") ||
      "",
    experience:
      initialEmployee?.experience ||
      (isSelfMode ? memberProfile?.experience || memberProfile?.experienceYears : "") ||
      "",
    specialization:
      initialEmployee?.specialization ||
      (isSelfMode ? memberProfile?.specialization : "") ||
      "Residential Properties",
    // Never pre-fill a placeholder photo: a real photo is mandatory for the card
    photo:
      initialEmployee?.photo ||
      (initialEmployee as any)?.photoUrl ||
      (isSelfMode ? memberProfile?.photoUrl || memberProfile?.photo || selfUser?.photoURL || "" : ""),
    employeeId: initialEmployee?.employeeId || (isSelfMode ? memberProfile?.employeeId || "" : ""),
    issuedDate: initialEmployee?.issuedDate || (isSelfMode ? memberProfile?.issuedDate || "" : ""),
    validTill: initialEmployee?.validTill || (isSelfMode ? memberProfile?.validTill || "" : ""),
    department:
      initialEmployee?.department ||
      (isSelfMode ? memberProfile?.department : "") ||
      "Property Sales & Channel",
    password: "",
    confirmPassword: "",
  });

  const [formData, setFormData] = useState(buildInitialForm);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Live Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const previewRequestRef = useRef(0);

  // An ID already issued for this tier (the member's own, or the card being inspected)
  const existingIdForTier = (tier: TierKey) => {
    const prefix = `${getPrefixForTier(tier)}-`;
    return [initialEmployee?.employeeId, memberProfile?.employeeId].find((id) => id && id.startsWith(prefix)) || "";
  };

  // Show the member's existing ID for the tier, otherwise preview the next sequential ID.
  // Stale lookups (e.g. after rapid tier switching) are ignored.
  const resolvePreviewId = async (tier: TierKey) => {
    const requestId = ++previewRequestRef.current;
    let nextId = existingIdForTier(tier);
    if (!nextId) {
      try {
        nextId = await peekNextEmployeeId(tier);
      } catch {
        nextId = `${getPrefixForTier(tier)}-1111`;
      }
    }
    if (requestId === previewRequestRef.current) {
      setFormData((prev) => ({ ...prev, employeeId: nextId }));
    }
  };

  // Reset the form every time the modal is opened or employee changes so stale edits/success states don't leak between sessions
  useEffect(() => {
    if (!isOpen) return;
    const tier = normalizeTier(initialTier);
    setSelectedTier(tier);
    setFormData(buildInitialForm());
    setIsGenerated(false);
    setAuthError(null);
    setAuthSuccessMessage(null);
    setPhotoError(null);
    resolvePreviewId(tier);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialEmployee?.employeeId, initialEmployee?.name, initialEmployee?.photo, (initialEmployee as any)?.photoUrl]);

  // If the member profile finishes loading while the modal is open, fill in fields the user hasn't typed yet
  useEffect(() => {
    if (!isOpen || !memberProfile) return;
    const loaded = buildInitialForm();
    setFormData((prev) => ({
      ...prev,
      name: prev.name || loaded.name,
      mobile: prev.mobile || loaded.mobile,
      email: prev.email || loaded.email,
      location: prev.location || loaded.location,
      agencyName: prev.agencyName || loaded.agencyName,
      licenseNumber: prev.licenseNumber || loaded.licenseNumber,
      experience: prev.experience || loaded.experience,
      photo: prev.photo || loaded.photo,
      issuedDate: prev.issuedDate || loaded.issuedDate,
      validTill: prev.validTill || loaded.validTill,
    }));
    const existing = existingIdForTier(selectedTier);
    if (existing) {
      previewRequestRef.current++;
      setFormData((prev) => ({ ...prev, employeeId: existing }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, memberProfile?.uid, memberProfile?.employeeId]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (isCameraActive) {
          stopCamera();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isCameraActive, onClose]);

  // Attach camera stream when camera view is active
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => { });
    }
  }, [isCameraActive]);

  // Cleanup camera stream when closing modal or unmounting
  useEffect(() => {
    if (!isOpen && isCameraActive) {
      stopCamera();
    }
  }, [isOpen, isCameraActive]);

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
    setPhotoError(null);
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
        // Fallback to basic video constraint if ideal constraints fail
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
        videoRef.current.play().catch(() => { });
      }

      if (navigator.mediaDevices.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevs = devices.filter((d) => d.kind === "videoinput");
          setAvailableCameras(videoDevs);
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(
        "Camera access was denied or no camera device was detected. Please allow camera permissions or upload your photo from the gallery."
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

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    // Camera not streaming yet: capturing now would produce a black image
    if (!video.videoWidth || !video.videoHeight) {
      setCameraError("Camera is still starting. Please wait a moment and try again.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (facingMode === "user") {
        // Mirror horizontally so selfie picture matches what the user saw on screen
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const rawDataUrl = canvas.toDataURL("image/jpeg", 0.92);
      stopCamera();
      const dataUrl = (await compressImage(rawDataUrl, 1200, 1200, 0.88).catch(() => "")) || rawDataUrl;
      setFormData((prev) => ({ ...prev, photo: dataUrl }));
      setPhotoError(null);
    }
  };

  if (!isOpen) return null;

  const handleRegenerateId = (tier: TierKey) => {
    resolvePreviewId(tier);
  };

  // Change tier and update sequential ID format
  const handleTierChange = (tier: string) => {
    const nextTier = normalizeTier(tier);
    setSelectedTier(nextTier);
    resolvePreviewId(nextTier);
  };

  // Handle local image file upload with high-quality compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    // Clear the input so selecting the same file again (e.g. after "Remove") still fires onChange
    input.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file (PNG or JPG).");
      return;
    }

    try {
      // Compress image proportionally to max 1200px (cuts 5MB to ~180KB without losing quality)
      const compressed = await compressImage(file, 1200, 1200, 0.88);
      if (compressed) {
        setFormData((prev) => ({ ...prev, photo: compressed }));
        setPhotoError(null);
      } else {
        setPhotoError("Could not read this image. Please try a different photo.");
      }
    } catch (err) {
      console.warn("Photo compression fallback:", err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setFormData((prev) => ({ ...prev, photo: result }));
          setPhotoError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate ID Card & Create Member Login in Firebase
  const handleGenerateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhotoError(null);
    setAuthError(null);
    setAuthSuccessMessage(null);

    if (!formData.photo) {
      setPhotoError("⚠ Without a photo you will not get an ID card. Please take a photo or upload one from your gallery.");
      return;
    }

    if (!isSelfMode) {
      if (!formData.password) {
        setAuthError("Please enter Create Password to activate your member login.");
        return;
      }
      if (formData.password.length < 6) {
        setAuthError("Password must be at least 6 characters long.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setAuthError("Passwords do not match. Please re-enter your password.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const tierKey = selectedTier;
      const designation = TIER_DESIGNATION[tierKey];
      const department = formData.department || "Property Sales & Channel";
      const city = formData.location.split(",")[0]?.trim() || formData.location;
      const state = formData.location.split(",")[1]?.trim() || "India";

      let savedProfile: MemberProfileData;
      let isUpdate = false;

      const issuedForSomeoneElse = !isSelfMode && !!user;

      if (!isSelfMode || !user) {
        // registerMember creates the login, uploads the photo once authenticated, assigns the
        // Member ID (reusing the existing one if this email already has a card for this tier)
        // and saves both the `members` and `idCards` records.
        const { profile } = await registerMember({
          email: formData.email,
          password: formData.password,
          fullName: formData.name,
          phone: formData.mobile,
          city,
          state,
          location: formData.location,
          agencyName: formData.agencyName,
          licenseNumber: formData.licenseNumber,
          experience: formData.experience,
          specialization: formData.specialization,
          companyName: formData.agencyName,
          memberType: "realtor",
          selectedTier: tierKey,
          photoDataUrlOrFile: formData.photo,
          department,
          designation,
          employeeId: formData.employeeId ? formData.employeeId.trim() : undefined,
          // An admin/member issuing a card for someone else must stay logged in as themselves
          keepCurrentSession: issuedForSomeoneElse,
        });
        savedProfile = profile;
      } else {
        // Keep the member's existing ID (and its issue/expiry dates) unless they moved to another tier
        const previousId = memberProfile?.employeeId || "";
        const keepExistingId = !!previousId && previousId.startsWith(`${getPrefixForTier(tierKey)}-`);
        const employeeId = formData.employeeId
          ? formData.employeeId.trim()
          : keepExistingId
            ? previousId
            : await getNextEmployeeId(tierKey);
        isUpdate = keepExistingId && employeeId === previousId;

        const now = new Date();
        const issuedDate = (keepExistingId && memberProfile?.issuedDate) || formatCardDate(now);
        const validTill = (keepExistingId && memberProfile?.validTill) || formatCardDate(now, 2);
        const verificationUrl = `https://www.realtorsmedia.world/verify/${employeeId}`;

        let photoUrl = formData.photo;
        try {
          photoUrl = await uploadMemberPhoto(formData.photo, user.uid);
        } catch (uploadErr) {
          console.warn("Storage upload warning, storing photo inline:", uploadErr);
          photoUrl = await toFirestoreSafePhoto(formData.photo);
        }

        const safeAuthPhotoUrl =
          photoUrl && !photoUrl.startsWith("data:") && photoUrl.length < 2048 ? photoUrl : undefined;
        try {
          await updateProfile(user, {
            displayName: formData.name,
            ...(safeAuthPhotoUrl ? { photoURL: safeAuthPhotoUrl } : {}),
          });
        } catch (profileErr) {
          console.warn("Auth updateProfile warning:", profileErr);
        }

        const email = formData.email || user.email || "";
        savedProfile = {
          ...(memberProfile || {}),
          uid: user.uid,
          fullName: formData.name,
          name: formData.name,
          phone: formData.mobile,
          mobile: formData.mobile,
          email,
          city,
          state,
          location: formData.location,
          companyName: formData.agencyName,
          agencyName: formData.agencyName,
          reraNo: formData.licenseNumber,
          licenseNumber: formData.licenseNumber,
          experienceYears: formData.experience,
          experience: formData.experience,
          specialization: formData.specialization,
          memberType: memberProfile?.memberType || "realtor",
          selectedTier: tierKey,
          tier: tierKey,
          employeeId,
          photoUrl,
          photo: photoUrl,
          department,
          designation,
          verificationUrl,
          status: "ACTIVE",
          issuedDate,
          validTill,
        };

        // Timestamps are managed by saveMemberProfile; don't write back the cached values
        const { createdAt: _createdAt, updatedAt: _updatedAt, ...profileToSave } = savedProfile;
        await saveMemberProfile(user.uid, profileToSave);

        await saveIdCardRecord({
          employeeId,
          fullName: formData.name,
          name: formData.name,
          phone: formData.mobile,
          mobile: formData.mobile,
          email,
          location: formData.location,
          agencyName: formData.agencyName,
          licenseNumber: formData.licenseNumber,
          experience: formData.experience,
          specialization: formData.specialization,
          photoUrl,
          photo: photoUrl,
          cardTier: tierKey,
          department,
          designation,
          issuedDate,
          validTill,
          status: "ACTIVE",
          verificationUrl,
          uid: user.uid,
        });

        // A tier change issued a new ID: the old card's QR must stop verifying
        if (previousId && previousId !== employeeId) {
          await retireIdCardRecord(previousId, employeeId).catch((err) =>
            console.warn("Could not retire previous ID card:", err)
          );
        }
      }

      // Only update the signed-in session when the card belongs to the signed-in member
      if (isSelfMode && !issuedForSomeoneElse) {
        if (typeof window !== "undefined") {
          localStorage.setItem("rm_member_profile", JSON.stringify(savedProfile));
        }
        setMemberProfile(savedProfile);
      }
      onProfileUpdated?.(savedProfile);
      previewRequestRef.current++;
      setFormData((prev) => ({
        ...prev,
        employeeId: savedProfile.employeeId,
        photo: savedProfile.photoUrl || prev.photo,
        issuedDate: savedProfile.issuedDate,
        validTill: savedProfile.validTill,
        password: "",
        confirmPassword: "",
      }));
      setIsGenerated(true);
      setAuthSuccessMessage(
        isUpdate
          ? `✓ Official ID Card ${savedProfile.employeeId} updated and saved to realtime database!`
          : `✓ Official Member ID ${savedProfile.employeeId} generated and saved to realtime database!`
      );
      // Sync with Firestore in the background; the saved profile is already shown
      if (!issuedForSomeoneElse) {
        refreshProfile().catch(() => { });
      }
    } catch (err: any) {
      console.error("ID Card generation error:", err);
      let msg = "Could not complete registration. Please check your details.";
      if (err.code === "auth/email-already-in-use") {
        msg = "This email is already registered. Please enter your existing password to update your ID card.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only cards whose Member ID is actually registered can be exported — a previewed
  // (unsaved) ID would print a QR code that fails verification.
  const canExportCard =
    isGenerated ||
    (!!formData.employeeId &&
      (formData.employeeId === memberProfile?.employeeId || formData.employeeId === initialEmployee?.employeeId));

  const ensureExportable = () => {
    if (!formData.photo) {
      setPhotoError("⚠ Without a photo you will not get an ID card. Please take a photo or upload one from your gallery.");
      return false;
    }
    if (!canExportCard) {
      setPhotoError('Please click "Update & Generate Verified ID Card" first — the Member ID is only valid once saved.');
      return false;
    }
    setPhotoError(null);
    return true;
  };

  // High-Resolution CR80 PNG Download (Exact ID Card Print Size - No A4 margins)
  const handleDownloadPng = async () => {
    if (!ensureExportable()) return;

    try {
      setIsDownloading(true);
      const cardElement = document.getElementById("modal-realtors-id-card");
      if (!cardElement) throw new Error("ID card preview not found");

      // 1. Authoritative Photo Resolution: Always pull the exact active member picture from database
      let targetPhoto = formData.photo || (initialEmployee as any)?.photoUrl || initialEmployee?.photo;
      if (formData.employeeId) {
        try {
          const dbCard = await getIdCardRecord(formData.employeeId);
          if (dbCard && (dbCard.photoUrl || dbCard.photo)) {
            targetPhoto = dbCard.photoUrl || dbCard.photo || targetPhoto;
          }
        } catch (dbErr) {
          console.warn("Could not check idCards for fresh photo:", dbErr);
        }
      }

      // 2. Pre-fetch and inline image as base64 Data URL to bypass html-to-image internal cache
      if (targetPhoto && !targetPhoto.startsWith("data:")) {
        try {
          const inlinedDataUrl = await convertUrlToDataUrl(targetPhoto);
          if (inlinedDataUrl) {
            const photoImg =
              cardElement.querySelector<HTMLImageElement>('img[data-profile-photo="true"]') ||
              cardElement.querySelector<HTMLImageElement>('img[alt*="Photo"], img[alt*="Member"]');
            if (photoImg) {
              photoImg.src = inlinedDataUrl;
              await photoImg.decode().catch(() => { });
            }
          }
        } catch (convErr) {
          console.warn("Could not inline photo data URL before export:", convErr);
        }
      }

      const dataUrl = await toPng(cardElement, {
        quality: 1,
        pixelRatio: 3, // 300 DPI for crisp physical printing (1914 x 3048px)
        width: 638,
        height: 1016,
        cacheBust: true,
        includeQueryParams: true,
        style: {
          transform: "none",
          transformOrigin: "top left",
          position: "relative",
          left: "0",
          top: "0",
          borderRadius: "36px",
          clipPath: "inset(0 round 36px)",
          boxShadow: "none",
        },
      });

      const link = document.createElement("a");
      link.download = `realtors_media_id_${formData.employeeId}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Error generating ID card image:", err);
      alert("Failed to export ID Card. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = async () => {
    if (!ensureExportable()) return;

    try {
      setIsPrinting(true);
      const cardElement = document.getElementById("modal-realtors-id-card");
      if (!cardElement) {
        window.print();
        return;
      }

      // 1. Authoritative Photo Resolution: Always pull the exact active member picture from database
      let targetPhoto = formData.photo || (initialEmployee as any)?.photoUrl || initialEmployee?.photo;
      if (formData.employeeId) {
        try {
          const dbCard = await getIdCardRecord(formData.employeeId);
          if (dbCard && (dbCard.photoUrl || dbCard.photo)) {
            targetPhoto = dbCard.photoUrl || dbCard.photo || targetPhoto;
          }
        } catch (dbErr) {
          console.warn("Could not check idCards for fresh photo:", dbErr);
        }
      }

      // 2. Pre-fetch and inline image as base64 Data URL to bypass html-to-image internal cache
      if (targetPhoto && !targetPhoto.startsWith("data:")) {
        try {
          const inlinedDataUrl = await convertUrlToDataUrl(targetPhoto);
          if (inlinedDataUrl) {
            const photoImg =
              cardElement.querySelector<HTMLImageElement>('img[data-profile-photo="true"]') ||
              cardElement.querySelector<HTMLImageElement>('img[alt*="Photo"], img[alt*="Member"]');
            if (photoImg) {
              photoImg.src = inlinedDataUrl;
              await photoImg.decode().catch(() => { });
            }
          }
        } catch (convErr) {
          console.warn("Could not inline photo data URL before export:", convErr);
        }
      }

      const dataUrl = await toPng(cardElement, {
        quality: 1,
        pixelRatio: 3,
        width: 638,
        height: 1016,
        cacheBust: true,
        includeQueryParams: true,
        style: {
          transform: "none",
          transformOrigin: "top left",
          position: "relative",
          left: "0",
          top: "0",
          borderRadius: "36px",
          clipPath: "inset(0 round 36px)",
          boxShadow: "none",
        },
      });

      const printIframe = document.createElement("iframe");
      printIframe.style.position = "fixed";
      printIframe.style.right = "0";
      printIframe.style.bottom = "0";
      printIframe.style.width = "0";
      printIframe.style.height = "0";
      printIframe.style.border = "none";
      document.body.appendChild(printIframe);

      const iframeDoc = printIframe.contentWindow?.document;
      if (!iframeDoc) {
        printIframe.remove();
        window.print();
        return;
      }

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print ID Card - ${formData.employeeId}</title>
            <style>
              @page {
                size: 54mm 86mm;
                margin: 0;
              }
              html, body {
                margin: 0;
                padding: 0;
                width: 54mm;
                height: 86mm;
                background: #FFFFFF;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
              }
              .print-container {
                width: 54mm;
                height: 86mm;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                page-break-inside: avoid;
                break-inside: avoid;
                margin: 0;
                padding: 0;
              }
              img {
                width: 54mm;
                height: 86mm;
                aspect-ratio: 54 / 86;
                display: block;
                margin: 0;
                border-radius: 3.5mm;
                box-shadow: none;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <img src="${dataUrl}" alt="Realtors Media ID Card" />
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.focus();
                  window.print();
                  setTimeout(function() {
                    try {
                      window.parent.document.body.removeChild(window.frameElement);
                    } catch(e) {}
                  }, 1200);
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
      iframeDoc.close();
    } catch (err) {
      console.error("Print error:", err);
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  // Construct active employee object for live card render
  const previewEmployee: RealtorsMediaEmployee = {
    name: formData.name || "Realtor Name",
    designation: formData.agencyName || formData.specialization || TIER_DESIGNATION[selectedTier],
    employeeId: formData.employeeId,
    department: formData.specialization || formData.department || "Property Sales & Channel",
    location: formData.location || "City, State",
    issuedDate: formData.issuedDate,
    validTill: formData.validTill,
    photo: formData.photo,
    verificationUrl: `https://www.realtorsmedia.world/verify/${formData.employeeId}`,
    theme: selectedTier,
    phone: formData.mobile,
    email: formData.email,
    reraNumber: formData.licenseNumber,
    agencyName: formData.agencyName,
    specialization: formData.specialization,
    experience: formData.experience,
    licenseNumber: formData.licenseNumber,
  };

  const activePlan =
    cardTierPlans.find((p) => normalizeTier(p.tierTheme) === selectedTier) || cardTierPlans[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071E36]/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (isCameraActive) stopCamera();
          else onClose();
        }
      }}
    >
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-[#CBD5E1] overflow-hidden flex flex-col my-auto max-h-[96vh]">
        {/* ========================================================
            MODAL HEADER
           ======================================================== */}
        <div className="bg-[#073F73] px-4 py-2.5 sm:py-3 flex items-center justify-between text-white border-b border-[#0B4F8A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
              <FaIdCard className="text-[17px]" />
            </div>
            <div>
              <h2 className="text-[14px] sm:text-[16px] font-black uppercase tracking-wide flex items-center gap-2">
                <span>Verified Realtor ID Card Generator</span>
              </h2>
              <p className="text-[10.5px] sm:text-[11.5px] text-[#BAE6FD] font-medium leading-tight">
                Select your card tier, enter your details, and instantly generate your personalized ID Card
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isCameraActive) stopCamera();
              onClose();
            }}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <FaTimes className="text-[14px]" />
          </button>
        </div>

        {/* ========================================================
            TIER SELECTOR STRIP WITH PRICES
           ======================================================== */}
        <div className="bg-[#F8FAFC] px-3 sm:px-5 py-2 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[10px] font-black uppercase text-[#475569] mr-1 whitespace-nowrap">
              Selected Tier:
            </span>
            {cardTierPlans.map((plan) => {
              const isSelected = selectedTier === normalizeTier(plan.tierTheme);
              const isGreen = plan.tierTheme === "green";
              const isBlue = plan.tierTheme === "blue";

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handleTierChange(plan.tierTheme)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${isSelected
                      ? isGreen
                        ? "bg-[#059669] text-white border-[#047857] shadow-sm"
                        : isBlue
                          ? "bg-[#0284C7] text-white border-[#0369A1] shadow-sm"
                          : "bg-[#EA580C] text-white border-[#C2410C] shadow-sm"
                      : "bg-white text-[#334155] border-[#CBD5E1] hover:bg-gray-50"
                    }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : isGreen ? "bg-[#059669]" : isBlue ? "bg-[#0284C7]" : "bg-[#EA580C]"
                      }`}
                  />
                  <span>{plan.title}</span>
                  <span
                    className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-extrabold ${isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]"
                      }`}
                  >
                    {plan.price}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-extrabold text-[#0369A1] flex items-center gap-1 self-end sm:self-auto">
            <FaShieldAlt className="text-[#0284C7]" />
            <span>Commission: {activePlan.commission}</span>
          </div>
        </div>

        {/* ========================================================
            MODAL BODY: 2-COLUMN DUAL PANE LAYOUT
           ======================================================== */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-[#F1F5F9]">
          {/* LEFT COLUMN: FORM DETAILS (7 Cols on LG) */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-[#CBD5E1] p-3 sm:p-4.5 shadow-xs flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <h3 className="text-[13px] font-black uppercase text-[#073F73] tracking-wide flex items-center gap-1.5">
                <FaUserCheck className="text-[#0284C7]" />
                <span>Enter Realtor / Member Details</span>
              </h3>
              <span className="text-[10px] text-[#64748B] font-bold">
                Updates Live on Preview →
              </span>
            </div>

            <form
              onSubmit={handleGenerateCard}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                  e.preventDefault();
                }
              }}
              className="space-y-3"
            >
              {/* Full Name */}
              <div>
                <label className="block text-[10.5px] font-black uppercase text-[#334155] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Name"
                  className="w-full px-2.5 py-1.5 text-[12px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent bg-[#FAFBFD]"
                />
              </div>

              {/* Mobile No. & Email ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-black uppercase text-[#334155] mb-1">
                    Mobile No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
                    placeholder="+91 00000 00000"
                    className="w-full px-2.5 py-1.5 text-[12px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent bg-[#FAFBFD]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-black uppercase text-[#334155] mb-1">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full px-2.5 py-1.5 text-[12px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent bg-[#FAFBFD]"
                  />
                </div>
              </div>

              {/* Area / Location & Agency Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-black uppercase text-[#334155] mb-1">
                    Area / Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Area or locality"
                    className="w-full px-2.5 py-1.5 text-[12px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent bg-[#FAFBFD]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-black uppercase text-[#334155] mb-1">
                    Agency Name
                  </label>
                  <input
                    type="text"
                    value={formData.agencyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, agencyName: e.target.value }))}
                    placeholder="Agency or firm name (optional)"
                    className="w-full px-2.5 py-1.5 text-[12px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent bg-[#FAFBFD]"
                  />
                </div>
              </div>

              {/* License No. & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-black uppercase text-[#334155] mb-1">
                    License No.
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                    placeholder="RERA / License number (optional)"
                    className="w-full px-2.5 py-1.5 text-[12px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-[#FAFBFD]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-black uppercase text-[#334155] mb-1">
                    Experience
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                    className="w-full px-2.5 py-1.5 text-[12px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-[#FAFBFD] cursor-pointer"
                  >
                    <option value="">Select</option>
                    {EXPERIENCE_OPTIONS.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-[10.5px] font-black uppercase text-[#334155] mb-1">
                  Specialization
                </label>
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData((prev) => ({ ...prev, specialization: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                  className="w-full px-2.5 py-1.5 text-[12px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-[#FAFBFD] cursor-pointer"
                >
                  <option value="">Select</option>
                  {SPECIALIZATION_OPTIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Create Password & Confirm Password (only when creating a new member login) */}
              {!isSelfMode && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-black uppercase text-[#334155] mb-1">
                      Create Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Min. 6 characters"
                        className="w-full px-2.5 py-1.5 pr-8 text-[12px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent bg-[#FAFBFD]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-[12px] cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-black uppercase text-[#334155] mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      className="w-full px-2.5 py-1.5 text-[12px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent bg-[#FAFBFD]"
                    />
                  </div>
                </div>
              )}

              {/* Photo Section */}
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-black uppercase text-[#334155] flex items-center gap-1.5">
                    <FaCamera className="text-[#0284C7]" />
                    <span>Photo <span className="text-red-500">*</span></span>
                  </span>
                  <span className="text-[9px] font-medium text-[#64748B]">
                    PNG/JPG • auto-compressed
                  </span>
                </div>

                {/* Photo Action Buttons: Take Photo & Upload from Gallery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="px-3 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-black rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaCamera className="text-[11px]" />
                    <span>Take Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-white hover:bg-[#F0F9FF] border border-[#CBD5E1] text-[#073F73] text-[11px] font-black rounded-md shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaImage className="text-[12px] text-[#0284C7]" />
                    <span>Upload from Gallery</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Direct Photo URL Input */}
                <div className="pt-0.5">
                  <input
                    type="url"
                    value={formData.photo.startsWith("data:") ? "" : formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full px-2.5 py-1.5 text-[11px] border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white font-medium text-gray-700"
                  />
                </div>

                {/* Photo Preview Thumbnail & Status */}
                {formData.photo && (
                  <div className="flex items-center gap-3 pt-1 border-t border-[#E2E8F0]">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-[#0284C7] bg-white shadow-xs flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getSafePhotoUrl(formData.photo)}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10.5px] font-black text-[#065F46] flex items-center gap-1">
                        <FaCheck className="text-[9.5px]" /> Photo Attached
                      </span>
                      <span className="text-[9px] text-[#64748B]">
                        Live on card preview
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, photo: "" }))}
                        className="text-[9.5px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer bg-red-50 hover:bg-red-100 px-2 py-1 rounded border border-red-200"
                        title="Remove photo"
                      >
                        <FaTrash className="text-[8.5px]" /> Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Mandatory Warning Note */}
                <div className="p-2 bg-[#FFFBEB] border border-[#FDE68A] rounded-md flex items-center gap-2 text-[#92400E]">
                  <FaExclamationTriangle className="text-[12px] text-[#D97706] flex-shrink-0" />
                  <span className="text-[10.5px] font-bold leading-tight">
                    ⚠ Without a photo you will not get an ID card.
                  </span>
                </div>

                {photoError && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-md text-[10.5px] font-bold text-red-700 flex items-center gap-1.5">
                    <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                    <span>{photoError}</span>
                  </div>
                )}
              </div>

              {/* MEMBER ID (AUTO-GENERATED) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-black uppercase text-[#475569] flex items-center gap-1">
                      <span>MEMBER ID (AUTO-GENERATED)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRegenerateId(selectedTier)}
                      className="text-[9px] font-extrabold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FaSyncAlt className="text-[8px]" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                    placeholder="e.g. RM-A-1116"
                    className="w-full px-2.5 py-1.5 text-[11.5px] font-mono font-bold text-[#073F73] bg-[#FAFBFD] border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <span className="text-[9.5px] text-[#64748B] font-medium leading-tight">
                    Unique Member ID linked to your chosen card tier & verification QR code.
                  </span>
                </div>
              </div>

              {/* Auth Error Banner */}
              {authError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-md text-[11px] font-bold text-red-700 flex items-start gap-2">
                  <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Confirmation / Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-3 rounded-md bg-[#073F73] hover:bg-[#052E54] disabled:bg-gray-400 text-white text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin text-[12px]" />
                      <span>Compressing Photo & Generating Verified ID...</span>
                    </>
                  ) : (
                    <span>UPDATE & GENERATE VERIFIED ID CARD</span>
                  )}
                </button>
              </div>

              {/* Success Notification & Portal Link */}
              {isGenerated && (
                <div className="p-3.5 bg-[#ECFDF5] border border-[#10B981] rounded-lg space-y-2 text-[12px] text-[#065F46] animate-fade-in shadow-xs">
                  <div className="flex items-center gap-2 font-black text-sm">
                    <FaCheck className="text-[#059669] text-base shrink-0" />
                    <span>{authSuccessMessage || `ID Card & Member Record Created Successfully! Assigned ID: ${formData.employeeId}`}</span>
                  </div>
                  <p className="text-[11px] text-[#047857] font-medium leading-relaxed">
                    Your official CR80 card is active in the database. You can now download the high-resolution PNG, print, or review the card on the right.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#A7F3D0]">
                    <button
                      type="button"
                      onClick={handleDownloadPng}
                      className="bg-[#059669] hover:bg-[#047857] text-white text-[11px] font-black px-3.5 py-1.5 rounded transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <FaDownload className="text-[10px]" />
                      <span>Download ID Card PNG</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-black px-3.5 py-1.5 rounded transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <FaPrint className="text-[10px]" />
                      <span>Print (86x54mm)</span>
                    </button>
                    {/* The dashboard shows the signed-in account, not a card issued for someone else */}
                    {(isSelfMode || !user) && (
                      <Link
                        href="/dashboard"
                        onClick={() => onClose()}
                        className="bg-white hover:bg-gray-50 text-[#073F73] border border-[#CBD5E1] text-[11px] font-bold px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <span>Go to Dashboard</span>
                        <FaArrowRight className="text-[10px]" />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT COLUMN: LIVE CARD PREVIEW & EXPORT (5 Cols on LG) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start space-y-3">
            <div className="w-full bg-white rounded-lg border border-[#CBD5E1] p-3 sm:p-4 shadow-xs flex flex-col items-center">
              {/* Preview Header */}
              <div className="w-full flex items-center justify-between border-b border-[#E2E8F0] pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${selectedTier === "green"
                        ? "bg-[#059669]"
                        : selectedTier === "blue"
                          ? "bg-[#0284C7]"
                          : "bg-[#EA580C]"
                      }`}
                  />
                  <span className="text-[11.5px] font-black uppercase text-[#0F172A]">
                    Live CR80 Card Preview
                  </span>
                </div>
                <span className="text-[9.5px] font-bold text-[#0369A1] bg-[#E0F2FE] px-2 py-0.5 rounded-full">
                  {activePlan.price} Tier
                </span>
              </div>

              {/* Physical Card Container */}
              <div
                ref={cardContainerRef}
                className="w-full max-w-[280px] sm:max-w-[310px] drop-shadow-xl"
              >
                <RealtorsMediaIdCard
                  id="modal-realtors-id-card"
                  employee={previewEmployee}
                  theme={selectedTier}
                />
              </div>

              {/* QR Verification details pill */}
              <div className="w-full mt-3 p-2 bg-[#F8FAFC] rounded-md border border-[#E2E8F0] flex items-center justify-between text-[9.5px]">
                <div className="flex items-center gap-1.5 text-[#334155] font-bold">
                  <FaQrcode className="text-[#0284C7] text-[12px]" />
                  <span>QR Verifies:</span>
                </div>
                <span className="font-mono text-[#073F73] font-extrabold truncate max-w-[150px]">
                  {previewEmployee.employeeId}
                </span>
              </div>

              {/* Download & Print Action Buttons */}
              <div className="w-full grid grid-cols-2 gap-2 mt-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="w-full py-2 px-2 rounded-md border border-[#073F73] text-[#073F73] hover:bg-[#EEF6FC] font-extrabold text-[11.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <FaPrint className="text-[12px]" />
                  <span>{isPrinting ? "Preparing..." : "Print Card"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={isDownloading}
                  className="w-full py-2 px-2 rounded-md bg-[#073F73] hover:bg-[#06335C] text-white font-black text-[11.5px] flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {downloadSuccess ? (
                    <>
                      <FaCheck className="text-[12px] text-[#4ADE80]" />
                      <span>Card Saved!</span>
                    </>
                  ) : (
                    <>
                      <FaDownload className="text-[12px]" />
                      <span>{isDownloading ? "Rendering..." : "Download PNG"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* CR80 Specs Badge */}
            <div className="w-full text-center text-[10px] text-[#64748B] font-medium">
              CR80 Card Standard: 54mm × 85.6mm • 300 DPI Export Ready
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          LIVE CAMERA CAPTURE OVERLAY WITH FRONT & BACK SWITCH
         ======================================================== */}
      {isCameraActive && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xs p-3">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-300">
            {/* Camera Header */}
            <div className="bg-[#073F73] text-white px-4 py-3 flex items-center justify-between">
              <span className="text-[13px] font-black uppercase tracking-wide flex items-center gap-2">
                <FaCamera className="text-[#38BDF8]" />
                <span>Take Realtor Photo</span>
              </span>

              <div className="flex items-center gap-2">
                {/* Switch Camera in Header */}
                <button
                  type="button"
                  onClick={toggleCamera}
                  disabled={isSwitchingCamera}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white rounded-md text-[11px] font-bold transition-all cursor-pointer border border-white/20 disabled:opacity-50"
                  title={`Switch to ${facingMode === "user" ? "Back" : "Front"} Camera`}
                >
                  <FaSyncAlt className={`text-[10px] ${isSwitchingCamera ? "animate-spin" : ""}`} />
                  <span>{facingMode === "user" ? "Back Camera" : "Front Camera"}</span>
                </button>

                <button
                  type="button"
                  onClick={stopCamera}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Cancel & close camera"
                >
                  <FaTimes className="text-[12px]" />
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col items-center">
              {cameraError ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-700 font-semibold text-center my-4">
                  <FaExclamationTriangle className="text-red-500 mx-auto text-[20px] mb-2" />
                  <p>{cameraError}</p>
                </div>
              ) : (
                <div className="relative w-full aspect-square max-w-[280px] bg-black rounded-lg overflow-hidden border-2 border-[#0284C7] shadow-inner mb-3">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                    className="w-full h-full object-cover"
                  />

                  {/* Active Camera Indicator Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9.5px] font-bold backdrop-blur-sm border border-white/20 shadow-xs">
                    {facingMode === "user" ? "🤳 Front Camera" : "📷 Back Camera"}
                  </div>

                  {/* Floating Flip Camera Quick Button */}
                  <button
                    type="button"
                    onClick={toggleCamera}
                    disabled={isSwitchingCamera}
                    className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 hover:bg-black/85 text-white text-[10px] font-bold backdrop-blur-md border border-white/30 shadow-md transition-transform active:scale-95 cursor-pointer"
                    title={`Switch to ${facingMode === "user" ? "Back" : "Front"} Camera`}
                  >
                    <FaSyncAlt className={`text-[10px] text-[#38BDF8] ${isSwitchingCamera ? "animate-spin" : ""}`} />
                    <span>{facingMode === "user" ? "Switch to Back" : "Switch to Front"}</span>
                  </button>

                  {/* Visual Portrait Frame Overlay */}
                  <div className="absolute inset-0 border-2 border-white/20 rounded-lg pointer-events-none flex items-center justify-center">
                    <div className="w-44 h-52 border-2 border-dashed border-white/70 rounded-2xl pointer-events-none shadow-xs" />
                  </div>
                  <div className="absolute bottom-2 inset-x-0 text-center">
                    <span className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full font-medium">
                      Align your face within the frame
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons: Cancel, Switch Camera, Snap Photo */}
              <div className="flex items-center gap-2 w-full mt-1">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="py-2 px-3 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-[11.5px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                {!cameraError && (
                  <>
                    <button
                      type="button"
                      onClick={toggleCamera}
                      disabled={isSwitchingCamera}
                      className="py-2 px-2.5 rounded-md bg-[#EEF6FC] hover:bg-[#E0EFFB] text-[#073F73] font-bold text-[11px] flex items-center justify-center gap-1.5 border border-[#A5CEE8] transition-colors cursor-pointer"
                      title="Flip front / back camera"
                    >
                      <FaSyncAlt className={`text-[10px] ${isSwitchingCamera ? "animate-spin" : ""}`} />
                      <span>{facingMode === "user" ? "Back Camera" : "Front Camera"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 py-2 px-3 rounded-md bg-[#059669] hover:bg-[#047857] text-white font-black text-[11.5px] flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
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
    </div>
  );
};
