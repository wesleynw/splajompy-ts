import { Typography } from "@mui/material";
import theme from "@/theme";

export default function CommentCount({ count }: Readonly<{ count: number }>) {
  return (
    <Typography
      variant="subtitle2"
      sx={{
        color: "#777777",
        fontSize: 14,
        ...theme.applyStyles("dark", { color: "#b0b0b0" }),
      }}
    >
      {count} comment{count === 1 ? "" : "s"}
    </Typography>
  );
}
