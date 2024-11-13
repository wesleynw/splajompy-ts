import { Box } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface FileInputProps {
  file: File | null;
  setFile: (file: File | null) => void;
  setPreviewFile: (file: File | null) => void;
}

export default function FileInput({
  setFile,
  setPreviewFile,
}: Readonly<FileInputProps>) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFile(file);
    setPreviewFile(file);
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <input
        type="file"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
        <AddPhotoAlternateIcon
          fontSize="medium"
          sx={{ color: "#ffffff", marginLeft: "20px" }}
        />
      </label>
    </Box>
  );
}
