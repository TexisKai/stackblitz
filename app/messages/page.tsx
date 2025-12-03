import ChatList from "@/components/messaging/ChatList";

export default function Page() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Messages</h1>
      <ChatList />
    </div>
  );
}
