import { redirect } from "next/navigation";
import { getCurrentSession } from "../auth/session";
import Navigation from "../components/navigation/Navigation";
import TopBar from "../components/navigation/TopBar";
import UserProvider from "../providers/UserProvider";

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
    <div className="pt-13">
      <UserProvider user={user}>
        <TopBar user={user} />
        <div className="mb-60">{children}</div>
        <Navigation />
      </UserProvider>
    </div>
  );
}
