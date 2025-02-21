"use client";

import { authorize, verifyPasswordlessCode } from "@/app/auth/authentication";
import { useRouter } from "next/navigation";
import React, { useActionState, useState } from "react";
import Button2 from "../base/Button2";
import Form from "../base/form/Form";
import Input from "../base/form/Input";
import { StyledInput } from "../forms/input";
import CenteredLayout from "../layout/CenteredLayout";
import Spinner from "../loading/Spinner";

const initialState = {
  errors: {},
  payload: undefined,
};

export default function LoginPage() {
  const router = useRouter();
  const [state, dispatch, isPending] = useActionState(authorize, initialState);
  const [otpState, otpDispatch, isOtpPending] = useActionState(
    verifyPasswordlessCode,
    undefined,
  );
  const [identifier, setIdentifier] = useState("");
  const [isUsingPassword, setIsUsingPassword] = useState(false);

  return (
    <div className="flex h-screen w-screen flex-col justify-center">
      <CenteredLayout>
        {!state.useOtp && (
          <Form action={dispatch}>
            <p className="mb-5 text-2xl font-black">Sign In</p>
            <Input
              placeholder="Email or Username"
              type="text"
              name="identifier"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            {state.errors?.identifier && (
              <p style={{ color: "red" }}>{state.errors.identifier}</p>
            )}
            {isUsingPassword && (
              <Input
                placeholder="Password"
                type="password"
                name="password"
                required
                // defaultValue={(state.payload?.get("password") as string) || ""}
              />
            )}
            {state.errors?.password && (
              <p style={{ color: "red" }}>{state.errors.password}</p>
            )}
            <div className="flex w-full justify-end">
              <button
                className="text-sm font-bold"
                onClick={() => setIsUsingPassword((prev) => !prev)}
              >
                Sign in with{" "}
                {isUsingPassword ? "username or email" : "password"}
              </button>
            </div>
            <Button2 type="submit" disabled={isPending}>
              <p className={`${isPending ? "invisible" : "visible"}`}>
                Continue
              </p>
            </Button2>
            <div className="mt-2 flex flex-row space-x-2.5">
              <p className="font-bold">New here?</p>
              <button
                className="underline"
                onClick={() => router.push("/register")}
              >
                Register
              </button>
            </div>
          </Form>
        )}
        {state.useOtp && (
          <form
            action={otpDispatch}
            className="flex flex-col items-center rounded-lg bg-neutral-800 p-8 text-center"
          >
            <p className="mb-4 text-2xl font-black">Check your email</p>
            <p>
              If you have an account, an email has been sent to your email.
              Click the link inside or enter the code below.
            </p>
            <input type="hidden" name="identifier" value={identifier} />
            <div className="mt-4">
              <Input
                placeholder="Code"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="\\d{6}"
                maxLength={6}
                name="code"
                required
                className="text-center tracking-widest"
              />
            </div>
            {otpState?.errors?.code && (
              <p style={{ color: "red" }}>{otpState.errors.code}</p>
            )}
            {isUsingPassword && (
              <StyledInput
                placeholder="Password"
                type="password"
                name="password"
                disableUnderline
                required
                defaultValue={state.payload?.get("password") || ""}
              />
            )}

            <Button2 type="submit">
              {isOtpPending && <Spinner />}
              <p className={`${isOtpPending ? "invisible" : "visible"}`}>
                Continue
              </p>
            </Button2>
          </form>
        )}
      </CenteredLayout>
    </div>
  );
}
