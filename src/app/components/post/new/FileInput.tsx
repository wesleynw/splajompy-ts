import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Box } from "@mui/material";

interface FileInputProps {
  file: File | null;
  setFile: (file: File | null) => void;
  setPreviewFile: (file: File | null) => void;
  setError: (error: string | null) => void;
}

export default function FileInput({
  file,
  setFile,
  setPreviewFile,
  setError,
}: Readonly<FileInputProps>) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    const maxSizeInBytes = 20 * 1024 * 1024;

    if (file) {
      if (file.size > maxSizeInBytes) {
        setError("File size must not exceed 20MB.");
        setFile(null);
        setPreviewFile(null);
        return;
      } else {
        setError(null);
      }

      setFile(file);
      if (file.type.split("/")[0] !== "image") {
        setError("File must be an image.");
        setFile(null);
        setPreviewFile(null);
      } else {
        setPreviewFile(file);
      }
    }
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <input
        type="file"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id="file-upload"
        accept="image/*"
      />
      <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
        <AddPhotoAlternateIcon
          fontSize="medium"
          sx={{
            marginLeft: "20px",
            color: "#b0b0b0",
          }}
          visibility={file ? "hidden" : "visible"}
        />
      </label>
    </Box>
  );
}
