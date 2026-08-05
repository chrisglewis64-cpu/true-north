"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import {
  completeOnboarding,
  fetchProfile,
  updateProfileDisplayName,
} from "@/lib/data/profiles";
import {
  fetchStandards,
  replaceStandards,
} from "@/lib/data/standards";
import type { Profile } from "@/types/profile";
import type { Standard } from "@/types/standard";

type ProfileContextValue = {
  profile: Profile | null;
  standards: Standard[];
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<boolean>;
  saveStandards: (statements: string[]) => Promise<boolean>;
  finishOnboarding: () => Promise<boolean>;
  standardStatements: string[];
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setStandards([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const [nextProfile, nextStandards] = await Promise.all([
      fetchProfile(supabase, user.id),
      fetchStandards(supabase, user.id),
    ]);

    setProfile(nextProfile);
    setStandards(nextStandards);
    setIsLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user) {
        if (!cancelled) {
          setProfile(null);
          setStandards([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);

      const [nextProfile, nextStandards] = await Promise.all([
        fetchProfile(supabase, user.id),
        fetchStandards(supabase, user.id),
      ]);

      if (cancelled) {
        return;
      }

      setProfile(nextProfile);
      setStandards(nextStandards);
      setIsLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [supabase, user]);

  const updateDisplayName = useCallback(
    async (displayName: string) => {
      if (!user) {
        return false;
      }

      const next = await updateProfileDisplayName(
        supabase,
        user.id,
        displayName,
      );
      if (!next) {
        return false;
      }

      setProfile(next);
      return true;
    },
    [supabase, user],
  );

  const saveStandards = useCallback(
    async (statements: string[]) => {
      if (!user) {
        return false;
      }

      const next = await replaceStandards(supabase, user.id, statements);
      setStandards(next);
      return true;
    },
    [supabase, user],
  );

  const finishOnboarding = useCallback(async () => {
    if (!user) {
      return false;
    }

    const next = await completeOnboarding(supabase, user.id);
    if (!next) {
      return false;
    }

    setProfile(next);
    return true;
  }, [supabase, user]);

  const standardStatements = useMemo(
    () => standards.map((standard) => standard.statement),
    [standards],
  );

  const value = useMemo(
    () => ({
      profile,
      standards,
      isLoading,
      refreshProfile,
      updateDisplayName,
      saveStandards,
      finishOnboarding,
      standardStatements,
    }),
    [
      profile,
      standards,
      isLoading,
      refreshProfile,
      updateDisplayName,
      saveStandards,
      finishOnboarding,
      standardStatements,
    ],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}
