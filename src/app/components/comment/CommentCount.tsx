import { Chat as ChatIcon } from "@phosphor-icons/react/dist/ssr";

export default function CommentCount({ count }: Readonly<{ count: number }>) {
  return (
    <div className="flex flex-row items-center">
      <p className="font-black">{count}</p>
      <ChatIcon size={23} className="ml-1.5 h-6 w-6" />
    </div>
  );
}
