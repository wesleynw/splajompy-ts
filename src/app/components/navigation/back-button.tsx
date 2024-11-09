"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={() => router.back()}
      sx={{
        color: "#eee",
        textTransform: "none",
      }}
    >
      Back
    </Button>
  );
}
