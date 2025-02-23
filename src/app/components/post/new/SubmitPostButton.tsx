import { Button, Typography } from "@mui/material";
import Spinner from "../../loading/Spinner";

export default function SubmitPostButton({
  isLoading,
  disabled,
}: Readonly<{ isLoading: boolean; disabled: boolean }>) {
  return (
    <Button
      type="submit"
      variant="contained"
      sx={{
        borderRadius: "22px",
        padding: "4px 12px",
        backgroundColor: "#4a90e2",
        color: "#ffffff",
        fontWeight: "bold",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#357abf",
        },
        position: "relative",
        "&.Mui-disabled": {
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          color: "rgba(255, 255, 255, 0.3)",
        },
      }}
      disabled={isLoading || disabled}
      color="primary"
    >
      {isLoading && <Spinner />}

      <Typography
        variant="subtitle1"
        fontWeight={800}
        style={{ visibility: isLoading ? "hidden" : "visible" }}
      >
        Post
      </Typography>
    </Button>
  );
}
