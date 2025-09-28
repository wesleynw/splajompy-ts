"use client";

// import { register } from "@/app/auth/register";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
// import { useFormStatus } from "react-dom";
import logo from "../../apple-icon.png";
// import Form from "../base/form/Form";
// import Input from "../base/form/Input";
// import Button from "../button/Button";
import CenteredLayout from "../layout/CenteredLayout";

// const initialState = {
//   errors: {
//     username: "",
//     email: "",
//     password: "",
//   },
//   payload: undefined,
// };

export default function RegisterPage() {
  const router = useRouter();
  // const { pending } = useFormStatus();
  // const [state, dispatch] = useActionState(register, initialState);

  return (
    <div className="mt-16 flex w-screen flex-col justify-center">
      <CenteredLayout>
        <div className="flex flex-col items-center">
          <Image
            width={100}
            height={100}
            src={logo}
            alt="Logo"
            className="mb-7 rounded-3xl shadow-[0_0_15px_5px_rgba(255,255,255,0.3)]"
          />
          <p className="mb-5 text-2xl font-black">Register</p>
          <div className="mb-8 max-w-md text-center">
            <p className="mb-4 text-lg">
              Registration is now only available through the iOS app.
            </p>
          </div>
          <div className="mt-2 flex flex-row space-x-2.5">
            <p className="font-bold">Already have an account?</p>
            <button
              className="underline"
              onClick={() => router.push("/login")}
              type="button"
            >
              <p className="font-black">Login</p>
            </button>
          </div>
        </div>
        {/*
        <Form action={dispatch}>
          <Image
            width={100}
            height={100}
            src={logo}
            alt="Logo"
            className="mb-7 rounded-3xl shadow-[0_0_15px_5px_rgba(255,255,255,0.3)]"
          />
          <p className="mb-5 text-2xl font-black">Register</p>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            required
            defaultValue={(state.payload?.get("username") as string) || ""}
          />
          {state.errors?.username && (
            <p className="text-red-700">{state.errors.username}</p>
          )}
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            defaultValue={(state.payload?.get("email") as string) || ""}
          />
          {state.errors?.email && (
            <p className="text-red-700">{state.errors.email}</p>
          )}
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            defaultValue={(state.payload?.get("password") as string) || ""}
          />
          {state.errors?.password && (
            <p className="text-red-700">{state.errors.password}</p>
          )}
          <Button type="submit" isLoading={pending} fullWidth>
            Register
          </Button>
          <div className="mt-2 flex flex-row space-x-2.5">
            <p className="font-bold">Already have an account?</p>
            <button
              className="underline"
              onClick={() => router.push("/login")}
              type="button"
            >
              <p className="font-black">Login</p>
            </button>
          </div>
        </Form>
        */}
      </CenteredLayout>
    </div>
  );
}
