import { redirect } from "next/navigation";
import { getCurrentSession } from "../auth/session";
import LoginPage from "../components/login/LoginPage";

export const metadata = {
  title: "Login",
  description: "Login to the site.",
};

export default async function Page() {
  const { session } = await getCurrentSession();
  if (session !== null) {
    redirect("/");
  }

  return <LoginPage />;
}
