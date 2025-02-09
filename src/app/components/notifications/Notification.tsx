import { ExtendedNotificationData } from "@/app/lib/notifications";
import { RenderMentions } from "@/app/utils/mentions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import MiniComment from "./MiniComment";
import MiniPost from "./MiniPost";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  notificationData: ExtendedNotificationData;
};

export default function Notification({ notificationData }: Readonly<Props>) {
  const userTimezone = dayjs.tz.guess();

  console.log("notification: ", notificationData);

  return (
    <Link
      key={notificationData.notification_id}
      href={notificationData.link ?? ""}
      className="w-full"
    >
      <div className="group m-1.5 rounded-lg bg-neutral-800 p-4 transition-all">
        <p className="mb-1.5 font-medium">
          {<RenderMentions text={notificationData.message} />}
        </p>
        {notificationData.post && <MiniPost post={notificationData.post} />}
        {notificationData.comment && (
          <MiniComment comment={notificationData.comment} />
        )}
        <p className="text-sm text-neutral-400">
          {dayjs.utc(notificationData.created_at).tz(userTimezone).fromNow()}
        </p>
      </div>
    </Link>
  );
}
