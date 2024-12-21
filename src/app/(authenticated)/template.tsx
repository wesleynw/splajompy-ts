import { SessionProvider } from "next-auth/react";
import Navigation from "../components/navigation/Navigation";
import TopBar from "../components/navigation/TopBar";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <TopBar />
      {children}
      <Navigation />
    </SessionProvider>
  );
}
