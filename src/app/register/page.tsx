import { redirect } from "next/navigation";
import { getCurrentSession } from "../auth/session";
import RegisterPage from "../components/register/RegisterPage";

export const metadata = {
  title: "Register",
  description: "Register for an account.",
};

export default async function Page() {
  const { session } = await getCurrentSession();
  if (session !== null) {
    redirect("/");
  }

  return <RegisterPage />;
}
