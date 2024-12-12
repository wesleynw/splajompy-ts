import SinglePostSkeleton from "@/app/components/loading/SinglePostSkeleton";
import StandardWrapper from "@/app/components/loading/StandardWrapper";

export default function Loading() {
  return (
    <StandardWrapper>
      <SinglePostSkeleton />
    </StandardWrapper>
  );
}
