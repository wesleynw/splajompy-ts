import { Skeleton } from "@mui/material";

export default function FeedSkeleton() {
  return (
    <>
      <Skeleton
        variant="rounded"
        width="100%"
        height={150}
        sx={{ margin: "10px auto" }}
      />
      <Skeleton
        variant="rounded"
        width="100%"
        height={175}
        sx={{ margin: "10px auto" }}
      />
      <Skeleton
        variant="rounded"
        width="100%"
        height={185}
        sx={{ margin: "10px auto" }}
      />
      <Skeleton
        variant="rounded"
        width="100%"
        height={195}
        sx={{ margin: "10px auto" }}
      />
    </>
  );
}
