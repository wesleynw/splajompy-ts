import StandardWrapper from "@/app/components/loading/StandardWrapper";
import UserViewSkeleton from "@/app/components/loading/UserProfileSkeleton";

export default function Loading() {
  return (
    <StandardWrapper>
      <UserViewSkeleton />
    </StandardWrapper>
  );
}
