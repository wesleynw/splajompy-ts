import {
  Modal,
  Backdrop,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useState } from "react";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";

interface ImageModalProps {
  imagePath: string;
  imageWidth: number;
  imageHeight: number;
  open: boolean;
  handleClose: () => void;
}

export default function ImageModal({
  imagePath,
  imageWidth,
  imageHeight,
  open,
  handleClose,
}: Readonly<ImageModalProps>) {
  const [loaded, setLoaded] = useState(false);

  const src = `https://splajompy-bucket.nyc3.cdn.digitaloceanspaces.com/${imagePath}`;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const link = document.createElement("a");
    link.href = src;
    link.download = imagePath.split("/").pop() ?? "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal open={open} onClose={handleClose} style={{ zIndex: 10000 }}>
      <Box sx={{ zIndex: 10001 }}>
        <IconButton
          onClick={handleDownload}
          sx={{
            position: "fixed",
            top: 16,
            right: 56,
            zIndex: 4000,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <VerticalAlignBottomIcon />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleClose();
          }}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 4000,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Backdrop
          open={open}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleClose();
          }}
          sx={{ backgroundColor: "black", zIndex: 2000 }}
        >
          {!loaded && <CircularProgress />}
          <Image
            src={src}
            alt="Modal Image"
            width={imageWidth}
            height={imageHeight}
            onLoad={() => setLoaded(true)}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
              width: "100%",
              height: "100%",
              zIndex: 2100,
            }}
          />
        </Backdrop>
      </Box>
    </Modal>
  );
}
