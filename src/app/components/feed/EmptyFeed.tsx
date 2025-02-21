import { useRouter } from "next/navigation";
import Button from "../base/Button";
import CenteredLayout from "../layout/CenteredLayout";

export default function EmptyFeed() {
  const router = useRouter();
  return (
    <CenteredLayout>
      <p className="p-4 text-xl font-black text-neutral-400">
        Follow other users to see their posts here.
      </p>
      <Button onClick={() => router.push("/all")}>See all posts</Button>
    </CenteredLayout>
  );
}
