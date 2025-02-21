"use client";

import { register } from "@/app/auth/register";
import { useRouter } from "next/navigation";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Button2 from "../base/Button2";
import Form from "../base/form/Form";
import Input from "../base/form/Input";
import CenteredLayout from "../layout/CenteredLayout";

const initialState = {
  errors: {
    username: "",
    email: "",
    password: "",
  },
  payload: undefined,
};

export default function RegisterPage() {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, dispatch] = useActionState(register, initialState);

  return (
    <div className="flex h-screen w-screen flex-col justify-center">
      <CenteredLayout>
        <Form action={dispatch}>
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
          <Button2>
            <div className="flex w-full flex-row justify-between">
              <div></div>
              <p>Register</p>
              <div className="relative">
                {pending && (
                  <div className="absolute top-1 -left-4">
                    <div className="text-surfaceinline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"></div>
                  </div>
                )}
              </div>
            </div>
          </Button2>
          <div className="mt-2 flex flex-row space-x-2.5">
            <p className="font-bold">Already have an account?</p>
            <button className="underline" onClick={() => router.push("/login")}>
              Register
            </button>
          </div>
        </Form>
      </CenteredLayout>
    </div>
  );
}
