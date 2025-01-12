"use client";

import React, { useActionState, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import Link from "next/link";
import theme from "@/theme";
import { authorize, verifyPasswordlessCode } from "@/app/auth/authentication";

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

const StyledInput = styled(Input)(({ theme }) => ({
  width: "100%",
  fontSize: "0.875rem",
  fontWeight: 400,
  padding: "8px 12px",
  margin: "8px 0px",
  borderRadius: "8px",
  color: theme.palette.grey[900],
  background: "#fff",
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: `0 2px 2px ${theme.palette.grey[50]}`,
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
  "&:focus": {
    outline: 0,
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
  },
  ...theme.applyStyles("dark", {
    color: theme.palette.grey[300],
    background: theme.palette.grey[900],
    border: `1px solid ${theme.palette.grey[700]}`,
    boxShadow: `0 2px 2px ${theme.palette.grey[900]}`,
    "&:focus": {
      boxShadow: `0 0 0 3px ${theme.palette.primary.dark}`,
    },
  }),
}));

const StyledButton = styled(Button)(() => ({
  textTransform: "none",
  borderRadius: "10px",
  padding: "8px 16px",
  fontWeight: "bold",
  fontSize: "0.875rem",
  backgroundColor: "#1DA1F2",
  color: "#ffffff",
  marginTop: "20px",
  width: "100%",
  "&:hover": {
    backgroundColor: "#0d8de6",
  },
}));

const StyledFormControl = styled(FormControl)(() => ({
  margin: "0px",
  padding: "0px",
  width: "100%",
}));

const initialState = {
  errors: {},
  payload: undefined,
};

export default function LoginPage() {
  const [state, dispatch] = useActionState(authorize, initialState);
  const [otpState, otpDispatch] = useActionState(
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
        backgroundColor: "#f5f5f5",
        ...theme.applyStyles("dark", { backgroundColor: "#121212" }),
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
            <StyledButton variant="contained" type="submit">
              Continue
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
              Continue
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
