import ChatWindow from "@/components/messaging/ChatWindow";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-2xl mx-auto h-[80vh] p-4 border rounded-lg bg-white dark:bg-neutral-900">
      <ChatWindow otherUserId={params.id} />
    </div>
  );
}
