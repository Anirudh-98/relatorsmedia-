"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaLock, FaCheckCircle, FaArrowLeft, FaPhoneAlt, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { resetMemberPassword } from "@/lib/firebase/auth";

// "rohan.d@gmail.com" -> "ro*****@gmail.com"
const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}${"*".repeat(Math.max(local.length - 2, 3))}@${domain}`;
};

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [step, setStep] = useState<"request" | "success">("request");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Where the link was sent; masked when the member searched by Member ID
  const [sentTo, setSentTo] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const value = identifier.trim();
      // The link goes to the email registered in the database, never to what was typed
      const registeredEmail = await resetMemberPassword(value);
      setSentTo(value.includes("@") ? registeredEmail : maskEmail(registeredEmail));
      setStep("success");
    } catch (caught) {
      const err = caught as { code?: string; message?: string };
      console.error("Password reset error:", err);
      let msg = "Could not send the password reset link. Please try again.";
      if (err.code === "app/member-not-found" || err.code === "auth/user-not-found") {
        msg = "This email or Member ID is not registered with Realtors Media. Please check and try again.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many reset requests. Please wait a few minutes and try again.";
      } else if (err.code === "auth/network-request-failed") {
        msg = "Network error. Please check your connection and try again.";
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout
      title="ACCOUNT RECOVERY & PASSWORD RESET"
      subtitle="Secure recovery for Realtors Media registered members and authorized channel associates"
      breadcrumbs={[{ label: "Forgot Password" }]}
    >
      <div className="max-w-md mx-auto my-6">
        <div className="bg-white rounded-[4px] border border-[#C9D7E3] shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-[#073F73] px-5 py-4 text-white text-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 text-xl text-[#F7C900]">
              <FaLock />
            </div>
            <h2 className="text-[16px] font-black uppercase tracking-wider">
              {step === "request" ? "Password Recovery" : "Reset Link Dispatched"}
            </h2>
            <p className="text-[11px] text-gray-200 mt-1">
              Realtors Media Secure Member Verification
            </p>
          </div>

          <div className="p-6">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-[11.5px] text-red-700 flex items-start gap-2">
                <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Identifier Input */}
            {step === "request" && (
              <form onSubmit={handleRequestReset} className="space-y-4 text-[12px]">
                <p className="text-gray-600 leading-relaxed">
                  Enter your registered <strong>Email Address</strong> or <strong>Member ID</strong> to receive an official password reset link directly to your inbox.
                </p>

                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">
                    Registered Email or Member ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. rohan@deshmukh.com or RM-B-2026"
                    className="w-full px-3 py-2 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#073F73] hover:bg-[#06345F] disabled:bg-gray-400 text-white font-black py-2.5 rounded-[3px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-[12px]" />
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <span>Send Password Reset Email</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <Link
                    href="/dashboard"
                    className="text-[#073F73] font-bold text-[11.5px] hover:underline flex items-center justify-center gap-1.5"
                  >
                    <FaArrowLeft className="text-[10px]" />
                    <span>Back to Member Login</span>
                  </Link>
                </div>
              </form>
            )}

            {/* Step 2: Success */}
            {step === "success" && (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-[#168A3A] rounded-full flex items-center justify-center mx-auto text-3xl">
                  <FaCheckCircle />
                </div>
                <h3 className="text-[16px] font-black text-[#073F73]">
                  Password Reset Email Sent!
                </h3>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  We have sent a password reset link to your registered email <strong>{sentTo}</strong>. Please check your inbox and spam folder, then click the link to choose your new password.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    className="w-full inline-block bg-[#073F73] hover:bg-[#06345F] text-white text-[12px] font-black py-2.5 rounded-[3px] uppercase tracking-wider transition-colors"
                  >
                    Return to Login
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("request");
                      setIdentifier("");
                      setSentTo("");
                    }}
                    className="text-[11px] text-gray-500 hover:text-gray-800 font-semibold"
                  >
                    Send to a different email
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help box */}
          <div className="bg-[#F8FAFC] border-t border-gray-100 p-4 text-[11px] text-gray-600 flex items-center gap-3">
            <FaPhoneAlt className="text-[#073F73] text-lg flex-shrink-0" />
            <div>
              <span className="font-bold text-[#143B5D] block">Need assistance from support?</span>
              Call member helpline at <strong>+91 98490 12345</strong> or email <strong>support@realtorsmedia.com</strong>.
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
