import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

export default function CommentCount({ count }: Readonly<{ count: number }>) {
  return (
    <div className="flex flex-row items-center">
      <p className="font-black">{count}</p>
      <ChatBubbleLeftIcon className="ml-1.5 h-6 w-6" />
    </div>
  );
}
