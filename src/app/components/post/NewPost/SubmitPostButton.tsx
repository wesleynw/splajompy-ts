import { Box, Button, CircularProgress, Typography } from "@mui/material";

export default function SubmitPostButton({
  isLoading,
}: Readonly<{ isLoading: boolean }>) {
  return (
    <Button
      type="submit"
      variant="contained"
      sx={{
        borderRadius: "20px",
        padding: "10px 20px",
        backgroundColor: "#4a90e2",
        color: "#ffffff",
        fontWeight: "bold",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#357abf",
        },
        position: "relative",
      }}
      disabled={isLoading}
    >
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <CircularProgress size="1.5rem" sx={{ color: "inherit" }} />
        </Box>
      )}

      <Typography
        variant="subtitle2"
        style={{ visibility: isLoading ? "hidden" : "visible" }}
      >
        Post
      </Typography>
    </Button>
  );
}
