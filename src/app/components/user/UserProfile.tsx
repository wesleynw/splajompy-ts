import { deleteSessionTokenCookie } from "@/app/auth/cookies";
import { getCurrentSession, invalidateSession } from "@/app/auth/session";
import { useUser } from "@/app/data/user";
import { redirect } from "next/navigation";
import FollowButton from "../follows/FollowButton";
import CenteredLayout from "../layout/CenteredLayout";

type Props = {
  username: string;
  isOwnProfile: boolean;
};

export default function UserProfile({
  username,
  isOwnProfile,
}: Readonly<Props>) {
  const { isPending, isError, user } = useUser(username);

  if (isPending) {
    return (
      <div className="flex w-full animate-pulse flex-row justify-between border-t-1 border-neutral-800 p-4 sm:border-x-1">
        <div role="status" className="animate-pulse">
          <div className="mb-4 h-6 w-40 rounded-sm bg-neutral-700"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <CenteredLayout>
        <p className="mt-5 text-xl font-black">This user doesn&apos;t exist.</p>
      </CenteredLayout>
    );
  }

  if (isError) {
    return <h1>error</h1>;
  }

  const handleSignOut = async () => {
    const { session } = await getCurrentSession();
    if (session !== null) {
      invalidateSession(session.id);
      deleteSessionTokenCookie();
      redirect("/login");
    }
  };

  return (
    <div className="flex w-full flex-row justify-between border-t-1 border-neutral-800 p-4 sm:border-x-1">
      <p className="ml-1 text-lg font-black">@{user.username}</p>
      <p>{user.isFollower && "Follows You"}</p>
      {isOwnProfile && (
        <button
          className="rounded-full bg-blue-400 px-2.5 py-1 font-bold"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      )}
      <FollowButton user_id={user.user_id} show_unfollow={true} />
    </div>
  );
}
