export default function NotificationItem({ n }: { n: any }) {
  return (
    <div className="p-3 border-b dark:border-neutral-700 flex gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
        🔔
      </div>
      <div className="flex-1">
        <p className="text-sm">{n.message}</p>
        <p className="text-xs text-gray-500">
          {new Date(n.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
