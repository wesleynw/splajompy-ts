"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: "#1da1f2",
    },
    secondary: {
      main: "#4a90e2",
    },
  },
  colorSchemes: {
    dark: true,
  },
  cssVariables: {
    colorSchemeSelector: "class",
  },
});

export default theme;
