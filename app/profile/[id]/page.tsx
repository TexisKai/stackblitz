import ProfileView from "@/components/profile/ProfileView";

export default function Page({ params }: { params: { id: string } }) {
  return <ProfileView userId={params.id} />;
}
