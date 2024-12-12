import { Skeleton } from "@mui/material";

export default function FeedSkeleton() {
  return (
    <>
      <Skeleton variant="rounded" width="100%" height={200} />
      <Skeleton variant="rounded" width="100%" height={200} />
      <Skeleton variant="rounded" width="100%" height={200} />
      <Skeleton variant="rounded" width="100%" height={200} />
    </>
  );
}
