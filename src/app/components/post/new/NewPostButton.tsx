import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

type Props = {
  isOpen: boolean;
  toggleOpen: () => void;
};

export default function NewPostButton({ isOpen, toggleOpen }: Readonly<Props>) {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        borderRadius: "30px",
        border: "1px solid #1DA1F2",
        backgroundColor: "#1DA1F2",
        color: "white",
        padding: 0,
        zIndex: 9000,
      }}
    >
      <IconButton
        size="large"
        onClick={toggleOpen}
        sx={{
          paddingX: "10px",
          paddingY: "5px",
        }}
      >
        <AddCircleIcon
          sx={{
            transform: isOpen ? "rotate(-135deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease-in-out",
          }}
        />
        {isDesktop && (
          <Typography variant="body1" fontWeight={800} sx={{ marginX: "10px" }}>
            Post
          </Typography>
        )}
      </IconButton>
    </Box>
  );
}
