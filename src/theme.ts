"use client";
import { alpha, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: "#FFFFFF",
      light: alpha("#FFFFFF", 0.7),
      dark: alpha("#FFFFFF", 0.9),
    },
    secondary: {
      main: "#121212",
      dark: "rgba(255, 255, 255, 0.7)",
    },
  },
});

export default theme;
