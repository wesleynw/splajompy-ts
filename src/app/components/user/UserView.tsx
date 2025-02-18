"use client";

import React from "react";
import Feed from "../feed/Feed";
import CenteredLayout from "../layout/CenteredLayout";
import UserProfile from "./UserProfile";

interface Props {
  isOwnProfile: boolean;
  user: {
    user_id: number;
    email: string;
    password: string;
    username: string;
  };
}

export default function UserView({ user, isOwnProfile }: Readonly<Props>) {
  return (
    <>
      <CenteredLayout>
        <UserProfile user={user} isOwnProfile={isOwnProfile} />
      </CenteredLayout>
      <Feed user={user} target_user_id={user.user_id} />
    </>
  );
}
