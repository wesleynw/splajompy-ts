import { redirect } from "next/navigation";
import { getCurrentSession } from "../auth/session";
import Navigation from "../components/navigation/Navigation";
import TopBar from "../components/navigation/TopBar";
import UserProvider from "../providers/UserProvider";
import Box from "@mui/material/Box";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();

  if (user === null) {
    redirect("/login");
  }

  return (
    <Box sx={{ paddingTop: "60px" }}>
      <UserProvider user={user}>
        <TopBar user={user} />
        {children}
        <Navigation />
      </UserProvider>
    </Box>
  );
}
