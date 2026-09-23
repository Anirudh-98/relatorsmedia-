"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaLock, FaKey, FaCheckCircle, FaArrowLeft, FaShieldAlt, FaPhoneAlt } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [step, setStep] = useState<"request" | "verify" | "reset" | "success">("request");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("verify");
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto-focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("reset");
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 800);
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
              {step === "request" && "Password Recovery"}
              {step === "verify" && "Verify OTP"}
              {step === "reset" && "Set New Password"}
              {step === "success" && "Password Reset Successful"}
            </h2>
            <p className="text-[11px] text-gray-200 mt-1">
              Realtors Media Secure Member Verification
            </p>
          </div>

          <div className="p-6">
            {/* Step 1: Identifier Input */}
            {step === "request" && (
              <form onSubmit={handleRequestOtp} className="space-y-4 text-[12px]">
                <p className="text-gray-600 leading-relaxed">
                  Enter your registered <strong>Member ID</strong> (e.g. <code>RM-B-1111</code>) or your registered <strong>Mobile Number</strong> to receive an instant verification code.
                </p>

                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">
                    Member ID or Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. RM-B-1111 or 9849012345"
                    className="w-full px-3 py-2 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#073F73] hover:bg-[#06345F] text-white font-black py-2.5 rounded-[3px] uppercase tracking-wider transition-colors"
                >
                  {loading ? "Sending OTP..." : "Send Verification OTP"}
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

            {/* Step 2: OTP Verification */}
            {step === "verify" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-[12px]">
                <p className="text-gray-600 leading-relaxed text-center">
                  We sent a 4-digit verification code to the mobile number linked with{" "}
                  <strong className="text-[#073F73]">{identifier || "your account"}</strong>.
                </p>

                <div className="flex justify-center gap-3 my-4">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-black border-2 border-[#C9D7E3] rounded-[4px] focus:border-[#073F73] focus:outline-none"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#073F73] hover:bg-[#06345F] text-white font-black py-2.5 rounded-[3px] uppercase tracking-wider transition-colors"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>

                <div className="text-center text-[11px] text-gray-500">
                  Didn't receive code?{" "}
                  <button
                    type="button"
                    onClick={() => setStep("request")}
                    className="text-[#073F73] font-bold hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4 text-[12px]">
                <p className="text-gray-600">
                  Enter your new password below. Make sure it contains at least 8 characters.
                </p>

                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#143B5D] mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#168A3A] hover:bg-[#126f2f] text-white font-black py-2.5 rounded-[3px] uppercase tracking-wider transition-colors"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}

            {/* Step 4: Success */}
            {step === "success" && (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-[#168A3A] rounded-full flex items-center justify-center mx-auto text-3xl">
                  <FaCheckCircle />
                </div>
                <h3 className="text-[16px] font-black text-[#073F73]">
                  Password Reset Successfully!
                </h3>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  Your credentials have been securely updated. You can now log in using your new credentials.
                </p>
                <div className="pt-2">
                  <Link
                    href="/dashboard"
                    className="w-full inline-block bg-[#073F73] hover:bg-[#06345F] text-white text-[12px] font-black py-2.5 rounded-[3px] uppercase tracking-wider transition-colors"
                  >
                    Go to Member Dashboard
                  </Link>
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
