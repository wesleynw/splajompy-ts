"use client";

import React, { useActionState } from "react";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { register } from "@/app/auth/register";
import { StyledButton } from "../forms/button";
import { StyledInput } from "../forms/input";
import { StyledFormControl } from "../forms/formControl";

const FormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "400px",
  padding: "20px",
  margin: "10px auto",
  borderRadius: "8px",
  background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  ...theme.applyStyles("dark", {
    background: "linear-gradient(135deg, #1b1b1b, #222222)",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
  }),
}));

const initialState = {
  errors: {
    username: "",
    email: "",
    password: "",
  },
  payload: undefined,
};

export default function RegisterPage() {
  const [state, dispatch] = useActionState(register, initialState);

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
      <form action={dispatch} style={{ width: "100%" }}>
        <FormContainer>
          <Typography variant="h5" fontWeight={800} marginBottom="30px">
            Register
          </Typography>
          <StyledFormControl>
            <StyledInput
              type="text"
              name="username"
              placeholder="Username"
              disableUnderline
              required
              defaultValue={state.payload?.get("username") || ""}
            />
          </StyledFormControl>
          {state.errors?.username && (
            <Box
              component="p"
              sx={{
                color: "#ff0000",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              {state.errors.username}
            </Box>
          )}
          <StyledFormControl>
            <StyledInput
              type="email"
              name="email"
              placeholder="Email"
              disableUnderline
              required
              defaultValue={state.payload?.get("email") || ""}
            />
          </StyledFormControl>
          {state.errors?.email && (
            <Box
              component="p"
              sx={{
                color: "#ff0000",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              {state.errors.email}
            </Box>
          )}
          <StyledFormControl>
            <StyledInput
              type="password"
              name="password"
              placeholder="Password"
              disableUnderline
              required
              defaultValue={state.payload?.get("password") || ""}
            />
          </StyledFormControl>
          {state.errors?.password && (
            <Box
              component="p"
              sx={{
                color: "#ff0000",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              {state.errors.password}
            </Box>
          )}
          <RegisterButton />
          <Stack direction="row" spacing={1} sx={{ marginTop: "20px" }}>
            <Typography>Already have an account?</Typography>
            <Typography
              sx={{
                color: "primary.main",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              component={Link}
              href="/login"
            >
              Login
            </Typography>
          </Stack>
        </FormContainer>
      </form>
    </Box>
  );
}

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <StyledButton variant="contained" disabled={pending} type="submit">
      {pending ? <CircularProgress size={24} /> : "Register"}
    </StyledButton>
  );
}
