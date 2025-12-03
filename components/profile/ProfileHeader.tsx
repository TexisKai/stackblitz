export default function ProfileHeader({ profile }: { profile: any }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-300">
            {profile.display_name?.charAt(0) || "U"}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold">
          {profile.display_name}
        </h2>
        <p className="text-gray-600 text-sm">{profile.bio}</p>
      </div>
    </div>
  );
}
