"use client";

import React, { useActionState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import Link from "next/link";
import theme from "@/theme";
import { authorize } from "@/app/auth/authentication";

const FormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: 600,
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

const StyledInput = styled(Input)(({ theme }) => ({
  width: "320px",
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
  width: "90%",
  "&:hover": {
    backgroundColor: "#0d8de6",
  },
}));

const StyledFormControl = styled(FormControl)(() => ({
  margin: "0px",
  padding: "0px",
}));

const StyledFormLabel = styled(FormLabel)(() => ({
  marginBottom: "4px",
}));

const initialState = {
  errors: {},
  payload: undefined,
};

export default function LoginPage() {
  const [state, dispatch] = useActionState(authorize, initialState);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 60px)",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        paddingBottom: "90px",
        backgroundColor: "#f5f5f5",
        ...theme.applyStyles("dark", { backgroundColor: "#121212" }),
      }}
    >
      <form action={dispatch}>
        <FormContainer>
          <StyledFormControl>
            <StyledFormLabel>Email or Username</StyledFormLabel>
            <StyledInput
              type="text"
              name="identifier"
              disableUnderline
              required
              defaultValue={state.payload?.get("identifier") || ""}
            />
          </StyledFormControl>
          {state.errors?.identifier && (
            <p style={{ color: "red" }}>{state.errors.identifier}</p>
          )}
          <StyledFormControl>
            <StyledFormLabel>Password</StyledFormLabel>
            <StyledInput
              type="password"
              name="password"
              disableUnderline
              required
              defaultValue={state.payload?.get("password") || ""}
            />
          </StyledFormControl>
          {state.errors?.password && (
            <p style={{ color: "red" }}>{state.errors.password}</p>
          )}
          <StyledButton variant="contained" type="submit">
            Login
          </StyledButton>
          <Stack direction="row" spacing={1} sx={{ marginTop: "20px" }}>
            <Typography>New here?</Typography>
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
    </Box>
  );
}
