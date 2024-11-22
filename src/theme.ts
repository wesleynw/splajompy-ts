"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
    button: {
      textTransform: "none",
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
