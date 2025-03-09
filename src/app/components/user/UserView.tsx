"use client";

import { PublicUser } from "@/db/schema";
import React from "react";
import Feed from "../feed/Feed";
import CenteredLayout from "../layout/CenteredLayout";
import UserProfile from "./UserProfile";

interface Props {
  user: PublicUser;
  username: string;
  isOwnProfile: boolean;
}

export default function UserView({
  user,
  username,
  isOwnProfile,
}: Readonly<Props>) {
  return (
    <>
      <CenteredLayout>
        <UserProfile username={username} isOwnProfile={isOwnProfile} />
      </CenteredLayout>
      <Feed user={user} target_user_id={user.user_id} />
    </>
  );
}
