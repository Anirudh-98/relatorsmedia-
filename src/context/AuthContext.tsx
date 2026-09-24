"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { subscribeToAuthState, logoutMember } from "@/lib/firebase/auth";
import { getMemberProfile, MemberProfileData } from "@/lib/firebase/db";

interface AuthContextType {
  user: User | null;
  memberProfile: MemberProfileData | null;
  setMemberProfile: React.Dispatch<React.SetStateAction<MemberProfileData | null>>;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: (targetUser?: User | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  memberProfile: null,
  setMemberProfile: () => {},
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [memberProfile, setMemberProfile] = useState<MemberProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string, email?: string | null) => {
    try {
      const profile = await getMemberProfile(uid, email);
      if (profile) {
        setMemberProfile(profile);
        if (typeof window !== "undefined") {
          localStorage.setItem("rm_member_profile", JSON.stringify(profile));
        }
      }
      return profile;
    } catch (err) {
      console.warn("Error fetching member profile:", err);
      return null;
    }
  };

  useEffect(() => {
    // Immediate hydration from cache for instant dashboard rendering
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("rm_member_profile");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed?.employeeId) {
            setMemberProfile(parsed);
          }
        } catch {}
      }
    }

    const unsubscribe = subscribeToAuthState(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid, currentUser.email);
      } else {
        setMemberProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await logoutMember();
    setUser(null);
    setMemberProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("rm_member_profile");
      localStorage.removeItem("rm_last_member");
    }
  };

  const refreshProfile = async (targetUser?: User | null) => {
    const activeUser = targetUser || user || auth.currentUser;
    if (activeUser) {
      setUser(activeUser);
      await fetchProfile(activeUser.uid, activeUser.email);
    }
  };

  return (
    <AuthContext.Provider value={{ user, memberProfile, setMemberProfile, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
