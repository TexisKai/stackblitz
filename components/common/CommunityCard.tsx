// components/common/CommunityCard.tsx
"use client";

import JoinCommunityButton from "@/components/community/JoinCommunityButton";

type Props = {
  community: {
    id: string;
    name: string;
    description?: string;
    banner_url?: string | null;
    member_count?: number;
  };
};

export default function CommunityCard({ community }: Props) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:shadow-sm transition-shadow">
      <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        {community.banner_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={community.banner_url} alt={community.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-300 to-indigo-500 flex items-center justify-center text-white font-semibold">
            {community.name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-medium truncate">{community.name}</h4>
            <p className="text-xs text-gray-500 truncate">{community.description ?? "A community for students"}</p>
          </div>
          <div className="flex-shrink-0">
            <JoinCommunityButton communityId={community.id} />
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">{(community.member_count ?? 0) + " members"}</div>
      </div>
    </div>
  );
}
