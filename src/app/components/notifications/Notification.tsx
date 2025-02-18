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
      className={`m-1.5 rounded-lg ${notificationData.viewed ? "bg-neutral-800" : "bg-neutral-600"} transition-al flex w-full cursor-pointer flex-col justify-start p-4 text-left`}
      onClick={handleClick}
      role="button"
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
