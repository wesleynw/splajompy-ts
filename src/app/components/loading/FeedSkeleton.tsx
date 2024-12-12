import { Skeleton } from "@mui/material";

export default function FeedSkeleton() {
  return (
    <>
      <Skeleton
        variant="rounded"
        width="100%"
        height={200}
        sx={{ margin: "10px" }}
      />
      <Skeleton
        variant="rounded"
        width="100%"
        height={200}
        sx={{ margin: "10px" }}
      />
      <Skeleton
        variant="rounded"
        width="100%"
        height={200}
        sx={{ margin: "10px" }}
      />
      <Skeleton
        variant="rounded"
        width="100%"
        height={200}
        sx={{ margin: "10px" }}
      />
    </>
  );
}
