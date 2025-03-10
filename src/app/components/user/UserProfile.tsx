import { deleteSessionTokenCookie } from "@/app/auth/cookies";
import { getCurrentSession, invalidateSession } from "@/app/auth/session";
import { useUser } from "@/app/data/user";
import { redirect, useRouter } from "next/navigation";
import Button2 from "../base/Button2";
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
  const router = useRouter();
  const { isPending, isError, user } = useUser(username);

  if (isPending) {
    return null;
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
    <div className="w-full border-y-1 border-neutral-800 p-4 sm:border-x-1">
      <div className="ml-2">
        <p className="text-xl font-black">{user.name}</p>
        <div className="flex w-full flex-row justify-between">
          {!user.name ? (
            <p className="text-lg font-black">@{user.username}</p>
          ) : (
            <p className="text-md font-black text-neutral-400">
              @{user.username}
            </p>
          )}
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
        {user.isFollower && (
          <p className="font-bold text-neutral-700">Follows You</p>
        )}

        {user.bio && (
          <p className="preserve-b my-2.5 break-words whitespace-pre-line">
            {user.bio}
          </p>
        )}
      </div>
      {isOwnProfile && (
        <div className="flex">
          <Button2
            variant="outlined"
            onClick={() => router.push("/edit-profile")}
          >
            Edit Profile
          </Button2>
        </div>
      )}
    </div>
  );
}
