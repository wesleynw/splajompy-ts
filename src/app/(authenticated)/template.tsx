import { SessionProvider } from "next-auth/react";
import Navigation from "../components/navigation/Navigation";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      {children}
      <Navigation />
    </SessionProvider>
  );
}
