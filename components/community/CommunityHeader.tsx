export default function CommunityHeader({ community }: { community: any }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-300">
        {community.banner_url ? (
          <img src={community.banner_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            {community.name?.charAt(0) || "C"}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{community.name}</h1>
        <p className="text-gray-600 text-sm">{community.description}</p>
        <p className="text-xs text-gray-500 mt-1">
          {community.member_count || 0} members
        </p>
      </div>
    </div>
  );
}
