"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  date: string;
};

export default function Timestamp({ date }: Readonly<Props>) {
  const userTimezone = dayjs.tz.guess();

  return (
    <p className="text-sm font-bold">
      {dayjs.utc(date).tz(userTimezone).fromNow()}
    </p>
  );
}
