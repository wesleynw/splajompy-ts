import { Modal, Backdrop, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useState } from "react";

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
}: ImageModalProps) {
  const [loaded, setLoaded] = useState(false);
  const src = `https://splajompy-bucket.nyc3.cdn.digitaloceanspaces.com/${imagePath}`;

  return (
    <Modal open={open} onClose={handleClose}>
      <>
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            handleClose();
          }}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 100,
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
            e.preventDefault();
            handleClose();
          }}
          sx={{ backgroundColor: "black" }}
        >
          {!loaded && <CircularProgress />}
          <Image
            src={src}
            alt="Image"
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
            }}
          />
        </Backdrop>
      </>
    </Modal>
  );
}
