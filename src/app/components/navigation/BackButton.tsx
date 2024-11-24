"use client";

import { Button, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={() => {
        if (window.history?.length && window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      sx={{
        color: "#777777",
        ...theme.applyStyles("dark", { color: "#b0b0b0" }),
      }}
    >
      Back
    </Button>
  );
}
