"use client";

import React from "react";
import TrendingPostsWidget from "@/components/widgets/TrendingPostsWidget";
import ClubsWidget from "@/components/widgets/ClubsWidget";
import ActivityWidget from "@/components/widgets/ActivityWidget";
import RecommendedCommunitiesWidget from "@/components/widgets/RecommendedCommunitiesWidget";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Explore</h1>
        <p className="text-gray-600 mt-2">
          Discover trending posts, popular clubs, and active communities
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <TrendingPostsWidget />
          <ActivityWidget />
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          <ClubsWidget />
          <RecommendedCommunitiesWidget />
        </aside>
      </section>
    </div>
  );
}