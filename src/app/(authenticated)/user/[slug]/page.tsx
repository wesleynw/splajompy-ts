import { getCurrentSession } from "@/app/auth/session";
import UserView from "@/app/components/user/UserView";
import { getUserByUsername } from "@/app/lib/users";
import { Box, Typography } from "@mui/material";
import { redirect } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  return {
    title: `${params.slug}'s Profile`,
  };
}

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const slug = (await params).slug;
  const username = String(slug);

  const { session, user: session_user } = await getCurrentSession();

  if (session === null) {
    redirect("/login");
  }

  const user = await getUserByUsername(username);

  if (!user) {
    return (
      <Box
        maxWidth="600px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ margin: "0 auto", padding: 4 }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#777777",
            paddingBottom: 2,
          }}
        >
          This user doesn&apos;t exist.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <UserView
        user={user}
        isOwnProfile={user.user_id === session_user.user_id}
      />
    </Box>
  );
}
