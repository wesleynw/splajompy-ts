import {
  Box,
  IconButton,
  Typography,
  Modal,
  Button,
  useMediaQuery,
} from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function DownloadPrompt() {
  const [isPWAEligible, setIsPWAEligible] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const path = usePathname();

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    setIsPWAEligible(
      isMobile && !window.matchMedia("(display-mode: standalone)").matches
    );
  }, [isMobile]);

  if (
    (!["/", "/notifications", "/all"].includes(path) &&
      !path.startsWith("/profile")) ||
    !isPWAEligible
  ) {
    return null;
  }

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <>
      <Box
        sx={{
          borderRadius: "30px",
          color: "#0cce6b",
          border: "1px solid #0cce6b",
          padding: 0,
          zIndex: 9000,
          transition: "background-color 0.3s ease-in-out",
          backgroundColor: "#ffffff", // White background for candy cane effect
        }}
      >
        <IconButton
          size="large"
          sx={{ margin: 0, padding: "2px" }}
          disableRipple
          onClick={handleOpenModal}
        >
          <LightbulbIcon
            sx={{
              color: "#ff0000", // Red color for icon
              padding: "3px",
              paddingBottom: "5px",
            }}
          />
          <Typography
            variant="body2"
            fontWeight={800}
            sx={{ marginLeft: "2px", marginRight: "6px" }}
            color="#ff0000" // Red color for text
          >
            Install
          </Typography>
        </IconButton>
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="pwa-install-title"
        aria-describedby="pwa-install-description"
      >
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#ffffff", // White background for modal
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
            width: "90%",
          }}
        >
          <Typography
            id="pwa-install-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Install This App
          </Typography>

          <Typography id="pwa-install-description" variant="body1" gutterBottom>
            To install this application on your device:
          </Typography>

          <Typography variant="body2" gutterBottom>
            <strong>Android</strong>: Open the browser menu and tap &quot;Add to
            Home Screen&quot;.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>iOS</strong>: Open the browser share menu and tap &quot;Add
            to Home Screen&quot;.
          </Typography>

          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
