import theme from "@/theme";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function EmptyFeed() {
  const router = useRouter();
  return (
    <Box
      maxWidth="600px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ margin: "0 auto", padding: 4 }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          color: "#777777",
          paddingBottom: 2,
        }}
      >
        Follow other users to see their posts here.
      </Typography>
      <Button
        onClick={() => router.push("/all")}
        variant="contained"
        size="medium"
        sx={{
          textTransform: "none",
          borderRadius: "20px",
          paddingX: 2,
          paddingY: 0.5,
          fontWeight: "bold",
          fontSize: "0.875rem",
          minWidth: "auto",
          backgroundColor: "#1DA1F2",
          color: "#ffffff",
          ...theme.applyStyles("dark", {
            backgroundColor: "#1DA1F2",
          }),
          "&:hover": {
            backgroundColor: "#0d8de6",
          },
        }}
      >
        See all posts
      </Button>
    </Box>
  );
}
