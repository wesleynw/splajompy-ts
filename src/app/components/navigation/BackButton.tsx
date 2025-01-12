"use client";

import { Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { User } from "@/db/schema";

type Props = {
  user: User;
};

export default function BackButton({ user }: Readonly<Props>) {
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const path = usePathname();

  const username = user.username ?? "";

  const needsBackButton = !new RegExp(
    `^(/|/all|/notifications|/user/${username})$`
  ).test(path);

  if (!needsBackButton) {
    return null;
  }

  return (
    <Button
      disableRipple
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
        marginLeft: `${isDesktop ? "20px" : "0px"}`,
      }}
    >
      <ArrowBackIcon />
      {isDesktop && (
        <Typography
          fontWeight={800}
          fontSize="medium"
          sx={{ marginLeft: "5px" }}
        >
          Back
        </Typography>
      )}
    </Button>
  );
}
