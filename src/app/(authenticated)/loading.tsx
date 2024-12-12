import FeedSkeleton from "../components/loading/FeedSkeleton";
import StandardWrapper from "../components/loading/StandardWrapper";

export default function Loading() {
  return (
    <StandardWrapper>
      <FeedSkeleton />
    </StandardWrapper>
  );
}
