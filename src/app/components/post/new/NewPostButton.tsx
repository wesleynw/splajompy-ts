import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, Typography } from "@mui/material";

type Props = {
  isOpen: boolean;
  toggleOpen: () => void;
};

export default function NewPostButton({ isOpen, toggleOpen }: Readonly<Props>) {
  return (
    <Box
      sx={{
        borderRadius: "30px",
        border: isOpen ? "1px solid #ffffff" : "1px solid #1DA1F2",
        backgroundColor: isOpen ? "#111111" : "#1DA1F2",
        color: "white",
        padding: 0,
        zIndex: 9000,
        transition: "background-color 0.3s ease-in-out",
      }}
    >
      <IconButton
        size="large"
        onClick={toggleOpen}
        sx={{
          padding: "5px",
        }}
        disableRipple
        color="primary"
      >
        <AddCircleIcon
          sx={{
            transform: isOpen ? "rotate(-135deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease-in-out",
          }}
        />
        <div className="hidden sm:block">
          <Typography variant="body1" fontWeight={800} sx={{ marginX: "10px" }}>
            Post
          </Typography>
        </div>
      </IconButton>
    </Box>
  );
}
