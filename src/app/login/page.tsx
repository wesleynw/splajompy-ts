import LoginPage from "../components/login/LoginPage";

export const metadata = {
  title: "Login",
  description: "Login to the site.",
};

export default async function Page() {
  return <LoginPage />;
}
