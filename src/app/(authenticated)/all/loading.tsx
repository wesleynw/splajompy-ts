import FeedSkeleton from "@/app/components/loading/FeedSkeleton";
import StandardWrapper from "@/app/components/loading/StandardWrapper";

export default function Loading() {
  return (
    <StandardWrapper>
      <FeedSkeleton />
    </StandardWrapper>
  );
}
