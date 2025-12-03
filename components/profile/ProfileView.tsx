"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import ProfileHeader from "./ProfileHeader";
import BadgeDisplay from "./BadgeDisplay";
import SkillsDisplay from "./SkillsDisplay";

export default function ProfileView({ userId }: { userId: string }) {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error) setProfile(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, [userId]);

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <ProfileHeader profile={profile} />
      <BadgeDisplay badges={profile.badges || []} />
      <SkillsDisplay skills={profile.skills || []} />
    </div>
  );
}
