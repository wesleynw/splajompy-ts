"use server";

import { auth } from "@/auth";
import TopBar from "./TopBar";
import TopBarMenu from "./TopBarMenu";

export default async function TopBarWrapper() {
  const session = await auth();

  return (
    <TopBar>
      <TopBarMenu session={session} />
    </TopBar>
  );
}
