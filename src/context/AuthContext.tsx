"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { subscribeToAuthState, logoutMember } from "@/lib/firebase/auth";
import { getMemberProfile, MemberProfileData } from "@/lib/firebase/db";

interface AuthContextType {
  user: User | null;
  memberProfile: MemberProfileData | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  memberProfile: null,
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
      setMemberProfile(profile);
    } catch (err) {
      console.warn("Error fetching member profile:", err);
    }
  };

  useEffect(() => {
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
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid, user.email);
    }
  };

  return (
    <AuthContext.Provider value={{ user, memberProfile, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
