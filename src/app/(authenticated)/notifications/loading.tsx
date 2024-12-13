import NotificationsPageSkeleton from "@/app/components/loading/NotificationsPageSkeleton";
import StandardWrapper from "@/app/components/loading/StandardWrapper";

export default function Loading() {
  return (
    <StandardWrapper>
      <NotificationsPageSkeleton />
    </StandardWrapper>
  );
}
