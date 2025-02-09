import { NotificationData } from "@/db/schema";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Link from "next/link";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  notificationData: NotificationData;
};

export default function Notification({ notificationData }: Readonly<Props>) {
  const userTimezone = dayjs.tz.guess();

  return (
    <Link
      key={notificationData.notification_id}
      href={notificationData.link ?? ""}
      className="w-full"
    >
      <div className="m-1.5 rounded-lg bg-neutral-800 p-4 transition-all hover:bg-neutral-700">
        <p className="mb-1.5 font-medium">{notificationData.message}</p>
        <p className="text-sm text-neutral-400">
          {dayjs.utc(notificationData.created_at).tz(userTimezone).fromNow()}
        </p>
      </div>
    </Link>
  );
}
