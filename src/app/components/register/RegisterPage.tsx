"use client";

import { register } from "@/app/lib/actions";
import { useFormState, useFormStatus } from "react-dom";

export default function RegisterPage() {
  const [errorMessage, dispatch] = useFormState(register, undefined);

  return (
    <form action={dispatch}>
      <input type="text" name="username" placeholder="Username" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <div>{errorMessage && <p>{errorMessage}</p>}</div>
      <LoginButton />
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button aria-disabled={pending} type="submit">
      Register
    </button>
  );
}
