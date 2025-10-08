"use client";

import { PublicUser } from "@/db/schema";
import React from "react";
import Feed from "../feed/Feed";
import CenteredLayout from "../layout/CenteredLayout";
import UserProfile from "./UserProfile";

interface Props {
  current_user: PublicUser;
  target_user: PublicUser;
  username: string;
  isOwnProfile: boolean;
}

export default function UserView({
  current_user,
  target_user,
  username,
  isOwnProfile,
}: Readonly<Props>) {
  return (
    <>
      <CenteredLayout>
        <UserProfile username={username} isOwnProfile={isOwnProfile} />
      </CenteredLayout>
      <Feed user={current_user} target_user_id={target_user.user_id} />
    </>
  );
}
