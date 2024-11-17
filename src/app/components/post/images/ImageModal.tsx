import { Modal, Backdrop, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

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
  const src = `https://splajompy-bucket.nyc3.cdn.digitaloceanspaces.com/${imagePath}`;

  return (
    <Modal open={open} onClose={handleClose}>
      <>
        <IconButton
          onClick={handleClose}
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

        <Backdrop open={open} onClick={handleClose} sx={{ color: "#aaa" }}>
          <Image
            src={src}
            alt="Image"
            width={imageWidth}
            height={imageHeight}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
              width: "80%",
              height: "80%",
            }}
          />
        </Backdrop>
      </>
    </Modal>
  );
}
