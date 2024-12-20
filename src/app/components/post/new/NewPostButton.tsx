import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

type Props = {
  handleOpen: () => void;
};

export default function NewPostButton({ handleOpen }: Readonly<Props>) {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        borderRadius: "30px",
        border: "1px solid #1DA1F2",
        backgroundColor: "#1DA1F2",
        color: "white",
        padding: 0,
      }}
    >
      <IconButton
        size="large"
        onClick={handleOpen}
        sx={{ paddingX: "10px", paddingY: "5px" }}
      >
        <AddCircleIcon />
        {isDesktop && (
          <Typography variant="body1" fontWeight={800} sx={{ marginX: "10px" }}>
            Post
          </Typography>
        )}
      </IconButton>
    </Box>
  );
}
