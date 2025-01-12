"use client";

import React, { useActionState, useState } from "react";
import {
  Box,
  CircularProgress,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { authorize, verifyPasswordlessCode } from "@/app/auth/authentication";
import { StyledButton } from "../forms/button";
import { StyledInput } from "../forms/input";
import { StyledFormControl } from "../forms/formControl";

const FormContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "400px",
  padding: "20px",
  margin: "10px auto",
  borderRadius: "8px",
  background: "linear-gradient(135deg, #1b1b1b, #222222)",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
}));

const initialState = {
  errors: {},
  payload: undefined,
};

export default function LoginPage() {
  const [state, dispatch, isPending] = useActionState(authorize, initialState);
  const [otpState, otpDispatch, isOtpPending] = useActionState(
    verifyPasswordlessCode,
    undefined
  );
  const [identifier, setIdentifier] = useState("");
  const [isUsingPassword, setIsUsingPassword] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        paddingBottom: "90px",
        backgroundColor: "#121212",
      }}
    >
      {!state.useOtp && (
        <form action={dispatch} style={{ width: "100%" }}>
          <FormContainer>
            <Typography variant="h5" fontWeight={800} marginBottom="30px">
              Sign In
            </Typography>
            <StyledFormControl>
              <StyledInput
                placeholder="Email or Username"
                type="text"
                name="identifier"
                disableUnderline
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </StyledFormControl>
            {state.errors?.identifier && (
              <p style={{ color: "red" }}>{state.errors.identifier}</p>
            )}

            {isUsingPassword && (
              <StyledFormControl>
                <StyledInput
                  placeholder="Password"
                  type="password"
                  name="password"
                  disableUnderline
                  required
                  defaultValue={state.payload?.get("password") || ""}
                />
              </StyledFormControl>
            )}
            {state.errors?.password && (
              <p style={{ color: "red" }}>{state.errors.password}</p>
            )}
            <Box display="flex" justifyContent="flex-end" width="100%">
              <Typography
                variant="subtitle2"
                component="a"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={() => setIsUsingPassword((prev) => !prev)}
              >
                Sign in with{" "}
                {isUsingPassword ? "username or email" : "password"}
              </Typography>
            </Box>
            <StyledButton
              variant="contained"
              type="submit"
              disabled={isPending}
            >
              {isPending && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <CircularProgress size="1.5rem" sx={{ color: "inherit" }} />
                </Box>
              )}
              <Typography
                variant="subtitle2"
                style={{ visibility: isPending ? "hidden" : "visible" }}
              >
                Continue
              </Typography>
            </StyledButton>
            <Stack direction="row" spacing={1} sx={{ marginTop: "20px" }}>
              <Typography fontWeight={500}>New here?</Typography>
              <Typography
                sx={{
                  color: "primary.main",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                component={Link}
                href="/register"
              >
                Register
              </Typography>
            </Stack>
          </FormContainer>
        </form>
      )}
      {state.useOtp && (
        <form action={otpDispatch}>
          <FormContainer>
            <Typography variant="h5" fontWeight={800} marginBottom="30px">
              Check your email
            </Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: "25px" }}>
              If you have an account, an email has been sent to your email.
              Click the link inside or enter the code below.
            </Typography>
            <input type="hidden" name="identifier" value={identifier} />
            <StyledFormControl>
              <StyledInput
                autoComplete="one-time-code"
                inputMode="numeric"
                inputProps={{ pattern: "\\d{6}", maxLength: 6 }}
                name="code"
                disableUnderline
                required
                defaultValue={otpState?.payload?.get("code") || ""}
                sx={{
                  margin: "auto",
                  width: "50%",
                  letterSpacing: "2ch",
                }}
              />
            </StyledFormControl>
            {otpState?.errors?.code && (
              <p style={{ color: "red" }}>{otpState.errors.code}</p>
            )}
            {isUsingPassword && (
              <StyledFormControl>
                <StyledInput
                  placeholder="Password"
                  type="password"
                  name="password"
                  disableUnderline
                  required
                  defaultValue={state.payload?.get("password") || ""}
                />
              </StyledFormControl>
            )}

            <StyledButton variant="contained" type="submit">
              {isOtpPending && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <CircularProgress size="1.5rem" sx={{ color: "inherit" }} />
                </Box>
              )}
              <Typography
                variant="subtitle2"
                style={{ visibility: isOtpPending ? "hidden" : "visible" }}
              >
                Continue
              </Typography>
            </StyledButton>
            {/* <Box onClick={() => router.replace("/login")}>
              <Typography
                variant="subtitle2"
                sx={{
                  paddingTop: "15px",
                  "&:hover": {
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                }}
              >
                Back
              </Typography>
            </Box> */}
          </FormContainer>
        </form>
      )}
    </Box>
  );
}
