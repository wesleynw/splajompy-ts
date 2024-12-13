import { SessionProvider } from "next-auth/react";
import Navigation from "../components/navigation/Navigation";
import RequireAuth from "../components/RequireAuth";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <RequireAuth>{children}</RequireAuth>
      <Navigation />
    </SessionProvider>
  );
}
