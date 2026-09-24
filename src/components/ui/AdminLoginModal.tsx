"use client";

import React, { useState } from "react";
import { FaShieldAlt, FaLock, FaTimes, FaSpinner, FaExclamationTriangle, FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const loggedUser = userCredential.user;

      // Verify that this user is the authorized admin
      const authorizedAdmin = "admin@relatormedia.com";
      if (loggedUser.email?.toLowerCase().trim() !== authorizedAdmin.toLowerCase()) {
        setError(`Access Denied: ${loggedUser.email} is not authorized. Please log in with ${authorizedAdmin}.`);
        setLoading(false);
        return;
      }

      // Success - grant access to ID Card generator
      setPassword("");
      setError(null);
      onSuccess();
    } catch (err: any) {
      console.error("Admin login error:", err);
      let msg = "Invalid credentials. Please verify your email and password.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        msg = "Incorrect password. Please try again.";
      } else if (err.code === "auth/user-not-found") {
        msg = "Admin account not found in Firebase. Please check the email address.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Please wait a moment and try again.";
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071E36]/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-[#CBD5E1] overflow-hidden animate-fade-in my-auto">
        {/* Modal Header */}
        <div className="bg-[#073F73] px-5 py-4 flex items-center justify-between text-white border-b border-[#0B4F8A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F7C900] text-[#073F73] flex items-center justify-center text-sm font-bold shadow-xs">
              <FaShieldAlt className="text-base" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide">
                Admin Authorization Required
              </h3>
              <p className="text-[11px] text-[#BAE6FD] font-medium leading-tight">
                Verify credentials to access the ID card generator
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleAdminLogin} className="p-5 sm:p-6 space-y-4">
          <div className="p-3 bg-[#EEF6FC] border border-[#BFDBFE] rounded-lg text-[11.5px] text-[#073F73] leading-relaxed">
            <strong className="block font-black uppercase text-[10px] text-[#0369A1] tracking-wider mb-0.5">
              Restricted Console Access
            </strong>
            Generating and configuring official Realtors Media ID cards requires administrator sign-in.
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-700 flex items-start gap-2 animate-fade-in">
              <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                Admin Email ID
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full px-3 py-2 text-xs font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#073F73] bg-[#FAFBFD]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-3 py-2 pr-9 text-xs font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#073F73] bg-[#FAFBFD]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#073F73] hover:bg-[#052E54] disabled:opacity-50 text-white text-xs font-black uppercase py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-xs" />
                  <span>Verifying Admin Credentials...</span>
                </>
              ) : (
                <>
                  <FaLock className="text-xs" />
                  <span>Verify & Access ID Generator</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
