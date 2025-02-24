import { ExtendedNotificationData } from "@/app/lib/notifications";
import { RenderMentions } from "@/app/utils/mentions";
import { useRouter } from "next/navigation";
import Timestamp from "../post/Timestamp";
import MiniComment from "./MiniComment";
import MiniPost from "./MiniPost";

type Props = {
  notificationData: ExtendedNotificationData;
  markRead: () => void;
};

export default function Notification({
  notificationData,
  markRead,
}: Readonly<Props>) {
  const router = useRouter();

  const handleClick = () => {
    markRead();

    router.push(notificationData.link ?? "");
  };

  return (
    <div
      className={`border-x-1 border-t-1 border-neutral-700 ${notificationData.viewed ? "transparent" : "bg-neutral-600"} transition-al flex w-full cursor-pointer flex-col justify-start p-4 text-left`}
      onClick={handleClick}
    >
      <p className="mb-1.5 font-medium">
        {<RenderMentions text={notificationData.message} />}
      </p>
      {notificationData.post && <MiniPost post={notificationData.post} />}
      {notificationData.comment && (
        <MiniComment comment={notificationData.comment} />
      )}
      <Timestamp date={notificationData.created_at} />
    </div>
  );
}
